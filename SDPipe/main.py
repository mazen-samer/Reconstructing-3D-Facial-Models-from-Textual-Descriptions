from diffusers import StableDiffusionPipeline
# import torch

# model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained('./stable-diffusion-v1-4', revision="fp16")
pipe = pipe.to('cpu')

prompt = "a photo of a man with beard and bald"
image = pipe(prompt).images[0]
    
image.save("demo.png")