const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
const { verify } = require("crypto");

require("dotenv").config();
//=================================================================================
//https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html =
//https://developer.okta.com/docs/concepts/oauth-openid/#implicit-flow            =
//=================================================================================
const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log(profile);
  done(null, profile);
  //if we used password auth, then accessToken would be the password and this function would
  //be doing manual verification. However since we are using Google OAuth, we just need to pass
  //params for now
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id); //done is a callback for when we need to do other things like query db for serializing cookie
  //this will add this data to the browser
  //here "user" is the "profile" data sent back by google during log in
});

//read the session from the cookie
passport.deserializeUser((obj, done) => {
  done(null, obj); //deserializing will read the cookie data from the browser and add it to the "req" object
  //usually we would do something like this when we store user id in cookie:
  // User.findById(id).then((user) => {
  //   done(null, user);
  // });
});

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: "session", //under this name in browser it will be stored
    maxAge: 24 * 60 * 60 * 1000, //maxeAge must be in milliseconds
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2], //with these keys, the cookie will be signed cryptographically
    //keys are in an array because we might expire an old key with a new one and sign all new cookies with the new one
    //however all old data will be lost, so we will still keep old key and accept cookies signed with the old key but
    //sign NEW cookies with new key only
  })
);
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user; //isAuthenticated() is a passport function
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }
  next();
}

//first request to google auth server
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"], //we only want the email to be returned from google auth server, we can also ask for profile, name, etc
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google called us back!!");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(); //passport provided function
  //removes req.user and clears any logged in session or cookie
  return res.redirect("/");
});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("Your personal secret value is 42!");
});

app.get("/failure", (req, res) => {
  res.send("Failed to login");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
