from diffusers import StableDiffusionPipeline #latest version tranformers (clips)
from diffusers import DiffusionPipeline # slow version
import torch
from PIL import Image

#https://huggingface.co/runwayml/stable-diffusion-v1-5
#fast stable diff model


class imageGen:
    def __init__(self):
        pass
            
    def generate(self,prompt="No prompt given"):
        self.model_id = "runwayml/stable-diffusion-v1-5"
        self.pipe = StableDiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16,safety_checker = None)
        self.pipe.enable_model_cpu_offload() #faster option?
        image = self.pipe(prompt=prompt).images[0]  
        image.save(prompt+".png");
        return image;

    def generateDetailed(self,prompt="No prompt given"):
        self.model_id = "stabilityai/stable-diffusion-xl-base-1.0"
        self.pipe = DiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
        self.pipe = self.pipe.to("cuda")
        image = self.pipe(prompt=prompt).images[0]  
        image.save(prompt+".png");
        return image;


if __name__ == '__main__':
   prompt = "people playing basketball inside"
   gen = imageGen();
   gen.generate(prompt);