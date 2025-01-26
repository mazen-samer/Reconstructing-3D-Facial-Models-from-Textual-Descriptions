import argparse
import os
from flask import Flask, jsonify, request
from run_basics import generate
from demo import main

app = Flask(__name__)

output_dir = "../server/static/3dobjs"
input_dir = "../server/static/generated"

gpu = "-1"
is_dlib = True
is_3d = True
is_mat = True
is_kpt = False
is_pose = False
is_show = False
is_image = False
is_front = False
is_depth = False
is_texture = True
is_mask = False
texture_size = 256


@app.route("/api/generate3d/<img>", methods=["GET"])
def generate3d(img):
    try:
        args = argparse.Namespace(
            inputDir=os.path.join(input_dir, img),
            outputDir=output_dir,
            gpu=gpu,
            isDlib=is_dlib,
            is3d=is_3d,
            isMat=is_mat,
            isKpt=is_kpt,
            isPose=is_pose,
            isShow=is_show,
            isImage=is_image,
            isFront=is_front,
            isDepth=is_depth,
            isTexture=is_texture,
            isMask=is_mask,
            texture_size=texture_size,
        )
        main(args)
        # generate(os.path.join(input_dir, img), output_dir)
        return {"status": "success", "message": "Object generated successfully"}, 200
    except Exception as e:
        return {
            "status": "failed",
            "message": "There was an error while generating the object",
            "error": str(e),
        }, 500


if __name__ == "__main__":
    app.run(port=5003)
