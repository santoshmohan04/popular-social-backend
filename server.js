import { startServer } from "./src/server.js";

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
