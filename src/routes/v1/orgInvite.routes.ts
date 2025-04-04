import { Router } from "express";

import { OrgInviteController } from "../../controller/orgInvite.controller";

const orgInviteController = new OrgInviteController();

export const orgInviteRoute = Router();

orgInviteRoute.post("/", orgInviteController.createUserOrgInvite);
