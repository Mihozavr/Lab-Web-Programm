var mydb = openDatabase("bicycles_rental_db", "0.1", "Bicycles database", 1024 * 1024);
mydb.transaction(function(t) {
    t.executeSql("CREATE TABLE IF NOT EXISTS bicycles_rental (id INTEGER PRIMARY KEY ASC, point TEXT, name TEXT, tel TEXT, date TEXT, bykePrice TEXT, start_time TEXT)");
});
if (!mydb) { alert("Failed to connect to database."); }

var bykePrice;

function AddToDataBase() {
    var point = document.getElementById("point").value;
    var name = document.getElementById("name").value;
    var tel = document.getElementById("tel").value;
    var date = document.getElementById("date").value;

    mydb.transaction(function(t) {
        t.executeSql("INSERT INTO bicycles_rental (point, name, tel, date, bykePrice, start_time) VALUES (?, ?, ?, ?, ?, ?)", [point, name, tel, date, bykePrice, 0]);
    });
}

function viewForm(a) {
    bykePrice = a;
    document.getElementById("request-form").style.visibility = "visible";
}
