import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(), 
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  wishlist: text("wishlist"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Secret Santa assignments
export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  giverId: text("giver_id").notNull().references(() => users.id),
  receiverId: text("receiver_id").notNull().references(() => users.id), 
  year: text("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});