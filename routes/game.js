module.exports = app => {
	const Game = app.models.game;
	app.route('/game')
		.get((req, res) => {
			res.json({'msg': 'game'});
		})
		.post((req, res) => {
			let dateNow = (new Date()).valueOf().toString(),
				gameName = req.body.name,
				hash = crypto.createHash('sha1').update(dateNow + gameName).digest('hex'),
				game = new Game({ name: gameName, hash: hash});

			res.json(game);
		});
};