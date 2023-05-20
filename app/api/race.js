const express = require("express");
const router = express.Router();

const mongo = require("../mongodb.js");

// REST APIs
/*
GET /api/races/:year/                                       // races of the year
GET /api/races/:year/:round                                 // race info
GET /api/races/:year/:round/results                         // results of race
GET /api/races/:year/:round/lap_times                       // lap times of race
GET /api/races/:year/:round/lap_times/lap/:lap              // lap times of race-lap
GET /api/races/:year/:round/lap_times/driver/:driver        // lap times of driver
GET /api/sprint/:year/:round/results                        // results of sprint race
GET /api/standings/:year/:round/drivers                     // drivers standings after race
GET /api/standings/:year/:round/constructors                // constructor standings after race
*/

router.get('/races/:year', async (req, res) => {
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
                $sort: { round: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    year: year,
                    round: "$round",
                    race_date: "$race_date",
                    gp_name: "$gp_name",
                    country: "$circuit.country",
                    city: "$circuit.city",
                    circuit_id: "$circuit.circuit_id",
                    circuit_name: "$circuit.circuit_name",
                    url: "$url",
                }
            }
        ]).toArray();

        res.send(racesInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get('/races/:year/:round', async (req, res) => {
    const db = mongo.getDB();
    try {
        const pipeline = [
            {
                $match: {
                    year: parseInt(req.params.year),
                    round: parseInt(req.params.round)
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
                $sort: { fieldName: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    year: 1,
                    round: 1,
                    race_date: 1,
                    gp_name: 1,
                    url: 1,
                    country: '$circuit.country',
                    city: '$circuit.city',
                    circuit_id: '$circuit.circuit_id',
                    circuit_name: '$circuit.circuit_name'
                }
            }
        ];
        let singleRaceInfo = await db.collection("races").aggregate(pipeline).next();
        res.send(singleRaceInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/races/:year/:round/results', async (req, res) => {
    const db = mongo.getDB();
    try {
        const pipeline = [
            {
                $match: {
                    year: parseInt(req.params.year),
                    round: parseInt(req.params.round)
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver_id',
                    foreignField: 'driver_id',
                    as: 'driver'
                }
            },
            { $unwind: '$driver' },
            {
                $lookup: {
                    from: 'constructors',
                    localField: 'constructor_id',
                    foreignField: 'constructor_id',
                    as: 'constructor'
                }
            },
            { $unwind: '$constructor' },
            {
                $lookup: {
                    from: 'race_grid',
                    let: {
                        year: '$year',
                        round: '$round',
                        driver_id: '$driver_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$year', '$$year'] },
                                        { $eq: ['$round', '$$round'] },
                                        { $eq: ['$driver_id', '$$driver_id'] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, grid_position: 1 } }
                    ],
                    as: 'grid'
                }
            },
            { $unwind: { path: '$grid', preserveNullAndEmptyArrays: true } },
            { 
                $sort: { finish_position: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    finish_position: 1,
                    driver_id: '$driver.driver_id',
                    driver_name: '$driver.driver_name',
                    constructor_name: '$constructor.constructor_name',
                    constructor_id: '$constructor.constructor_id',
                    finish_status: 1,
                    grid_position: '$grid.grid_position'
                }
            }
        ];


        const raceResults = await db.collection('race_results').aggregate(pipeline).toArray();

        const singleRaceInfo = {
            year: parseInt(req.params.year),
            round: parseInt(req.params.round),
            results: raceResults
        };

        res.send(singleRaceInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/races/:year/:round/lap_times', async (req, res) => {
    const db = mongo.getDB();

    try {
        const raceQuery = { year: parseInt(req.params.year), round: parseInt(req.params.round) };

        const lapTimes = await db.collection("lap_times").aggregate([
            { $match: raceQuery },
            {
                $lookup: {
                    from: "drivers",
                    localField: "driver_id",
                    foreignField: "driver_id",
                    as: "driver_info"
                }
            },
            {
                $project: {
                    _id: 0,
                    year: parseInt(req.params.year),
                    round: parseInt(req.params.round),
                    lap: "$lap",
                    driver_id: "$driver_id",
                    driver_name: { $arrayElemAt: ["$driver_info.driver_name", 0] },
                    lap_time: "$lap_time",
                    gap_to_leader: "$gap_to_leader"
                }
            },
            {
                $group: {
                    _id: { lap: "$lap" },
                    times: {
                        $push: {
                            driver_id: "$driver_id",
                            driver_name: "$driver_name",
                            lap_time: "$lap_time",
                            gap_to_leader: "$gap_to_leader"
                        }
                    }
                }
            },
            {
                $sort: {
                    "_id.lap": 1,
                    "_id.gap_to_leader": 1
                }
            },
            {
                $project: {
                    _id: 0,
                    lap: "$_id.lap",
                    times: "$times"
                }
            }
        ]).toArray();

        res.send({
            year: parseInt(req.params.year),
            round: parseInt(req.params.round),
            lap_times: lapTimes
        });
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/races/:year/:round/lap_times/lap/:lap', async (req, res) => {
    const db = mongo.getDB();
    try {
        const raceQuery = { year: parseInt(req.params.year), round: parseInt(req.params.round) };
        const response = {
            year: parseInt(req.params.year),
            round: parseInt(req.params.round),
            lap: parseInt(req.params.lap),
            lap_times: []
        };

        const lapTimesQuery = [
            {
                $match: {
                    year: raceQuery.year,
                    round: raceQuery.round,
                    lap: parseInt(req.params.lap)
                }
            },
            {
                $lookup: {
                    from: "drivers",
                    localField: "driver_id",
                    foreignField: "driver_id",
                    as: "driver"
                }
            },
            { 
                $sort: { gap_to_leader: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    driver_id: "$driver_id",
                    driver_name: { $arrayElemAt: ["$driver.driver_name", 0] },
                    lap_time: "$lap_time",
                    gap_to_leader: "$gap_to_leader"
                }
            }
        ];

        const raceLapTimes = await db.collection("lap_times").aggregate(lapTimesQuery).toArray();

        for (let data of raceLapTimes) {
            response.lap_times.push({
                driver_id: data.driver_id,
                driver_name: data.driver_name,
                lap_time: data.lap_time,
                gap_to_leader : data.gap_to_leader
            });
        }
        res.send(response);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/races/:year/:round/lap_times/driver/:driver', async (req, res) => {
    const db = mongo.getDB();
    try {
        const year = parseInt(req.params.year);
        const round = parseInt(req.params.round);
        const driverId = req.params.driver;

        const lapTimes = await db.collection("lap_times").aggregate([
            {
                $match: {
                    year: year,
                    round: round,
                    driver_id: driverId
                }
            },
            {
                $lookup: {
                    from: "drivers",
                    localField: "driver_id",
                    foreignField: "driver_id",
                    as: "driver_info"
                }
            },
            {
                $unwind: "$driver_info"
            },
            { 
                $sort: { lap: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    lap: 1,
                    lap_time: 1,
                    gap_to_leader: 1
                }
            }
        ]).toArray();

        const response = {
            year: year,
            round: round,
            driver_id: driverId,
            driver_name: (await db.collection("drivers").findOne({ driver_id: driverId })).driver_name,
            lap_times: lapTimes
        };

        res.send(response);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/sprint/:year/:round/results', async (req, res) => {
    const db = mongo.getDB();
    try {

        const pipeline = [
            {
                $match: {
                    year: parseInt(req.params.year),
                    round: parseInt(req.params.round)
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver_id',
                    foreignField: 'driver_id',
                    as: 'driver'
                }
            },
            { $unwind: '$driver' },
            {
                $lookup: {
                    from: 'constructors',
                    localField: 'constructor_id',
                    foreignField: 'constructor_id',
                    as: 'constructor'
                }
            },
            { $unwind: '$constructor' },
            { 
                $sort: { finish_position: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    finish_position: 1,
                    driver_id: '$driver.driver_id',
                    driver_name: '$driver.driver_name',
                    constructor_name: '$constructor.constructor_name',
                    constructor_id: '$constructor.constructor_id',
                    finish_status: 1
                }
            }
        ];

        const raceResults = await db.collection('sprint_results').aggregate(pipeline).toArray();

        const singleRaceInfo = {
            year: parseInt(req.params.year),
            round: parseInt(req.params.round),
            results: raceResults
        };

        res.send(singleRaceInfo);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.get('/standings/:year/:round/drivers', async (req, res) => {
    const db = mongo.getDB();
    try {
        const pipeline = [
            {
                $match: {
                    year: parseInt(req.params.year),
                    round: parseInt(req.params.round)
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver_id',
                    foreignField: 'driver_id',
                    as: 'driver'
                }
            },
            {
                $unwind: '$driver'
            },
            { 
                $sort: { position: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    position: 1,
                    driver_name: '$driver.driver_name',
                    driver_id: 1,
                    points: 1
                }
            }
        ];
        let driverStandings = await db.collection("driver_standings").aggregate(pipeline).toArray();
        let response = {
            year: parseInt(req.params.year),
            round: parseInt(req.params.round),
            driver_standings: driverStandings
        }
        res.send(response);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


router.get('/standings/:year/:round/constructors', async (req, res) => {
    const db = mongo.getDB();
    try {
        const pipeline = [
            {
                $match: {
                    year: parseInt(req.params.year),
                    round: parseInt(req.params.round)
                }
            },
            {
                $lookup: {
                    from: 'constructors',
                    localField: 'constructor_id',
                    foreignField: 'constructor_id',
                    as: 'constructor'
                }
            },
            {
                $unwind: '$constructor'
            },
            { 
                $sort: { position: 1 } 
            },
            {
                $project: {
                    _id: 0,
                    position: 1,
                    constructor_name: '$constructor.constructor_name',
                    constructor_id: 1,
                    points: 1
                }
            }
        ];
        let driverStandings = await db.collection("constructor_standings").aggregate(pipeline).toArray();
        let response = {
            year: parseInt(req.params.year),
            round: parseInt(req.params.round),
            constructor_standings: driverStandings
        }
        res.send(response);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
        return res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;