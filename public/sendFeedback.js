// function on the contact form to send in the users feedback into a txt file. 

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.post('/save-feedback', (req, res) => {
  const email = req.body.email;
  const message = req.body.message;

  const feedbackContent = `Email: ${email}\nMessage: ${message}\n`;

  fs.appendFile('feedback.txt', feedbackContent, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving feedback.');
    } else {
      console.log('Feedback saved successfully.');
      res.status(200).send('Feedback saved successfully.');
    }
  });
});
const port = 3000; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
