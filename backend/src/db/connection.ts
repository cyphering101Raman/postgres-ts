import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);

export const db = drizzle(client);

export const connectDB = async () => {
  try {
    await client`SELECT 1`;
    console.log("✅Database connected");
  } catch (error) {
    console.log("❌Database connection failed:", error);
    process.exit(1);
  }
}