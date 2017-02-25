const access_token = "{your Channel Access Token here}";

const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.listen(process.env.PORT || 1337);

app.post('/', function (req, res) {
  var body = req.body;
  var event = body['events'][0];
  var token = event['replyToken'];
  var text = event['message']['text'];

  var options = {
    uri: "https://api.line.me/v2/bot/message/reply",
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + access_token,
    },
    json: {
      "replyToken": token,
      "messages": [
        {
          "type": "text",
          "text": text + "ほげ"
        }
      ]
    }
  };

  request.post(options, function (error, response, body) {
    console.log(JSON.stringify(response));
  });
  res.send(200, 'ok');
})