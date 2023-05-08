const express = require("express");
const router = express.Router();
const fs = require('fs');

const DATASET_DIRECTORY = __dirname + '/../../f1data/';
const DOMAIN = 'https://f1-app-demo-a5kvrhkn4a-ew.a.run.app';

router.get('/dataset', async (req, res) => {
    try {
        let files = await fs.promises.readdir(DATASET_DIRECTORY);
        let response = [];
        for(let file of files) {
            let fileInfo = await fs.promises.stat(DATASET_DIRECTORY + file);
            response.push({
                filename : file,
                size_in_byte : fileInfo.size,
                last_modified : fileInfo.mtime
            });
        }
        res.set('dc.title', 'F1 Dataset');
        res.set('dc.creator', 'Mauro Farina');
        res.set('dc.subject', 'F1, Formula 1, Formula One, Motorsport, csv, api, dataset');
        res.set('dc.description', 'A dataset containing information about the latest seasons of Formula 1');
        res.set('dc.type', 'json');
        res.set('dc.format', 'application/json');
        res.set('dc.identifier', DOMAIN + '/api/dataset');
        res.set('dc.language', 'EN');
        res.set('dc.rights', 'CCO 1.0 Universal');
        res.send(response);
    } catch(err) {
        console.error(err);
        res.status(500).send('Error while reading a file.');
        return;
    }
});


router.get('/dataset/:filename', async (req, res) => {
    const filePath = DATASET_DIRECTORY + req.params.filename;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('File not found.');
            return;
        }
        res.set('dc.title', req.params.filename);
        res.set('dc.creator', 'Mauro Farina');
        res.set('dc.subject', 'F1, Formula 1, Motorsport, csv, api, dataset');
        res.set('dc.description', 'A dataset containing information about the latest seasons of Formula 1');
        res.set('dc.type', 'csv');
        res.set('dc.format', 'text/csv');
        res.set('dc.identifier', DOMAIN + '/api/dataset/' + req.params.filename);
        res.set('dc.language', 'EN');
        res.set('dc.rights', 'CCO 1.0 Universal');
        res.set('Content-Type', 'text/csv');
        res.send(data);
    });
});

module.exports = router;