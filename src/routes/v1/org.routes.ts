import { Router } from "express";
import { OrgController } from "../../controller/org.controller";

const orgController = new OrgController();

export const orgRouter = Router();

orgRouter.post("/", orgController.createOrg);
orgRouter.get("/:id", orgController.getOrgById);
orgRouter.get("/name/:name", orgController.getOrgByName);
