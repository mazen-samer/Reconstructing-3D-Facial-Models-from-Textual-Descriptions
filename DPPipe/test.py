from deepface import DeepFace
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
from PIL import Image

img1 = cv2.imread("../server/static/imgs/employee-24.png")
plt.imshow(img1[:, :, ::-1])
plt.show()

img_path = "../server/static/imgs/employee-24.png"
img_folder_path = "../server/static/imgs"

# dfs = DeepFace.find(
#     img_path="../server/static/imgs/images (1).png",
#     db_path="../server/static/imgs",
#     enforce_detection=False,
# )
# print(dfs)
# metrics = ["cosine", "euclidean", "euclidean_l2"]
# models = [
#     "VGG-Face",
#     "Facenet",
#     "Facenet512",
#     "OpenFace",
#     "DeepFace",
#     "DeepID",
#     "ArcFace",
#     "Dlib",
#     "SFace",
# ]
# backends = ["opencv", "ssd", "dlib", "mtcnn", "retinaface", "mediapipe"]


# def multi_compare(image, path):
#     suspects = []

#     # Iterate over each file in the directory
#     for filename in os.listdir(path):
#         img_path = os.path.join(path, filename)

#         # Ensure the file is an image file
#         if not os.path.isfile(img_path) or not any(
#             img_path.endswith(ext) for ext in [".png", ".jpg", ".jpeg"]
#         ):
#             continue

#         # Read the image using OpenCV
#         image2 = cv2.imread(img_path)

#         # Check if the image was read successfully
#         if image2 is None:
#             print(f"Error reading image: {img_path}")
#             continue

#         # Verify the faces in the two images
#         result = DeepFace.verify(
#             image,
#             image2,
#             distance_metric=metrics[2],
#             model_name=models[2],
#             detector_backend=backends[4],
#             enforce_detection=False,
#         )

#         # If the faces are verified, add the suspect image to the list
#         if result["verified"]:
#             suspects.append(img_path)

#     return suspects


# # Call the multi_compare function with the appropriate image and path
# suspects = multi_compare(img1, "../server/static/imgs")
# print(suspects)
