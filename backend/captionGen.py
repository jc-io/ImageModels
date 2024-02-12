import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration, AutoModelForCausalLM, AutoTokenizer



#https://huggingface.co/docs/transformers/en/llm_tutorial
#https://huggingface.co/Salesforce/blip-image-captioning-large
   

class captionGen:
    def __init__(self):
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
        self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
   

    #change to imagepath
    def predict(self, imageurl):
        # img_url = 'https://storage.googleapis.com/sfr-vision-language-research/BLIP/demo.jpg' 
        # raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')
        raw_image = Image.open(imageurl).convert('RGB')

        # conditional image captioning
        text = "a photography of"
        inputs = self.processor(raw_image, text, return_tensors="pt")

        out = self.model.generate(**inputs)
        return self.processor.decode(out[0], skip_special_tokens=True)

        # unconditional image captioning
        # inputs = processor(raw_image, return_tensors="pt")

        # out = model.generate(**inputs)
        # return processor.decode(out[0], skip_special_tokens=True)
    def makeFunny(self, caption):
        tokenizer = AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-beta")
        model = AutoModelForCausalLM.from_pretrained("HuggingFaceH4/zephyr-7b-beta")
        text = "A short witty and funny instagram caption for a image of a, "+ caption +" is:"
        input_ids = tokenizer.encode(text, return_tensors="pt")

        # Generate text based on the scene description
        output = model.generate(input_ids, max_length=100, num_return_sequences=1, temperature=0.7)

        generated_joke = tokenizer.decode(output[0], skip_special_tokens=True)

        print(generated_joke);
        return generated_joke;

if __name__ == '__main__':
   location = "/Users/mattiwosbelachew/Repos/github.com/CSE115A/ImageModels/backend/uploads/wildcamping.jpg"
   gen = captionGen();
   caption = gen.predict(location);
   print(caption);
   funnycaption = gen.makeFunny(caption);
