from diffusers import StableDiffusionPipeline
import PIL.Image
# import torch



def generate_img(prompt: str, id: str):
    model_id = "runwayml/stable-diffusion-v1-5"
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id, revision="fp16")
    pipe = pipe.to('cpu')

    image: PIL.Image.Image = pipe(prompt).images[0]
    image.save(fp=f"../server/static/generated/{id}.png")


if __name__ == "__main__":
    prompt = "a photo of a man with beard and bald"
    generate_img(prompt, "demo")
