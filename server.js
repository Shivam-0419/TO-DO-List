require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Task = require('./models/Task');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));
app.use('/uploads', express.static('uploads'));

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password, fullName, email } = req.body;
        const user = new User({ username, password, fullName, email });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ message: 'Signed in', userId: user._id });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Task Routes
app.post('/api/tasks', async (req, res) => {
    try {
        const { text, userId } = req.body;
        const task = new Task({ text, userId });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.json(task);
    } catch (err) {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Profile Routes
app.get('/api/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/users/:userId', async (req, res) => {
    try {
        const { fullName, email, profilePicture } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { fullName, email, profilePicture },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/users/:userId/tasks', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }

        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/users/:userId/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const avatarUrl = `/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(req.params.userId, { profilePicture: avatarUrl });
        
        res.json({ message: 'Avatar uploaded', avatarUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
