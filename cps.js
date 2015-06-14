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

var updateUser = function(req, res, cb) {
    var obj=req.params;
    var replace_request = new cps.PartialReplaceRequest([{ id: req.params.id}, req.params]);
    cpsConn.sendRequest(replace_request, function (err, replace_resp) {
    //if (err) return console.log(err); // Handle error
        res.send({status: 'updated'})
    }, 'json');

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
    var username2 = req.params.username;
    var replace_request = new cps.PartialReplaceRequest([{ id: req.params.id}, {id: req.params.id, status : 'inprogress',username2: username2}]);
    cpsConn.sendRequest(replace_request, function (err, replace_resp) {
    //if (err) return console.log(err); // Handle error
        res.send({status: 'inprogress'})
    }, 'json');
}

var doneStatus = function(req, res, cb) {
    console.log(req.params)
    var retrieve_req = new cps.RetrieveRequest(req.params.id);
    cpsConn.sendRequest(retrieve_req, function (err, retrieve_resp) {
        //if (err) return console.log(err);
        if (retrieve_resp) {
            console.log(retrieve_resp.results);
        }

        var username = req.params.username;
        var result = req.params.result;
        console.log(result);

        var obj = {
            id: req.params.id
        }

        if (username == retrieve_resp.results.document[0].username) {
            obj.username_acknowledge = result;
        } else {
            obj.username2_acknowledge = result;
        }

        console.log(obj)

        var replace_request = new cps.PartialReplaceRequest([{ id: req.params.id}, obj]);
        cpsConn.sendRequest(replace_request, function (err, replace_resp) {
        //if (err) return console.log(err); // Handle error
            cpsConn.sendRequest(retrieve_req, function (err, final_resp){
                var response = final_resp.results.document[0];
                console.log(response)
                if (response.hasOwnProperty('username_acknowledge')
                 && response.hasOwnProperty('username2_acknowledge')) {
                     var update = {id: req.params.id}
                     update.winner = (response.username_acknowledge != "0") ? response.username : response.username2
                     update.status = 'completed'
                    var replace_request2 = new cps.PartialReplaceRequest([{ id: req.params.id}, update])
                    cpsConn.sendRequest(replace_request2, function (err, replace_resp) {
                        return res.send({status: 'completed'})
                    })
                }
                res.send({status: 'acknowledged'})
            })
        }, 'json');

    }, 'json');


}

var matchLookup = function(req, res, cb) {
    return 0;
}

var search = function(req, res, cb) {
    var search_req = new cps.SearchRequest(cps.Term('active','status'))
    //var search_req = new cps.SearchRequest("<id>&gt; 1</id> <id>&lt; 1000</id>")
    cpsConn.sendRequest(search_req, function (err, search_resp) {
        //if (err) return console.log(err)
        res.send( search_resp.results.document)
        console.log(search_resp.results.document)
    })
}

var getMatches = function(req, res, cb) {
    //TODO: Only filter active matches?
    var search_req = new cps.SearchRequest('{' + cps.Term(req.params.user, 'username') + ' ' + cps.Term(req.params.user, 'username2') + '}');
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
    updateUser: updateUser,
    search: search,
    getMatches: getMatches,
    updateStatus: updateStatus,
    doneStatus: doneStatus
}
