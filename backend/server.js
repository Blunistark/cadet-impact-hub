const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

// Example route
app.post('/api/register', (req, res) => {
  const { email, password, fullName } = req.body;
  db.query(
    'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
    [email, password, fullName],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.listen(5000, () => console.log('Server running on port 5000'));