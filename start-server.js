const { spawn } = require("child_process");

console.log("Starting server...");

const server = spawn(
  "npx",
  [
    "ts-node-dev",
    "--project",
    "backend/tsconfig.json",
    "backend/src/server.ts",
  ],
  {
    stdio: "inherit",
    shell: true,
  }
);

server.on("error", (error) => {
  console.error("Failed to start server:", error);
});

server.on("close", (code) => {
  console.log(`Server exited with code ${code}`);
});
