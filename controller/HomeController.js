        const express = require('express');
        const router = express.Router();

        // GET /
        router.get('/', (req, res) => {
            res.redirect('/login'); // Redirect to the login page
        });

        // GET /mystats
        router.get('/mystats', (req, res) => {
            res.render('mystats'); // Render the "mystats" view
        });

        // GET /teacherdashboard
        router.get('/teacherdashboard', (req, res) => {
            res.render('teacherdashboard'); // Render the "teacherdashboard" view
        });

        module.exports = router;