const express = require("express");
const app = express();

require("dotenv").config({ path: __dirname + '/private/settings.env' });

const db = require("./mongodb.js");
const generalAPI = require("./api/api-general.js");
const raceAPI = require("./api/api-race.js");
const datasetAPI = require("./api/dataset.js");
const oldRaceAPI = require("./api/api-race-unoptimized.js");
const oldGeneralAPI = require("./api/api-general-unoptimized.js");

app.use("/api", generalAPI);
app.use("/api", raceAPI);
app.use("/api", datasetAPI);
app.use("/oldapi", oldGeneralAPI);
app.use("/oldapi", oldRaceAPI);

app.use(express.static(__dirname +"/public/", { extensions: ['html'] }));

app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
    await db.connect().then(console.log("Connected to MongoDB"));
});