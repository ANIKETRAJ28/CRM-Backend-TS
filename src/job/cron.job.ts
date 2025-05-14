import cron from "node-cron";
import { BACKEND_URL } from "../config/env.config";

export const scheduleCron = (): void => {
  cron.schedule("* * * * *", async () => {
    try {
      await fetch(`${BACKEND_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Cron job executed successfully");
    } catch (error) {
      console.error("Error executing cron job:", error);
    }
  });
};
