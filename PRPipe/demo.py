import numpy as np
import os
from glob import glob
import scipy.io as sio
from skimage.io import imread, imsave
from skimage.transform import rescale, resize
from time import time
import argparse
import ast

from api import PRN

from utils.estimate_pose import estimate_pose
from utils.rotate_vertices import frontalize
from utils.render_app import get_visibility, get_uv_mask, get_depth_image
from utils.write import write_obj_with_colors, write_obj_with_texture

import cv2
from utils.cv_plot import plot_kpt, plot_vertices, plot_pose_box

import argparse
import ast

import warnings

warnings.filterwarnings("ignore")

# Define static arguments
input_dir = "TestImages/Test"
output_dir = "TestImages/results"
gpu = "-1"
is_dlib = True
is_3d = True
is_mat = True
is_kpt = False
is_pose = False
is_show = False
is_image = False
is_front = True
is_depth = False
is_texture = False
is_mask = False
texture_size = 256


def main(args):

    # ---- init PRN
    os.environ["CUDA_VISIBLE_DEVICES"] = args.gpu  # GPU number, -1 for CPU
    prn = PRN(is_dlib=args.isDlib)

    # ------------- load data
    image_path = args.inputDir
    save_folder = args.outputDir
    if not os.path.exists(save_folder):
        os.mkdir(save_folder)

    landmarks = []

    name = image_path.strip().split("\\")[-1][:-4]

    # read image
    image = imread(image_path)
    [h, w, c] = image.shape
    if c > 3:
        image = image[:, :, :3]

    if image.shape[0] > 450 or image.shape[1] > 450:
        # Load the image
        image = cv2.imread(image_path)

        # Specify the full path to the Haar cascade classifier file
        cascade_path = "E:\GRADUATION_PROJECT\Reconstructing-3D-Facial-Models-from-Textual-Descriptions\PRPipe\haarcascade_frontalface_default.xml"

        # Load the pre-trained Haar Cascade classifier for face detection
        face_cascade = cv2.CascadeClassifier(cascade_path)

        # Convert the image to grayscale (optional, depending on your cascade classifier)
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        if len(faces) < 1:
            raise Exception("Can not detect faces in img")

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

    # the core: regress position map
    if args.isDlib:
        max_size = max(image.shape[0], image.shape[1])
        print(max_size)
        if max_size > 1000:
            image = rescale(image, 1000.0 / max_size)
            image = (image * 255).astype(np.uint8)
        pos = prn.process(image)  # use dlib to detect face
        kpt = prn.get_landmarks(pos)  # Get landmarks for the image
        landmarks.append(kpt)

    else:
        if image.shape[0] == image.shape[1]:
            image = resize(image, (256, 256))
            pos = prn.net_forward(
                image / 255.0
            )  # input image has been cropped to 256x256
        else:
            box = np.array(
                [0, image.shape[1] - 1, 0, image.shape[0] - 1]
            )  # cropped with bounding box
            pos = prn.process(image, box)
            kpt = prn.get_landmarks(pos)  # Get landmarks for the image
            landmarks.append(kpt)

    image = image / 255.0

    if args.is3d or args.isMat or args.isPose or args.isShow:
        # 3D vertices
        vertices = prn.get_vertices(pos)
        if args.isFront:
            save_vertices = frontalize(vertices)
        else:
            save_vertices = vertices.copy()
        save_vertices[:, 1] = h - 1 - save_vertices[:, 1]

    if args.isImage:
        cv2.imshow("Resized Image", image)
        imsave(os.path.join(save_folder, name + ".jpg"), image)

    if args.is3d:
        # corresponding colors
        colors = prn.get_colors(image, vertices)

        write_obj_with_colors(
            os.path.join(save_folder, name + ".obj"),
            save_vertices,
            prn.triangles,
            colors,
        )  # save 3d face(can open with meshlab)

    if args.isDepth:
        depth_image = get_depth_image(vertices, prn.triangles, h, w, True)
        depth = get_depth_image(vertices, prn.triangles, h, w)
        imsave(os.path.join(save_folder, name + "_depth.jpg"), depth_image)
        sio.savemat(os.path.join(save_folder, name + "_depth.mat"), {"depth": depth})

    if args.isMat:
        kpt = prn.get_Transposed_landmarks(pos)
        sio.savemat(
            os.path.join(save_folder, name + "_mesh.mat"),
            {
                "vertices": vertices,
                "colors": colors,
                "triangles": prn.triangles,
                "pt3d_68": kpt,
            },
        )

    if args.isKpt or args.isShow:
        # get landmarks
        kpt = prn.get_landmarks(pos)
        np.savetxt(os.path.join(save_folder, name + "_kpt.txt"), kpt)

    if args.isPose or args.isShow:
        # estimate pose
        camera_matrix, pose = estimate_pose(vertices)
        np.savetxt(os.path.join(save_folder, name + "_pose.txt"), pose)
        np.savetxt(
            os.path.join(save_folder, name + "_camera_matrix.txt"), camera_matrix
        )

        np.savetxt(os.path.join(save_folder, name + "_pose.txt"), pose)

    if args.isShow:
        # ---------- Plot
        image_pose = plot_pose_box(image, camera_matrix, kpt)
        cv2.imshow("sparse alignment (landmarks)", plot_kpt(image, kpt))
        cv2.imshow("dense alignment(vertices)", plot_vertices(image, vertices))
        cv2.imshow("Camera pose", image_pose)
        cv2.waitKey(0)


if __name__ == "__main__":
    args = argparse.Namespace(
        inputDir=os.path.join(input_dir, "generated-1-1.png"),
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
