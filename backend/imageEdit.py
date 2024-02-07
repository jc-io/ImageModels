from diffusers import StableDiffusionImg2ImgPipeline #latest version tranformers (clips)
import torch
from PIL import Image
import io
"""
image edit starter
"""
class imageEdit:
    def __init__(self):
        self.model_id = "runwayml/stable-diffusion-v1-5"
        self.pipe = StableDiffusionImg2ImgPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16, safety_checker = None)
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()

    def generate(self, img, prompt="Didn't work sorry"):
        file = open(img, "rb")
        og_image = Image.open(file).convert("RGB")
        og_image = og_image.resize((768, 512))

        images = self.pipe(prompt=prompt, image=og_image).images
        images[0].save("uploads/modified.jpg")
        return images[0]

if __name__ == '__main__':
   img = './uploads/original.jpg'
   prompt = "turn it into a bamboo forest"
   gen = imageEdit()
   gen.generate(img, prompt)
