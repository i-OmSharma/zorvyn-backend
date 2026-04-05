import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const startServer = async () => {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ Database connected");

    const app = createApp();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📋 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();