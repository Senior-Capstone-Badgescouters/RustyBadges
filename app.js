const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const open = require('sqlite').open;
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const db = new sqlite3.Database('girlsscout.db');

const get_badges_by_level_proc = db.prepare("select * from badges where \"level\" == (?)")

app.get('/api/get-badges-by-level/:level', (req, res) => {
  get_badges_by_level_proc.all(req.params.level, (err, badges) => res.json(badges))
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

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
