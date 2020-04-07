var mydb = openDatabase("bicycles_rental_db", "0.1", "Bicycles database", 1024 * 1024);
mydb.transaction(function(t) {
    t.executeSql("CREATE TABLE IF NOT EXISTS bicycles (id INTEGER PRIMARY KEY ASC, point TEXT, name TEXT, tel TEXT, date TEXT, bykePrice TEXT, start_time TEXT)");
});
if (!mydb) { alert("Failed to connect to database."); }

function countCost(transaction, results) {
    
    var start_time = results.rows.item(results.rows.length - 1).start_time;
    var timeInMs = Date.now() - start_time;
    var timeInHours = timeInMs / 1000 / 60 / 60;
    var final_cost = timeInHours * results.rows.item(results.rows.length - 1).bykePrice;

    var listitems = "";
    var listholder = document.getElementById("final-cost");

    listholder.innerHTML = "";
    listholder.innerHTML += "<li>" + "Конечная стоимость проката: " + final_cost + " руб." + "</li>";
}

function StartRental(a) {
    var start_time = Date.now();

    mydb.transaction(function(t) {
        t.executeSql('UPDATE bicycles_rental SET start_time=? WHERE id=(SELECT MAX(iD) FROM bicycles_rental)', [start_time]);
    });
}

function EndRental() {
    mydb.transaction(function(t) {
        t.executeSql("SELECT * FROM bicycles_rental", [], countCost);
    });
}

function checkStart(transaction, results) {
    if (results.rows.item(results.rows.length - 1).start_time != 0.0)
        document.getElementById("end").style.visibility = "visible";
    else document.getElementById("start").style.visibility = "visible";
}

function showButton() {
    mydb.transaction(function(t) {
        t.executeSql("SELECT * FROM bicycles_rental", [], checkStart);
    });
}

showButton();