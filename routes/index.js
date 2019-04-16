const path = require('path');

module.exports = app => {

	app.get(/(\/(?!graphql).+|^\/$)/, (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
		return;
	});
};
