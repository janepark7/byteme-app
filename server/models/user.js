
import sql from '../util/sql';
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const path = require('path');
// import table dependencies

const Likes = require('./like');
const fs = require("fs-extra");

const User = sql.define('user', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: Sequelize.STRING,
		notNull: true,
		unique: true,
	},
	password: {
		type: Sequelize.STRING,
		notNull: true,
	},
	isActive: {
		type: Sequelize.BOOLEAN,
	}
}, {
	hooks: {
		beforeCreate: hashUserPassword,
		beforeUpdate: hashUserPassword,
	},
});


//additional user functionality

function hashUserPassword(user) {
	if (user.password) {
		return bcrypt.genSalt()
			.then(function(salt) {
				return bcrypt.hash(user.password, salt);
			})
			.then(function(hashedPassword) {
				user.password = hashedPassword;
			});
	}
};

User.prototype.comparePassword = function(password) {
	return bcrypt.compare(password, this.get("password"));
};

User.search = function(username) {
	return User.findOne({ where: {
		username: username,
	}})
	.then(function(user) {
		if (user) {
			return true;
		} else {
			return false;
		}
	})
};

User.signup = function(req) {
	return User.create({
			username: req.body.username,
			password: req.body.password,
			isActive: true,
		})
		.then(function(user) {
			return user;
		});
};


User.prototype.like = function(fileid) {
	return Likes.upsert({
		userid: this.id,
		fileid: fileid,
		liked: true,  	// will need to eventually change this to a value from the page in order to toggle liked / unliked
	})
	.then(function(test) {
		if (test) {
			console.log(test);
		}
		else {
			console.error("??");
		}
	})
};


// define table relations



export default User;