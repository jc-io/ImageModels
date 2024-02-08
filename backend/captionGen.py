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
        img_url = 'https://storage.googleapis.com/sfr-vision-language-research/BLIP/demo.jpg' 
        raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')
        # raw_image = Image.open(imageurl).convert('RGB')

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
        model_inputs = tokenizer(["A short witty and funny instagram caption for a image of a, "+ caption +" is:"], return_tensors="pt").to("cuda")
        generated_ids = model.generate(**model_inputs)
        result = tokenizer.batch_decode(generated_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0];
        print(result);
        return result;

if __name__ == '__main__':
   location = "/Users/mattiwosbelachew/Repos/github.com/CSE115A/ImageModels/backend/uploads/wildcamping.jpg"
   gen = captionGen();
   caption = gen.predict(location);
   print(caption);
   funnycaption = gen.makeFunny(caption);
