import { pgTable, serial, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./user.schema.js";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", {
    length: 225
  }).notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})