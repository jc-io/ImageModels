from diffusers import StableDiffusionImg2ImgPipeline #latest version tranformers (clips)
import torch
from PIL import Image
import base64
import io
"""
image edit starter
"""
class ImageEdit:
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
        return self.covertToimgageJpeg(images[0]);
    
    def covertToimgageJpeg(self, image):
        image = image.convert('RGB')
                        # Convert the image to a byte array
        with io.BytesIO() as buffer:
            image.save(buffer, format="JPEG")
            image_byte_array = buffer.getvalue()

            # Convert the image to a byte array
            # image_byte_array = image.tobytes()

            # Encode the byte array to base64
        base64_encoded_image = base64.b64encode(image_byte_array)

            # Convert the base64 bytes to a string
        base64_encoded_image_string = base64_encoded_image.decode('utf-8')

            # Format the base64 string as a data URL for HTML
        data_url = f"data:image/jpeg;base64,{base64_encoded_image_string}"
        return data_url

if __name__ == '__main__':
   img = './uploads/original.jpg'
   prompt = "turn it into a bamboo forest"
   gen = imageEdit()
   gen.generate(img, prompt)
