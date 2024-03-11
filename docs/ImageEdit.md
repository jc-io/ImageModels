# ImageEdit (Image-to-Image Generation)
## Overview
We based our implentation off the huggingface/Stable Diffusion Image-to-image models that uses 3 steps found [here](https://huggingface.co/docs/diffusers/en/api/pipelines/stable_diffusion/img2img).

Much like theirs, our ImageEdit feature takes an initial image along with a prompt as the starting point for the diffusion process.
It then runs through the [Stable Diffusion v1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5) (less computationally demanding and less detailed) or [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) (more computationally demanding and more detailed), depending on the model selection specified by the users.
How this differs from the huggingface implementation, however, is that rather than loading images and changing inputs ourselves we take user uploaded images and specified inputs to generate images.

## How this file works with the Stable Diffusion v1.5 Model:
1. We load the checkpoint or pre-trained model into the StableDiffusionPipeline class:
```
from diffusers import StableDiffusionPipeline  # latest version transformers (clips)
import torch
```
2. We take the user inputs on the image, prompt, and parameters given by the user and pass it to the generate function:
```
def generate(self, img, prompt="Didn't work sorry", strengthImg=0.8, guidance_scaleImg=7.5, stepsImg=50, negativeImg="", num_images=1):
        # Image is processed
        model_input_img = self.preprocess(img)
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
         images = self.pipe(prompt=prompt, image=model_input_img,
                strength=strengthImg,
                guidance_scale=guidance_scaleImg,
                num_inference_steps=stepsImg,
                negative_prompt=negativeImg,
                num_images_per_prompt=num_images
            ).images
```
5. Finally, we return the image:
```
return self.covertToimgageJpeg(images[0]);
```
## How this file works with the Stable Diffusion XL Model:
1. We load the checkpoint or pre-trained model into the DiffusionPipeline class:
```
from diffusers import DiffusionPipeline # slow version
import torch
```
2. We take the user inputs on the image, prompt, and parameters given by the user and pass it to the generateDetailed function:
```
def generateDetailed(self, img, prompt="Didn't work sorry", strengthImg=0.8, guidance_scaleImg=7.5, stepsImg=50, negativeImg="", num_images=1):
        # Image is processed
        model_input_img = self.preprocess(img)
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
         images = self.pipe(prompt=prompt, image=model_input_img,
                strength=strengthImg,
                guidance_scale=guidance_scaleImg,
                num_inference_steps=stepsImg,
                negative_prompt=negativeImg,
                num_images_per_prompt=num_images
            ).images
```
5. Finally, we return the image:
```
return self.covertToimgageJpeg(images[0]);
```
## Product Backlog

- Allow users to generate multiple images based on their input image and prompt
- Allow users to modify more of the model's parameters