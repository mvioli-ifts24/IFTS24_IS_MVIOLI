import { connection } from "#database";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Divide un script SQL en statements individuales respetando
 * los literales de cadena (no parte por ';' dentro de comillas simples).
 */
function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let inString = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    if (inString) {
      current += char;
      // Comillas escapadas al estilo MySQL: '' dentro de una cadena
      if (char === "'" && sql[i + 1] === "'") {
        current += sql[++i];
      } else if (char === "'") {
        inString = false;
      }
    } else if (char === "'") {
      inString = true;
      current += char;
    } else if (char === "-" && sql[i + 1] === "-") {
      // Saltar línea de comentario completa
      while (i < sql.length && sql[i] !== "\n") i++;
    } else if (char === ";") {
      const stmt = current.trim();
      if (stmt) statements.push(stmt);
      current = "";
    } else {
      current += char;
    }
  }

  const last = current.trim();
  if (last) statements.push(last);

  return statements;
}

function syncSeedImages() {
  const UPLOADS_DIR = path.join(__dirname, "../public/uploads/images");
  const SOURCE_DIRS = [
    path.join(__dirname, "../public/sponsors"),
    path.join(__dirname, "../public/banners"),
  ];

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  for (const srcDir of SOURCE_DIRS) {
    if (!fs.existsSync(srcDir)) continue;
    const files = fs.readdirSync(srcDir).filter((f) => f !== "README.md");
    for (const file of files) {
      const dest = path.join(UPLOADS_DIR, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(path.join(srcDir, file), dest);
      }
    }
  }

  console.log(
    chalk.green("✅ Imágenes de seed sincronizadas en uploads/images"),
  );
}

