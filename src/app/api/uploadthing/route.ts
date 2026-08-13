import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

const DEFAULT_UPLOADTHING_TOKEN = "eyJhcGlLZXkiOiJza19saXZlX2U1YjllZTE1NzVhYjA5MWJiN2RjZDQ0YjA0ODBiMzRiNTUyYzFhNWU4MzZjMThkNzA1NjFjYmMzMmM2ODg3NTkiLCJhcHBJZCI6InQzOWtyMm9ycXciLCJyZWdpb25zIjpbInNlYTEiXX0=";

const activeToken = (process.env.UPLOADTHING_TOKEN || DEFAULT_UPLOADTHING_TOKEN)
  .trim()
  .replace(/^['"]|['"]$/g, "");

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: activeToken,
  },
});
