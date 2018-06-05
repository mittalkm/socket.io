var socket=io();
    socket.on('connect',function(){
        console.log('connected to server');
    });
    socket.on('newMessage',function(msg){
        var Time=moment(msg.createdAt).format('h:mm a');
        var li=jQuery('<li></li>');
        li.text(`${msg.from} ${Time}: ${msg.text}`);
        jQuery("#messages").append(li);
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
        var messageTextbox=jQuery('[name=message]');
        socket.emit('createMessage',{
            from:'User',
            text:messageTextbox.val()
        },function(){
            messageTextbox.val("")
        });
    });
    socket.on('newLocationMessage',function(message){
        var li=jQuery('<li></li>');
        var time=moment(message.createdAt).format('h:mm a');
        var a=jQuery('<a target="_blank" >My Location</a>')
        li.text(`${message.from} ${time}: `);
        a.attr('href',message.url);
        li.append(a);
        jQuery("#messages").append(li);
    });
    var locationButton=jQuery("#send-location");
    locationButton.on('click',function(){
        if(!navigator.geolocation){
            return alert('Geolocation not supported....');
        }
        locationButton.attr('disabled','disabled').text('Sending Location...');
        navigator.geolocation.getCurrentPosition(function(position){
            //console.log(position);
            locationButton.removeAttr('disabled').text('Send Location');
            socket.emit('createLocationMessage',{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            });
        },function(){
            locationButton.removeAttr('disabled').text('Send Location');
            alert('Unable to fetch location.');
        })
    });