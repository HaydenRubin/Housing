import sqlite3
from flask import Flask,jsonify,render_template,redirect


#Create an app, being sure to pass __name__
app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/house-values")
def value():
    return render_template('racing_bar.html')
    
@app.route("/heating_fuel")
def fuel():
    return render_template('dot_plot.html')

@app.route("/smocapi")
def smocapi():
    return render_template('line_and_scatter.html')

@app.route("/api/v1.0/table")
def get_table():
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d
 
    connection = sqlite3.connect("ushousing_db.sqlite")
    connection.row_factory = dict_factory
 
    cursor = connection.cursor()
    cursor.execute("select * from ushousing_10to19")
 
    # fetch all or one we'll go for all.
    results = cursor.fetchall()
    connection.close()
 
    return jsonify(results)
 
# this part must be placed at the end of the file!!	
if __name__ == '__main__':
    app.run(debug=True)