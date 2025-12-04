import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const policiesPath = path.join(__dirname, "../data/policies.json");
const outputPath = path.join(__dirname, "../database/seed.sql");

const policies = JSON.parse(fs.readFileSync(policiesPath, "utf-8"));

const escape = (val: any) => {
  if (val === undefined || val === null) return "NULL";
  const str = String(val);
  return `'${str.replace(/'/g, "''")}'`;
};

const sqlStatements = policies.map((p: any) => {
  return `INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    ${escape(p.id)},
    ${escape(p.title)},
    ${escape(p.category)},
    ${p.age_min || "NULL"},
    ${p.age_max || "NULL"},
    ${escape(p.income_limit)},
    ${escape(p.region)},
    ${escape(p.benefit_summary)},
    ${escape(p.description)},
    ${escape(p.apply_url)}
  );`;
});

const finalSql = `DELETE FROM policies;\n` + sqlStatements.join("\n");

fs.writeFileSync(outputPath, finalSql);

console.log(
  `Generated seed.sql with ${policies.length} policies at ${outputPath}`
);
