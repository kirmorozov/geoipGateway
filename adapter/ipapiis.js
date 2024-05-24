const fetch = require("node-fetch");

class IpapiAdapter {
    constructor(config) {

    }

    async process(ip) {
        try {
            const url = `https://api.ipapi.is/?q=${ip}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
            }

            const jsonData = await response.json();
            if (!jsonData.location || !jsonData.location.country_code ) {
                throw new Error('Failed to get country name from provided IP address.');
            }

            return jsonData.location.country_code;
        } catch (error) {
            console.log(error);
            throw new Error('An error occurred while processing the request.');
        }
    };

}
module.exports = {Adapter: IpapiAdapter}