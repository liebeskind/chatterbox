(function(){

var userName = window.location.search.split('=')[1];
var currentRoom = 'lobby';
var roomNames = {'lobby': true};

var sendRequest = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('Message sent!');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

var getRequest = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {
      order: '-createdAt',
      limit: 100
    },
    contentType: 'application/json',
    success: function (data) {
      parseMessages(data.results);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var parseMessages = function(messages) {
  $('.message').remove();
  for (var i = 0; i < messages.length; i++) {
    roomNames[messages[i].roomname] = true;
    if (messages[i].roomname === currentRoom) {
      var time = new Date(messages[i].createdAt);
      var h = time.getHours();
      var m = time.getMinutes();
      var $message = $('<div>').attr('class', 'message');
        $message.append($('<span>').attr('class', 'createdAt').html(h + ':' + m + ' '));
        $message.append($('<span>').attr('class', 'username').html(messages[i].username + ' '));
        $message.append($('<span>').attr('class', 'text').html(messages[i].text));
        $('.messages').append($message);
    }
  }
};

setInterval(getRequest, 2000);

$(document).on('click', 'button', function() {
  var submitted = $('input').val();
  var message = {'username': userName, 'text': submitted, 'roomname': currentRoom};
  sendRequest(message);
  $('input').val('');
});
}());

