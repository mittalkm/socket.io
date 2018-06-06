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
const {Users}=require('./utils/users.js');
const {generateLocationMessage}=require('./utils/message.js');
const {isRealString}=require('./utils/validation.js');
app.use(express.static(publicPath));
var users=new Users();
// socket.emit for a single connection.
// io.emit for every single connection.
//socket.broadcast.emit to everybody except sender.
io.on('connection',(socket)=>{
    console.log('New User Connected');
    
    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room name are required.');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin',`Welcome ${params.name}`));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} In The House!`));    
        callback();
    });
    socket.on('createMessage',(newMsg,callback)=>{
        var user=users.getUser(socket.id);
        if(user && isRealString(newMsg.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,newMsg.text));
        }
        
        callback();
        // socket.broadcast.emit('newMessage',{
        //     from:newMsg.from,
        //     text:newMsg.text,
        //     createdAt:new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords)=>{
        var user=users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
        //io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });
    socket.on('disconnect',()=>{
        var user=users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }
        console.log('User DisConnected');
    });

});

server.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});