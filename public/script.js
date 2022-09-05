
let user = prompt("Digite o seu usuário:");
let emojis = ['&#128512', '&#128513', '&#128519', 
'&#128522', '&#128526', '&#128538', '&#129321',
'&#129488', '&#129299', '&#128567'];
let emojiSelect = Math.floor(Math.random() * 10);
document.getElementById('username').value = emojis[emojiSelect]+ " " + user;
document.getElementById('user').innerHTML = "Usuário: " + user;
$('.messages').append('<div class="connect">Bem-vindo ao chat!&#128075</div>');

let socket = io('http://localhost:8080');

function renderMessage(message) {
    $('.messages').append('<div class="message"><strong>' + message.author + '</strong>: ' + message.message + '</div>')
}

socket.on('receivedMessage', function (message) {
    renderMessage(message);
});

socket.emit('newUser', user);

socket.on('newUserConnected', user => {
    $('.messages').append('<div class="connect"><strong>'+`${user}`+'</strong> entrou no chat!</div>');
})

socket.on('userDisconnected', user => {
    $('.messages').append('<div class="connect"><strong>'+`${user}`+'</strong> saiu do chat</div>');
})

socket.on('previousMessages', function (messages) {
    for (message of messages) {
        renderMessage(message);
    }
});

$('#chat').submit(function (event) {
    event.preventDefault();

    let author = $('input[name=username]').val();
    let message = $('input[name=message]').val();

    if (author.length && message.length) {
        let messageObject = {
            author: author,
            message: message,
        };
        renderMessage(messageObject);
        socket.emit('sendMessage', messageObject);
    };
    document.getElementById('message').value = "";
});