const express = require("express");
const router = express.Router();

const mongo = require("../mongodb.js");

// REST APIs
/*
GET /api/drivers[?year=XXXX]                            // all drivers across all seasons
GET /api/drivers/:driverName                            // infos about a single driver
GET /api/constructors[?year=XXXX]                       // all constructors across all seasons
GET /api/constructors/:constructorName                  // infos about a single constructor
GET /api/circuits[?year=XXXX]                           // all circuits across all seasons
GET /api/circuits/:circuitName                          // infos about a single circuit
GET /api/races                                          // all races across all seasons
*/


router.get('/drivers', async (req, res) => {
    const db = mongo.getDB();
    try {
        const options = {
            sort: {
                driver_name: 1
            },
            projection: {
                _id: 0
            }
        }
        let drivers;
        if (req.query['year']) {
            const yearFilter = { year: parseInt(req.query['year']) };
            const driverIds = await db.collection("driver_standings").distinct('driver_id', yearFilter);
            drivers = await db.collection("drivers").find({ driver_id: { $in: driverIds } }, options).toArray();
        } else {
            drivers = await db.collection("drivers").find({}, options).toArray();
        }
        res.send(drivers);
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
        let constructors;
        if (req.query['year']) {
            const yearFilter = { year: parseInt(req.query['year']) };
            const constructorIds = await db.collection("constructor_standings").distinct('constructor_id', yearFilter);
            constructors = await db.collection("constructors").find({ constructor_id: { $in: constructorIds } }, options).toArray();
        } else {
            constructors = await db.collection("constructors").find({}, options).toArray();
        }
        res.send(constructors);
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
        let circuits;
        if (req.query['year']) {
            const yearFilter = { year: parseInt(req.query['year']) };
            const circuitIds = await db.collection("races").distinct('circuit_id', yearFilter);
            circuits = await db.collection("circuits").find({ circuit_id: { $in: circuitIds } }, options).toArray();
        } else {
            circuits = await db.collection("circuits").find({}, options).toArray();
        }
        res.send(circuits);
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
                $match: {
                    year: (req.query['year'] === undefined || req.query['year'].length === 0) ? { $exists: true } : parseInt(req.query['year'])
                }
            },
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
                $sort: { year: 1, round: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    year: 1,
                    round: 1,
                    gp_name: 1,
                    race_date: 1,
                    url: 1,
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


module.exports = router;