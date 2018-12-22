const Sequelize = require('sequelize');


// set up sequelize to point to our postgres database
var sequelize = new Sequelize('dbf5r7okp0smi9', 'ylhusxwlnunttg', 'eea86786841eea90fc5741f8dfdc5536c3fa805f58e06ea40a6fe4d48c40f3ae', {
    host: 'ec2-184-73-181-132.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

//sequelize auth
sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });


// artist schema 
var Artist = sequelize.define('Artist', {
    ArtistId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    BandName: Sequelize.TEXT,
    BandMembers: Sequelize.STRING,
    YearFormed: Sequelize.INTEGER,
    MusicGenre: Sequelize.STRING
});


// album schema
var Album = sequelize.define('Album', {
    AlbumId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    AlbumName: Sequelize.STRING,
    YearReleased: Sequelize.INTEGER,
    RecordLabel: Sequelize.STRING,
    SongList: Sequelize.TEXT,
    comments: Sequelize.TEXT,
    Rating: Sequelize.INTEGER
});

//setting one to many with artist -> album
Artist.hasMany(Album, {
    foreignKey: 'ArtistId'
});
//setting one to one with album -> artist
Album.Artist = Album.belongsTo(Artist, {
    foreignKey: 'ArtistId'
});


function initialize() {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                console.log('Sequelize database synchronized.');
                resolve();
            })
            .catch(function (err) {
                console.log('sequelize sync error: ', err);
                reject();
            })
    })
}

function getAlbums() {
    return new Promise(function (resolve, reject) {
        Album.findAll()
            .then(function () {
                console.log('getAlbums Success!');
                resolve();
            })
            .catch(function (err) {
                console.log('error finding all albums: ', err);
                reject();
            });
    });
}

function getAlbumsJoin() {
    return new Promise(function (resolve, reject) {
        Album.findAll({
                include: Album.Artist
            })
            .then(function () {
                console.log('getAlbums Success!');
                resolve();
            })
            .catch(function (err) {
                console.log('getAlbums failure, err:', err);
                reject();
            })
    });
}

function getAlbumById(id) {
    return new Promise(function (resolve, reject) {
        Album.findAll({
                where: {
                    AlbumId: id
                }
            })
            .then(function () {
                console.log('getAlbumById success!');
                resolve();
            })
            .catch(function (err) {
                console.log('getAlbumById failure, err:', err);
                reject();
            });
    });
}


function addAlbum(data) {
    return new Promise(function (resolve, reject) {
        for (var prop in data) {
            if (data[prop] == '') {
                data[prop] = null;
            }
        }
        Album.create(data)
            .then(function () {
                console.log('new album added!');
                resolve();
            })
            .catch(function (err) {
                console.log('add album failure, err:', err);
                reject();
            });
    });
}

function updateAlbumById(id, data) {
    return new Promise(function (resolve, reject) {
        for (var prop in data) {
            if (data[prop] == '') {
                data[prop] = null;
            }

            Album.update(data, {
                    where: {
                        AlbumId: id
                    }
                })
                .then(function () {
                    console.log('updateAlbumById success!');
                    resolve();
                })
                .catch(function (err) {
                    console.log('updateAlbumById failure, err: ', err);
                    reject();
                });
        }
    });
}

function deleteAlbumById(id) {
    return new Promise(function (resolve, reject) {
        Album.destroy({
                where: {
                    AlbumId: id
                }
            })
            .then(function () {
                console.log(`deleteAlbumById success!`);
                resolve();
            })
            .catch(function (err) {
                console.log(`deleteAlbumById failure, err: ${err}`);
                reject();
            });
    });
}

function getArtists() {
    return new Promise(function (resolve, reject) {
        Artist.findAll()
            .then(function () {
                console.log(`getArtists success!`);
                resolve();
            })
            .catch(function (err) {
                console.log(`getArtists failure, err: ${err}`);
                reject();
            })
    });
}

function getArtistById(id) {
    return new Promise(function (resolve, reject) {
        Artist.findAll({
                where: {
                    ArtistId: id
                }
            }).then(function () {
                console.log(`getArtistById success!`);
                resolve();
            })
            .catch(function (err) {
                console.log(`getArtistById failure, err: ${err}`);
                reject();
            })
    });
}


function addArtist(data) {
    return new Promise(function (resolve, reject) {
        for (var prop in data) {
            if (data[prop] == '') {
                data[prop] = null;
            }
        }
        Artist.create(data)
            .then(function () {
                console.log('addArtist success!');
                resolve();
            })
            .catch(function (err) {
                console.log('addArtist failure, err:', err);
                reject();
            });
    });
}


function updateArtistById(id, data) {
    return new Promise(function (resolve, reject) {
        for (var prop in data) {
            if (data[prop] == '') {
                data[prop] = null;
            }

            Artist.update(data, {
                    where: {
                        ArtistId: id
                    }
                })
                .then(function () {
                    console.log('updateArtistById success!');
                    resolve();
                })
                .catch(function (err) {
                    console.log('updateArtistById failure, err: ', err);
                    reject();
                });
        }
    })
}

function deleteArtistById(id) {
    return new Promise(function (resolve, reject) {
        Artist.destroy({
                where: {
                    ArtistId: id
                }
            })
            .then(function () {
                console.log(`deleteArtistById success!`);
                resolve();
            })
            .catch(function (err) {
                console.log(`deleteArtistById failure, err: ${err}`);
                reject();
            })
    });
}


module.exports = {
    initialize: initialize,
    getAlbums: getAlbums,
    getAlbumById: getAlbumById,
    getAlbumsJoin: getAlbumsJoin,
    getArtistById: getArtistById,
    getArtists: getArtists,
    addAlbum: addAlbum,
    addArtist: addArtist,
    updateAlbumById: updateAlbumById,
    updateArtistById: updateArtistById,
    deleteAlbumById: deleteAlbumById,
    deleteArtistById: deleteArtistById
};