const pg = require("pg");
const express = require("express");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_shop_db"
);

const app = express();
app.use(express.json());
app.use(require("morgan")("dev"));

app.post("/api/shop", async (req, res, next) => {
  try {
    const SQL = `
    INSERT INTO shop(name) 
    VALUES($1) 
    RETURNING *
    `;
    const response = await client.query(SQL, [req.body.text]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get("/api/shop", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * from shop ORDER BY created_at DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.put("/api/shop/:id", async (req, res, next) => {
  try {
    const SQL = ``;
    const response = await client.query(SQL);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/shop/:id", async (req, res, next) => {
  try {
    const SQL = `
    DELETE from shop
    WHERE id = 
    `;
    const response = await client.query(SQL);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  let SQL = `
  DROP TABLE IF EXISTS shop;
  CREATE TABLE shop(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );
  `;
  await client.query(SQL);
  console.log("tables created");
  SQL = `
  INSERT INTO shop(name, is_favorite) VALUES('Strawberry', false);
  INSERT INTO shop(name, is_favorite) VALUES('Chocolate', true);
  INSERT INTO shop(name, is_favorite) VALUES('Mint', false);
  INSERT INTO shop(name, is_favorite) VALUES('Vanilla', true);
 `;
  await client.query(SQL);
  console.log("data seeded");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
