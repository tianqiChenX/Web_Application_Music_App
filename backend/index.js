require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/routes");

mongoose.connect(mongoString);
const database = mongoose.connection;

// connect to the database, and throws any error if the connection fails.
database.on("error", (error) => {
    console.log(error);
});

// If it is successful, show a message that says Database Connected.
database.once("connected", () => {
    console.log("Database Connected");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
