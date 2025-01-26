import numpy as np
import os
from glob import glob
import scipy.io as sio
from skimage.io import imread, imsave
from time import time
import cv2
from skimage.transform import rescale, resize

from api import PRN
from utils.write import write_obj_with_colors_texture
from utils.rotate_vertices import frontalize
from utils.render_app import get_visibility, get_uv_mask, get_depth_image

# ---- init PRN
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # GPU number, -1 for CPU
prn = PRN(is_dlib=True)


def generate(image_path, save_folder):
    landmarks = []

    image = imread(image_path)
    [h, w, c] = image.shape
    if c > 3:
        image = image[:, :, :3]

    if image.shape[0] > 450 or image.shape[1] > 450:
        print(image.shape)
        # Load the image
        image = cv2.imread(image_path)

        # Specify the full path to the Haar cascade classifier file
        cascade_path = "haarcascade_frontalface_default.xml"
        # Load the pre-trained Haar Cascade classifier for face detection
        face_cascade = cv2.CascadeClassifier(cascade_path)

        # Convert the image to grayscale (optional, depending on your cascade classifier)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        print(gray.shape)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        # Process each detected face
        for x, y, w, h in faces:
            # Draw a rectangle around the face (optional, for visualization)
            # cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)

            # Crop the face region
            face_roi = image[y : y + h, x : x + w]

            # Resize the face region to 450x450 pixels
            resized_face = cv2.resize(face_roi, (450, 450))
            rgb_face = cv2.cvtColor(resized_face, cv2.COLOR_BGR2RGB)

        image = rgb_face
        image = image.astype(np.uint8)
        print(image.shape)
    
    pos = prn.process(image)  # use dlib to detect face
    kpt = prn.get_landmarks(pos)
    landmarks.append(kpt)

    image = image / 255.0

    # 3D vertices
    vertices = prn.get_vertices(pos)
    save_vertices = frontalize(vertices)
    save_vertices[:, 1] = h - 1 - save_vertices[:, 1]

    # corresponding colors
    colors = prn.get_colors(image, vertices)


    pos_interpolated = pos.copy()
    texture = cv2.remap(
        image,
        pos_interpolated[:, :, :2].astype(np.float32),
        None,
        interpolation=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0),
    )

    # -- save
    name = image_path.strip().split("\\")[-1][:-4]

    write_obj_with_colors_texture(
                f"{save_folder}/{name}.obj",
                save_vertices,
                colors,
                prn.triangles,
                texture,
                prn.uv_coords / prn.resolution_op,
            )  # save 3d face with texture(can open with meshlab)



if __name__ == "__main__":
    save_folder = "3dobjs"
    image_folder = "E:/test"
    output_dir = "../server/static/3dobjs"
    input_dir = "../server/static/generated\\generated-2-2.png"
    generate(input_dir, output_dir)
