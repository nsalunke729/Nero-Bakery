import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orderTypeValues = ["bulk", "catering"] as const;
export const orderStatusValues = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export interface CateringOrderItem {
  menuItemId: string;
  itemName: string;
  quantity: number;
}

export const cateringOrdersTable = pgTable("catering_orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  orderType: text("order_type", { enum: orderTypeValues }).notNull(),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  guestCount: integer("guest_count"),
  items: jsonb("items").notNull().$type<CateringOrderItem[]>(),
  notes: text("notes"),
  status: text("status", { enum: orderStatusValues })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertCateringOrderSchema = createInsertSchema(
  cateringOrdersTable,
).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertCateringOrder = z.infer<typeof insertCateringOrderSchema>;
export type CateringOrderRow = typeof cateringOrdersTable.$inferSelect;
