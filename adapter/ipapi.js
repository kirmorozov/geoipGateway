const fetch = require("node-fetch");

class IpapiAdapter {
    constructor(config) {

    }

    async process(ip) {
        try {
            const url = `http://ip-api.com/json/${ip}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
            }

            const jsonData = await response.json();
            if (!jsonData.country || !jsonData.countryCode) {
                throw new Error('Failed to get country name from provided IP address.');
            }

            return jsonData.countryCode;
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while processing the request.');
        }
    };

}

module.exports = {Adapter: IpapiAdapter}