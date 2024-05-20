from flask import jsonify, send_from_directory, request
from models import *
from datetime import datetime

# importing module
import SDPipe.generate as generator


def configure_routes(app):
    # Routes
    @app.route("/api/getimage/<int:img_id>", methods=["GET"])
    def test(img_id):
        try:
            image_path = f"static/imgs/img-{img_id}.png"
            return jsonify({"img": image_path, "status": "success"}), 200
        except Exception as e:
            return {"message": str(e), "status": "failed"}

    @app.route("/static/3dobjs/<int:obj_id>")
    def testmodel(obj_id):
        try:
            return send_from_directory("static/3dobjs", f"3dobj-{obj_id}.obj")
        except Exception as e:
            return {"message": str(e), "status": "failed"}

    @app.route("/api/generateImage", methods=["POST"])
    def generateImage():
        try:
            name = request.json["img-id"]
            img_path = f"../server/static/generated/{name}"
            generator.generate_img(request.json["description"], img_path)
        except Exception as e:
            return jsonify({"error": str(e), "status": "failed"}), 500
        path = f"static/generated/{name}"
        return jsonify(
            {"status": "success", "message": "Image generated", "path": path}
        )

    @app.route("/api/getallpeople")
    def getallpeople():
        try:
            people = Employee.query.all()
            people_list = []
            for person in people:
                person_data = {
                    "id": person.id,
                    "name": person.name,
                    "ssn": person.ssn,
                    "dob": person.dob,
                }
                people_list.append(person_data)

            return jsonify({"status": "success", "data": people_list})

        except Exception as e:
            return (
                jsonify({"message": str(e), "status": "failed"}),
                500,
            )  # Return error message and set HTTP status code to 500

    @app.route("/api/findemployee/<ssn>", methods=["GET"])
    def findemployee(ssn):
        try:
            # Convert SSN to string
            ssn = str(ssn)
            employees = Employee.query.filter(Employee.ssn.like(f"%{ssn}%")).all()
            all_employees = []
            for person in employees:
                person_data = {
                    "id": person.id,
                    "name": person.name,
                    "ssn": person.ssn,
                    "dob": person.dob,
                }
                all_employees.append(person_data)
        except Exception as e:
            return jsonify({"status": "failed", "error": str(e)})
        print(all_employees)
        return jsonify({"status": "success", "data": all_employees})

    @app.route("/api/addemployee", methods=["POST"])
    def addemployee():
        data = request.json
        try:
            new_employee = Employee(ssn=data["ssn"], name=data["name"], dob=data["dob"])
            db.session.add(new_employee)
            db.session.commit()
        except Exception as e:
            return jsonify(
                {
                    "status": "failed",
                    "message": "Failed to add employee",
                    "error": str(e),
                }
            )
        return jsonify({"status": "success", "message": "Employee added successfully!"})

    @app.route("/api/addcase", methods=["POST"])
    def addcase():
        data = request.json
        try:
            new_case = Incident(
                description=data["description"], title=data["title"], date=data["date"]
            )
            db.session.add(new_case)
            db.session.commit()
        except Exception as e:
            return jsonify(
                {"status": "failed", "message": "Failed to add case", "error": str(e)}
            )
        return jsonify({"status": "success", "message": "Case added successfully!"})

    @app.route("/api/getemployee/<int:id>", methods=["GET"])
    def getemployee(id):
        try:
            employee = Employee.query.get(id)
            if not employee:
                return (
                    jsonify({"message": "Employee not found", "status": "failed"}),
                    404,
                )
            serialized_employee = {
                "id": employee.id,
                "name": employee.name,
                "ssn": employee.ssn,
                "dob": employee.dob.strftime("%Y-%m-%d"),  # Format date as string
            }
            return jsonify({"data": serialized_employee, "status": "success"})

        except Exception as e:
            return (
                jsonify({"message": str(e), "status": "failed"}),
                500,
            )

    # CORE ROUTES
    @app.route("/api/assign", methods=["POST"])
    def assign_employee_to_incident():
        try:
            # Extract employee_id and incident_id from the request JSON
            data = request.json
            employee_id = data.get("employee_id")
            incident_id = data.get("incident_id")

            # Query the Employee and Incident records based on their IDs
            employee = Employee.query.get(employee_id)
            incident = Incident.query.get(incident_id)

            if not employee or not incident:
                return (
                    jsonify(
                        {
                            "message": "Employee or Incident not found",
                            "status": "failed",
                        }
                    ),
                    404,
                )

            # Create a new Assigned record with the assigned_at attribute set to the current date and time
            assigned_at = datetime.now()
            assignment = Assigned(
                employee_id=employee_id,
                incident_id=incident_id,
                assigned_at=assigned_at,
            )
            db.session.add(assignment)
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Employee assigned to incident successfully",
                        "status": "success",
                    }
                ),
                200,
            )

        except Exception as e:
            db.session.rollback()  # Rollback the transaction in case of error
            return (
                jsonify({"message": str(e), "status": "failed"}),
                400,
            )  # Return error message and set HTTP status code to 400

    @app.route("/api/incidents", methods=["GET"])
    def get_all_incidents():
        try:
            # Query all incidents from the database
            incidents = Incident.query.all()

            # Serialize the incidents to JSON
            serialized_incidents = []
            for incident in incidents:
                serialized_incident = {
                    "id": incident.id,
                    "title": incident.title,
                    "description": incident.description,
                    "date": incident.date.strftime("%Y-%m-%d"),  # Format date as string
                }
                serialized_incidents.append(serialized_incident)

            # Return the serialized incidents as JSON response
            if len(serialized_incidents) == 0:
                return (
                    jsonify({"status": "failed", "message": "No available incidents"}),
                    404,
                )
            else:
                return jsonify({"status": "success", "data": serialized_incidents}), 200

        except Exception as e:
            return (
                jsonify({"message": str(e), "status": "failed"}),
                500,
            )  # Return error message and set HTTP status code to 500 for internal server error

    # available incident to assign for a specific employee
    @app.route("/api/available_incidents/<int:employee_id>", methods=["GET"])
    def get_available_incidents_for_employee(employee_id):
        try:
            # Query the employee to ensure it exists
            employee = Employee.query.get(employee_id)
            if not employee:
                return (
                    jsonify({"message": "Employee not found", "status": "failed"}),
                    404,
                )

            # Query all incidents that haven't been assigned to the specific employee
            available_incidents = Incident.query.filter(
                ~Incident.id.in_(
                    [
                        assignment.incident_id
                        for assignment in Assigned.query.filter_by(
                            employee_id=employee_id
                        )
                    ]
                )
            ).all()

            # Serialize the available incidents to JSON
            serialized_incidents = []
            for incident in available_incidents:
                serialized_incident = {
                    "id": incident.id,
                    "title": incident.title,
                    "description": incident.description,
                    "date": incident.date.strftime("%Y-%m-%d"),  # Format date as string
                }
                serialized_incidents.append(serialized_incident)

            # Return the serialized available incidents as JSON response
            return jsonify({"status": "success", "data": serialized_incidents}), 200

        except Exception as e:
            return (
                jsonify({"message": str(e), "status": "failed"}),
                500,
            )  # Return error message and set HTTP status code to 500 for internal server error

    @app.route("/api/unassign", methods=["POST"])
    def unassign_incident():
        try:
            # Extract incident_id and employee_id from the request JSON
            data = request.json
            employee_id = data.get("employee_id")
            incident_id = data.get("incident_id")

            # Query the assignment to ensure it exists
            assignment = Assigned.query.filter_by(
                employee_id=employee_id, incident_id=incident_id
            ).first()
            if not assignment:
                return (
                    jsonify({"message": "Assignment not found", "status": "failed"}),
                    404,
                )

            # Delete the assignment
            db.session.delete(assignment)
            db.session.commit()

            return (
                jsonify(
                    {"message": "Assignment removed successfully", "status": "success"}
                ),
                200,
            )

        except Exception as e:
            db.session.rollback()  # Rollback the transaction in case of error
            return (
                jsonify({"message": str(e), "status": "failed"}),
                400,
            )  # Return error message and set HTTP status code to 400

    @app.route("/api/last_assigned_case/<ssn>", methods=["GET"])
    def get_last_assigned_case(ssn):
        try:
            # Query the employee based on SSN
            employee = Employee.query.filter_by(ssn=ssn).first()
            if not employee:
                return (
                    jsonify({"message": "Employee not found", "status": "failed"}),
                    404,
                )

            # Query the last assigned case for the employee based on their ID
            last_assignment = (
                Assigned.query.filter_by(employee_id=employee.id)
                .order_by(Assigned.assigned_at.desc(), Assigned.id.desc())
                .first()
            )
            if not last_assignment:
                return (
                    jsonify(
                        {
                            "message": "No assignments found for this employee",
                            "status": "failed",
                        }
                    ),
                    404,
                )

            # Get the incident details for the last assignment
            incident = Incident.query.get(last_assignment.incident_id)

            # Serialize the employee details
            serialized_employee = {
                "id": employee.id,
                "name": employee.name,
                "ssn": employee.ssn,
                # Include other employee details as needed
            }

            # Serialize the incident details
            serialized_incident = {
                "id": incident.id,
                "title": incident.title,
                "description": incident.description,
                "date": incident.date.strftime("%Y-%m-%d"),  # Format date as string
            }

            # Return the serialized employee and incident details as JSON response
            return jsonify(
                {
                    "status": "success",
                    "employee": serialized_employee,
                    "incident": serialized_incident,
                }
            )

        except Exception as e:
            return (
                jsonify({"message": str(e), "status": "failed"}),
                500,
            )  # Return error message and set HTTP status code to 500 for internal server error

    @app.route("/api/assigned_incidents/<int:employee_id>", methods=["GET"])
    def get_assigned_incidents(employee_id):
        try:
            # Query the employee to ensure they exist
            employee = Employee.query.get(employee_id)
            if not employee:
                return (
                    jsonify({"message": "Employee not found", "status": "failed"}),
                    404,
                )

            # Query all assignments for the employee
            assignments = Assigned.query.filter_by(employee_id=employee_id).all()

            # Get the details of each assigned incident
            assigned_incidents = []
            for assignment in assignments:
                incident = Incident.query.get(assignment.incident_id)
                if incident:
                    serialized_incident = {
                        "id": incident.id,
                        "title": incident.title,
                        "description": incident.description,
                        "date": incident.date.strftime(
                            "%Y-%m-%d"
                        ),  # Format date as string
                        "assigned_at": assignment.assigned_at.strftime(
                            "%Y-%m-%d"
                        ),  # Include assignment date
                    }
                    assigned_incidents.append(serialized_incident)

            # Return the serialized incident details as JSON response
            return jsonify({"status": "success", "data": assigned_incidents})

        except Exception as e:
            return (
                jsonify({"error": str(e), "status": "failed"}),
                500,
            )  # Return error message and set HTTP status code to 500 for internal server error
