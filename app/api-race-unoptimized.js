const express = require("express");
const router = express.Router();

const mongo = require("./mongodb.js");

// REST APIs
/*
GET /api/:year/:round                                   // race info
GET /api/:year/:round/race_results                      // results of race
GET /api/:year/:round/race_lap_times                    // lap times of race
GET /api/:year/:round/race_lap_times/lap/:lap           // lap times of race-lap
GET /api/:year/:round/race_lap_times/driver/:driver     // lap times of driver
GET /api/:year/:round/sprint_results                    // results of sprint race
GET /api/:year/:round/driver_standings                  // drivers standings after race
GET /api/:year/:round/constructor_standings             // constructor standings after race
*/


router.get('/:year/:round', async (req,res) => {
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        let race = await db.collection("races").findOne(raceQuery);

        let singleRaceInfo = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            race_date : '',
            country : '',
            city : '',
            circuit_id : '',
            circuit_name : ''
        }
        singleRaceInfo.round = race.round;
        singleRaceInfo.race_date = race.race_date;
        let circuitInfo = await db.collection("circuits").findOne({circuit_id : race.circuit_id});
        singleRaceInfo.country = circuitInfo.country;
        singleRaceInfo.city = circuitInfo.city;
        singleRaceInfo.circuit_name = circuitInfo.circuit_name;    
        singleRaceInfo.circuit_id = circuitInfo.circuit_id;        
        res.send(singleRaceInfo);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/race_results', async (req,res) => {
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        let race = await db.collection("races").findOne(raceQuery);

        let singleRaceInfo = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            /*
            race_date : '',
            country : '',
            city : '',
            circuit : '',
            circuit_length_in_km : '',
            */
            results : []
        }
        singleRaceInfo.round = race.round;
        //singleRaceInfo.race_date = race.race_date;
        //let circuitInfo = await db.collection("circuits").findOne({circuit_id : race.circuit_id});
        //singleRaceInfo.country = circuitInfo.country;
        //singleRaceInfo.city = circuitInfo.city;
        //singleRaceInfo.circuit = circuitInfo.circuit_name;
        //singleRaceInfo.circuit_length_in_km = circuitInfo.length_in_km;
        
        let raceResults = await db.collection("race_results").find(raceQuery).toArray();

        for(let result of raceResults) {
            let driverResult = {
                finish_position : result.finish_position,
                driver_name : '',
                constructor_name : '',
                finish_status : result.finish_status
            }
            driverResult.driver_name = (await db.collection("drivers").findOne({driver_id : result.driver_id})).driver_name;
            driverResult.constructor_name = (await db.collection("constructors").findOne({constructor_id : result.constructor_id})).constructor_name;
            singleRaceInfo.results.push(driverResult);
        }
        
        res.send(singleRaceInfo); // send ( [array] ) or json( { drivers : [array] } ) ?
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/race_lap_times', async (req,res) => { // lap times of a given race
    const db = mongo.getDB();

    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        const response = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            /*
            race_date : '',
            circuit : '',
            */
            lap_times : []
        };
        /*
        let race = await db.collection("races").findOne(raceQuery);
        response.race_date = race.race_date;
        response.circuit = (await db.collection("circuits").findOne({circuit_id : race.circuit_id})).circuit_name;
        */

        let raceLapTimes = await db.collection("lap_times").find(raceQuery).toArray();

        let i = 0;
        while(typeof raceLapTimes[i] !== 'undefined') {
            currentLap = raceLapTimes[i].lap;
            let times = [];
            while((typeof raceLapTimes[i] !== 'undefined') && (currentLap === raceLapTimes[i].lap)) {
                let driver_time = {
                    driver_id : raceLapTimes[i].driver_id,
                    driver_name : (await db.collection("drivers").findOne({driver_id : raceLapTimes[i].driver_id})).driver_name,
                    lap_time : raceLapTimes[i].lap_time
                };
                times.push(driver_time);
                i++;
            }
            response.lap_times.push({
                lap : currentLap,
                times : times
            });
        }

        res.send(response);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/race_lap_times/lap/:lap', async (req,res) => { // lap time of a given race
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        const response = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            /*
            race_date : '',
            circuit : '',
            */
            lap : parseInt(req.params.lap),
            lap_times : []
        };
        //let race = await db.collection("races").findOne(raceQuery);
        //response.race_date = race.race_date;
        //response.circuit = (await db.collection("circuits").findOne({circuit_id : race.circuit_id})).circuit_name;
        const lapTimesQuery = { 
            year : raceQuery.year,
            round : raceQuery.round,
            lap : parseInt(req.params.lap)
        };
        let raceLapTimes = await db.collection("lap_times").find(lapTimesQuery).toArray();

        for(let data of raceLapTimes) {
            response.lap_times.push({
                driver_id : data.driver_id,
                lap_time : data.lap_time
            })
        }
        res.send(response);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/race_lap_times/driver/:driver', async (req,res) => { // lap time of a given race
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        const response = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            /*
            race_date : '',
            circuit : '',
            */
            driver_id : req.params.driver,
            lap_times : []
        };
        //let race = await db.collection("races").findOne(raceQuery);
        //response.race_date = race.race_date;
        //response.circuit = (await db.collection("circuits").findOne({circuit_id : race.circuit_id})).circuit_name;
        const lapTimesQuery = { 
            year : raceQuery.year,
            round : raceQuery.round,
            driver_id : req.params.driver
        };
        let raceLapTimes = await db.collection("lap_times").find(lapTimesQuery).toArray();

        for(let data of raceLapTimes) {
            response.lap_times.push({
                lap : data.lap,
                lap_time : data.lap_time
            })
        }
        res.send(response);
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/sprint_results', async (req,res) => { // sprint info
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        //let race = await db.collection("races").findOne(raceQuery);

        let singleRaceInfo = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            /*
            race_date : '',
            country : '',
            city : '',
            circuit : '',
            circuit_length_in_km : '',
            */
            results : []
        }
        /*singleRaceInfo.race_date = race.race_date;
        let circuitInfo = await db.collection("circuits").findOne({circuit_id : race.circuit_id}, circuitQueryOptions);
        singleRaceInfo.country = circuitInfo.country;
        singleRaceInfo.city = circuitInfo.city;
        singleRaceInfo.circuit = circuitInfo.circuit_name;
        singleRaceInfo.circuit_length_in_km = circuitInfo.length_in_km;
        */
        
        let raceResults = await db.collection("sprint_results").find(raceQuery).toArray();

        for(let result of raceResults) {
            let driverResult = {
                finish_position : result.finish_position,
                driver_name : '',
                constructor_name : '',
                finish_status : result.finish_status
            }
            driverResult.driver_name = (await db.collection("drivers").findOne({driver_id : result.driver_id})).driver_name;
            driverResult.constructor_name = (await db.collection("constructors").findOne({constructor_id : result.constructor_id})).constructor_name;
            singleRaceInfo.results.push(driverResult);
        }
        
        res.send(singleRaceInfo); // send ( [array] ) or json( { drivers : [array] } ) ?
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/driver_standings', async (req,res) => {
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        let standings = await db.collection("driver_standings").find(raceQuery).toArray();
        //let race = await db.collection("races").findOne(raceQuery);

        let response = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            //race_date : '',
            //country : '',
            //city : '',
            //circuit : '',
            //circuit_length_in_km : '',
            driver_standings : []
        }
        
        //response.race_date = race.race_date;
        //let circuitInfo = await db.collection("circuits").findOne({circuit_id : race.circuit_id});
        //response.country = circuitInfo.country;
        //response.city = circuitInfo.city;
        //response.circuit = circuitInfo.circuit_name;
        //response.circuit_length_in_km = circuitInfo.length_in_km;
        
        for(let driver of standings) {
            let driverNameQuery = await db.collection("drivers").findOne({driver_id : driver.driver_id});
            response.driver_standings.push({
                position : driver.position,
                driver_id : driver.driver_id,
                driver_name : driverNameQuery.driver_name,
                points : driver.points
            });
        }
        
        res.send(response); // send ( [array] ) or json( { drivers : [array] } ) ?
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


