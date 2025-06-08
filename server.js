const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

let posts = [];

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Setup multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST with file + content
app.post('/submit', upload.single('file'), (req, res) => {
  const content = req.body.content || '';
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

  posts.push({ content, fileUrl });
  res.json({ success: true });
});

// GET all posts
app.get('/posts', (req, res) => {
  res.json(posts);
  res.send('Backend server is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});