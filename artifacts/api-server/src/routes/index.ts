import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuItemsRouter from "./menu-items";
import cateringOrdersRouter from "./catering-orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuItemsRouter);
router.use(cateringOrdersRouter);

export default router;
