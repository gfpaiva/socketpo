const express = require('express'),
	path = require('path'),
	dotenv = require('dotenv').config(),
	consign = require('consign'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	cors = require('cors'),
	helmet = require('helmet'),
	{ createServer } = require('http'),
	{ SubscriptionServer } = require('subscriptions-transport-ws'),
	{ execute, subscribe } = require('graphql'),
	schema = require('./graphql/schema');
	app = express(),
	server = createServer(app);

app.use(express.static(path.resolve(__dirname, './client/build')));
app.set('port', process.env.PORT || 3001);
app.set("json spaces", 4);
app.use(helmet());
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST'],
}));
app.use(compression());
app.use(bodyParser.json());

consign({verbose: false})
	.include('libs/config.js')
	.then('libs/db.js')
	.then('models')
	.then('routes')
	.into(app);

server.listen(app.get('port'), () => {
	console.log(`SocketPO running on port ${app.get('port')}`);

	new SubscriptionServer({
			execute,
			subscribe,
			schema,
			/* onConnect: (connectionParams, webSocket, context) => {
				console.log('CONNECT: connectionParams', connectionParams);
				console.log('CONNECT: webSocket', webSocket);
				console.log('CONNECT: context', context);
			}, */
			/* onDisconnect: (connectionParams, webSocket, context) => {
				console.log('CONNECT: connectionParams', connectionParams);
				console.log('CONNECT: webSocket', webSocket);
				console.log('CONNECT: context', context);
			}, */
		}, {
			server,
			path: '/subscriptions',
	});
});

module.exports = app;
