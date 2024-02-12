from diffusers import StableDiffusionPipeline #latest version tranformers (clips)
import torch
from PIL import Image

#https://huggingface.co/runwayml/stable-diffusion-v1-5

class imageGen:
    def __init__(self):
        self.model_id = "runwayml/stable-diffusion-v1-5"
        
        self.pipe = StableDiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16,safety_checker = None)
        # self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
    def generate(self,prompt="Didn't work sorry"):
        image = self.pipe(prompt).images[0]  
        Image.show(image);
        return image;

if __name__ == '__main__':
   prompt = "horse space walk"
   gen = imageGen();
   gen.generate(prompt);