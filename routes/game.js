module.exports = app => {
	const crypto = require('crypto'),
		Game = app.models.game;
	app.route('/game')
		.get((req, res) => {
			Game.find().select('name hash').exec((err, game) => {
				if(err) {
					res.json(err);
				} else {
					res.json(game);
				}
			});
		})
		.post((req, res) => {
			let dateNow = (new Date()).valueOf().toString(),
				gameName = req.body.name,
				hash = crypto.createHash('sha1').update(dateNow + gameName).digest('hex'),
				game = new Game({ name: gameName, hash: hash});

				game.save((err, game) => {
					if(err) {
						res.json(err);
					} else {
						res.json(game);
					}
				});

		});
};