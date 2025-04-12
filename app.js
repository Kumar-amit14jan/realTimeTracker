const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const path = require('path');
const sockerio = require('socket.io');
// socket io run on http server
const server = http.createServer(app);
const io = sockerio(server);

// set ejs
app.set('view engine' , 'ejs');
app.use(express.static(path.join(__dirname , 'public')));

io.on('connection' , (socket)=>{
    socket.on("send-location" ,function(data){
        io.emit("receive-location" ,{id:socket.id , ...data})
    });
    console.log("socket connected:", socket.id);
    socket.on("disconnect", function(){
        console.log("user-disconnected", socket.id);
        io.emit("user-disconnected", socket.id);
    })
})

app.get('/', function(req , res){
    res.render("index");
})

server.listen(port, ()=>{
    console.log(`server is running at:${port}`);
})