console.log('hello from nodejs-geo');

var express = require('express');
var http = require('http');
var platform = require('platform'),
    ua_parser = require('ua-parser'),
    fs = require('fs'),
    url = require('url');

var app = express();
app.get('/', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    var usrAgent = req.headers["user-agent"];
    var info = platform.parse(usrAgent);

    res.write("" + usrAgent + "\n");
    res.write("<h3><u>Client with platformjs</u></h5><div>");
    res.write("" + info.name + "</br>");
    res.write("" + info.version + "</br>");
    res.write("" + info.os + "</br>");
    res.write("" + info.product + "</br>");
    res.write("</div></br>");
    res.write("<h3><u>Client with ua-parser</u></h5><div>");
    res.write("" + ua_parser.parse(usrAgent) + "</br>");
    res.write("" + ua_parser.parseOS(usrAgent) + "</br>");
    res.write("" + ua_parser.parseDevice(usrAgent) + "</br>");

    /*
    var extServerOptions = {
        host: 'ip-api.com',
        port: '80',
        path: '/json',
        method: 'GET'
    };
        
    function get() {
        http.request(extServerOptions, function (data) {
            data.on('data', function (data) {
                var geo = JSON.parse(data);
                //console.log(geo);
                res.write("lon:"+geo.lon+"\n");
                res.write("lat:"+geo.lat+"\n");
                res.write("city:"+geo.city+"\n");
                res.write("country:"+geo.country+"\n");
                res.write("zip:"+geo.zip+"\n");
                res.end("[DONE2]");
            });
     
        }).end();
    }

    get();
    */

    res.write("<a href='./geo'>Geolocation</a><br><br>");
    res.write("<a href='./qr'>QRCode</a><br><br>");
    res.write("<a href='./ua'>UA Parser</a><br><br>");
    res.end("[DONE]");
});


app.get('/geo', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    fs.readFile('./html/geo.html', function(err, html) {
        if (err) {
            throw err;
        }

        res.write(html);
        res.end();
    });
});

app.get('/qr', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    fs.readFile('./html/qr.html', function(err, html) {
        if (err) {
            throw err;
        }

        res.write(html);
        res.end();
    });
});

app.get('/ua', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    fs.readFile('./html/ua.html', function(err, html) {
        if (err) {
            throw err;
        }

        res.write(html);
        res.end();
    });
});

app.get('/excel', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    fs.readFile('./html/excel.html', function(err, html) {
        if (err) {
            throw err;
        }

        res.write(html);
        res.end();
    });
});

function getMtId() {
    const symbols = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

    var mtId = '';
    for (i = 0; i < 16; i++) {
        var loc = Math.floor(Math.random() * symbols.length);
        var ch = symbols.charAt(loc);
        mtId += ch;
    }

    return mtId;
}

function getMtIdNumeric(len) {
    const symbols = '1234567890';

    var mtId = '';
    for (i = 0; i < len; i++) {
        var loc = Math.floor(Math.random() * symbols.length);
        var ch = symbols.charAt(loc);
        mtId += ch;
    }

    return mtId;
}

app.get('/push/mexcomm', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/xml" });

    var msisdn = req.query.msisdn;
    if (msisdn == undefined || msisdn == null)
        res.write('<MEXCOMM>' +
            '<MSISDN>' + msisdn + '</MSISDN>' +
            '<MSGID></MSGID>' +
            '<STATUS>401</STATUS>' +
            '</MEXCOMM>');
    else
        res.write('<MEXCOMM>' +
            '<MSISDN>' + msisdn + '</MSISDN>' +
            '<MSGID>' + getMtIdNumeric(16) + '</MSGID>' +
            '<STATUS>0000</STATUS>' +
            '</MEXCOMM>');

    res.end();
});

app.get('/push/mmp', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    var msisdn = req.query.msisdn;
    if (msisdn == undefined || msisdn == null)
        res.write('401');
    else
        res.write(msisdn + ',OK,' + getMtId());

    res.end();
});

app.get('/push/mk', function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    var msisdn = req.query.to;
    if (msisdn == undefined || msisdn == null)
        res.write('401');
    else
        res.write(msisdn + ',' + getMtIdNumeric(10) + ',200');

    res.end();
});

/*
var go=function(res, path) {
    res.writeHead(200, {"Content-Type": "text/html"});
    
    fs.readFile(path, function (err, html) {
        if (err) {
            throw err; 
        }           
    
        res.write(html);  
        res.end();  
    });
}*/

var port = process.env.PORT || 1337;
var server = app.listen(port, function() {
    console.log("running at port:" + port);
});