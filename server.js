const express = require("express");
const path = require('path');

const app = express();
const server = require('http'). createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});
let users = {};
let messages = [];
io.on('connection', socket => {
    socket.emit('previousMessages', messages);
    socket.on('newUser', user => {
        users[socket.id] = user
        socket.broadcast.emit('newUserConnected', user)
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', users[socket.id])
        delete users[socket.id]
    });
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(8080);