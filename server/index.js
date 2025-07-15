require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.json({message: "You are not logged in"})
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})
app.get("/success",isLoggedIn, (req, res) => {
    res.send(`Welcome ${req.user.email}`)
})

app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
    ));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/');
        });
    });
});


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => console.log("server running on port" + port));