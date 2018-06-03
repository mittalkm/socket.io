var socket=io();
    socket.on('connect',function(){
        console.log('connected to server');
    });
    socket.on('newMessage',function(msg){
        console.log('New Message',msg);
        var li=jQuery('<li></li>');
        li.text(`${msg.from}: ${msg.text}`);
        jQuery("#messages").append(li);
        jQuery('[name=message]').val("");
    });
    socket.on('disconnect',function(){
        console.log('Server disconnected');
    });

    // socket.emit('createMessage',{
    //     from:'Kanu',
    //     text:'Hey Manu'
    // },function(data){
    //     console.log('Got It',data);
    // });

    jQuery('#message-form').on('submit',function(e){
        e.preventDefault();

        socket.emit('createMessage',{
            from:'User',
            text:jQuery('[name=message]').val()
        },function(){

        });
    })