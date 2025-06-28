const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#Try2Guess10', // use your password
  database: 'todo'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    return;
  }
  console.log('✅ Connected to Database');
});

// GET all todos
app.get('/', (req, res) => {
  db.query('SELECT * FROM todoItems', (err, results) => {
    if (err) {
      console.error('❌ Error fetching items:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// POST new todo
app.post('/add-item', (req, res) => {
  const { text } = req.body;
  db.query('INSERT INTO todoItems (itemDescription) VALUES (?)', [text], (err, result) => {
    if (err) {
      console.error('❌ Error inserting item:', err);
      return res.status(500).send('Insert failed');
    }
    res.send({ message: '✅ Item added successfully', id: result.insertId });
  });
});

// DELETE todo by ID
app.delete('/delete-item/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM todoItems WHERE ID = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting item:', err);
      return res.status(500).send('Delete failed');
    }
    res.send({ message: '🗑️ Item deleted successfully' });
  });
});

// UPDATE todo by ID
app.put('/update-item/:id', (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  db.query('UPDATE todoItems SET itemDescription = ? WHERE ID = ?', [text, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating item:', err);
      return res.status(500).send('Update failed');
    }
    res.send({ message: '✏️ Item updated successfully' });
  });
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
