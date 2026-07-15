import { boolean, integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const menuCategoryValues = [
  "bread",
  "pastries",
  "cakes",
  "coffee",
  "sandwiches",
  "seasonal",
] as const;

export const menuItemsTable = pgTable("menu_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category", { enum: menuCategoryValues }).notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").notNull().default(true),
  ratingSum: integer("rating_sum").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({
  id: true,
  createdAt: true,
  ratingSum: true,
  ratingCount: true,
});
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItemRow = typeof menuItemsTable.$inferSelect;
