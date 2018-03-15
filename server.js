// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var months = [ 'Januar', 'Februar', 'March',
               'April', 'May', 'June',
               'July', 'August', 'September',
               'October', 'November', 'December' ];

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

/*
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
*/
app.get("/dreams", function (request, response) {
  response.send(dreams);
});

app.get("/kuzaev", function (request, response) {
  response.send('Hello, dear admin!');
});

app.get("/:time", function (request, response) {
  var date = new Date();
  var param = request.params.time;

  var reNatural = /^(Januar|Februar|March|April|May|June|July|August|September|October|November|December) (\d?\d), (\d\d\d\d)$/;
  var fNatural = reNatural.test(param);

  if (fNatural) {//date template is valid, but check if the numbers are  correct
      var paramMonth = RegExp.$1;
      var paramDay = RegExp.$2;
      var paramYear = RegExp.$3;
      date = new Date(param);
//      if (date.toString() == 'Invalid Date')
//        fNatural = false;
      if (paramMonth != months[date.getMonth()] || paramDay != date.getDate() || paramYear != date.getYear)
        fNatural = false;
  }
console.log('fNatural = '+fNatural);
  var reUnix = /^\d+$/;
  var fUnix = reUnix.test(param);

  var unixStr;
  var naturalStr;
  
  if (fNatural) {
    unixStr = String(date.getTime() / 1000);
    naturalStr = param;
  } else
    if (fUnix) {
      date.setTime(Number(param) * 1000);
      unixStr = param;
      naturalStr = months[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
    } else { //no valid date, return nulls
        unixStr = null;
        naturalStr = null;
      }

  var obj = {unix: unixStr, natural: naturalStr };
  
//  response.send(JSON.stringify(obj));
  response.send(obj);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
