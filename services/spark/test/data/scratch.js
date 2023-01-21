db.sensorData.aggregate( [
    {
        $match: { id: "RIG-R&D-TMP-003" }
    },
    {
        $project: {
            date: {
                $dateToParts: { date: "$timestamp" }
            },
            id: 1,
            value: 1
        }
    },
    {
        $group: {
            _id: {
                id: "$id",
                date: {
                    year: "$date.year",
                    month: "$date.month",
                    day: "$date.day"
                }
            },
            min: { $min: "$value" },
            max: { $max: "$value" },
            avg: { $avg: "$value" }
       }
    }
 ] )