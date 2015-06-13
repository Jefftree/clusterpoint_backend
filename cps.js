var cps = require('cps-api')
var cpsConn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'sportslist', 'jeffrey.ying86@gmail.com', 'qwerty', 'document', 'document/id', {account: 100499})
var profile = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'profile', 'jeffrey.ying86@gmail.com', 'qwerty', 'document', 'document/id', {account: 100499})


var addUser = function(req, res, cb) {
    var obj = req.params
    var id = Math.floor((Math.random() * 1000) + 1)
    obj.id = id

    profile.sendRequest(new cps.InsertRequest([obj]), function (err, resp) {
        //if (err) return console.error(err) // Handle error
        res.send(obj)
    })

}

var add = function(req, res, cb) {
    var obj = req.params

    var id = Math.floor((Math.random() * 1000) + 1)
    obj.id = id

    //obj.avatar = "http://abcdefg.com"
    //obj.username = "asdf"
    //obj.sport = "Tennis"
    //obj.location = "Toronto"
    //obj.rating = 1400
    //obj.status = "active"
    obj.date = new Date()

    cpsConn.sendRequest(new cps.InsertRequest([obj]), function (err, resp) {
        //if (err) return console.error(err) // Handle error
        res.send(obj)
    })
}

var updateStatus = function(req, res, cb) {
    var replace_request = new cps.PartialReplaceRequest({ id: req.params.id, status : 'inprogress'});
    cpsConn.sendRequest(replace_request, function (err, replace_resp) {
    //if (err) return console.log(err); // Handle error
        res.send({status: 'inprogress'})
    }, 'json');
}

var doneStatus = function(req, res, cb) {
    var winner = req.params.winner;
    var replace_request = new cps.PartialReplaceRequest([{ id: req.params.id}, {status : 'completed', winner : winner}]);
    cpsConn.sendRequest(replace_request, function (err, replace_resp) {
    //if (err) return console.log(err); // Handle error
        res.send({status: 'completed'})
    }, 'json');
}

var search = function(req, res, cb) {
    var search_req = new cps.SearchRequest(cps.Term('active','status'))
    //var search_req = new cps.SearchRequest("<id>&gt; 1</id> <id>&lt; 1000</id>")
    cpsConn.sendRequest(search_req, function (err, search_resp) {
        if (err) return console.log(err)
        res.send( search_resp.results.document)
        console.log(search_resp.results.document)
    })
}

var getMatches = function(req, res, cb) {
    //TODO: Only filter active matches?
    var search_req = new cps.SearchRequest(cps.Term(req.params.user, 'username'));
    cpsConn.sendRequest(search_req, function (err, search_resp) {
        if (err) return console.log(err)
        res.send(search_resp.results.document)
        console.log(search_resp.results.document)
    })
}

module.exports = {
    cpsConn: cpsConn,
    add: add,
    addUser: addUser,
    search: search,
    getMatches: getMatches,
    updateStatus: updateStatus,
    doneStatus: doneStatus
}
