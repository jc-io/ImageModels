from diffusers import StableDiffusionPipeline #latest version tranformers (clips)
from diffusers import DiffusionPipeline # slow version
import torch
from PIL import Image

#https://huggingface.co/runwayml/stable-diffusion-v1-5
#fast stable diff model

class imageGenFast:
    def __init__(self):
        self.model_id = "runwayml/stable-diffusion-v1-5"
        
        self.pipe = StableDiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16,safety_checker = None)
        # self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()  #faster option?
    def generate(self,prompt="No prompt given"):
        image = self.pipe(prompt).images[0]  
        image.save(prompt+".png");
        return image;

class imageGenSlow:
    def __init__(self):
        self.model_id = "stabilityai/stable-diffusion-xl-base-1.0"
        
        self.pipe = DiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
        self.pipe = self.pipe.to("cuda")
    def generate(self,prompt="No prompt given"):
        image = self.pipe(prompt=prompt).images[0]  
        image.save(prompt+".png");
        return image;

if __name__ == '__main__':
   prompt = "people playing basketball inside"
   gen = imageGenFast();
   gen.generate(prompt);