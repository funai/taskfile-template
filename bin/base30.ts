#!/usr/bin/env -S deno run -A --ext=ts

import { parseArgs } from "jsr:@std/cli/parse-args";

//#!/usr/bin/env -S deno run -A --ext=ts
//
//import { parseArgs } from "https://deno.land/std@0.115.1/flags/mod.ts";

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random item from an array
function getRandomItem(items: string[]): string {
  const max: number = items.length;
  const index: number = getRandomInt(0, max - 1);
  return items[index];
}

// Function to generate a random base30 string
export function getRandomBase30(len: number): string {
  const base30: string = "0123456789Acdefghjkmnpqrtvwxyz";
  const baseArr: string[] = base30.toLowerCase().split("");
  let randStr: string = "";
  let numUsed: number = 0;
  const numMax: number = Math.floor(len / 2);

  while (randStr.length < len) {
    const choice: string = getRandomItem(baseArr);

    if (/\d/.test(choice)) {
      numUsed++;
      if (numUsed > numMax) {
        continue;
      }
    }

    randStr += choice;
  }

  return randStr;
}

// Main function
function main() {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["length"],
    boolean: ["caps"],
    default: {
      length: "8",
      caps: false,
    },
  });

  let len: number = 0;
  if (parsedArgs._.length > 0) {
    len = parseInt(parsedArgs._[0]);
  } else if (parsedArgs.length) {
    len = parseInt(parsedArgs.length, 10);
  }

  if (isNaN(len)) {
    console.error("Error: Length must be a valid number.");
    Deno.exit(1);
  }

  let randomString = getRandomBase30(len);

  if (parsedArgs.caps) {
    randomString = randomString.toUpperCase();
  }

  console.log(randomString);
}

// Entry point
if (import.meta.main) {
  main();
}
