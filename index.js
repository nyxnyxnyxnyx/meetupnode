var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data = require("./data.json");


function emit(socket,msg){
    socket.emit('message', msg);
}

io.on('connection', function(socket){
    socket.count=0
    emit(socket,data.messages[socket.count]);
    socket.on('message', function(msg){
        socket.count++;
        switch (socket.count) {
            case 1:
            case 2:
                emit(socket,data.messages[socket.count]);
                break;
            case 3:
                user = msg.split("saluda a ")[1]?msg.split("saluda a ")[1]:"usuario";
                emit(socket,data.messages[socket.count].replace("%usuario%",user));
                socket.count++;
                setTimeout(()=> emit(socket,data.messages[socket.count]),5000)
               
                break;        
            default:
                emit(socket,data.messages[5]);
                break;
        }
    });
    socket.on('disconnect', function(){

    });
});

http.listen(3000, function(){
  console.log('Escuchando en el puerto 3000');
});

