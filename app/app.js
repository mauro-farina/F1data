const express = require("express");
const app = express();

const fs = require('fs');
require("dotenv").config({ path: __dirname + '/private/settings.env' });

const db = require("./mongodb.js");
const generalAPI = require("./api-general.js");
const raceAPI = require("./api-race.js");
const oldRaceAPI = require("./api-race-unoptimized.js");
const oldGeneralAPI = require("./api-general-unoptimized.js");

app.use("/api", generalAPI);
app.use("/api", raceAPI);
app.use("/oldapi", oldGeneralAPI);
app.use("/oldapi", oldRaceAPI);

app.use(express.static(__dirname +"/public/", { extensions: ['html'] }));

app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}`);
    await db.connect().then(console.log("Connected to MongoDB"));
});

const DATASET_DIRECTORY = __dirname + '/data/';

app.get('/dataset/:filename', async (req, res) => {
    const filePath = DATASET_DIRECTORY + req.params.filename + '.csv';

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error while reading file');
            return;
        }
        res.set('Content-Type', 'text/csv');
        res.send(data);
    });
});