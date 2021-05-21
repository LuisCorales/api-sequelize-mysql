// Create express application
const express = require("express");
const app = express();
app.use(express.json());

// DB connection
const db = require("./db/database");

// Set the app port and handle routes
app.set("port", 5500);
const port = app.set("port");
app.use('/api/', require('./routes'));

// If not fitting route was found, then display error
app.use((req, res) => {
    return res.status(500).json({
        error: "Type of request not found: " + req.url
    });
});

// Set up and run the API server
app.listen(port, async () => {
    console.log("The server is running on http://localhost:" + port);

    // // Connect to DB without migrations ran
    // try {
    //     await db.sync({
    //         force: true
    //     });
    //     console.log('Database connected!');
    // } catch(e) {
    //     console.error('Unable to connect to the database:', e);
    // }

    // Connect to DB with migrations ran
    try {
        await db.authenticate();
        console.log('Database connected!');
    } catch(e) {
        console.error('Unable to connect to the database:', e);
    }
});