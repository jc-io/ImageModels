from diffusers import StableDiffusionPipeline
import torch
#https://huggingface.co/runwayml/stable-diffusion-v1-5

class imageGen:
    def __init__(self):
        self.model_id = "runwayml/stable-diffusion-v1-5"
        self.pipe = StableDiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16)
        self.pipe = self.pipe.to("cuda")
    def generate(self,prompt="Didn't work sorry"):
        image = self.pipe(prompt).images[0]  
        return image;
