var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Handlebars = require('handlebars');
var template_cache = {};
var layout_path = 'layout';
var cache_templates = false;
var Packard = require('../packard.js');

var getTemplate = function (path) {
    if (!template_cache[path]) {
        template_cache[path] = Handlebars.compile(fs.readFileSync(__dirname + '/static/templates/' + path + '.hbs').toString());
    }
    var template = template_cache[path];
    cache_templates ? null : template_cache[path] = null;
    return template;
};

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
        res.render('main', {});
    });