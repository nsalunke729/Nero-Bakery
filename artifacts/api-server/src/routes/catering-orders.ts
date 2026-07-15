import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, cateringOrdersTable } from "@workspace/db";
import {
  CreateCateringOrderBody,
  CreateCateringOrderResponse,
  GetCateringOrderParams,
  GetCateringOrderResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/catering-orders", async (req, res): Promise<void> => {
  const parsed = CreateCateringOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.items.length === 0) {
    res.status(400).json({ error: "At least one item is required" });
    return;
  }

  const eventDateStr = parsed.data.eventDate.toISOString().slice(0, 10);

  const [order] = await db
    .insert(cateringOrdersTable)
    .values({
      id: randomUUID(),
      customerName: parsed.data.customerName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      orderType: parsed.data.orderType,
      eventDate: eventDateStr,
      guestCount: parsed.data.guestCount ?? null,
      items: parsed.data.items,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  req.log.info({ orderId: order?.id }, "Created catering order request");
  res.status(201).json(CreateCateringOrderResponse.parse(order));
});

router.get("/catering-orders/:id", async (req, res): Promise<void> => {
  const params = GetCateringOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(cateringOrdersTable)
    .where(eq(cateringOrdersTable.id, params.data.id));

  if (!order) {
    res.status(404).json({ error: "Order request not found" });
    return;
  }

  res.json(GetCateringOrderResponse.parse(order));
});

export default router;
