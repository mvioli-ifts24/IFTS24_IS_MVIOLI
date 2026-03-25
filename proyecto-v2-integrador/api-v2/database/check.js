import { connection } from "#database";
import chalk from "chalk";

async function checkDatabase() {
  console.log(chalk.blue("🔍 Verificando estado de la base de datos...\n"));

  try {
    // Verificar conexión
    console.log(chalk.yellow("📡 Probando conexión..."));
    await connection.getConnection();
    console.log(chalk.green("✅ Conexión exitosa\n"));

    // Verificar tablas
    const tables = [
      "users",
      "users_genders",
      "games_reviews",
      "games_reviews_ratings",
      "cached_games",
      "contact_messages",
      "banners",
      "sponsors",
    ];

    console.log(chalk.yellow("📋 Verificando tablas..."));
    for (const table of tables) {
      try {
        const [result] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${table}`,
        );
        const count = result[0].count;
        console.log(chalk.green(`✅ ${table}: ${count} registros`));
      } catch (error) {
        console.log(chalk.red(`❌ ${table}: Error - ${error.message}`));
      }
    }

    console.log("");

    // Verificar estructura de users
    console.log(chalk.yellow("🔧 Verificando estructura de tabla users..."));
    const [columns] = await connection.execute("DESCRIBE users");

    const requiredColumns = [
      "id",
      "name",
      "surname",
      "email",
      "password",
      "birth_date",
      "gender_id",
      "role",
      "email_verified",
      "favorite_game_id",
      "profile_picture_filename",
    ];
    const existingColumns = columns.map((col) => col.Field);

    for (const col of requiredColumns) {
      if (existingColumns.includes(col)) {
        console.log(chalk.green(`✅ Columna ${col}: OK`));
      } else {
        console.log(chalk.red(`❌ Columna ${col}: FALTA`));
      }
    }

    console.log("");

    // Verificar usuario admin
    console.log(chalk.yellow("👤 Verificando usuario administrador..."));
    const [adminUsers] = await connection.execute(
      "SELECT id, email, role FROM users WHERE role = 'admin' LIMIT 5",
    );

    if (adminUsers.length > 0) {
      console.log(chalk.green("✅ Usuarios administradores encontrados:"));
      adminUsers.forEach((user) => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
    } else {
      console.log(chalk.red("❌ No se encontraron usuarios administradores"));
      console.log(chalk.yellow("💡 Ejecuta: npm run db:init"));
    }

    console.log("");
    console.log(chalk.green.bold("🎉 Verificación completada!"));
  } catch (error) {
    console.error(
      chalk.red("❌ Error verificando base de datos:"),
      error.message,
    );
    console.log("");
    console.log(chalk.yellow("💡 Asegúrate de que:"));
    console.log("   - MySQL esté ejecutándose");
    console.log("   - Las variables de entorno en .env sean correctas");
    console.log("   - Hayas ejecutado: npm run db:init");
  } finally {
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDatabase();
}

export { checkDatabase };
