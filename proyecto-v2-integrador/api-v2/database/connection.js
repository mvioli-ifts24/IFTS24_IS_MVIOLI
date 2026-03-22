import chalk from "chalk";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

// Verificar conexión al iniciar
connection
  .getConnection()
  .then((conn) => {
    conn.release();
    console.log(
      chalk.green.inverse.bold(
        " ------------------------------------ \n" +
          "  Conectado a la base de datos MySQL  " +
          "\n ------------------------------------ ",
      ),
    );
  })
  .catch(() => {
    console.error(
      chalk.red.inverse.bold(
        " ---------------------------------------------- \n" +
          "  Error al conectar con la base de datos MySQL  " +
          "\n ---------------------------------------------- ",
      ),
    );
  });

export { connection };
