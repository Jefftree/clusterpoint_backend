var restify = require('restify')
var request = require('request')
var cps = require('./cps')

var server = restify.createServer({
    name: 'ooo',
    version: '1.0.0'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.post('/sportslist', function (req, res, next) {
    return cps.add(req, res, function(){
        return next()
    })
})

server.post('/adduser', function (req, res, next) {
    return cps.addUser(req, res, function(){
        return next()
    })
})

server.post('/updateuser/:id', function (req, res, next) {
    return cps.updateUser(req, res, function(){
        return next()
    })
})

server.get('/sportslist', function (req, res, next) {
    return cps.search(req, res, function(){
        return next()
    })
})

server.get('/mymatches/:user', function (req, res, next) {
    return cps.getMatches(req, res, function(){
        return next()
    })
})

server.post('/update/inprogress/:id', function (req, res, next) {
    return cps.updateStatus(req, res, function(){
        return next()
    })
})

server.post('/update/completed/:id', function (req, res, next) {
    return cps.doneStatus(req, res, function(){
        return next()
    })
})




var rand = function (num) {
    return Math.floor(Math.random() * num)
}

var user_list = ["judy","joe","john","charlie"]
var sport_list = ["basketball", "tennis"]
var rating_list = [500,1000,1250,1500]
var location_list = ["Toronto","Mississauga","Markham"]

var populate = function () {

    for (var i = 0; i < 10; i++) {
        request({
            uri: "https://oneononeapp.herokuapp.com/sportslist",
            method: "POST",
            form: {
                avatar : "http://files.softicons.com/download/sport-icons/sports-illustrated-icons-by-kevin-andersson/png/64x64/Basketball.png",
                username : user_list[rand(4)],
                sport: sport_list[rand(2)],
                location: location_list[rand(3)],
                rating : rating_list[rand(4)],
                description: "Let's Play",
                status : "active",
                winner: ""
            }
        },function(error, response, body) {
            console.log(body);
        });
    }
}

var populate_users = function() {
    request({
        uri: "http://localhost:8080/adduser",
        method: "POST",
        form: {
            avatar : "http://files.softicons.com/download/sport-icons/sports-illustrated-icons-by-kevin-andersson/png/64x64/Basketball.png",
            username : user_list[rand(4)],
            rating : rating_list[rand(4)],
            friends: 2
        }
    },function(error, response, body) {
        console.log(body);
    });
}

var port = process.env.PORT || 8080;
    server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url)
    //populate_users();
    //populate();
})
