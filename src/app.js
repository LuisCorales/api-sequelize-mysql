// Create express application
const express = require("express");
const app = express();

// Settings -> port = 5500
app.set("port", 5500);
const port = app.set("port");

// Configures express to read and write JSON
app.use(express.json());

// Set up and run the API server
app.listen(port, () => {
    console.log("The server is running on port:", port);
});
