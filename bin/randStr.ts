#!/usr/bin/env -S deno run --ext=ts
import { parseArgs } from "jsr:@std/cli/parse-args";

class InvalidLengthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidLengthError";
  }
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomItem<T>(items: T[]): T {
  const max = items.length;
  const index = getRandomInt(0, max);
  return items[index];
}

function getCharset(lower: boolean, upper: boolean, num: boolean, symbol: boolean): string[] {
  const lowerChar = "acdefghjkmnpqrtvwxyz";
  const upperChar = "ACDEFGHJKMNPQRTVWXYZ";
  const numChar = "0123456789";
  const symChar = "@#$%&";
  let charset = "";

  if (lower) charset += lowerChar;
  if (upper) charset += upperChar;
  if (num) charset += numChar;
  if (symbol) charset += symChar;

  // set the default charset to lowerChar + numChar if no option is provided.
  if (charset === "") {
    charset = lowerChar + numChar;
  }

  return charset.split("");
}

function getRandomStr(charset: string[], len: number): string {
  if (isNaN(len) || len <= 0) throw new InvalidLengthError("Length must be a positive number.");

  let randStr = "";

  while (randStr.length < len) {
    const choice = getRandomItem(charset);
    randStr += choice;
  }

  return randStr;
}

function main(): string {
  const opts = parseArgs(Deno.args, {
    number: ["length", "times"],
    boolean: ["upper", "lower", "number", "symbol"],
    alias: {
      upper: "u",
      lower: "l",
      number: "n",
      symbol: "s",
      times: "t",
    },
    default: {
      length: 8,
      times: 1,
      upper: false,
      lower: false,
      number: false,
      symbol: false,
    },
  });

  let len: number;
  if (opts._.length > 0) {
    len = parseInt(opts._[0]);
  } else if (opts.length) {
    len = parseInt(opts.length);
  } else {
    len = opts.default.length;
  }

  try {
    const charset = getCharset(opts.lower, opts.upper, opts.number, opts.symbol);
    [...Array(opts.times)].map(() => console.log(getRandomStr(charset, len)));
  } catch (e) {
    if (e instanceof InvalidCharsetError || e instanceof InvalidLengthError) {
      console.error(e.message);
    } else {
      console.error("An unexpected error occurred:", e);
    }
  }

  return "";
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
