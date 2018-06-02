const express=require('express');
const path=require('path');
const socketIO=require('socket.io');
const http=require('http');
const port=process.env.PORT || 3000;
const publicPath=path.join(__dirname,'../public');
const app=express();
var server=http.createServer(app);
var io=socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('disconnect',()=>{
        console.log('User DisConnected');
    });
});

server.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});