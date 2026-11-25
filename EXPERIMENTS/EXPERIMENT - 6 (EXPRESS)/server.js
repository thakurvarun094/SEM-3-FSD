const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use((req, res, next) => {
    console.log("Method: " + req.method);
    console.log("Link: http://localhost:" + PORT + req.originalUrl);
    next();
});


// Home route
app.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// About route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Contact route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// 404 route
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The page you requested does not exist.</p>
        <a href="/">Go to Home</a>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
