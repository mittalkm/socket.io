var socket=io();
    socket.on('connect',function(){
        console.log('connected to server');

        socket.emit('createEmail',{
            to:'shubhamcr7@gmail.com',
            text:'what are u doing?'
        });
        socket.emit('createMessage',{
            to:'shubhamcr7@gmail.com',
            text:'what are u doing?'
        });
    });
    socket.on('newEmail',function(email){
        console.log('New Email',email);
    });
    socket.on('newMessage',function(msg){
        console.log('New Message',msg);
    });
    socket.on('disconnect',function(){
        console.log('Server disconnected');
    });
