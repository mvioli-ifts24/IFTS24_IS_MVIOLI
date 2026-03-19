require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/", rootRouter);

app.listen(port, () => {
  console.log(`La API esta corriendo en el puerto ${port}`);
});
