import https from "https";
import morgan from "morgan";
import express from "express";
import { resolve } from "path";
import { config } from "dotenv";

import corsConfig from "./config/cors.js";
import errorHandler from "./config/errorHandler.js";
import notFoundHandler from "./config/notFoundHandler.js";

import animeRouter from "./routes/index.js";

config();
const app: express.Application = express();
const PORT: number = Number(process.env.PORT) || 4000;

app.use(morgan("dev"));
app.use(corsConfig);

// CAUTION: For personal deployments, "refrain" from having an env
// named "ANIWATCH_API_HOSTNAME". You may face rate limitting
// and other issues if you do.

app.use(express.static(resolve("public")));
app.get("/health", (_, res) => res.sendStatus(200));
app.use("/anime", animeRouter);

app.use(notFoundHandler);
app.use(errorHandler);

// NOTE: this env is "required" for vercel deployments
if (!Boolean(process?.env?.IS_VERCEL_DEPLOYMENT)) {
  app.listen(PORT, () => {
    console.log(`⚔️  api @ http://localhost:${PORT}`);
  });
}

export default app;
