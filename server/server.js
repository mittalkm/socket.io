const express=require('express');
const path=require('path');
const socketIO=require('socket.io');
const http=require('http');
const port=process.env.PORT || 3000;
const publicPath=path.join(__dirname,'../public');
const app=express();
var server=http.createServer(app);
var io=socketIO(server);
const {generateMessage}=require('./utils/message.js');
const {generateLocationMessage}=require('./utils/message.js');
app.use(express.static(publicPath));
// socket.emit for a single connection.
// io.emit for every single connection.
//socket.broadcast.emit to everybody except sender.
io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.emit('newMessage',generateMessage('admin','Welcome Buddy!'));
    socket.broadcast.emit('newMessage',generateMessage('admin','New Buddy In The House!'))
    socket.on('createMessage',(newMsg,callback)=>{
        console.log('Create Message',newMsg);
        io.emit('newMessage',generateMessage(newMsg.from,newMsg.text));
        callback('This Is From Server');
        // socket.broadcast.emit('newMessage',{
        //     from:newMsg.from,
        //     text:newMsg.text,
        //     createdAt:new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });
    socket.on('disconnect',()=>{
        console.log('User DisConnected');
    });

});

server.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});