var socket = require('socket.io');
var debug = require('debug')('angularExample');
var app = require('./app');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', process.env.PORT || 3030);

io.on('connection', function (socket) {
    socket.on('scoresUpdated',function(msg){
       io.emit('scoresUpdated',msg);
    });
});

io.on('refresh', function(data) {
   location.reload();
});

server.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
