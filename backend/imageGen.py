import io
import base64
import torch

from diffusers import StableDiffusionPipeline, DiffusionPipeline


class ImageGen:
    """
    This is the model wrapper for the stable-diffusion-v1-5 (Small)
    TexttoImage Model and the stable-diffusion-xl-base-1.0 (Large)
    TexttoImage Model
    """

    def __init__(self):
        """
        Create wrapper for stable-diffusion-v1-5 Model
        and stable-diffusion-xl-base-1.0 Model
        """
        self.model_id = "runwayml/stable-diffusion-v1-5"
        self.detailed_model_id = "stabilityai/stable-diffusion-xl-base-1.0"

    def generate(
        self,
        prompt="",
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
                - strengthImg: model parameter
                    guidance_scale, default = 7.5
                - strengthImg: model parameter
                    num_inference_steps, default = 50
                - strengthImg: model parameter
                    negative_prompt, default = ""
                - strengthImg: model parameter
                    num_images_per_prompt, default = 1
            :returns jpeg image
        """
        self.pipe = StableDiffusionPipeline.from_pretrained(
            self.model_id,
            torch_dtype=torch.float16,
            safety_checker=None,
            filter_enabled=False,
        )
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
        images = self.pipe(
            prompt=prompt,
            guidance_scale=guidance_scale_img,
            num_inference_steps=steps_img,
            negative_prompt=negative_img,
            num_images_per_prompt=num_images,
        ).images[0]
        # Format the base64 string as a data URL for HTML
        #image.save(prompt+".png"); // uncomment for unit testing
        torch.cuda.empty_cache()  # empty vram
        return self.covert_to_imgage_jpeg(images)

    def generate_xl(
        self,
        prompt="",
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
                - strengthImg: model parameter
                    guidance_scale, default = 7.5
                - strengthImg: model parameter
                    num_inference_steps, default = 50
                - strengthImg: model parameter
                    negative_prompt, default = ""
                - strengthImg: model parameter
                    num_images_per_prompt, default = 1
            :returns jpeg image
        """
        self.pipe = DiffusionPipeline.from_pretrained(
            self.detailed_model_id,
            torch_dtype=torch.float16,
            variant="fp16",
            filter_enabled=False,
            safety_checker=None,
        )
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
        images = self.pipe(
            prompt=prompt,
            guidance_scale=guidance_scale_img,
            num_inference_steps=steps_img,
            negative_prompt=negative_img,
            num_images_per_prompt=num_images,
        ).images[0]
        # Format the base64 string as a data URL for HTML
        #image.save(prompt+".png"); // uncomment for unit testing
        torch.cuda.empty_cache()  # empty vram
        return self.covert_to_imgage_jpeg(images)

    def covert_to_imgage_jpeg(self, image):
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
    prompt = "people playing basketball inside"
    gen = imageGen();
    gen.generate(prompt);
    gen.generate_xl(prompt);
