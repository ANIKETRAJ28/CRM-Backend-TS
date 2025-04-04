import { Router } from "express";

import { authRouter } from "./auth.routes";
import { orgRouter } from "./org.routes";
import { jwtMiddleware, orgMiddleware } from "../../middleware/auth.middleware";
import { userOrgRoute } from "./userOrg.routes";
import { orgInviteRoute } from "./orgInvite.routes";
import { ticketRouter } from "./ticket.routes";
import { registerRoute } from "./register.routes";

export const v1Route = Router();

v1Route.use("/register", registerRoute);
v1Route.use("/auth", authRouter);
v1Route.use("/org", jwtMiddleware, orgRouter);
v1Route.use("/userOrg", jwtMiddleware, userOrgRoute);
v1Route.use("/orgInvite", jwtMiddleware, orgMiddleware, orgInviteRoute);
v1Route.use("/ticket", jwtMiddleware, orgMiddleware, ticketRouter);
