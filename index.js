const express = require('express'),
	dotenv = require('dotenv').config(),
	consign = require('consign'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	cors = require('cors'),
	helmet = require('helmet'),
	socket = require('socket.io'),
	app = express(),
	server = require('http').Server(app),
	io = socket(server);

app.set('port', process.env.PORT || 3000);
app.set("json spaces", 4);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());

consign({verbose: false})
	.include('libs/config.js')
	.then('libs/db.js')
	.then('models')
	.then('routes')
	.into(app);

app.use((req, res) => {
	res.status(404);
	res.json({'msg': '404 not found'});
});

app.use((error, req, res) => {
	res.status(500);
	res.json({'msg': `500 ${error}`});
});

server.listen(app.get('port'), () => {
	console.log(`SocketPO running on port ${app.get('port')}`);
});

module.exports = app;