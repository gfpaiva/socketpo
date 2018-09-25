import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import registerServiceWorker from './registerServiceWorker';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { BrowserRouter as Router } from 'react-router-dom';

import './index.scss';

const APIURL = process.env.NODE_ENV === 'production' ? 'socketpo.herokuapp.com' : 'localhost:3001';
const WS_PROTOCOL = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';

const wsLink = new WebSocketLink({
	uri: `${WS_PROTOCOL}://${APIURL}/subscriptions`,
	options: {
		reconnect: true,
		connectionParams: {
			myName: 'Guilherme'
		}
	}
});

const httpLink = new HttpLink({
	uri: `//${APIURL}/graphql`
});

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLink,
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>
	, document.getElementById('root'));
registerServiceWorker();
