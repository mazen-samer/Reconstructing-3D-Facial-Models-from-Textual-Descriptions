import os
from diffusers import StableDiffusionPipeline
import PIL.Image
# import torch

def generate_img(prompt: str, id: str):
    model_id = "../SDPipe/stable-diffusion-v1-4"
    if not os.path.isdir(model_id):
        raise Exception("aaaaaaaaaaaaaaaaaa")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id, variant='fp16', local_files_only=True)
    pipe = pipe.to('cpu')

    image: PIL.Image.Image = pipe(prompt).images[0]
    image.save(f"{id}.png")


if __name__ == "__main__":
    prompt = "a photo of a man with beard and bald"
    generate_img(prompt, "demo2")
