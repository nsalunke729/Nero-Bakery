import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db, menuItemsTable, ratingsTable, type MenuItemRow } from "@workspace/db";
import {
  ListMenuItemsQueryParams,
  GetMenuItemParams,
  GetMenuItemResponse,
  ListMenuItemsResponse,
  ListMenuItemRatingsParams,
  ListMenuItemRatingsResponse,
  CreateMenuItemRatingParams,
  CreateMenuItemRatingBody,
  CreateMenuItemRatingResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toMenuItemResponse(row: MenuItemRow) {
  const ratingCount = row.ratingCount;
  const averageRating = ratingCount > 0 ? row.ratingSum / ratingCount : 0;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    imageUrl: row.imageUrl,
    isAvailable: row.isAvailable,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingCount,
    createdAt: row.createdAt,
  };
}

router.get("/menu-items", async (req, res): Promise<void> => {
  const parsed = ListMenuItemsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, sort } = parsed.data;

  const whereClause = category ? eq(menuItemsTable.category, category) : undefined;

  let orderByClause;
  if (sort === "price") {
    orderByClause = asc(menuItemsTable.price);
  } else if (sort === "rating") {
    orderByClause = desc(
      sql`CASE WHEN ${menuItemsTable.ratingCount} > 0 THEN ${menuItemsTable.ratingSum}::float / ${menuItemsTable.ratingCount} ELSE 0 END`,
    );
  } else {
    orderByClause = asc(menuItemsTable.name);
  }

  const rows = whereClause
    ? await db
        .select()
        .from(menuItemsTable)
        .where(whereClause)
        .orderBy(orderByClause)
    : await db.select().from(menuItemsTable).orderBy(orderByClause);

  req.log.info({ count: rows.length }, "Listed menu items");
  res.json(ListMenuItemsResponse.parse(rows.map(toMenuItemResponse)));
});

router.get("/menu-items/:id", async (req, res): Promise<void> => {
  const params = GetMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  res.json(GetMenuItemResponse.parse(toMenuItemResponse(item)));
});

router.get("/menu-items/:id/ratings", async (req, res): Promise<void> => {
  const params = ListMenuItemRatingsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  const ratings = await db
    .select()
    .from(ratingsTable)
    .where(eq(ratingsTable.menuItemId, params.data.id))
    .orderBy(desc(ratingsTable.createdAt));

  res.json(ListMenuItemRatingsResponse.parse(ratings));
});

router.post("/menu-items/:id/ratings", async (req, res): Promise<void> => {
  const params = CreateMenuItemRatingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateMenuItemRatingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  const [rating] = await db
    .insert(ratingsTable)
    .values({
      id: randomUUID(),
      menuItemId: params.data.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
      authorName: parsed.data.authorName ?? null,
    })
    .returning();

  await db
    .update(menuItemsTable)
    .set({
      ratingSum: sql`${menuItemsTable.ratingSum} + ${parsed.data.rating}`,
      ratingCount: sql`${menuItemsTable.ratingCount} + 1`,
    })
    .where(and(eq(menuItemsTable.id, params.data.id)));

  req.log.info({ menuItemId: params.data.id }, "Created menu item rating");
  res.status(201).json(CreateMenuItemRatingResponse.parse(rating));
});

export default router;
