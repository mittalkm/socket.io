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
    socket.emit('newEmail',{
        from:'mittalkunal47@gmaiil.com',
        text:'Text of mail'
    });
    socket.emit('newMessage',{
        from:'mittalkunal47@gmaiil.com',
        text:'Text of mail'
    });
    socket.on('createEmail',(newEmail)=>{
        console.log('Create Email',newEmail);
    });
    socket.on('createMessage',(newMsg)=>{
        console.log('Create Message',newMsg);
    })
    socket.on('disconnect',()=>{
        console.log('User DisConnected');
    });

});

server.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});