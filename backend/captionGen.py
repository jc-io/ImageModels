import requests
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration, AutoModelForCausalLM, AutoTokenizer
import os
import sys
# Check if CUDA (GPU support) is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.cuda.empty_cache() #empty vram

class captionGen:
    def __init__(self):
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
        self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large").to(device)

    def predict(self, imageurl):
        try:
            raw_image = Image.open(imageurl).convert('RGB')
            text = "a photo of"
            inputs = self.processor(raw_image, text, return_tensors="pt").to(device)

            out = self.model.generate(**inputs)
            return self.processor.decode(out[0], skip_special_tokens=True)
        except Exception as e:
            raise Exception("File failed to create Caption")


    def createCaption(self, caption, tone):
        print("Using device: " + str(device))
        #text = "Make a " + tone + " Instagram caption for : " + caption + "; make sure to only output the made Instagram caption. Do not output anything other then the made Instagram caption."
        messages = [
        {
        "role": "system",
        "content": "You are a bot that generates one " + tone + " Instagram caption",
        },
        {"role": "user", "content": caption},
        ]
        #print("Text to be sent to LLM: " + text)
        tokenizer = AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-beta")
        model = AutoModelForCausalLM.from_pretrained("HuggingFaceH4/zephyr-7b-beta", torch_dtype=torch.float16).to(device)
        # text = "What is a short witty and funny instagram caption for an image of, " + caption + "  and make sure not to add extra information:"
        #text = "Make a" + tone + "Instagram caption for an image of " + caption + " and make sure to only output the caption"
        #input_ids = tokenizer.encode(text, return_tensors="pt").to(device)
        tokenized_chat = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to(device)

        """
        output = model.generate(
            input_ids,
            max_length=140,  # Increase or decrease this value for longer or shorter captions
            num_return_sequences=1,  # Generate multiple sequences for diversity
            temperature=1,  # Adjust the temperature for more diverse outputs
            top_k=50,  # Adjust the top_k parameter for diversity
            top_p=0.9,  # Adjust the top_p parameter for diversity
            repetition_penalty=1.3,  # Penalize repetition for more diverse outputs
            do_sample=True  # Sample from the distribution instead of greedy decoding
        )
        """
        output = model.generate(
            tokenized_chat,
            max_length=140,  # Increase or decrease this value for longer or shorter captions
            num_return_sequences=1,  # Generate multiple sequences for diversity
            temperature=0.7,  # Adjust the temperature for more diverse outputs
            top_k=50,  # Adjust the top_k parameter for diversity
            top_p=0.9,  # Adjust the top_p parameter for diversity
            repetition_penalty=1.3,  # Penalize repetition for more diverse outputs
            do_sample=True  # Sample from the distribution instead of greedy decoding
        )

        generated_joke = tokenizer.decode(output[0], skip_special_tokens=True)
        torch.cuda.empty_cache()
        return generated_joke.partition("<|assistant|>")[2]



if __name__ == '__main__':
   location = "/Users/mattiwosbelachew/Repos/github.com/CSE115A/ImageModels/backend/uploads/wildcamping.jpg"
   gen = captionGen()
   caption = gen.predict(location)
   print("Predicted caption:", caption)
   funnycaption = gen.makeFunny(caption)
   print("Funny caption:", funnycaption)
