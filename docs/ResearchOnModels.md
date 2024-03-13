# ResearchOnModels 
## Overview
When starting this project, we initially wanted to use BLIP to create Image Captions and Instructpix2pix to generate images.

As we setup infastructure, we researched different models to use for our three pages: CaptionGen(Image-to-Text), Edit Image (Image-to-Image), and ImageGen(Text-to-Image)

In the end we settled to use
- BLIP chained with a LLM zephyr-7b-beta for CaptionGen
- StableDiffusion for Edit Image and ImageGen
## Used models

### BLIP (CaptionGen)
https://huggingface.co/docs/transformers/en/model_doc/blip
BLIP was used over CLIP because BLIP is specifically trained to generate captions (4-8 word phrases) and
CLIP focuses more on keywords, often single words.
### zephyr-7b-beta (CaptionGen)
https://huggingface.co/HuggingFaceH4/zephyr-7b-beta
zephyr-7b-beta was used because other LLMs were either too large for our local development or too small to generate meaningful captions.
### StableDiffusion (Edit Image) (ImageGen)
https://huggingface.co/docs/diffusers/en/api/pipelines/stable_diffusion/img2img
https://huggingface.co/docs/diffusers/en/api/pipelines/stable_diffusion/text2img
We used "runwayml/stable-diffusion-v1-5" and "stabilityai/stable-diffusion-xl-base-1.0" for Edit Image and ImageGen.
These models were used due to its comparably small model size yet get good results.
"runwayml/stable-diffusion-v1-5" allowed us to generate a quick image and "stabilityai/stable-diffusion-xl-base-1.0" allowed us to generate a high quality image.
We dropped Instructpix2pix because it requires another model, adding complexity and storage costs.
Also Instructpix2pix was based on on Stable Diffusion, meaning we could finetune our Stable Diffusion model to work better than Instructpix2pix. Finetuning is in the backlog.
## Un-used models
### CLIP
https://huggingface.co/docs/transformers/model_doc/clip
### Instructpix2pix
https://huggingface.co/docs/diffusers/en/training/instructpix2pix
