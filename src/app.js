// Create express application
const express = require("express");
const app = express();
app.use(express.json());

// DB connection
const testConnection = require("./db/database");
testConnection();

// Set the app port
app.set("port", 5500);
const port = app.set("port");

// Handle each route
const routes = require('./routes');
app.use('/', routes);

// If not fitting route was found, then display error
app.use((req, res, next) => {
    return res.status(500).json({
        error: "Type of request not found: " + req.url
    });
});

// Set up and run the API server
app.listen(port, () => {
    console.log("The server is running on port:", port);
});