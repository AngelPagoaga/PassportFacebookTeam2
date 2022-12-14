/** @format */

import express,{Response,NextFunction} from 'express'
import {FacebookUser,Request} from './interfaces'

const path = require("path");
const app = express();

const passport = require("passport");

const session = require("express-session");

const User = require("./models/User");

const facebookStrategy = require("passport-facebook").Strategy;
app.set("views",path.join(__dirname, '/views'));
app.set("view engine", "ejs");
app.use(session({ secret: "ilovescotchscotchyscotchscotch" }));
app.use(passport.initialize());
app.use(passport.session());

passport.authenticate('facebook', {scope: ['email']});
passport.use(
    
    new facebookStrategy(
        {
            // pull in our app id and secret from our auth.js file
            clientID: "1160926991464006",
            clientSecret: "e8432c677b683c7de01f382d670cad8f",
            callbackURL: "https://localhost:5000/facebook/callback",
            profileFields: [
                "id",
                "displayName",
                "name",
                "gender",
                "picture.type(large)",
                "emails",
            ],
        }, // facebook will send back the token and profile
        function (_token:any, _refreshToken:any, profile:any, done:any) {
            // asynchronous
            process.nextTick(function () {
                // find the user in the database based on their facebook id
                try {
                    User.findOne({ email: profile.emails[0].value }, function (err:any, user:any) {
                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err) return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            console.log("user found");
                            console.log(user);
                            console.log("Hola fb devolvio:",profile);
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser = new User();
                            // set all of the facebook information in our user model
                            //newUser.uid = profile.id; // set the users facebook id
                            //newUser.token = token; // we will save the token that facebook provides to the user
                            newUser.name = profile.name.givenName + " " + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                           // newUser.gender = profile.gender;
                            newUser.pic = profile.photos[0].value;
                            console.log(profile);
                            // save our user to the database
                            newUser.save(function (err:any) {
                                if (err) throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            });
        }
    )
);

passport.serializeUser(function (user:any, done:any) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id:any, done:any) {
    User.findById(id, function (err:any, user:any) {
        done(err, user);
    });
});

app.get("/profile", isLoggedIn, function (req:Request, res:Response) {
    console.log(req.user);
    res.render("profile", {
        user: req.user, // get the user out of session and pass to template
    });
});

app.get("/logout", function (req:Request, res:Response) {
    req.logout();
    res.redirect("/");
});

// route middleware to make sure
function isLoggedIn(req:Request, res:Response, next:any) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect("/");
}

app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/profile",
        failureRedirect: "/",
    })
);

app.get("/", (_req:Request, res:Response) => {
    res.render("index");
});

app.listen(5000, () => {
    console.log("App is listening on Port 50000");
});
