from flask import jsonify, send_from_directory, request
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from datetime import timedelta
from models import *
import requests
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv


# importing modules
# import SDPipe.generate as generator
# import DPPipe.compare as compare


UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "static", "imgs"
)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
load_dotenv()
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def configure_routes(app):
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    jwt = JWTManager(app)
    # app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    jwt.default_auth_token_expires = timedelta(days=365 * 100)
    app.config["JWT_DEBUG"] = True

    @jwt.expired_token_loader
    def expired_token_callback(token):
        return jsonify({"message": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Invalid token", "error": error}), 401

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({"message": "Unauthorized", "error": error}), 401

    # Client
    @app.route("/api/getimage/<int:img_id>", methods=["GET"])
    def test(img_id):
        try:
            image_path = f"static/imgs/img-{img_id}.png"
            return jsonify({"img": image_path, "status": "success"}), 200
        except Exception as e:
            return {"message": str(e), "status": "failed"}

    @app.route("/static/3dobjs/<int:obj_id>")
    # @jwt_required()
    def testmodel(obj_id):
        try:
            current_user = get_jwt_identity()
            print(f"User {current_user} is accessing get_image")
            return send_from_directory("static/3dobjs", f"{obj_id}")
        except Exception as e:
            return {"message": str(e), "status": "failed"}

    @app.route("/api/generateImage", methods=["POST"])
    # @jwt_required()
    def generateImage():
        try:
            name = request.json["img-id"]
            description = request.json["description"]
            response = requests.post(
                "http://localhost:5001/api/generateImage",
                json={"img-id": name, "description": description},
            )
        except Exception as e:
            return jsonify(
                {
                    "message": "Something went wrong in this microservice.",
                    "error": e,
                }
            )
        return response.json()

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
            access_token = create_access_token(identity=employee.ssn)
            # Return the serialized employee and incident details as JSON response
            return jsonify(
                {
                    "status": "success",
                    "employee": serialized_employee,
                    "incident": serialized_incident,
                    "access_token": access_token,
                }
            )

        except Exception as e:
            return (
                jsonify({"message": str(e), "status": "failed"}),
                500,
            )  # Return error message and set HTTP status code to 500 for internal server error

    @app.route("/api/compare/<img>", methods=["GET"])
    # @jwt_required()
    def compare_img(img):
        try:
            response = requests.get(f"http://localhost:5002/api/compare/{img}")
        except Exception as e:
            return jsonify(
                {
                    "message": "Something went wrong in this microservice.",
                    "error": e,
                }
            )
        return response.json()

    @app.route("/api/save_testimonial", methods=["POST"])
    # @jwt_required()
    def save_testimonial():
        try:
            data = request.json
            employee_id = data.get("employee_id")
            criminal_id = data.get("criminal_id")
            incident_id = data.get("incident_id")
            testimonial_text = data.get("testimonial_text")

            if not (employee_id and incident_id and testimonial_text):
                return (
                    jsonify({"message": "Missing required fields", "status": "failed"}),
                    400,
                )

            employee = Employee.query.get(employee_id)
            if not employee:
                return (
                    jsonify({"message": "Employee not found", "status": "failed"}),
                    404,
                )

            incident = Incident.query.get(incident_id)
            if not incident:
                return (
                    jsonify({"message": "Incident not found", "status": "failed"}),
                    404,
                )

            testimonial = Testimonial(
                employee_id=employee_id,
                criminal_id=criminal_id,
                incident_id=incident_id,
                testimonial_text=testimonial_text,
            )
            db.session.add(testimonial)

            if criminal_id:
                suspect = Employee.query.get(criminal_id)
                if not suspect:
                    return (
                        jsonify({"message": "Suspect not found", "status": "failed"}),
                        404,
                    )

                new_suspect = Suspect(suspect_id=criminal_id, incident_id=incident_id)
                db.session.add(new_suspect)

            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Testimonial and suspect added successfully",
                        "status": "success",
                    }
                ),
                200,
            )

        except Exception as e:
            db.session.rollback()
            return (
                jsonify(
                    {
                        "error": str(e),
                        "status": "failed",
                        "message": "Could'nt add testimonial.",
                    }
                ),
                500,
            )

    @app.route("/api/generate3d/<img>", methods=["GET"])
    def generat3d(img):
        try:
            response = requests.get(f"http://localhost:5003/api/generate3d/{img}")
        except Exception as e:
            return jsonify(
                {
                    "message": "Something went wrong in this microservice.",
                    "error": e,
                }
            )
        return response.json()

    @app.route("/api/unassign_employee/<int:employee_id>", methods=["DELETE"])
    def unassign_employee(employee_id):
        try:
            # Query all assignments for the given employee_id
            assignments = Assigned.query.filter_by(employee_id=employee_id).all()

            if not assignments:
                return (
                    jsonify(
                        {
                            "message": "No assignments found for this employee",
                            "status": "failed",
                        }
                    ),
                    404,
                )

            # Delete all assignments for the employee
            for assignment in assignments:
                db.session.delete(assignment)

            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "All assignments unassigned successfully",
                        "status": "success",
                    }
                ),
                200,
            )

        except Exception as e:
            db.session.rollback()
            return (
                jsonify(
                    {
                        "error": str(e),
                        "status": "failed",
                        "message": "Could'nt unassign employee",
                    }
                ),
                500,
            )

    # Dashboard
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
        if "file" not in request.files:
            return jsonify({"status": "failed", "message": "No file attached"}), 400

        file = request.files["file"]

        if file.filename == "":
            return (
                jsonify({"status": "failed", "message": "No selected file was sent"}),
                400,
            )

        if not allowed_file(file.filename):
            return (
                jsonify({"status": "failed", "message": "File type not allowed"}),
                400,
            )

        data = request.form
        try:
            print(UPLOAD_FOLDER)
            employee = Employee.query.filter_by(ssn=data.get("ssn")).first()
            if employee:
                return (
                    jsonify(
                        {
                            "message": "There exists an employee with the same SSN",
                            "status": "failed",
                        }
                    ),
                    406,
                )

            new_employee = Employee(ssn=data["ssn"], name=data["name"], dob=data["dob"])
            db.session.add(new_employee)
            db.session.flush()  # Ensure the ID is generated without committing

            # Generate filename with the new employee id
            employee_id = new_employee.id
            filename = secure_filename(f"employee-{employee_id}.png")
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            db.session.commit()

        except Exception as e:
            db.session.rollback()  # Roll back the transaction on error
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "Failed to add employee",
                        "error": str(e),
                    }
                ),
                500,
            )

        return (
            jsonify({"status": "success", "message": "Employee added successfully!"}),
            200,
        )

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
            print(employee)
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

    @app.route("/api/getincident/<int:id>", methods=["GET"])
    def get_incident(id):
        try:
            incident = Incident.query.get(id)
            if not incident:
                return (
                    jsonify({"message": "Incident not found", "status": "failed"}),
                    404,
                )

            serialized_incident = {
                "id": incident.id,
                "title": incident.title,
                "description": incident.description,
                "date": incident.date.strftime("%Y-%m-%d"),  # Format date if needed
            }
            return jsonify({"data": serialized_incident, "status": "success"})

        except Exception as e:
            return jsonify({"message": str(e), "status": "failed"}), 500

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

    @app.route("/api/testimonials/<int:incident_id>", methods=["GET"])
    def get_testimonials_by_incident(incident_id):
        try:
            # Query all testimonials for the given incident_id
            testimonials = Testimonial.query.filter_by(incident_id=incident_id).all()

            if not testimonials:
                return (
                    jsonify(
                        {
                            "message": "No testimonials found for this incident",
                            "status": "failed",
                        }
                    ),
                    404,
                )

            # Serialize each testimonial's details
            serialized_testimonials = []
            for testimonial in testimonials:
                employee = Employee.query.get(testimonial.employee_id)
                criminal = (
                    Employee.query.get(testimonial.criminal_id)
                    if testimonial.criminal_id
                    else None
                )

                testimonial_data = {
                    "id": testimonial.id,
                    "testimonial_text": testimonial.testimonial_text,
                    "employee": {
                        "id": employee.id,
                        "name": employee.name,
                        "ssn": employee.ssn,
                        "dob": employee.dob.strftime("%Y-%m-%d"),
                    },
                    "criminal": (
                        {
                            "id": criminal.id,
                            "name": criminal.name,
                            "ssn": criminal.ssn,
                            "dob": criminal.dob.strftime("%Y-%m-%d"),
                        }
                        if criminal
                        else None
                    ),
                    "incident_id": testimonial.incident_id,
                }
                serialized_testimonials.append(testimonial_data)

            return (
                jsonify({"status": "success", "data": serialized_testimonials}),
                200,
            )

        except Exception as e:
            return jsonify({"error": str(e), "status": "failed"}), 500
