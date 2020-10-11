import sqlite3
from flask import Flask,jsonify

#Create an app, being sure to pass __name__
app = Flask(__name__)


@app.route("/api/v1.0/table")
def get_table():
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d
 
    connection = sqlite3.connect("us_housing_db.sqlite")
    connection.row_factory = dict_factory
 
    cursor = connection.cursor()
    cursor.execute("select * from housing_10to19")
 
    # fetch all or one we'll go for all.
    results = cursor.fetchall()
    connection.close()
 
    return jsonify(results)
 
# this part must be placed at the end of the file!!	
if __name__ == '__main__':
    app.run(debug=True)