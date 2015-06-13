var cps = require('cps-api')
var cpsConn = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'sportslist', 'jeffrey.ying86@gmail.com', 'qwerty', 'document', 'document/id', {account: 100499})
var add = function(req, res, cb) {
    var obj = req.params

    var id = Math.floor((Math.random() * 100) + 1)
    obj.id = id;

    //obj.avatar = "http://abcdefg.com"
    //obj.username = "asdf"
    //obj.sport = "Tennis"
    //obj.location = "Toronto"
    obj.date = new Date()

    cpsConn.sendRequest(new cps.InsertRequest([obj]), function (err, resp) {
        //if (err) return console.error(err) // Handle error
        res.send(obj)
    })
}

var search = function(req, res, cb) {
    var search_req = new cps.SearchRequest("<id>&gt; 1</id> <id>&lt; 1000</id>")
    cpsConn.sendRequest(search_req, function (err, search_resp) {
        if (err) return console.log(err)
        res.send(search_resp.results.document)
        console.log(search_resp.results.document)
    })
}

module.exports = {
    cpsConn: cpsConn,
    add: add,
    search: search
}
