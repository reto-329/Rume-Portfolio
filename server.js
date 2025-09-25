// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for simplicity, adjust as needed
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'image')));

// Public config endpoint for EmailJS keys
app.get('/config/emailjs', (req, res) => {
    res.json({
        EMAILJS_PUBLIC_KEY: process.env.PUBLIC_KEY || '',
        EMAILJS_SERVICE_ID: process.env.SERVICE_ID || '',
        EMAILJS_TEMPLATE_ID: process.env.TEMPLATE_ID || ''
    });
});

// Serve PDF files statically
app.use('/pdf', express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// CV Download Route
app.get('/cv', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Sophia Data Entry Resume.pdf');
    res.download(filePath, 'Sophia_Tabele_Resume.pdf', (err) => {
        if (err) {
            console.error('Error downloading CV:', err);
            res.status(404).send('CV not found');
        }
    });
});

// CV View Route
app.get('/view-cv', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Sophia Data Entry Resume.pdf');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error viewing CV:', err);
            res.status(404).send('CV not found');
        }
    });
});

// Contact Form Submission
// EmailJS is now used for contact form submissions. No backend email sending required.

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});