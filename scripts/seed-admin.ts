import "dotenv/config";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const pool = new Pool({ connectionString });

  try {
    const username = (await rl.question("Admin username: ")).trim();
    const password = await rl.question("Admin password: ");

    if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(username)) {
      throw new Error(
        "Username must be 3–50 characters and use letters, numbers, dots, underscores or hyphens.",
      );
    }

    if (password.length < 12) {
      throw new Error("Use an admin password of at least 12 characters.");
    }

    // Prevent this script from creating duplicate admin accounts.
    const existingAdmin = await pool.query(
      `SELECT "id" FROM "User" WHERE "role" = 'ADMIN' LIMIT 1`,
    );

    if (existingAdmin.rowCount) {
      console.log("An admin account already exists. No changes made.");
      return;
    }

    const passwordHash = await hash(password, 12);

    await pool.query(
      `INSERT INTO "User"
        ("username", "passwordHash", "role", "active", "createdAt", "updatedAt")
       VALUES ($1, $2, 'ADMIN', TRUE, NOW(), NOW())
       ON CONFLICT ("username") DO NOTHING`,
      [username, passwordHash],
    );

    const created = await pool.query(
      `SELECT "id", "username", "role"
       FROM "User"
       WHERE "username" = $1 AND "role" = 'ADMIN'`,
      [username],
    );

    if (!created.rowCount) {
      throw new Error(
        "Admin was not created. The username may already belong to another user.",
      );
    }

    console.log("Initial admin account created successfully.");
    console.log(`Username: ${username}`);
    console.log("Keep your password secure.");
  } finally {
    rl.close();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Admin seed failed:", error.message);
  process.exitCode = 1;
});