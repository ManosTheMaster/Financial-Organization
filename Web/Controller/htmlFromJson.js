const sqlite3 = require('sqlite3').verbose();

module.exports = {
    createJsonFiles : function(){
        // open database
        let db = new sqlite3.Database('./../Model/Database/costs.sqlite', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the costs SQlite database.');
        });
    
        db.serialize(() => {
            var list = [];
            db.each(`PRAGMA table_info(costs)`, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
                createDataBy(row.name); //Create Json files with the name of columns.json
                list.push(row.name);
                createFile(list, 'columns'); //Create Json file which stores the files
            });
        });

        // close the database connection
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }
}

function createDataBy(orderColumn){
    const sqlite3 = require('sqlite3').verbose();
    // open database
    let db = new sqlite3.Database('./../Model/Database/costs.sqlite', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the costs SQlite database.');
    });
        
    db.serialize(() => {
        var list = [];
        db.each(`SELECT DISTINCT ` + orderColumn + ` FROM costs ORDER BY ` + orderColumn, (err, row) => {//Alpharithmetical order
            if (err) {
                console.error(err.message);
            }
            list.push(row[orderColumn]);
            createFile(list, orderColumn);
        });
    });
    
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function createFile(output, fileName){
    var path = "./../Model/Json/" + fileName + ".json";
    const fs = require('fs');
    const content = JSON.stringify(output);
    fs.writeFile(path, content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    }); 
}