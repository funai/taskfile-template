#!/usr/bin/env -S deno run --allow-all --ext=ts

import { parseArgs } from "jsr:@std/cli/parse-args";
import $ from "jsr:@david/dax"; // "dax-sh" in Node

// Main function
async function main() {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["path"],
    alias: {
      "path": "p",
    },
    default: {
      path: "",
    },
  });

  let filePaths: string[] = '';
  let filePath: string = '';
  if (parsedArgs._.length > 1) {
    filePaths = parsedArgs._;
  } else {
    filePath = parsedArgs._[0] || parsedArgs.path;
  }

  if (!filePath && !filePaths) {
    console.error("Error: Path argument is required.");
    Deno.exit(1);
  }

  try {
    if (filePaths) {
      await $`touch ${filePaths}`;
    } else {
      await $`touch ${filePath}`;
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    Deno.exit(1);
  }
}

// Entry point
if (import.meta.main) {
  main();
}

