var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8081
});

var dataPlace = [];

for (var i = 1; i < 4; i++) {
  dataPlace[i] = generateData();
}

function pushData (param) {
  // console.log(param)
  param.clients[param.id].send(JSON.stringify(dataPlace[param.message]));
}
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);


  ws.on('message', function(message) {
    console.log(id, ': получено сообщение ' + message);

    pushData({ clients, message, id });
    
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});

function generateData () {
  const arrPlaces = [...Array(Math.ceil(Math.random() * (1 + 5))).keys()].reduce((previousRack, currentRack, index) => { // 40
    let parentIndex = currentRack
    previousRack = [
      ...previousRack,
      {
        id: `id-rake-${currentRack}`,
        title: `rake-${currentRack}`,
        nodes: (function () {
          return [...Array(Math.ceil(Math.random() * (15 + 15))).keys()].reduce((previousNode, current, nodeId) => {
            previousNode = [
              ...previousNode,
              {
                id: `id-${currentRack}-${nodeId}`,
                ip: Math.ceil(Math.random() * (1 + 1000)),
                title: `${parentIndex}c${current}p`,
                status: Math.ceil(Math.random() * (0 + 2)) === 1 ? 'on' : 'off'
              }
            ]

            return previousNode
          }, [])
        })()
      }
    ]

    return previousRack
  }, [])

  return arrPlaces
}
