from flask import jsonify, send_from_directory
from models import *

def configure_routes(app):
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
