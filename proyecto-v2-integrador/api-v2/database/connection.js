import chalk from "chalk";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

// Crear la conexión con la base de datos usando `mysql2` y `Promise`.
let connection;

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
    });
    console.log(
      chalk.green.inverse.bold(
        " ------------------------------------ \n" +
          "  Conectado a la base de datos MySQL  " +
          "\n ------------------------------------ ",
      ),
    );
  } catch (err) {
    console.error(
      chalk.red.inverse.bold(
        " ---------------------------------------------- \n" +
          "  Error al conectar con la base de datos MySQL  " +
          "\n ---------------------------------------------- ",
      ),
    );
  }
}

connectToDatabase();

export { connection };
