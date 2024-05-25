# GEOIP Gateway 
API provides country names for given ip.

As of now service provides  `/countryName/:ip`

### How to run
To run use `node app.js` default port is 3000, no SSL at this moment.

### How to run tests
Manual test is as simple as `curl http://127.0.0.1:3000/countryName/104.40.147.215`

Mocha Test can be run as `npm test`

End 2 End test for current [config.json](config.json) can be found [test/e2e/geoip_test.js](test/e2e/geoip_test.js).
To run it use:
```bash
cd test/e2e
npm install --save-dev
npm run codeceptjs
```

### Configuration
Please check `config.json` as you can configure rate limits for adapters there.

I adapters are named, below you can see `some_api`, which utilizes specific adapter.

### Design

* Adapter provides `process(ip)` method
* Strategy is like adapter provides `process(ip)` method, but takes map of adapters in constructor. New strategies may be added.
* Middleware alters instance of `adapter` and `strategy` and overrides `process()`

Every instance receives configuration from `connfig.json`

Given some providers return 'The Netherlands', some return 'Netherlands', We are using ISO2 map for country names.

Example below provides rate limit of 10 calls per minute.
```json
{
  "strategy": {
    "path": "strategy/fallback",
    "adapters": ["some_api"],
    "middleware": [
      {
        "path": "middleware/cache"
      }
    ]
  },
  "adapters": {
    "some_api": {
      "path": "adapter/ipapi",
      "middleware": [
        {
          "path": "middleware/limit",
          "limit": 10,
          "term": 60
        }
      ]
    }
  }
}
```
