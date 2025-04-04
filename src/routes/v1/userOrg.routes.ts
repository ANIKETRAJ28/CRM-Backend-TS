import { Router } from "express";
import { UserOrgController } from "../../controller/userOrg.controller";
import { orgMiddleware } from "../../middleware/auth.middleware";

const userOrgController = new UserOrgController();

export const userOrgRoute = Router();

userOrgRoute.get("/", userOrgController.getUserOrgs);
userOrgRoute.get(
  "/org/members",
  orgMiddleware,
  userOrgController.getUserOrgMembers
);
userOrgRoute.post("/org/:orgName", userOrgController.addUserOrgForUser);
userOrgRoute.post("/:hashCode", userOrgController.addUserOrg);
