const express = require("express");
const router = express.Router();

const mongo = require("./mongodb.js");

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


router.get('/drivers', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection: {
                _id: 0
            }
        }
        let allDrivers = await db.collection("drivers").find({}, options).toArray();
        res.send(allDrivers);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/drivers/:driver', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection: {
                _id: 0
            }
        }
        let driverInfo = await db.collection("drivers").findOne({ driver_id: req.params.driver }, options);
        res.send(driverInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/constructors', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection: {
                _id: 0
            }
        }
        let allConstructors = await db.collection("constructors").find({}, options).toArray();
        res.send(allConstructors);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/constructors/:constructor', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection: {
                _id: 0
            }
        }
        let constructorInfo = await db.collection("constructors").findOne({ constructor_id: req.params.constructor }, options);
        res.send(constructorInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/circuits', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection: {
                _id: 0
            }
        }
        let allCircuits = await db.collection("circuits").find({}, options).toArray();
        res.send(allCircuits);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/circuits/:circuit', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            projection: {
                _id: 0
            }
        }
        let circuitInfo = await db.collection("circuits").findOne({ circuit_id: req.params.circuit }, options);
        res.send(circuitInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/races', async (req, res) => {
    const db = mongo.getDB();
    try {
        const races = await db.collection('races').aggregate([
            {
                $lookup: {
                    from: 'circuits',
                    localField: 'circuit_id',
                    foreignField: 'circuit_id',
                    as: 'circuit'
                }
            },
            {
                $unwind: '$circuit'
            },
            {
                $project: {
                    _id: 0,
                    year: 1,
                    round: 1,
                    race_date: 1,
                    country: '$circuit.country',
                    city: '$circuit.city',
                    circuit_id: 1,
                    circuit_name: '$circuit.circuit_name'
                }
            }
        ]).toArray();

        res.send(races);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:year/drivers', async (req, res) => {
    const db = mongo.getDB();
    try {
        const year = parseInt(req.params.year);
        const driverIds = await db.collection("driver_standings").distinct('driver_id', { year });
        const driversInfo = await db.collection("drivers").find({ driver_id: { $in: driverIds } }, { projection: { _id: 0 } }).toArray();
        res.send(driversInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/:year/races', async (req, res) => {
    const db = mongo.getDB();
    try {
        const year = parseInt(req.params.year);

        const racesInfo = await db.collection("races").aggregate([
            { $match: { year: year } },
            {
                $lookup: {
                    from: "circuits",
                    localField: "circuit_id",
                    foreignField: "circuit_id",
                    as: "circuit"
                }
            },
            { $unwind: "$circuit" },
            {
                $project: {
                    _id: 0,
                    year: year,
                    round: "$round",
                    race_date: "$race_date",
                    country: "$circuit.country",
                    city: "$circuit.city",
                    circuit_id: "$circuit.circuit_id",
                    circuit_name: "$circuit.circuit_name"
                }
            }
        ]).toArray();

        res.send(racesInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/:year/constructors', async (req, res) => {
    const db = mongo.getDB();
    try {
        const year = parseInt(req.params.year);
        const constructorsInfo = await db.collection("constructor_standings").aggregate([
            {
                $match: { year }
            },
            {
                $group: {
                    _id: "$constructor_id"
                }
            },
            {
                $lookup: {
                    from: "constructors",
                    localField: "_id",
                    foreignField: "constructor_id",
                    as: "constructor"
                }
            },
            {
                $unwind: "$constructor"
            },
            {
                $project: {
                    _id: 0,
                    constructor_id: "$constructor.constructor_id",
                    constructor_name: "$constructor.constructor_name",
                    nationality: "$constructor.nationality",
                    main_office: "$constructor.main_office"
                }
            }
        ]).toArray();

        res.send(constructorsInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/:year/circuits', async (req, res) => {
    const db = mongo.getDB();
    try {
        const circuitsInfo = await db.collection("races").aggregate([
            { $match: { year: parseInt(req.params.year) } },
            {
                $lookup: {
                    from: "circuits",
                    localField: "circuit_id",
                    foreignField: "circuit_id",
                    as: "circuit"
                }
            },
            { $unwind: "$circuit" },
            {
                $group: {
                    _id: "$circuit.circuit_id",
                    country: { $first: "$circuit.country" },
                    city: { $first: "$circuit.city" },
                    circuit_name: { $first: "$circuit.circuit_name" },
                    length_in_km: { $first: "$circuit.length_in_km" },
                }
            },
            { $project: { _id: 0, circuit_id: "$_id", country: 1, city: 1, circuit_name: 1, length_in_km: 1 } }
        ]).toArray();

        res.send(circuitsInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;