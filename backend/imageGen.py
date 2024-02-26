from diffusers import StableDiffusionPipeline  # latest version transformers (clips)
from diffusers import DiffusionPipeline # slow version
import torch
import base64
import io
from PIL import Image

class ImageGen:
    def __init__(self):
        self.model_id = "runwayml/stable-diffusion-v1-5"
        self.detailed_model_id = "stabilityai/stable-diffusion-xl-base-1.0"

    def generate(self, prompt="No prompt given"):
        try:
            self.pipe = StableDiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16, safety_checker=None)
            self.pipe.enable_model_cpu_offload()
            image = self.pipe(prompt).images[0]
           # Format the base64 string as a data URL for HTML
            return self.covertToimgageJpeg(image);

        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def generateDetailed(self, prompt="No prompt given"):
        try:
            self.pipe = DiffusionPipeline.from_pretrained(self.detailed_model_id, torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
            self.pipe = self.pipe.to("cuda")
            image = self.pipe(prompt).images[0]
            return self.covertToimgageJpeg(image);

        except Exception as e:
            print(f"An error occurred: {e}")
            return None

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
    prompt = "horse space walk"
    gen = ImageGen()
    generated_image_url = gen.generate(prompt)
    if generated_image_url:
        print("Generated image URL:", generated_image_url)
    else:
        print("Failed to generate the image.")
