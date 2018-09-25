const { withFilter } = require('graphql-subscriptions');
const pubsub = require('../../../libs/pubsub');
const { GAME } = require('../../../libs/events');

module.exports = {
	Subscription: {
		gameSubscription: {
			subscribe: () => pubsub.asyncIterator(GAME)
		}
	}
}