router.get('/:year/:round/constructor_standings', async (req,res) => {
    const db = mongo.getDB();
    try {
        const raceQuery = { year : parseInt(req.params.year), round : parseInt(req.params.round) };
        let standings = await db.collection("constructor_standings").find(raceQuery).toArray();
        //let race = await db.collection("races").findOne(raceQuery);

        let response = {
            year : parseInt(req.params.year),
            round : parseInt(req.params.round),
            /*race_date : '',
            country : '',
            city : '',
            circuit : '',
            circuit_length_in_km : '',*/
            constructor_standings : []
        }
        /*
        response.race_date = race.race_date;
        let circuitInfo = await db.collection("circuits").findOne({circuit_id : race.circuit_id});
        response.country = circuitInfo.country;
        response.city = circuitInfo.city;
        response.circuit = circuitInfo.circuit_name;
        response.circuit_length_in_km = circuitInfo.length_in_km;
        */
        for(let constructor of standings) {
            let constructorNameQuery = await db.collection("constructors").findOne({constructor_id : constructor.constructor_id});
            response.constructor_standings.push({
                position : constructor.position,
                constructor_id : constructor.constructor_id,
                constructor_name : constructorNameQuery.constructor_name,
                points : constructor.points
            });
        }
        
        res.send(response); // send ( [array] ) or json( { drivers : [array] } ) ?
    } catch(err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({error : "Server error"});
    }
});


module.exports = router;