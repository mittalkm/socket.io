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
// socket.emit for a single connection.
// io.emit for every single connection.
//socket.broadcast.emit to everybody except sender.
io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.emit('newMessage',{
        from:'admin',
        text:'Welcome to our site.'
    });
    socket.broadcast.emit('newMessage',{
        from:'admin',
        text:'New buddy in the house!!!'
    })
    socket.on('createMessage',(newMsg)=>{
        console.log('Create Message',newMsg);
        io.emit('newMessage',{
            from:newMsg.from,
            text:newMsg.text,
            createdAt:new Date().getTime()
        });
        // socket.broadcast.emit('newMessage',{
        //     from:newMsg.from,
        //     text:newMsg.text,
        //     createdAt:new Date().getTime()
        // });
    })
    socket.on('disconnect',()=>{
        console.log('User DisConnected');
    });

});

server.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});