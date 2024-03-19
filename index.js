import express from "express";
import cors from "cors";
import { main } from "./lib/mongo.js";
import { routerWeb } from "./routes/index.js";
import { config } from "./config/index.js";
import path from "path";

const app = express();
const port = config.port;

main();
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/app", express.static("public"));
app.use(cors());
routerWeb(app);


app.get("/", (req, res) => {
  res.send("Welcome to the FLASHBACK API");
});

app.listen(port, () => {
  console.log("server en el puerto ", port);
});
