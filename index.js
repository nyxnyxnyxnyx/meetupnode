var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data = require("./data.json");


function emit(socket,msg){
    socket.emit('writting',true);
    setTimeout(()=> {
        socket.emit('writting',false);
        socket.emit('message',msg)
    }                
    ,2000)
}

io.on('connection', function(socket){
    console.log("usuario conectado")
    socket.count=0
    //emit(socket,data.messages[socket.count]);
    socket.on('message', function(msg){
        socket.count++;
        switch (socket.count) {
            case 1:
            case 2:
                emit(socket,data.messages[socket.count].replace("%usuario%",socket.user))
                break;
            case 3:
                user = msg.split("saluda a ")[1]?msg.split("saluda a ")[1]:"invitado";
                emit(socket,data.messages[socket.count].replace("%invitado%",user))
                socket.count++;
                setTimeout(()=> emit(socket,data.messages[socket.count]),5000)               
                break;        
            default:
                socket.emit('message',data.messages[5])
                break;
        }
    });
    socket.on('login',function(user){
        user = user ? user : "usuario"
        socket.user = user;
    })
    socket.on('disconnect', function(){
        console.log("usuario desconectado: "+socket.user)
    });
});

http.listen(3000, function(){
  console.log('Escuchando en el puerto 3000');
});

