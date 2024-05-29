#!/usr/bin/env -S deno run -A --ext=ts --allow-read --allow-write

import { parseArgs } from "jsr:@std/cli/parse-args";
import { ensureFile } from "jsr:@std/fs/ensure-file";

// Main function
function main() {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["path"],
    alias: {
      "path": "p",
    },
    default: {
      path: "",
    },
  });

  let filePath = "";
  if (parsedArgs._.length > 0) {
    filePath = parsedArgs._[0];
  } else if (parsedArgs.path) {
    filePath = parsedArgs.path;
  }

  if (!filePath) {
    console.error("Error: Path argument is required.");
    Deno.exit(1);
  }

  try {
    ensureFile(filePath);
    // console.log(`File ${filePath} created or already exists.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    Deno.exit(1);
  }
}

// Entry point
if (import.meta.main) {
  main();
}
