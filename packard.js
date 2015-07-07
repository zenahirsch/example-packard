var pg = require('pg');

var Packard = function (settings) {
    var self = this;
    var details = {
        title: settings.title,
        author: settings.author,
        version: settings.version,
        database_url: settings.database_url
    };

    self.showDetails = function () {
        return details.title + ' ' + details.author + ' ' + details.version;
    };

    self.getDatabaseURL = function () {
        return details.database_url;
    };
};

Packard.prototype.save = function () {
    var self = this; 

    pg.connect(self.getDatabaseURL(), function (err, client, done) {
        if (err) {
            throw err;
        }

        client.query('SELECT * FROM games', function (err, result) {
            done();
            if (err) {
                console.error(err);
                return err;
            } else {
                return result.rows;
            }
        });
    });
};

Packard.prototype.importNodesFromJSON = function (path) {
    var nodes = require(path);

    console.log(nodes);
};

Packard.prototype.addNode = function (node_settings) {

};

Packard.prototype.deleteNode = function (node_id) {

};

Packard.prototype.editNode = function (node_id, node_settings) {

};

Packard.prototype.getNode = function (node_id) {

};

module.exports = Packard;