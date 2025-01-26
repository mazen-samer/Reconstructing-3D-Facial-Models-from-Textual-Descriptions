import sys
import os

# appending a path
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
sys.path.append(parent_dir)

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from routes import configure_routes
from dotenv import load_dotenv
from models import *


# Starting the server app
app = Flask(__name__, static_url_path="/static")
CORS(app)

# Import vnv Variables
load_dotenv()
SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
SWAGGER_URL = os.getenv("SWAGGER_URL")
SWAGGER_LOCAL_PATH = os.getenv("SWAGGER_LOCAL_PATH")

# Initializing SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
db.init_app(app)

# Swagger setup
swagger_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL, SWAGGER_LOCAL_PATH, config={"app_name": "Graduation Project API"}
)
app.register_blueprint(swagger_blueprint, url_prefix=SWAGGER_URL)

# Routes
configure_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
