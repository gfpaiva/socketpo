const { withFilter } = require('graphql-subscriptions');
const pubsub = require('../../../libs/pubsub');
const { JUST_TEST } = require('../../../libs/events');

module.exports = {
	Subscription: {
		justTesting: {
			subscribe: () => pubsub.asyncIterator(JUST_TEST)
		}
	}
}