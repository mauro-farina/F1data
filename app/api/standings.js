const express = require("express");
const router = express.Router();

const mongo = require("../mongodb.js");

// REST APIs
/*
GET /api/standings/:year/:round/drivers                     // drivers standings after race
GET /api/standings/:year/:round/constructors                // constructor standings after race
*/

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