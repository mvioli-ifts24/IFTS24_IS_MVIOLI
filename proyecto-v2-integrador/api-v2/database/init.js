import { connection } from "#database";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log(chalk.blue("🚀 Inicializando base de datos..."));

  try {
    // Verificar si necesitamos migrar la tabla users
    console.log(
      chalk.yellow("🔍 Verificando estructura de la base de datos..."),
    );

    try {
      await connection.execute("DESCRIBE users");
      console.log(
        chalk.yellow("📋 Verificando si la tabla users necesita migración..."),
      );

      // Verificar si existe la columna 'role'
      const [columns] = await connection.execute(
        "SHOW COLUMNS FROM users LIKE 'role'",
      );

      if (columns.length === 0) {
        console.log(
          chalk.yellow("🔄 Migrando tabla users para agregar campo role..."),
        );

        // Agregar columna role si no existe
        await connection.execute(
          "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER gender_id",
        );

        // Migrar datos de is_admin a role
        await connection.execute(
          "UPDATE users SET role = 'admin' WHERE is_admin = 1",
        );

        // Migrar datos de is_moderator a role (admin tiene prioridad)
        await connection.execute(
          "UPDATE users SET role = 'moderator' WHERE is_moderator = 1 AND role = 'user'",
        );

        // Eliminar columnas antiguas
        try {
          await connection.execute("ALTER TABLE users DROP COLUMN is_admin");
          await connection.execute(
            "ALTER TABLE users DROP COLUMN is_moderator",
          );
        } catch (e) {
          // Ignorar si las columnas no existen
        }

        console.log(chalk.green("✅ Tabla users migrada exitosamente"));
      } else {
        console.log(chalk.green("✅ Tabla users ya está actualizada"));
      }
    } catch (e) {
      // La tabla users no existe, continuar con la creación normal
      console.log(
        chalk.yellow("📋 La tabla users no existe, creando desde cero..."),
      );
    }
    const migrations = [
      "users_genders.sql",
      "users.sql",
      "games_reviews_ratings.sql",
      "cached_games.sql",
      "games_reviews.sql",
      "contact_messages.sql",
      "banners.sql",
      "sponsors.sql",
    ];

    console.log(chalk.yellow("📋 Ejecutando migraciones..."));

    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, "migrations", migration);
      let sql = fs.readFileSync(migrationPath, "utf8");

      // Reemplazar CREATE TABLE por CREATE TABLE IF NOT EXISTS
      sql = sql.replace(/CREATE TABLE/g, "CREATE TABLE IF NOT EXISTS");

      // Dividir en statements individuales (por CREATE TABLE)
      const statements = sql
        .split(";")
        .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }

      console.log(chalk.green(`✅ ${migration}`));
    }

    // Ejecutar seeders
    const seeders = ["users_genders.sql", "games_reviews_ratings.sql"];

    console.log(chalk.yellow("🌱 Ejecutando seeders..."));

    for (const seeder of seeders) {
      const seederPath = path.join(__dirname, "seeders", seeder);
      let sql = fs.readFileSync(seederPath, "utf8");

      // Reemplazar INSERT por INSERT IGNORE para evitar duplicados
      sql = sql.replace(/INSERT INTO/g, "INSERT IGNORE INTO");

      // Ejecutar cada INSERT por separado
      const statements = sql
        .split("\n")
        .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }

      console.log(chalk.green(`✅ ${seeder}`));
    }

    // Crear usuario administrador por defecto
    console.log(chalk.yellow("👤 Creando usuario administrador..."));

    const adminPassword =
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"; // admin123

    await connection.execute(
      `INSERT INTO users (name, surname, email, password, gender_id, role, profile_picture_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE email=email`,
      [
        "Admin",
        "Sistema",
        "admin@rank.com",
        adminPassword,
        1,
        "admin",
        "default.jpg",
      ],
    );

    console.log(chalk.green("✅ Usuario administrador creado"));
    console.log(chalk.green("📧 Email: admin@rank.com"));
    console.log(chalk.green("🔑 Contraseña: admin123"));

    console.log(
      chalk.green.bold("\n🎉 Base de datos inicializada exitosamente!"),
    );
  } catch (error) {
    console.error(chalk.red("❌ Error inicializando base de datos:"), error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };
