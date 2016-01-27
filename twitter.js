/**
 * Created by jaimemac on 1/19/16.
 */




var csvFile;
var arrayUsers                  = [];
var arrayImages                 = [];
var arrayUsersData              = [];
var arrayUserTwitterData        = [];
var iPageNo                     = 1;
var http                        = require('http');
var Twitter                     = require('twitter');

var client = new Twitter({
    consumer_key: 'wrYF9hApsNGs8OgU3MyQw',
    consumer_secret: 'a5i8UlzzgIJ2HHqZPg8yfQHMZGaPVj38iW9OyG3oQ',
    access_token_key: '19669840-I4m2CWkH9jExlhCRqJMOKtdVppe9EW1ig7z7p7KZM',
    access_token_secret: 'FaXH9kjQ16wGpmstnR5f8evN2Ov3RWfqF1bCa7Zit9IgL'
});

/*

var params = {'jayzosoutside': 'nodejs'};

client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
        console.log(tweets);
    }
});

*/



function LoadHTML(htmlcontent) {




    http.createServer(function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write('<!doctype html>\n<html lang="en">\n' +
            '\n<meta charset="utf-8">\n<title>Test web page on node.js</title>\n' +
            '<style type="text/css">* {font-family:arial, sans-serif;} table {width: 100%;} img {height: 110px; width: 110px;} </style>\n' +

            formatHTML(htmlcontent) +
                '\n\n');

        res.end();
    }).listen(8083, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:8083');

}




function LoadCSV()
{

    var csv = require("fast-csv");

    csv
        .fromPath("cluster1_total_segments.csv")
        .on("data", function(data){
            //console.log(data);
            //console.log(data[0]);
            //sUsers += "<li><div>" + csvFile[0] + "</div><div>" +    + "</div></li>";

            arrayUsers.push(data[0]);


        })
        .on("end", function(){
            console.log("done");

            getTwitterHandles(arrayUsers);

        });

}



function getTwitterHandles(arrayData)
{

    var params  = {'screen_name': arrayData.showRangeAsString(2,101)};

    // bulk user search
    var path    = "users/lookup";

    client.get(path, params, twitterResponse);

    /*

    for (var i in arrayData)
    {
        //console.log(arrayData[i]);

        // per user search
        var path    = "users/show";

        client.get(path, params, twitterResponse);

    }

    */
}







function twitterResponse(error, response)
{
    if (!error) {

        //console.log(response);

        arrayUsersData = response;

        parseUserTwitterData(arrayUsersData);
    }
    else {
        console.log("Error : " + error[0].message + " Code : " + error[0].code);
    }
}



Array.prototype.showRangeAsString = function(iStartAmt, iFinishAmt){

    var mystring = "";

    for (var i=(iStartAmt-1); i<iFinishAmt; i++){

        //console.log(this[i]);

        mystring += this[i] + ((i+1) == iFinishAmt ? "" : ",");

    }

    //console.log(mystring);

    return mystring;
}






function parseUserTwitterData(arrayTwitterData){

    var sImageURL               = "image_url";          //profile_image_url
    var sUserID                 = "id";                 //id
    var sScreenName             = "screen_name";        //screen_name
    var sProfileURL             = "profile_url";        //http://twitter.com/screen_name
    var sFollowersAmt           = "followers_amount";   //followers_count
    var sName                   = "name";               //name
    var sLocation               = "location";           //location
    var sDescription            = "description";        //description


    for (var users in arrayTwitterData) {



        var jsonUserData                 = {};
        jsonUserData[sImageURL]          = (arrayTwitterData[users].profile_image_url != undefined ? arrayTwitterData[users].profile_image_url.split("_normal").join("") : arrayTwitterData[users].profile_image_url);
        jsonUserData[sUserID]            = arrayTwitterData[users].id;
        jsonUserData[sScreenName]        = arrayTwitterData[users].screen_name;
        jsonUserData[sProfileURL]        = "http://twitter.com/" + arrayTwitterData[users].screen_name;
        jsonUserData[sFollowersAmt]      = arrayTwitterData[users].followers_count;
        jsonUserData[sName]              = arrayTwitterData[users].name;
        jsonUserData[sLocation]          = arrayTwitterData[users].location;
        jsonUserData[sDescription]       = arrayTwitterData[users].description;

        //console.log(jsonUserData[sImageURL]);

       arrayUserTwitterData.push(jsonUserData);
    }

    //formatHTML(arrayUserTwitterData);
    LoadHTML(arrayUserTwitterData);
}




