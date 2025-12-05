import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { ruruHTML } from "ruru/server";


var schema = buildSchema(`
    type Query
    {hello: String}
    `)


const root = {
    hello(){
        return "Hello test"
    }
}

const app = express();
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

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});
