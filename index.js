'use strict';
var dotenv = require('dotenv');
dotenv.load();

const express = require('express');
const app = express();

const mongodb = require('mongodb');
const uuidv1 = require('uuid/v1');

const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'pizza';

const port = process.env.PORT || 3000;

//const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const AI_SESSION_ID = uuidv1();

const dialogflow = require('apiai');
const ai = dialogflow('a6ff903cfa474b49b138a0fe29b12ea8');

app.use(express.static(__dirname + '/views')); // HTML Pages
app.use(express.static(__dirname + '/public')); // CSS, JS & Images

const server = app.listen(port, function(){
  console.log('listening on  port ' + port);
});

const socketio = require('socket.io')(server);
socketio.on('connection', function(socket){
  console.log('a user connected');
});

//Serve UI
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/app.html');
});

socketio.on('connection', function(socket) {

  socket.on('chat request', (text) => {
    console.log('Message: ' + text);
     

   let aiReq = ai.textRequest(text, {
    sessionId: AI_SESSION_ID
  });
 
    aiReq.on('response', (response) => {
      let aiResponse = response.result.fulfillment.speech;
      console.log('AI Response: ' + aiResponse);
      socket.emit('ai response', aiResponse);

  })
       
    aiReq.on('error', (error) => {
      console.log(error);
    });

    aiReq.end();

  });
  });



//MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {


//   if(error) {
//     return console.log('Unable to connect to database');
//   }

//   const db = client.db(databaseName);
//   console.log("Connected successfully to server");
//   socketio.on('connection', function(socket) {

//   socket.on('chat request', (text) => {
//     console.log('Message: ' + text);
     

//    let aiReq = ai.textRequest(text, {
//     sessionId: AI_SESSION_ID
//   });
 
//     aiReq.on('response', (response) => {
//       let aiResponse = response.result.fulfillment.speech;
//       console.log('AI Response: ' + aiResponse);
//       socket.emit('ai response', aiResponse);

//       let details = db.collection('details');
     
//       details.insertOne({response: response.result.parameters});
//   })
       
//     aiReq.on('error', (error) => {
//       console.log(error);
//     });

//     aiReq.end();


//   });

// })
//});