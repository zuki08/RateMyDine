import express from "express";
import path from "path";
import * as userDBUtils from "../../DataBase/userDBUtils.js";
import server from "../../server.js";
import passport from 'passport';
import session from 'express-session';
import passportAuth from "../authentication/passportAuth.js"

const authRouter = express.Router();
const __dirname = path.resolve();

// session configuration
const sessionConfig = {
    secret: process.env.SECRETKEY || 'MYFRIENDISACAT',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}

authRouter.use(session(sessionConfig));
authRouter.use(passport.initialize());
authRouter.use(passport.session());


// Express routing documentation: https://expressjs.com/en/guide/routing.html

// check if the user is authenticated
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/login');
    }
}

// the default endpoint to retrieve main page
authRouter.get('/', (req, res) => {
    res.sendFile(__dirname + "index.html");
});

// signup endpoint to retrieve sign up page
authRouter.get('/signup', (req, res) => {
    res.sendFile(__dirname + "/client/HTML/signup.html");
});

// signup for submitting a form
authRouter.post('/signup', async (req, res) => {
    console.log(req.body);

    if (await userDBUtils.findUser(server.users, req.body.email)) {
        // making another account with the same email
        res.status(403).send({
            message: `User is already existed`,
            status: "failure",
        });
    } else {
        try {
            await userDBUtils.createUser(server.users, req.body);
            res.redirect("/login");
        } catch (error) {
            res.status(500).send({ status: "failure" });
        }
    }
});

// login endpoint to retrieve login page
authRouter.get('/login', (req, res) => {
    res.sendFile(__dirname + "/client/HTML/login.html");
});

// login endpoint for submitting a form
authRouter.post('/login',
    passportAuth.authenticate('local', {
        // user email/password authentication 
        successRedirect: '/',
        failureRedirect: '/login'
    })
);



// Handle logging out (takes us back to the login page).
authRouter.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/');
});

export default authRouter;
