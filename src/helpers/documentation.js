const options = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Library of things API",
            version: "1.0.0",
            description: "An API for a library of things application"
        },
        servers: [
            {
                url:"http://127.0.0.1:8000"
            }
        ],
    },
    apis: ["../routes/*.js"]
};

module.exports = { options }