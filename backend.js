const WebSocket = require('ws')
var os = require('os');
var pty = require('node-pty');

const wss = new WebSocket.Server({ port: 6060 })

console.log("Socket is up and running...")

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    //   cwd: process.env.HOME,
    env: process.env,
});
wss.on('connection', ws => {
    console.log("new session")
    ws.on('message', command => {
        ptyProcess.write(command);
    })

    ptyProcess.on('data', function (data) {
        ws.send(data)
        console.log(data);

    });
})


const express = require('express')
const server = express()
server.use(express.urlencoded({ extended: false }))
server.use(express.json())
server.use(express.static(__dirname + '/Frontend')); 
const path = require('path')
server.use('/static', express.static(path.join(__dirname, 'apks'))) 



/* final catch-all route to index.html defined last */
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/index.html'); 
})

server.post('/git-url',(req,res)=>{ 
    console.log(req.body);
    var path_url=req.body['links'];
    var path=path_url.split('/'); 
    console.log(path_url);
    var path1=path[4];
    console.log(path[4]);
    ptyProcess.write("bash -c 'cd /home/developer ; git clone "+path_url+" ; cd "+path1+" ; flutter build apk ; mkdir /home/src/server/apks/"+path1 +" ; cp ./build/app/outputs/flutter-apk/app-release.apk /home/src/server/apks/"+path1+"/' \r");
})

const port = 3000;
server.listen(port, function() {
  console.log('server listening on port ' + port)
})