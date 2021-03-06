import sql from '../util/sql';
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
import Jimp from 'jimp';

const path = require('path');

// import table dependencies

import Post from "./post";
import Address from "./address";
import Like from "./like";

const fs = require("fs-extra");

const Restaurant = sql.define('restaurant', {
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
	restaurantName: {
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

// relationships
Restaurant.hasMany(Post);
/* Restaurant.hasOne(Address, { through: userAddress });
Restaurant.hasMany(Phone, { through: userPhone }); */

// model extensions
Restaurant.prototype.upload = function(file, body) {
	let image;
	return this.createPost({
			id: file.key,
			size: file.size,
			originalName: file.originalname,
			mimeType: file.mimetype,
			title: body.title,
			description: body.description,
			price: body.price,		  
		})
		.then(function(image) {
					return image;
		});
};



//additional user functionality

function hashUserPassword(restaurant) {
	if (restaurant.password) {
		return bcrypt.genSalt()
			.then(function(salt) {
				return bcrypt.hash(restaurant.password, salt);
			})
			.then(function(hashedPassword) {
				restaurant.password = hashedPassword;
			});
	}
};

Restaurant.prototype.comparePassword = function(password) {
	return bcrypt.compare(password, this.get("password"));
};

Restaurant.search = function(username) {
	return Restaurant.findOne({ where: {
		username: username,
	}})
	.then(function(restaurant) {
		if (restaurant) {
			return true;
		} else {
			return false;
		}
	})
};

Restaurant.signup = function(req) {
	return Restaurant.create({
			username: req.body.username,
			password: req.body.password,
			restaurantName: req.body.restaurantName,
			isActive: true,
		})
		.then(function(restaurant) {
			return restaurant;
		});
};


export default Restaurant;