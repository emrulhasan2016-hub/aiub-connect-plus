const fs = require("fs");
const path = require("path");
const db = require("./db");

function init() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  db.exec(schemaSql);
  console.log("✔ SQLite schema applied at:", db.name);
}

init();
