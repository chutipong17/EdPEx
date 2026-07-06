import app, { handler } from "./app";

// Export the handler for Next.js API routes
export { handler };

// This conditional allows the file to be used both as a standalone server
// and as a module for Next.js API routes
if (require.main === module) {
  // Only run the standalone server when this file is executed directly
  import("@hono/node-server").then(({ serve }) => {
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    serve({
      fetch: app.fetch,
      port: PORT,
    });

    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}
