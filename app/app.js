const express = require("express");
const app = express();

require("dotenv").config({ path: __dirname + '/private/settings.env' });

const db = require("./mongodb.js");

const generalApiRouter = require("./api/general.js");
const racesApiRouter = require("./api/races.js");
const standingsApiRouter = require("./api/standings.js");
const datasetApiRouter = require("./api/dataset.js");

app.use("/api", generalApiRouter);
app.use("/api", racesApiRouter);
app.use("/api", standingsApiRouter);
app.use("/api", datasetApiRouter);

app.use(express.static(__dirname +"/public/", { extensions: ['html'] }));

app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
    await db.connect().then(console.log("Connected to MongoDB"));
});