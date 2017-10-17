import express from "express";
import BodyParser from "body-parser";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

// const S3_BUCKET = process.env.S3_BUCKET;

// coment this line out before pushing to heroku
// AWS.config.loadFromPath("./s3Config.json");

// AWS.config.loadFromPath("./s3Config.json");
const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET || 'bytemeimagestorage',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "x-amz-meta-" + file.filename });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
  })
// import models here ##################################
import User from "../models/user";
import Restaurant from "../models/restaurant";
import Post from "../models/post";


const router = express.Router();
router.use(BodyParser.json());

// define routes here ###################################

router.post("/signup", (req, res) => {
	Restaurant.findOne({ where: {
		username: req.body.username,
	}})
	.then((restaurant) => {
		if (restaurant) {
			res.json({error: "Username is already taken. Please choose another"})
		}
		else {
			Restaurant.signup(req)
			.then((restaurant) => {
				req.session.restaurantId = restaurant.get("id");
				res.json(restaurant.dataValues);
			});
		}
	}).catch((error) => {
		console.error("Something went wrong", error);
	});
});

router.post("/login", (req, res) => {
	Restaurant.findOne({ where: {
		username: req.body.username,
	}})
	.then((restaurant) => {
		if (restaurant) {
			restaurant.comparePassword(req.body.password)
			.then((valid) => {
				if (valid) {
					req.session.restaurantId = restaurant.get("id");
					req.session.save((err) => {
						res.json(restaurant);
					})
				}
				else {
					res.json({ error: "Bad username or password" });
				}
			}).catch((error) => {
				res.json({ error: "Something went wrong"});
			});
		} else {
			res.json({ error: "Bad username or password" });
		}
	})
});

router.get("/posts", (req, res) => {
	if (req.query.restaurantId) {
		Post.findAll({
			where: { restaurantId: req.query.restaurantId, }
		})
		.then((images) => {
			if (images) {
				res.json(images);
			}
			else {
				res.json({ error: "Something went wrong" });
			}
		}).catch((error) => {
			return error;
		});
	}
	else {
		Post.findAll({

		}).then((images) => {
			if (images) {
				res.json(images);
			}
			else {
				res.json({ error: "Something went wrong" });
			}
		}).catch((error) => {
			return error;
		});
	}
});

router.post("/upload", upload.single("file"), (req, res) => {
	if (!req.file) {
		res.json({error: "Invalid file type."});
	}
	else {
		Restaurant.findOne({ where: {
			id: req.body.restaurantId,
		}}).then((restaurant) => {
			restaurant.upload(req.file, req.body)
		.then((image) => {
			if (image) {
				res.redirect("/useradmin");
			}
			else {
				res.send({error: "Upload failed."});
			}
		}).catch((error) => {
			console.error(error);
			res.send("error", error);
		});
		}).then((success) => {
			console.log("Success?", success);
		}).catch((error) => {
			console.error(error);
		});
	}
})

router.post("/logout", (req, res) => {
	req.session.restaurantId = null,
	res.send("User logged out.");
})

router.post("/user/signup", (req, res) => {
	User.findOne({ where: {
		username: req.body.username,
	}})
	.then((user) => {
		if (user) {
			res.json({error: "Username is already taken. Please choose another"})
		}
		else {
			User.signup(req)
			.then((user) => {
				req.session.userId = user.get("id");
				res.json(user.dataValues);
			});
		}
	}).catch((error) => {
		console.error("Something went wrong", error);
	});
});

router.post("/user/login", (req, res) => {
	User.findOne({ where: {
		username: req.body.username,
	}})
	.then((user) => {
		if (user) {
			user.comparePassword(req.body.password)
			.then((valid) => {
				if (valid) {
					req.session.userId = user.get("id");
					req.session.save((err) => {
						res.json(user);
					})
				}
				else {
					res.json({ error: "Bad username or password" });
				}
			}).catch((error) => {
				res.json({ error: "Something went wrong"});
			});
		} else {
			res.json({ error: "Bad username or password" });
		}
	})
});

export default router;