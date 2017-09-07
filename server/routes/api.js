import express from "express";
import BodyParser from "body-parser";

// import models here ##################################
//import Post from "../models/post";
import Restaurant from "../models/restaurant";

const router = express.Router();
router.use(BodyParser.json());

// define routes here ###################################

router.post("/signup", (req, res) => {
	Restaurant.signup(req)
	.then((restaurant) => {
		console.log("success", res.signedCookies, res.body);
		res.send("Success");
	});
});

router.post("/login", (req, res) => {
	Restaurant.login(req)
	.then(restaurant)
});

router.get("/posts", (req, res) => {
	/* Post.findAll({
		where: id === req.session.restaurantId,
	})
	.then(() => {
		res.send("H1@");
	}) */

	res.send("{'TEST': 1}");
});

export default router;