import { auth } from "@ledgerly/auth";
import { env } from "@ledgerly/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { categoryRoutes } from "./routes/category.routes";
import { walletRoutes } from "./routes/wallet.routes";
import { transactionRoutes } from "./routes/transaction.routes";
import { budgetRoutes } from "./routes/budget.routes";
import { notificationRoutes } from "./routes/notification.routes";
import { invoiceRoutes } from "./routes/invoice.route";

// Allowed origins for development and production
const allowedOrigins = [
  "http://localhost:3000", // Local web dev
  "http://10.0.2.2:3000", // Android emulator
  "https://10.0.2.2:3000", // Android emulator (HTTPS)
  env.CORS_ORIGIN, // Environment-based origin (ngrok/production)
];

const app = new Hono()
  .use(logger())
  .use(
    "/*",
    cors({
      origin: allowedOrigins,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      credentials: true,
    }),
  )
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .route("/api/category", categoryRoutes)
  .route("/api/wallet", walletRoutes)
  .route("/api/budget", budgetRoutes)
  .route("/api/transaction", transactionRoutes)
  .route("/api/notification", notificationRoutes)
  .route("/api/invoice", invoiceRoutes);

app.get("/api/health", (c) => {
  return c.json({ message: "Route is up and running" }, 200);
});

app.onError((err, c) => {
  console.error("[Server Error]", err);
  return c.json(
    {
      error: err.message || "Internal Server Errror",
      ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
    500,
  );
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});
export type AppType = typeof app;
export default app;
