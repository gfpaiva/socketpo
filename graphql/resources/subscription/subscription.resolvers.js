const { withFilter } = require('graphql-subscriptions');
const pubsub = require('../../../libs/pubsub');
const { GAME } = require('../../../libs/events');

module.exports = {
	Subscription: {
		gameSubscription: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(GAME),
				(payload, variables) => {
					const payloadHash = payload && payload.gameSubscription && payload.gameSubscription.hash;
					return payloadHash === variables.hash
				}
			)
		}
	}
}

/* module.exports = {
	Subscription: {
		gameSubscription: {
			subscribe: () => pubsub.asyncIterator(GAME)
		}
	}
} */
