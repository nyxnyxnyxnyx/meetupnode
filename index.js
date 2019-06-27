var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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
    
    socket.on('message', function(msg){
        socket.broadcast.emit('message',{msg:msg,user:socket.user})
    });

    socket.on('writting', function(state){
        socket.broadcast.emit('writting',{state:state,user:socket.user})
    });

    socket.on('login',function(user){
        user = user ? user : "usuario"
        socket.user = user;
        socket.emit('message',{msg:"Bienvenido a ZapWhat "+socket.user,user:"Zappy"})
        socket.broadcast.emit('message',{msg:socket.user+" se acaba de conectar",user:"Zappy"})

    })
    
    socket.on('disconnect', function(){
        socket.broadcast.emit('message',{msg:socket.user+" se acaba de desconectar",user:"Zappy"})
        console.log("usuario desconectado: "+socket.user)
    });
});

http.listen(3000, function(){
  console.log('Escuchando en el puerto 3000');
});

