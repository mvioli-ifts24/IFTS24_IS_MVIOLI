// back/server.js
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rootRouter from "./routes/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Middleware para registrar cada solicitud entrante
app.use((req, _, next) => {
  console.log(chalk.cyanBright(`\n${req.method} ${req.url}`));
  next();
});

app.use("/api", rootRouter);

app.listen(port, () => {
  console.log(
    chalk.green.inverse.bold(
      " -------------------------------------------- \n" +
        `  Servidor iniciado en http://localhost:${port}  ` +
        "\n -------------------------------------------- ",
    ),
  );
});
