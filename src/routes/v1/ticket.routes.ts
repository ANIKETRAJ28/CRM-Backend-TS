import { Router } from "express";
import { TicketController } from "../../controller/ticket.controller";

const ticketController = new TicketController();

export const ticketRouter = Router();

ticketRouter.post("/", ticketController.createTicket);
ticketRouter.get("/", ticketController.getTicketsForAdmin);
ticketRouter.get("/assignee", ticketController.getTicketForAssignee);
ticketRouter.get("/reporter", ticketController.getTicketForReporter);
ticketRouter.get("/:id", ticketController.getTicketById); // check
ticketRouter.put("/:id", ticketController.updateTicketStatus);
