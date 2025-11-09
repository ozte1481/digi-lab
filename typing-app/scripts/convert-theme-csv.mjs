#!/usr/bin/env node
/**
 * Convert the provided CSV (インデックス, テーマ, カテゴリ, トピック, 説明01..10)
 * into the JSON structure expected by ThemeCollection.
 *
 * Usage:
 *   node scripts/convert-theme-csv.mjs --input path/to/source.csv --output app/data/japanese.json
 */

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function parseArgs() {
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    if (key === "--input" || key === "-i") {
      parsed.input = args[i + 1];
      i += 1;
    } else if (key === "--output" || key === "-o") {
      parsed.output = args[i + 1];
      i += 1;
    }
  }
  if (!parsed.input || !parsed.output) {
    throw new Error("Usage: node scripts/convert-theme-csv.mjs --input <csv> --output <json>");
  }
  return parsed;
}

function parseCsv(text) {
  const rows = [];
  let current = [];
  let value = "";
  let inQuotes = false;
  const content = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        value += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      current.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      current.push(value);
      rows.push(current);
      current = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || current.length > 0) {
    current.push(value);
    rows.push(current);
  }

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0));
}

function buildThemeCollection(rows) {
  const [header, ...data] = rows;
  const idxColumn = header.indexOf("インデックス");
  const themeColumn = header.indexOf("テーマ");
  const topicColumn = header.indexOf("トピック");

  const getColumnIndex = (index) => header.indexOf(`説明${index.toString().padStart(2, "0")}`);

  const entries = {};

  for (const row of data) {
    if (!row.length) continue;
    const indexRaw = row[idxColumn] || `${Object.keys(entries).length + 1}`;
    const key = indexRaw.trim().padStart(3, "0");
    const theme = row[themeColumn]?.trim() ?? "";
    const topic = row[topicColumn]?.trim() ?? "";
    const name = [theme, topic].filter(Boolean).join(" / ");

    const short = [];
    const long = [];

    for (let i = 1; i <= 5; i += 1) {
      const colIndex = getColumnIndex(i);
      const cell = colIndex >= 0 ? row[colIndex] : "";
      if (cell && cell.trim().length > 0) {
        short.push(cell.trim());
      }
    }

    for (let i = 6; i <= 10; i += 1) {
      const colIndex = getColumnIndex(i);
      const cell = colIndex >= 0 ? row[colIndex] : "";
      if (cell && cell.trim().length > 0) {
        long.push(cell.trim());
      }
    }

    entries[key] = {
      name: name || `Theme ${key}`,
      short,
      long: long.length > 0 ? long : short,
    };
  }

  return entries;
}

function main() {
  const { input, output } = parseArgs();
  const csvText = fs.readFileSync(input, "utf8");
  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    throw new Error(`No rows found in ${input}`);
  }
  const collection = buildThemeCollection(rows);
  const jsonText = `${JSON.stringify(collection, null, 2)}\n`;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, jsonText, "utf8");
  console.log(`Generated ${Object.keys(collection).length} themes -> ${output}`);
}

main();
