/*************************************************************************** 
*WEB322 –PLA Assignment*  
*I declare that this assignment is my own work in accordance with Seneca Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.* 

*Name: Musaddiqur Rahman
*Student ID: 106932189
*Date: 
*Online (Heroku) Link: https://obscure-fjord-43423.herokuapp.com/
****************************************************************************/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions");

const albumService = require('./album-service');
const userService = require('./user-service');

var PORT = process.env.PORT || "60000";

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_pla_assignment", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}


app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});


albumService.initialize()
    .catch(function (err) {
        console.log('albumService initialization err: ', err);
        process.exit();
    })

userService.initialize()
    .catch(function (err) {
        console.log('userService initialization err: ', err);
        process.exit();
    })


app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/albums', function (req, res) {
    albumService.getAlbumsJoin()
        .then(function (albums) {
            res.render('albums', {
                albums: albums
            });
        })
        .catch(function (err) {
            res.status(500).send(`An unexpected error occurred: ${err}`);
        })
})


app.get('/album/:id', function (req, res) {
    albumService.getAlbumById(req.params.id)
        .then(function (album) {
            albumService.getArtists()
                .then(function (artists) {
                    albumService.getArtistById(album.ArtistId)
                        .then(function (theArtist) {
                            res.render('album', {
                                album: album,
                                artists: artists,
                                theArtist: theArtist
                            });
                        })
                        .catch(function (err) {
                            res.status(500).send(`An unexpected error occurred: ${err}`);
                        })
                })

                .catch(function (err) {
                    res.status(500).send(`An unexpected error occurred: ${err}`);
                })
        })
        .catch(function (err) {
            res.status(500).send(`An unexpected error occurred: ${err}`);
        })
});

app.get('/addAlbum', ensureLogin, function (req, res) {
    albumService.getArtists()
        .then(function (artists) {
            res.render('addAlbum', {
                artists: artists
            })
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.post('/addAlbum', ensureLogin, function (req, res) {
    albumService.addAlbum(req.body)
        .then(function () {
            res.redirect('/albums');
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.post('/updateAlbum', ensureLogin, function (req, res) {
    albumService.updateAlbumById(req.body.AlbumId, req.body)
        .then(function () {
            res.redirect('/albums');
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.get('/deleteAlbum/:id', ensureLogin, function (req, res) {
    albumService.deleteAlbumById(req.params.id)
        .then(function () {
            res.redirect('/albums');
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
})


app.get('/artists', function (req, res) {
    albumService.getArtists()
        .then(function (artists) {
            res.render('artists', {
                artists: artists
            })
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.get('/artist/:id', function (req, res) {
    albumService.getArtistById(req.params.id)
        .then(function (artist) {
            res.render('artist', {
                artist: artist
            });
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.get('/addArtist', ensureLogin, function (req, res) {
    res.render('addArtist');
})

app.post('/addArtist', ensureLogin, function (req, res) {
    albumService.addArtist(req.body)
        .then(function () {
            res.redirect('/artists');
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
})

app.post('/updateArtist', ensureLogin, function (req, res) {
    albumService.updateArtistById(req.body.ArtistId, req.body)
        .then(function () {
            res.redirect('/artists');
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.get('/deleteArtist/:id', ensureLogin, function (req, res) {
    albumService.deleteArtistById(req.params.id)
        .then(function () {
            res.redirect('/artists');
        })
        .catch(function(err){
            res.status(500).send(`An unexpected error occurred: ${err}`);
        });
});

app.get('/login', function (req, res) {
    res.render('login', {
        errorMessage: '',
        userName: req.body.userName
    });
})

app.get('/register', function (req, res) {
    res.render('register', {
        errorMessage: '',
        userName: req.body.userName,
        successMessage: ''
    });
})

app.post('/register', function (req, res) {
    userService.registerUser(req.body)
        .then(function () {
            res.render('register', {
                successMessage: "User Created",
                errorMessage: '',
                userName: req.body.userName
            });
        })
        .catch(function (err) {
            res.render('register', {
                asd: "asdf",
                errorMessage: err,
                userName: req.body.userName,
                successMessage: ''
            });
        })
})

app.post('/login', function (req, res) {
    userService.checkUser(req.body)
        .then(function () {
            req.session.user = {
                userName: req.body.userName
            };
            res.redirect('/albums');
        })
        .catch(function (err) {
            res.render('login', {
                errorMessage: err,
                userName: req.body.userName
            });
        })
})

app.get('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/');
})

app.use(function (req, res) {
    res.status(404).send("Page Not Found");
});


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});