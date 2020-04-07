var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/index/user_page.html');
});
app.use('/',express.static(__dirname + '/index'));
app.listen(80);

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "1234",
  database: "requests_db"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE PEEVO (id INT AUTO_INCREMENT PRIMARY KEY, start VARCHAR(50), price VARCHAR(50), status BOOLEAN DEFAULT FALSE)";
//     connection.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
// });

app.post('/start/:id', urlencodedParser, function(request, response) {
	var id = request.params.id.substring(1);
	var table_id = id - 1;
	console.log("table_id: " + table_id);
	console.log("id: " + id);
	var d = new Date();
	var time = (d.getHours()*60) + d.getMinutes();
	var status = false;
	console.log("User page loaded.");
	connection.query("select * from PEEVO", function(err, rows) {
		if(rows[table_id].start > 0) status = true;
		console.log("status: " + rows[table_id].status);
		console.log("rows[id].start: " + rows[table_id].start);

		console.log("Check satus.");
		if(status == true)
		{
			console.log("Status equal 1");
			var str = "Price: " + (time - rows[table_id].start)*rows[table_id].price;
			connection.query("UPDATE PEEVO set status='"+ 1 +"' WHERE id='"+ id + "'", function(err, rows) {
				if (err) { console.log(err);
					return;
				}
			});
			response.end(str);
		}
		else
		{
			console.log("Status equal 0");
			connection.query("UPDATE PEEVO set start='"+ time +"' WHERE id='"+ id + "'", function(err, rows) {
				if (err) { console.log(err);
					return;
				}
			});
			response.end(`started`);
		}
	});
});

app.get("/user_page/:id", function (request, response) {
	var id = request.params.id.substring(1);
	var table_id = id - 1;
	console.log("table_id: " + table_id);
	console.log("id: " + id);
	response.write(`<!DOCTYPE html>
	<html>`);
	var value = "Start";
	connection.query("select * from PEEVO", function(err, rows) {
		if(!rows[table_id].status) {
			if(rows[table_id].start > 0) value = "End";
			console.log("status: " + rows[table_id].status);
			console.log("rows[table_id].start: " + rows[table_id].start);

			var req = 
			'<form action="/start/' + request.params.id + '" method="post">' +
			'<input type="submit" value="'+value+'" />' +
			'</form>' +
			" <br>";
			response.write(req);
		
			response.write('</html>');
			response.end();
		}
		else {
			response.end("Served.");
		}
	});
});


app.post("/insert", urlencodedParser, function (request, response) {
	if(!request.body) return response.sendStatus(400);
	var sql = "INSERT INTO PEEVO (start, price) VALUES ('0', '100')";
	connection.query(sql, function(err, rows) {
		if (err){
			console.log(err);
			return;
		}
	});
	var j = 0;
	connection.query("select * from PEEVO", function(err, rows) {				
			for (var i in rows) {
				j = rows[i].id;
			}
			var id = i;
			var str = "localhost/user_page/:"+id;
			response.end(str);
	});	
});
