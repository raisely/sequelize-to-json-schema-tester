const mocker = require('./mockModel');

const user = mocker('user', {
	name: 'STRING',
});

mocker('address', {	country: 'STRING' });

mocker('scores', { highScore: 'INTEGER' });

user.associate([
	{ name: 'address', associationType: 'hasOne' },
	{ name: 'scores', associationType: 'hasMany' },
]);

module.exports = user;
