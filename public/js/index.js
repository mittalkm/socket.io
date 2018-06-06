var socket=io();
    function scrollToBottom(){
        var messages=jQuery("#messages");
        var newMessage=messages.children('li:last-child');

        var clientHieght=messages.prop('clientHeight');
        var scrollTop=messages.prop('scrollTop');
        var scrollHeight=messages.prop('scrollHeight');

        var newMessageHeight=newMessage.innerHeight();
        var lastMessageHeight=newMessage.prev().innerHeight();
        if(clientHieght+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
            messages.scrollTop(scrollHeight);
        }
    }
    socket.on('connect',function(){
        console.log('connected to server');
    });
    socket.on('newMessage',function(msg){
        var Time=moment(msg.createdAt).format('h:mm a');
        var template=jQuery("#message-template").html();
        var html=Mustache.render(template,{
            text:msg.text,
            from:msg.from,
            createdAt:Time
        });
        jQuery("#messages").append(html);
        scrollToBottom();
        // var li=jQuery('<li></li>');
        // li.text(`${msg.from} ${Time}: ${msg.text}`);
        // jQuery("#messages").append(li);
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
        var Time=moment(message.createdAt).format('h:mm a');
        var template=jQuery("#location-message-template").html();
        var html=Mustache.render(template,{
            url:message.url,
            createdAt:Time,
            from:message.from
        });
        jQuery("#messages").append(html);
        scrollToBottom();
        // jQuery("#messages").append(html);
        // var li=jQuery('<li></li>');
        // var time=moment(message.createdAt).format('h:mm a');
        // var a=jQuery('<a target="_blank" >My Location</a>')
        // li.text(`${message.from} ${time}: `);
        // a.attr('href',message.url);
        // li.append(a);
        // jQuery("#messages").append(li);
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