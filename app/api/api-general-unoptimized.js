const express = require("express");
const router = express.Router();

const mongo = require("../mongodb.js");

// REST APIs
/*
GET /api/drivers                                        // all drivers across all seasons
GET /api/drivers/:driverName                            // infos about a single driver
GET /api/constructors                                   // all constructors across all seasons
GET /api/constructors/:constructorName                  // infos about a single constructor
GET /api/circuits                                       // all circuits across all seasons
GET /api/circuits/:circuitName                          // infos about a single circuit
GET /api/races                                          // all races across all seasons

GET /api/:year/drivers                                  // drivers who compete in the given year
GET /api/:year/races                                    // races of the year: circuit, location, date
GET /api/:year/constructors                             // constructors who compete in the given year
GET /api/:year/circuits                                 // circuits used in the given year
*/


router.get('/drivers', async (req,res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection : {
                _id : 0
            }
        }
        let allDrivers = await db.collection("drivers").find({}, options).toArray();
        res.send(allDrivers);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/drivers/:driver', async (req,res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection : {
                _id : 0
            }
        }
        let driverInfo = await db.collection("drivers").findOne({driver_id : req.params.driver}, options);
        res.send(driverInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/constructors', async (req,res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection : {
                _id : 0
            }
        }
        let allConstructors = await db.collection("constructors").find({}, options).toArray();
        res.send(allConstructors);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/constructors/:constructor', async (req,res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection : {
                _id : 0
            }
        }
        let constructorInfo = await db.collection("constructors").findOne({constructor_id : req.params.constructor}, options);
        res.send(constructorInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/circuits', async (req,res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection : {
                _id : 0
            }
        }
        let allCircuits = await db.collection("circuits").find({}, options).toArray();
        res.send(allCircuits);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/circuits/:circuit', async (req,res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection : {
                _id : 0
            }
        }
        let circuitInfo = await db.collection("circuits").findOne({circuit_id : req.params.circuit}, options);
        res.send(circuitInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/races', async (req,res) => {
    const db = mongo.getDB();
    try {
        let allRaces = await db.collection("races").find({}).toArray();
        let racesInfo = [];
        for(let r of allRaces) {
            let singleRaceInfo = {
                year : r.year,
                round : r.round,
                race_date : r.race_date,
                country : '',
                city : '',
                circuit_id : r.circuit_id,
                circuit_name : ''
            }
            
            let circuitInfo = await db.collection("circuits").findOne({circuit_id : r.circuit_id});
            singleRaceInfo.country = circuitInfo.country;
            singleRaceInfo.city = circuitInfo.city;
            singleRaceInfo.circuit_name = circuitInfo.circuit_name;
            
            racesInfo.push(singleRaceInfo);
        }
        res.send(racesInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/drivers', async (req,res) => {
    const db = mongo.getDB();
    try {

        let allDriversOfYear = await db.collection("driver_standings").distinct('driver_id', {year : parseInt(req.params.year)});
        
        let driversInfo = [];
        const options = {
            projection : {
                _id : 0
            }
        }
        
        for(let d of allDriversOfYear) {
            driversInfo.push(await db.collection("drivers").findOne({driver_id : d}, options));
        }
        
        res.send(driversInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/races', async (req,res) => {
    const db = mongo.getDB();
    try {
        let allRacesOfYear = await db.collection("races").find({year : parseInt(req.params.year)}).toArray();
        let racesInfo = [];
        
        for(let r of allRacesOfYear) {
            let singleRaceInfo = {
                year : parseInt(req.params.year),
                round : r.round,
                race_date : r.race_date,
                country : '',
                city : '',
                circuit_id : r.circuit_id,
                circuit_name : ''
            }
            
            let circuitInfo = await db.collection("circuits").findOne({circuit_id : r.circuit_id});
            singleRaceInfo.country = circuitInfo.country;
            singleRaceInfo.city = circuitInfo.city;
            singleRaceInfo.circuit_name = circuitInfo.circuit_name;
            
            racesInfo.push(singleRaceInfo);
        }
        res.send(racesInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/constructors', async (req,res) => {
    const db = mongo.getDB();
    try {
        let allConstructorsOfYear = await db.collection("constructor_standings").distinct('constructor_id', {year : parseInt(req.params.year)}, {});
        let constructorsInfo = [];
        const options = {
            projection : {
                _id : 0
            }
        }
        for(let c of allConstructorsOfYear) {
            constructorsInfo.push(await db.collection("constructors").findOne({constructor_id : c}, options));
        }
        res.send(constructorsInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/circuits', async (req,res) => {
    const db = mongo.getDB();
    try {
        let allCircuitsOfYear = await db.collection("races").distinct('circuit_id', {year : parseInt(req.params.year)}, {});
        let circuitsInfo = [];
        
        const options = {
            projection : {
                _id : 0
            }
        }
        for(let c of allCircuitsOfYear) {
            circuitsInfo.push(await db.collection("circuits").findOne({circuit_id : c}, options));
        }
        
        res.send(circuitsInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


module.exports = router;