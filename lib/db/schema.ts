import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(), 
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  wishlist: text("wishlist"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Games table
export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => users.id),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users <-> Games membership
export const gamePlayers = pgTable("game_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Secret Santa assignments
export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  giverId: text("giver_id").notNull().references(() => users.id),
  receiverId: text("receiver_id").notNull().references(() => users.id), 
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id),
  year: text("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  favoriteColors: text("favorite_colors").notNull(),
  interests: text("interests").notNull(),
  wishlist: text("wishlist").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
