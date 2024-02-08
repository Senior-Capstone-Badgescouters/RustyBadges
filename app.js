const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); 

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// SQLite database connection
const dbPath = path.resolve(__dirname, 'girlsscout.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

app.post('/save-feedback', (req, res) => {
  const email = req.body.email;
  const message = req.body.message;

  const feedbackContent = `Email: ${email}\nMessage: ${message}\n`;

  // Write the content to a text file
  fs.appendFile('feedback.txt', feedbackContent, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error saving feedback.' });
    } else {
      console.log('Feedback saved successfully.');
      res.status(200).json({ success: 'Feedback saved successfully.' });
    }
  });
});

app.get('/badges', (req, res) => {

  const query = 'SELECT * FROM badges';

  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Error fetching data.' });
    } else {
      res.status(200).json(rows); 
    }
  });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
