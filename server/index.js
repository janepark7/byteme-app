import dotenv from "dotenv";

import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import connectSessionSerialize from "connect-session-sequelize";

import sql from "./util/sql";
import deserializeUser from "./middleware/deserializeUser";
const SessionStore = connectSessionSerialize(session.Store);


// configuration ###############################

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const cookieSecret = process.env.COOKIE_SECRET || "don";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(cookieSecret));
app.use(session({
	store: new SessionStore({ db: sql }),
	secret: cookieSecret,
	resave: false
}));
app.use(express.static('assets'));
app.use(deserializeUser);

// routing #################################

import apiRoutes from "./routes/api";
import reactRoute from "./routes/react";
//import adminRoutes from "./routes/admin";

app.use("/api", apiRoutes);
//app.use("/admin", adminRoutes);

if (!process.env.SERVER_ONLY) {
	reactRoute(app);
}

// Sync db and launch server ################################

sql.sync().then(function() {
	console.log("Database synced!");
	app.listen(port, function() {
		console.log("Server up and running on port ", port)
	});
})
.catch((err) => {
	console.error(err);
	console.error("Database failed to sync");
});
