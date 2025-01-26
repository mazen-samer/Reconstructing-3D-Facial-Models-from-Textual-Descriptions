from flask import Flask, jsonify, request
from compare import get_imgs

app = Flask(__name__)


@app.route("/api/compare/<img>", methods=["GET"])
def compare_img(img):
    try:
        imgs = get_imgs(img)
        return {"status": "success", "data": imgs[:5]}, 200
    except Exception as e:
        return {
            "status": "failed",
            "message": "There was an error while getting the images",
            "error": str(e),
        }, 500


if __name__ == "__main__":
    app.run(port=5002)
