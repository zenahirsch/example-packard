var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var Handlebars = require('handlebars');
var template_cache = {};
var layout_path = 'layout';
var cache_templates = false;
var Packard = require('../packard');

var getTemplate = function (path) {
    if (!template_cache[path]) {
        template_cache[path] = Handlebars.compile(fs.readFileSync(__dirname + '/static/templates/' + path + '.hbs').toString());
    }
    var template = template_cache[path];
    cache_templates ? null : template_cache[path] = null;
    return template;
};

app.set('port', (process.env.PORT || 5000));

app.use(express.static('static'));

app.use(function (req, res, next) {
    res.render = function (path, vars) {
        res.set('content-type', 'text/html');
        res.set('cache-control', 'no-cache');

        var template = getTemplate(path);

        if (layout_path && !req.query.ajax) {
            var compiled_layout = getTemplate(layout_path);
            res.end(compiled_layout({
                title: 'Example Packard',
                css_file: path + '.css',
                js_file: path + '.js',
                content: template(vars)
            }));
        } else {
            res.end(template(vars));
        }
    }

    next();
});

app.use(bodyParser.json());

app.route('/')
    .get(function (req, res) {
        console.log(process.env.DATABASE_URL);
        
        var game = new Packard({
            title: 'Example Game',
            author: 'Zena Hirsch',
            version: '1.0',
            database_url: process.env.DATABASE_URL
        });

        res.render('main', {
            results: game.save()
        });
    });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});