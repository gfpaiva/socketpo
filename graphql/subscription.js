const { subsSchema } = require('./resources/subscription/subscription.schema');

module.exports = `
 type Subscription {
	${subsSchema}
 }
`;