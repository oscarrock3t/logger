const http = require('http');
const ws = require('ws');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
    loadFiles(req, res);
    res.end();
});

httpServer.listen(8080);

function loadFiles(req, res) {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-type': contentType(req) });
        res.write(fs.readFileSync('index.html'));
    } else {

        try {
            res.writeHead(200, { 'Content-type': contentType(req) });
            res.write(fs.readFileSync('.' + req.url));

        } catch (e) {
            console.log(e.errno + " " + e.path);
        }

    }
}

function contentType(req) {
    switch (req.url.split('.')[req.url.split('.').length - 1]) {
        case '/':
            return 'text/html';
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'text/js';
        case 'png':
            return 'image/avif';
        case 'ico':
            return 'image/avif';
    }
}

//-----------------------------------------------------------------------------------------

wss = new ws.Server({
    server: httpServer
});

wss.on('connection', (ws) => {

    fs.readFileSync('log.txt').toString().split('\n').forEach(item => {
        ws.send(item);
    });

    ws.on('message', (msg) => {
        msg = addDate(msg);

        fs.appendFileSync('log.txt', msg + '\n');
        wss.clients.forEach(client => {
            if (client.readyState == ws.OPEN) {
                client.send(msg);
            }
        })

    })
});


function addDate(msg) {
    let date = new Date();
    return date.toLocaleDateString() + ' ' + date.toTimeString().substring(0, 8) + '**' + msg;
}