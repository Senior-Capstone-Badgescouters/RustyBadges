const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const { log } = require('console');

const app = express();
const port = 3000;


dotenv.config({ path: './.env' });

const sequelize = require('sequelize');
const db = new sequelize('postgres', 'postgres', process.env.PASSWORD, { dialect: 'postgres' });

const querier = { user: require('./models/user.model.js'), sequelize: db, Sequelize: sequelize };

log(querier);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));


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