async function initializeDatabase() {
  syncSeedImages();
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

      // Limpiar columnas legacy is_admin / is_moderator si sobrevivieron
      for (const legacyCol of ["is_admin", "is_moderator"]) {
        const [legacyCols] = await connection.execute(
          `SHOW COLUMNS FROM users LIKE '${legacyCol}'`,
        );
        if (legacyCols.length > 0) {
          await connection.execute(
            `ALTER TABLE users DROP COLUMN ${legacyCol}`,
          );
          console.log(
            chalk.green(`✅ Columna legacy '${legacyCol}' eliminada`),
          );
        }
      }
    } catch (e) {
      // La tabla users no existe, continuar con la creación normal
      console.log(
        chalk.yellow("📋 La tabla users no existe, creando desde cero..."),
      );
    }
    const migrations = [
      "users_genders.sql",
      "user_roles.sql",
      "cached_games.sql",
      "users.sql",
      "games_reviews_ratings.sql",
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

      const statements = splitSqlStatements(sql);

      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }

      console.log(chalk.green(`✅ ${migration}`));
    }

    // Asegurar columnas modernas de perfil en instalaciones existentes.
    const [emailVerifiedColumn] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'email_verified'",
    );

    if (emailVerifiedColumn.length === 0) {
      await connection.execute(
        "ALTER TABLE users ADD COLUMN email_verified TINYINT NOT NULL DEFAULT 0 AFTER role",
      );
    }

    const [favoriteGameColumn] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'favorite_game_id'",
    );

    if (favoriteGameColumn.length === 0) {
      await connection.execute(
        "ALTER TABLE users ADD COLUMN favorite_game_id BIGINT UNSIGNED NULL AFTER accept_newsletter",
      );
    }

    const [aboutColumn] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'about'",
    );

    if (aboutColumn.length > 0) {
      await connection.execute(
        "ALTER TABLE users MODIFY COLUMN about VARCHAR(150) DEFAULT NULL",
      );
    }

    // El perfil ya no depende de cached_games. Se elimina la FK si existe.
    try {
      await connection.execute(
        "ALTER TABLE users DROP CONSTRAINT users_cached_games_FK",
      );
    } catch (_) {
      // Ignorar si no existe
    }

    // Migrar banners de columna única a dos columnas (horizontal + vertical).
    try {
      const [hCol] = await connection.execute(
        "SHOW COLUMNS FROM banners LIKE 'image_filename_horizontal'",
      );

      if (hCol.length === 0) {
        await connection.execute(
          "ALTER TABLE banners ADD COLUMN image_filename_horizontal VARCHAR(255) NULL AFTER name",
        );
        await connection.execute(
          "ALTER TABLE banners ADD COLUMN image_filename_vertical VARCHAR(255) NULL AFTER image_filename_horizontal",
        );

        const [oldFilenameCol] = await connection.execute(
          "SHOW COLUMNS FROM banners LIKE 'image_filename'",
        );

        if (oldFilenameCol.length > 0) {
          const [oldOrientationCol] = await connection.execute(
            "SHOW COLUMNS FROM banners LIKE 'orientation'",
          );

          if (oldOrientationCol.length > 0) {
            await connection.execute(
              "UPDATE banners SET image_filename_horizontal = image_filename WHERE orientation = 'horizontal' OR orientation IS NULL",
            );
            await connection.execute(
              "UPDATE banners SET image_filename_vertical = image_filename WHERE orientation = 'vertical'",
            );
            await connection.execute(
              "ALTER TABLE banners DROP COLUMN orientation",
            );
          } else {
            // Sin columna orientation: se asume que eran horizontales
            await connection.execute(
              "UPDATE banners SET image_filename_horizontal = image_filename",
            );
          }

          await connection.execute(
            "ALTER TABLE banners DROP COLUMN image_filename",
          );
        }

        console.log(
          chalk.green(
            "✅ banners: migrado a image_filename_horizontal / image_filename_vertical",
          ),
        );
      }
    } catch (_) {
      // La tabla banners puede no existir aún; se creará con la migración
    }

    // Asegurar UNIQUE KEY en name para sponsors y banners (para instalaciones existentes).
    for (const { table, key } of [
      { table: "sponsors", key: "uq_sponsors_name" },
      { table: "banners", key: "uq_banners_name" },
    ]) {
      try {
        const [indexes] = await connection.execute(
          `SHOW INDEX FROM \`${table}\` WHERE Key_name = ?`,
          [key],
        );
        if (indexes.length === 0) {
          await connection.execute(
            `ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${key}\` (name)`,
          );
          console.log(chalk.green(`✅ ${table}: UNIQUE KEY en name agregado`));
        }
      } catch (_) {
        // La tabla puede no existir aún
      }
    }

    // Asegurar columnas de timestamps en games_reviews para instalaciones existentes.
    try {
      const [grCreatedAt] = await connection.execute(
        "SHOW COLUMNS FROM games_reviews LIKE 'created_at'",
      );
      if (grCreatedAt.length === 0) {
        await connection.execute(
          "ALTER TABLE games_reviews ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP",
        );
        console.log(
          chalk.green("✅ games_reviews: columna created_at agregada"),
        );
      }

      const [grUpdatedAt] = await connection.execute(
        "SHOW COLUMNS FROM games_reviews LIKE 'updated_at'",
      );
      if (grUpdatedAt.length === 0) {
        await connection.execute(
          "ALTER TABLE games_reviews ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        );
        console.log(
          chalk.green("✅ games_reviews: columna updated_at agregada"),
        );
      }
    } catch (_) {
      // La tabla games_reviews puede no existir aún; se creará con las columnas en la migración
    }

    // Ejecutar seeders
    const seeders = [
      "users_genders.sql",
      "user_roles.sql",
      "games_reviews_ratings.sql",
      "sponsors.sql",
      "banners.sql",
      "cached_games.sql",
      "users.sql",
      "games_reviews.sql",
    ];

    console.log(chalk.yellow("🌱 Ejecutando seeders..."));

    for (const seeder of seeders) {
      const seederPath = path.join(__dirname, "seeders", seeder);
      let sql = fs.readFileSync(seederPath, "utf8");

      // Reemplazar INSERT por INSERT IGNORE para evitar duplicados
      sql = sql.replace(/INSERT INTO/g, "INSERT IGNORE INTO");

      const statements = splitSqlStatements(sql);

      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }

      console.log(chalk.green(`✅ ${seeder}`));
    }

    // Limpiar profile_picture_filename='default.jpg' de usuarios seed para que muestren iniciales
    try {
      await connection.execute(
        "ALTER TABLE users MODIFY COLUMN profile_picture_filename VARCHAR(255) NOT NULL DEFAULT ''",
      );
    } catch (_) {
      // Ignorar si falla (ej. constraint)
    }
    await connection.execute(
      "UPDATE users SET profile_picture_filename = '' WHERE profile_picture_filename = 'default.jpg'",
    );
    console.log(chalk.green("✅ Fotos de perfil placeholder limpiadas"));

    // Crear usuario administrador por defecto
    console.log(chalk.yellow("👤 Creando usuario administrador..."));

    const adminPassword =
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"; // admin123

    await connection.execute(
      `INSERT INTO users (name, surname, email, password, gender_id, role, profile_picture_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE role = 'admin', profile_picture_filename = ''`,
      ["Admin", "Sistema", "admin@rank.com", adminPassword, 1, "admin", ""],
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
