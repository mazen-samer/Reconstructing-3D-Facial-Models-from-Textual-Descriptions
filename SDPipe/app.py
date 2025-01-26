from flask import Flask, jsonify, request
from generate import generate_img

app = Flask(__name__)


@app.route("/api/generateImage", methods=["POST"])
def generateImage():
    try:
        name = request.json["img-id"]
        img_path = f"../server/static/generated/{name}"
        generate_img(request.json["description"], img_path)
    except Exception as e:
        return jsonify({"msg": str(e), "status": "failed"}), 500
    path = f"static/generated/{name}"
    return (
        jsonify({"status": "success", "message": "Image generated", "path": path}),
        200,
    )


if __name__ == "__main__":
    app.run(port=5001)
