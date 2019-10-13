'use strict';

const socket = io();
const query = document.querySelector('#comment');
const html = document.querySelector('#conversation');
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

const autoscroll = () => {
    // New message element
    const $newMessage = html.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = html.offsetHeight;

    // Height of messages container
    const containerHeight = html.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = html.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        html.scrollTop = html.scrollHeight;
    }
}

document.querySelector('#chat-send').addEventListener('click', () => {
var date = new Date();
var htmlResponse = "<div class=\"row message-body\">\
<div class=\"col-sm-12 message-main-sender\">\
<div class=\"sender\">\
<div class=\"message-text\">" +
query.value +
"</div>\
<span class=\"message-time pull-left\">"
+ date.getHours() + ":" + date.getMinutes() +
"</span>\
</div>\
</div>\
</div>";
socket.emit('chat request', query.value);
query.value = '';
console.log(query.value);
html.innerHTML = html.innerHTML + htmlResponse;
autoscroll();
});

// if(is_chrome)
// {
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const oSpeechRecognition = new SpeechRecognition();
oSpeechRecognition.lang = 'en-US';
oSpeechRecognition.interimResults = false;
oSpeechRecognition.maxAlternatives = 1;

document.querySelector('#microphone-send').addEventListener('click', () => {
oSpeechRecognition.start();
});

oSpeechRecognition.addEventListener('speechstart', () => {
console.log('Speech has been detected.');
 });

oSpeechRecognition.addEventListener('result', (e) => {
console.log('Finalized the Result.');

let previous = e.results.length - 1;
let text = e.results[previous][0].transcript;

query.textContent = text;
console.log('Confidence: ' + e.results[0][0].confidence);

var date = new Date();
var htmlResponse = "<div class=\"row message-body\">\
<div class=\"col-sm-12 message-main-sender\">\
<div class=\"sender\">\
<div class=\"message-text\">" +
text +
"</div>\
<span class=\"message-time pull-left\">"
+ date.getHours() + ":" + date.getMinutes() +
"</span>\
</div>\
</div>\
</div>";
socket.emit('chat request', text);
query.value = '';
console.log(text);
html.innerHTML = html.innerHTML + htmlResponse;
autoscroll();
console.log(e);
});

oSpeechRecognition.addEventListener('speechend', () => {
oSpeechRecognition.stop();
});

oSpeechRecognition.addEventListener('error', (e) => {
query.textContent = 'Error: ' + e.error;
});
// }

function replyMain(e){
var key = e.which || e.keyCode;
    if (key === 13 && query.value != "") { // 13 is enter
    var date = new Date();
    var htmlResponse = "<div class=\"row message-body\">\
    <div class=\"col-sm-12 message-main-sender\">\
    <div class=\"sender\">\
    <div class=\"message-text\">" +
    query.value +
    "</div><span class=\"message-time pull-left\">"
    + date.getHours() + ":" + date.getMinutes() +
    "</span>\
    </div>\
    </div>\
    </div>";
html.innerHTML = html.innerHTML + htmlResponse;
    socket.emit('chat request', query.value);
    query.value = '';
    console.log(query.value);
}
autoscroll();
};

function speak(text) {
const speechSynthesis = window.speechSynthesis;
const oSpeechSynthesisUtternace = new SpeechSynthesisUtterance();
oSpeechSynthesisUtternace.text = text;
speechSynthesis.speak(oSpeechSynthesisUtternace);
}

socket.on('ai response', function(response) {
if(is_chrome)
{
speak(response);
}
var date = new Date();
if(response == '') response = '(No answer...)';
var htmlResponse = "<div class=\"row message-body\">\
<div class=\"col-sm-12 message-main-receiver\">\
<div class=\"receiver\">\
<div class=\"message-text\">" +
response +
"</div>\
<span class=\"message-time pull-left\">"
+ date.getHours() + ":" + date.getMinutes() +
"</span>\
</div>\
</div>\
</div>";
html.innerHTML = html.innerHTML + htmlResponse;
autoscroll();
});

 chat.find({}).sort({'_id':-1}).limit(1).toArray(function(err, result) {
      if (err) throw err;
      var ordId = result[0]._id;
      console.log(ordId);
    }) 
