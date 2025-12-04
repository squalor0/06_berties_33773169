const express = require("express");
const router = express.Router();
const request = require("request");

router.get('/weather', (req, res) => {
    res.render('weather.ejs');
});

router.post('/weather', (req, res, next) => {
    let city = req.sanitize(req.body.city.trim());
    let apiKey = process.env.WEATHER_API_KEY;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            let weather = JSON.parse(body);

            if (weather && weather.main) {
                let msg = `
                    <h2>Weather for ${weather.name}</h2>
                    <p>Temperature: ${weather.main.temp}°C</p>
                    <p>Feels like: ${weather.main.feels_like}°C</p>
                    <p>Humidity: ${weather.main.humidity}%</p>
                    <p>Wind speed: ${weather.wind.speed} m/s</p>
                    <p>Conditions: ${weather.weather[0].description}</p>
                `;

                res.send(msg);
            } else {
                res.send("No data found — check your spelling or try another city.");
                console.log("API returned:", body);
            }
        }
    });
});

module.exports = router;