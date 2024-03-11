# ImageGen (Text-to-Image Generation)
## Overview
We based our implentation off the huggingface/Stable Diffusion Text-to-image models that uses 3 steps found [here](https://huggingface.co/docs/diffusers/en/using-diffusers/conditional_image_generation).

Much like theirs, our ImageGen feature takes a prompt as the starting point for the diffusion process.
It then runs through the [Stable Diffusion v1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5) (less computationally demanding and less detailed) or [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) (more computationally demanding and more detailed), depending on the model selection specified by the users.

## How this file works with the Stable Diffusion v1.5 Model:
1. We load the checkpoint or pre-trained model into the StableDiffusionPipeline class:
```
from diffusers import StableDiffusionPipeline  # latest version transformers (clips)
import torch
```
2. We take the user inputs on the prompt, and parameters given by the user and pass it to the generate function:
```
def generate(self, prompt="Didn't work sorry", guidance_scaleImg=7.5, stepsImg=50, negativeImg="", num_images=1):
```
3. We then load the model and configure it run via GPU:
```
        # Model is loaded and configured, self.model_id = "runwayml/stable-diffusion-v1-5"
        self.pipe = StableDiffusionPipeline.from_pretrained(self.model_id, torch_dtype=torch.float16, safety_checker=None, filter_enabled=False)
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
```
4. We pass all the parameters given by the user into the pipeline of the loaded model and generate the images:
```
        # Image is fed to the model with the user specified parameters
        images = self.pipe(prompt=prompt,
                guidance_scale=guidance_scaleImg,
                num_inference_steps=stepsImg,
                negative_prompt=negativeImg,
                num_images_per_prompt=num_images
            ).images[0]
```
5. Finally, we return the image:
```
return self.covertToimgageJpeg(images);
```
## How this file works with the Stable Diffusion XL Model:
1. We load the checkpoint or pre-trained model into the DiffusionPipeline class:
```
from diffusers import DiffusionPipeline # slow version
import torch
```
2. We take the user inputs on the image, prompt, and parameters given by the user and pass it to the generateDetailed function:
```
def generateDetailed(self, prompt="Didn't work sorry", guidance_scaleImg=7.5, stepsImg=50, negativeImg="", num_images=1):
```
3. We then load the model and configure it run via GPU:
```
        # Model is loaded and configured, self.detailed_model_id = "stabilityai/stable-diffusion-xl-base-1.0"
        self.pipe = DiffusionPipeline.from_pretrained(self.detailed_model_id, torch_dtype=torch.float16, variant="fp16", filter_enabled=False, safety_checker=None)
        self.pipe = self.pipe.to("cuda")
        self.pipe.enable_model_cpu_offload()
```
4. We pass all the parameters given by the user into the pipeline of the loaded model and generate the images:
```
        # Image is fed to the model with the user specified parameters
        images = self.pipe(prompt=prompt,
                guidance_scale=guidance_scaleImg,
                num_inference_steps=stepsImg,
                negative_prompt=negativeImg,
                num_images_per_prompt=num_images
            ).images[0]
```
5. Finally, we return the image:
```
return self.covertToimgageJpeg(images);
```
## Product Backlog

- Allow users to modify more of the model's parameters
- Edit UI to be more fluid and intuitive for users to select images for archiving
- Allow users to select more than 1 image to archive at a time