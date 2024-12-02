const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = []; // In-memory database for now

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.json({ success: true, message: 'Account created!' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    res.json({ success: true, message: 'Login successful!' });
});

// Forgot Password endpoint
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(400).json({ success: false, message: 'Email not found.' });
    }

    res.json({ success: true, message: `Your password is: ${user.password}` });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
