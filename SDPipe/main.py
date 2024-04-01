from diffusers import StableDiffusionPipeline
import PIL.Image
# import torch

# model_id = "runwayml/stable-diffusion-v1-5"


def generate_img(prompt: str, id: str):
    pipe = StableDiffusionPipeline.from_pretrained(
        './stable-diffusion-v1-4', revision="fp16")
    pipe = pipe.to('cpu')

    image: PIL.Image.Image = pipe(prompt).images[0]
    image.save("demo.png", fp=f"../server/static/generated/{id}")


if __name__ == "__main__":
    prompt = "a photo of a man with beard and bald"
    generate_img(prompt, "demo")
