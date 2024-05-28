const express = require('express');
const fetch = require('node-fetch'); // import the `fetch` module
const {Factory} = require('./factory');

// Initialize the Express app
const app = express();
app.use(express.json());

// Initialize composition
const config = require('./config.json');
const factory = new Factory();

// Initialize adapters
var adapters = {};
Object.keys(config.adapters).forEach(function(adapterName, index) {
    adapters[adapterName] = factory.buildAdapter(config.adapters[adapterName]);
});

// Initialize strategy
const strategy = factory.buildStrategy(config.strategy,adapters);

// Country names map from iso2

const countryNames = require("./countryNames.json");

// Define the /countryName/:ip route
app.get('/countryName/:ip', async (req, res) => {
    const ipAddress = req.params.ip;
    try {
        // Todo: add api address format check to prevent false counts for rate limiter.

        const countryCode = await strategy.process(ipAddress);
        if (!(countryCode in countryNames)) {
            throw new Error(`Country code ${countryCode} has not country name defined`);
        }
        const countryName = countryNames[countryCode];
        res.status(200).send(countryName);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});