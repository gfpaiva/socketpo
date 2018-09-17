const { withFilter } = require('graphql-subscriptions');
const pubsub = require('../../../libs/pubsub');
const { GAME } = require('../../../libs/events');

module.exports = {
	Subscription: {
		gameSubscription: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(GAME),
				(payload, variables) => {
					return payload.hash === variables.hash
				}
			)
		}
	}
}
