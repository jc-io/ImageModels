import requests
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration, AutoModelForCausalLM, AutoTokenizer

# Check if CUDA (GPU support) is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class captionGen:
    def __init__(self):
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
        self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

    def predict(self, imageurl):
        raw_image = Image.open(imageurl).convert('RGB')
        text = "a photography of"
        inputs = self.processor(raw_image, text, return_tensors="pt").to(device)

        out = self.model.generate(**inputs)
        return self.processor.decode(out[0], skip_special_tokens=True)

    def makeFunny(self, caption):
        print("Using device: " + str(device))
        tokenizer = AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-beta")
        model = AutoModelForCausalLM.from_pretrained("HuggingFaceH4/zephyr-7b-beta", torch_dtype=torch.float16).to(device)
        text = "A short witty and funny instagram caption for an image of, " + caption + " is:"
        input_ids = tokenizer.encode(text, return_tensors="pt").to(device)

        output = model.generate(input_ids, max_length=90, num_return_sequences=1, temperature=0.7)

        generated_joke = tokenizer.decode(output[0], skip_special_tokens=True)
        return generated_joke.replace(text, '')

if __name__ == '__main__':
   location = "/Users/mattiwosbelachew/Repos/github.com/CSE115A/ImageModels/backend/uploads/wildcamping.jpg"
   gen = CaptionGen()
   caption = gen.predict(location)
   print("Predicted caption:", caption)
   funnycaption = gen.makeFunny(caption)
   print("Funny caption:", funnycaption)
