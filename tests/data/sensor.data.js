
const moment = require('moment');
var isodate = require("isodate");


const singleSensor = [    
    [{
        id: "XYWuMDmUyvYJnYwG0EtR", 
        value: 22
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 22
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 21
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 21
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 21
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 20
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 19
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 19
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 18
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR", 
        value: 10
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 11
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 12
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 13
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 14
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 15
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 14
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 13
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 12
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 11
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 10
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 9
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 8
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 7
    }],
    [{
        id: "XYWuMDmUyvYJnYwG0EtR",
        value: 6
    }]
];

const multiSensorBatch = [
    [
        {
            id: "XYWuMDmUyvYJnYwG0EtR", 
            value: 22
        },
        {
            id: "dcJlpH5VoGknwU4oTDJk",
            value: 23
        },
        {
            id: "62Eu18VNiDqqbZmudHms",
            value: 24
        }
    ],
    [
        {
            id: "XYWuMDmUyvYJnYwG0EtR", 
            value: 23
        },
        {
            id: "dcJlpH5VoGknwU4oTDJk",
            value: 24
        },
        {
            id: "62Eu18VNiDqqbZmudHms",
            value: 25
        }
    ],
    [
        {
            id: "XYWuMDmUyvYJnYwG0EtR", 
            value: 24
        },
        {
            id: "dcJlpH5VoGknwU4oTDJk",
            value: 25
        },
        {
            id: "62Eu18VNiDqqbZmudHms",
            value: 26
        }
    ],
    [
        {
            id: "XYWuMDmUyvYJnYwG0EtR", 
            value: 25
        },
        {
            id: "dcJlpH5VoGknwU4oTDJk",
            value: 26
        },
        {
            id: "62Eu18VNiDqqbZmudHms",
            value: 27
        }
    ]
];

module.exports = {
    singleSensor: singleSensor,
    multiSensorBatch: multiSensorBatch
};