from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_swagger_ui import get_swaggerui_blueprint


app = Flask(__name__, static_url_path='/static')
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost/Grad-project"

db = SQLAlchemy(app)
CORS(app)

# SWAGGER SETUP
swagger_blueprint = get_swaggerui_blueprint(
    "/swagger",
    "/static/swagger.json",
    config={"app_name": "Graduation Project API"}
)
app.register_blueprint(swagger_blueprint, url_prefix='/swagger')

# MODELS
class People(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    ssn = db.Column(db.String(100))
    dob = db.Column(db.Date)



@app.route("/api/getimage/<int:img_id>", methods=["GET"])
def test(img_id):
    image_path = f"static/imgs/img-{img_id}.png"
    return jsonify({"img": image_path})

@app.route("/static/3dobjs/<int:obj_id>")
def testmodel(obj_id):
    return send_from_directory("static/3dobjs", f"3dobj-{obj_id}.obj")

@app.route("/api/getallpeople")
def getallpeople():
    people = People.query.all()
    print(people[0].name)
    people_list = []
    for person in people:
        person_data = {
            'id': person.id,
            'name': person.name,
            'ssn': person.ssn,
            'dob': person.dob
        }
        people_list.append(person_data)
    return jsonify(people_list)


if __name__ == "__main__":
    app.run(debug=True)
