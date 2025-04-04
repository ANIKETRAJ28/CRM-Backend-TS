import { Router } from "express";

import { v1Route } from "./v1";

export const router = Router();

router.use("/v1", v1Route);
