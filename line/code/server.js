//LINE Developersで取得したChannel Access Tokenをここに貼り付ける
const access_token = "{your Channel Access Token here}";
//シミュレータを使ってローカルデバッグする場合、ここをtrueにする
//LINEアプリと通信をする場合はfalseにする
var localDebug = false;

if (localDebug) {
  var access_server = "http://localhost";
} else {
  var access_server = "https://api.line.me/v2/bot/message/reply";
}

const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 1337;
app.listen(port);

console.log("listen at " + port);

app.get("/", function (req, res) {
  res.send(200, "このサイトはLINE Bot用のサイトです");
});

//LINEから通信が来るとここが呼ばれる
app.post("/", function (req, res) {
  try {
    var body = req.body;
    var event = body["events"][0];
    var token = event["replyToken"];
    var receive = event["message"]["text"];
    //メッセージを処理するonMessage関数へ渡す
    var reply = onMessage(receive);

    var options = {
      uri: access_server,
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
      json: {
        "replyToken": token,
        "messages": [
          {
            "type": "text",
            "text": reply
          }
        ]
      }
    };

    if (!localDebug) {
      //LINEのサーバーへ返事を返す
      request.post(options, function (error, response, body) { });
      res.send(200, "ok");
    } else {
      res.send(200, options);
    }
  } catch (e) {
    console.log(e);
    res.send(500,e.stack);
  }

});

//正規表現とのマッチングを行う関数
//第一引数にメッセージ、第二引数に正規表現パターンを入れると
//その正規表現にマッチしてるかをboolでreturnしてくれる
function regrex(text, pattern) {
  var re = new RegExp(pattern, "g");
  return text.match(re);
}

/***************************************************************** */
/*                                                                 */
/*                      ここから下を編集する                         */
/*                                                                 */
/***************************************************************** */

//LINEからのメッセージを処理する関数
//receiveにメッセージが入る
//返したいメッセージをreturnする
function onMessage(receive) {
  //returnした文字列をbotが返信してくれる
  var reply = "あなたは[" + receive + "]と言いました。";

  //正規表現とマッチングをする場合はこんな感じ
  if (regrex(receive, ".*コーラ.*")) {
    reply = "コーラおいしい！";
  }

  return reply;
}