function formatHTML(formatdata) {

    var sTable = "<table><thead><td>Twitter ID</td><td>Image</td><td>Name</td><td>Screen Name</td><td>Followers</td><td>Location</td><td>Description</td><td>Useful</td><td>Gender</td><td>Age</td><td>Education</td><td>Children</td><td>Marital Status</td><td>Ethnicity</td><td>Occupation</td></thead>";


    for (var k in formatdata) {

        sTable  += "<tr>"
                +  "<td>" + formatdata[k].id + "</td>"
                +  "<td><img src='" + formatdata[k].image_url + "' border='1' /></td>"
                +  "<td>" + formatdata[k].name + "</td>"
                +  "<td><a href='" + formatdata[k].profile_url + "' target='_blank'>" + formatdata[k].screen_name + "</a></td>"
                +  "<td>" + formatdata[k].followers_amount + "</td>"
                +  "<td>" + formatdata[k].location + "</td>"
                +  "<td>" + formatdata[k].description + "</td>"
                +  "<td><select><option value=''>Valid</option><option value='valid'>Yes</option> <option value='invalid'>No</option> </select></td>"
                +  "<td><select><option value=''>Gender</option><option value='male'>Male</option> <option value='femail'>Female</option> </select></td>"
                +  "<td><select><option value=''>Age</option><option value='<18'><18</option> <option value='18-24'>18-24</option><option value='25-34'>25-34</option> <option value='35-49'>35-49</option><option value='50+'>50+</option></select></td>"
                +  "<td><select><option value=''>Education</option><option value='high school'>High School</option> <option value='graduated high school'>Graduated High School</option><option value='in college'>In College</option> <option value='graduated college'>Graduated College</option></select></td>"
                +  "<td><select><option value=''>Children</option><option value='has children'>Has Children</option> <option value='no children'>No Children</option> </select></td>"
                +  "<td><select><option value=''>Marital Status</option><option value='in relationship'>In Relationship</option> <option value='single'>Single</option> </select></td>"
                +  "<td><select><option value=''>Ethnicity</option><option value='african american'>African American</option> <option value='asian american'>Asian American</option><option value='caucasian'>Caucasian</option><option value='hispanic'>Hispanic</option> </select></td>"
                +  "<td><select><option value=''>Occupation</option><option value='unemployed'>Unemployed</option> <option value='minimum wage'>Minimum Wage</option><option value='corporate'>Corporate</option><option value='student'>Student</option> </select></td>"
                +  "</tr>"

    }

    sTable += "<tfoot><td colspan='14'><input type='button' value='Load Next Results' style='font-size: 22px; float: left;'><input type='button' value='Save' style='font-size: 22px; float: right;'> </td> </tfoot></table>";

    return sTable;
}

////////////////////////////////////////////////
//
// Compares two arrays shows the differences
//
////////////////////////////////////////////////

function validateTwitterUsers(a, b) {

    var seen = [], diff = [];
    for ( var i = 0; i < b.length; i++)
        seen[b[i]] = true;
    for ( var i = 0; i < a.length; i++)
        if (!seen[a[i]])
            diff.push(a[i]);
    return diff;
}









LoadCSV();










/*
var http = require('http');

http.createServer(function (req, res) {
    // parse URL
    var url_parts = url.parse(req.url);
    console.log(url_parts);
    if(url_parts.pathname == '/') {
        // file serving
        fs.readFile('./index.html', function(err, data) {
            res.end(data);
        });
    } else if(url_parts.pathname.substr(0, 5) == '/poll') {
        // polling code here
    }
}).listen(8081, 'localhost');
console.log('Server running.');

*/

/*

var http = require('http'),
    url = require('url'),
    fs = require('fs');

var jsdom = require('jsdom');

http.createServer(function (req, res) {
    fs.readFile('./index.html', function(err, data) {
        res.end(data);
    });
}).listen(8083, 'localhost');
console.log('Server running.');

*/
