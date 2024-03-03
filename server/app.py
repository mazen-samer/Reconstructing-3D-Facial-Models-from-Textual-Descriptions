from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import os
from dotenv import load_dotenv
from models import *

# Import vnv Variables 
load_dotenv()
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
SWAGGER_URL = os.getenv('SWAGGER_URL')
SWAGGER_LOCAL_PATH = os.getenv('SWAGGER_LOCAL_PATH')

# Starting the server app
app = Flask(__name__, static_url_path='/static')
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI

CORS(app)
db.init_app(app)

# Swagger setup
swagger_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    SWAGGER_LOCAL_PATH,
    config={"app_name": "Graduation Project API"}
)
app.register_blueprint(swagger_blueprint, url_prefix=SWAGGER_URL)

# Routes
@app.route("/api/getimage/<int:img_id>", methods=["GET"])
def test(img_id):
    image_path = f"static/imgs/img-{img_id}.png"
    return jsonify({"img": image_path})

@app.route("/static/3dobjs/<int:obj_id>")
def testmodel(obj_id):
    return send_from_directory("static/3dobjs", f"3dobj-{obj_id}.obj")

@app.route("/api/getallpeople")
def getallpeople():
    people = Employee.query.all()
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
