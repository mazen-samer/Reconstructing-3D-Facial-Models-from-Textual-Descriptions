
from flask import jsonify, send_from_directory, request
from models import *

# importing module
import SDPipe.generate as generator

def configure_routes(app):
    # Routes
    @app.route("/api/getimage/<int:img_id>", methods=["GET"])
    def test(img_id):
        image_path = f"static/imgs/img-{img_id}.png"
        return jsonify({"img": image_path})

    @app.route("/static/3dobjs/<int:obj_id>")
    def testmodel(obj_id):
        return send_from_directory("static/3dobjs", f"3dobj-{obj_id}.obj")

    @app.route("/api/generateImage", methods=["POST"])
    def generateImage():
        try:
            generator.generate_img(request.json["prompt"], f"./server/static/generated/{request.json['img-id']}")
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        return jsonify({"success": True})

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
    

    @app.route("/api/findemployee/<ssn>", methods=["GET"])
    def findemployee(ssn):
        try:
            # Convert SSN to string
            ssn = str(ssn)
            employees = Employee.query.filter(Employee.ssn.like(f'%{ssn}%')).all()
            all_employees = []
            for person in employees:
                person_data = {
                    'id': person.id,
                    'name': person.name,
                    'ssn': person.ssn,
                    'dob': person.dob
                }
                all_employees.append(person_data)
        except Exception as e:
            return jsonify({"status": "failed", "error": str(e)})
        print(all_employees)
        return jsonify({"status":"success", "data":all_employees})
    
    @app.route("/api/addemployee", methods=["POST"])
    def addemployee():
        data = request.json
        try:
            new_employee = Employee(ssn=data["ssn"], name=data["name"], dob=data["dob"])
            db.session.add(new_employee)
            db.session.commit()
        except Exception as e:
            return jsonify({"status":"failed", "message":"Failed to add employee", "error":str(e)})
        return jsonify({"status":"success", "message": "Employee added successfully!"})
    
    @app.route("/api/addcase", methods=["POST"])
    def addcase():
        data = request.json
        try:
            new_case = Incident(description=data["description"], name=data["name"], date=data["date"])
            db.session.add(new_case)
            db.session.commit()
        except Exception as e:
            return jsonify({"status":"failed", "message":"Failed to add case", "error":str(e)})
        return jsonify({"status":"success", "message": "Case added successfully!"})

