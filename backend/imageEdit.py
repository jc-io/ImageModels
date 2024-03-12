import io
import base64
import torch
from PIL import Image

from diffusers import StableDiffusionPipeline, DiffusionPipeline


class ImageEdit:
    """
    This is the model wrapper for the stable-diffusion-v1-5 (Small)
    ImagetoImage Model and the stable-diffusion-xl-base-1.0 (Large)
    ImagetoImage Model
    """

    def __init__(self):
        """
        Create wrapper for stable-diffusion-v1-5 Model
        and stable-diffusion-xl-base-1.0 Model
        """
        self.model_id = "runwayml/stable-diffusion-v1-5"
        self.detailed_model_id = "stabilityai/stable-diffusion-xl-base-1.0"

    def preprocess(self, img):
        """
        Model Preprocessing Stage
        :input
            - image file
        :returns a resized image for model
        """
        file = open(img, "rb")
        og_image = Image.open(file).convert("RGB")
        og_image = og_image.resize((768, 512))
        return og_image

    def generate(
        self,
        img,
        prompt="",
        strength_img=0.8,
        guidance_scale_img=7.5,
        steps_img=50,
        negative_img="",
        num_images=1,
    ):
        """
        stable-diffusion-v1-5 Model Prediction
            :input
                - img: preprocessed image
                - prompt: string input by
                    user , default = ""
                - strength_img: model parameter
                    strength, default = 0.8
                - strength_img: model parameter
                    guidance_scale, default = 7.5
                - strength_img: model parameter
                    num_inference_steps, default = 50
                - strength_img: model parameter
                    negative_prompt, default = ""
                - strength_img: model parameter
                    num_images_per_prompt, default = 1
            :returns jpeg image
        """
        model_input_img = self.preprocess(img)
        self.pipe = StableDiffusionPipeline.from_pretrained(
            self.model_id,
            torch_dtype=torch.float16,
            variant="fp16",
            use_safetensors=True,
        )
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
        images = self.pipe(
            prompt=prompt,
            image=model_input_img,
            strength=strength_img,
            guidance_scale=guidance_scale_img,
            num_inference_steps=steps_img,
            negative_prompt=negative_img,
            num_images_per_prompt=num_images,
        ).images
        torch.cuda.empty_cache()  # empty vram
        #image.save(prompt+".png"); # uncomment for unit testing
        return self.covert_to_imgage_jpeg(images[0])

    def generate_xl(
        self,
        img,
        prompt="",
        strength_img=0.8,
        guidance_scale_img=7.5,
        steps_img=50,
        negative_img="",
        num_images=1,
    ):
        """
        stable-diffusion-xl-base-1.0 Model Prediction
            :input
                - img: preprocessed image
                - prompt: string input by
                    user , default = ""
                - strength_img: model parameter
                    strength, default = 0.8
                - strength_img: model parameter
                    guidance_scale, default = 7.5
                - strength_img: model parameter
                    num_inference_steps, default = 50
                - strength_img: model parameter
                    negative_prompt, default = ""
                - strength_img: model parameter
                    num_images_per_prompt, default = 1
            :returns jpeg image
        """
        model_input_img = self.preprocess(img)
        self.pipe = DiffusionPipeline.from_pretrained(
            self.detailed_model_id,
            torch_dtype=torch.float16,
            variant="fp16",
            use_safetensors=True,
        )
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
        images = self.pipe(
            prompt=prompt,
            image=model_input_img,
            strength=strength_img,
            guidance_scale=guidance_scale_img,
            num_inference_steps=steps_img,
            negative_prompt=negative_img,
            num_images_per_prompt=num_images,
        ).images
        torch.cuda.empty_cache()  # empty vram
        #image.save(prompt+".png");  # uncomment for unit testing
        return self.covert_to_imgage_jpeg(images[0])

    def covert_to_imgage_jpeg(self, image):
        """
        Convert model output to jpeg file
        :input
            - Stable diffusion ImagetoImage model output
        :returns a jpeg file
        """
        image = image.convert("RGB")
        # Convert the image to a byte array
        with io.BytesIO() as buffer:
            image.save(buffer, format="JPEG")
            image_byte_array = buffer.getvalue()

            # Convert the image to a byte array
            # image_byte_array = image.tobytes()

            # Encode the byte array to base64
        base64_encoded_image = base64.b64encode(image_byte_array)

        # Convert the base64 bytes to a string
        base64_encoded_image_string = base64_encoded_image.decode("utf-8")

        # Format the base64 string as a data URL for HTML
        data_url = f"data:image/jpeg;base64,{base64_encoded_image_string}"
        return data_url

if __name__ == "__main__":
    location = "uploads/dogpark.jpg"
    prompt = "add a cat next to the dog"
    gen = ImageEdit();
    gen.generate(location, prompt);
    gen.generate_xl(location, prompt);