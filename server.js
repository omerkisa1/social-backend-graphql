import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { ruruHTML } from "ruru/server";


const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);


const root = {
    quoteOfTheDay(){
        return Math.random() < 0.5 ? "Test true" : "test false";
    },
    random(){
        return Math.random();
    },
    rollThreeDice(){
        return [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6));
    }
}

const app = express();

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: root,
  })
);

app.listen(4000, () => {
  console.log("Running graphql: http://localhost:4000/graphql");
});