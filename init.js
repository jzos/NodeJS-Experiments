var mongojs = require('mongojs')
var db = mongojs("ps", ["user", "dashboard"])

var userArray = [];
var arrayUserID = [];
var users = null;
var arrayDashboard = {};

db.user.find(function (err, docs) {


    users = docs;

    //console.log(users.length);
    var iInactiveCount = 0;

    for (var i in users)
    {
        userArray.push(users[i]._id);

        if (users[i].active == false)
        {

            iInactiveCount++;
            console.log(iInactiveCount + " : are InActive");

        }




    }

})


db.dashboard.find({"url" : "psc/ert/exe"}, function(err, doc) {




    arrayDashboard = doc[0].permission.user;

    //console.log(arrayDashboard);


    for (var k in arrayDashboard){

        arrayUserID.push(k);
    }

});

var intervalID = setInterval(function(){

    if (arrayUserID)
    {
        //console.log(users);


        //console.log(arrayUserID.length);


        for (var i=0; i<users.length; i++)
        {

            for (var k in arrayUserID)
            {
                if (users[i]._id == arrayUserID[k])
                {
                    //console.log(users[i].user_email_address);
                }
            }

            /*if (users[i]._id == arrayUserID[i])
            {

            } */

        }



        clearInterval(intervalID);
    }

}, 500);









