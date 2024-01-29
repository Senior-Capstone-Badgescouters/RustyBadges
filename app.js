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

const get_badge_by_id_proc = db.prepare("select * from badges where \"badge_id\" == (?)");

app.get('/api/get-badge-by-id/:id', (req, res) => {
  get_badge_by_id_proc.get(req.params.id, (err, badge) => res.json(badge))
});

app.get('/api/get-all-badges', (req, res) => {
  db.all('select * from badges', (err, badges) => { res.json })
})

const post_badge = db.prepare(
  "INSERT INTO badges (badge_name, level, date, description,requirements,category)" +
  " VALUES (?, ?, ?, ?, ?, ?)");

app.post('/api/post-badge', (req, res) => {
  const name = req.body.name;
  const level = req.body.level;
  const date = req.body.date;
  const description = req.body.description;
  const requirements = req.body.requirements;
  const category = req.body.category;

  console.log(req.body)


  //TODO: HERSH This currently fails because req comes in with a null body and a null
  //params field. Not sure why. Might be a bug in post-man or in express or I'm
  //doing something really stupid
  post_badge.run(name, level, date, description, requirements, category, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error saving badge' });
    } else {
      console.log('Badge saves successfully');
      res.status(200).json({ success: "Badge saved successfully" })
    }
  })
})

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
