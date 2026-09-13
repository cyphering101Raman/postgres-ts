import { pgTable, serial, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./user.schema.js";
import { createInsertSchema } from "drizzle-zod";

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
});

// Create a Zod validation schema directly from our Drizzle table.
// We pick only the fields the user is allowed to submit, and make them required.
export const insertTodoSchema = createInsertSchema(todos).pick({
  title: true,
  description: true,
}).required();