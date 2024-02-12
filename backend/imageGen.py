from diffusers import StableDiffusionPipeline #latest version tranformers (clips)
import torch
import base64
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
        image = image.convert('RGB')
        # Convert the image to a byte array
        image_byte_array = image.tobytes()

        # Encode the byte array to base64
        base64_encoded_image = base64.b64encode(image_byte_array)

        # Convert the base64 bytes to a string (if needed)
        base64_encoded_image_string = base64_encoded_image.decode('utf-8')

        # Print or use the base64 encoded image string
        # Image.show(image);
        return base64_encoded_image_string;

if __name__ == '__main__':
   prompt = "horse space walk"
   gen = imageGen();
   gen.generate(prompt);