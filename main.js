var restify = require('restify')
var cps = require('./cps')

var server = restify.createServer({
    name: 'ooo',
    version: '1.0.0'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.post('/sportslist/', function (req, res, next) {
    return cps.add(req, res, function(){
        return next()
    })
})

server.get('/sportslist', function (req, res, next) {
    return cps.search(req, res, function(){
        return next()
    })
})
var port = process.env.PORT || 8080;
server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url)
})
