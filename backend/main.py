from flask import Flask, jsonify, request
import json
from PIL import Image
from imageGen import ImageGen
from imageEdit import ImageEdit
from queue import Queue
import threading

import base64
from captionGen import captionGen
# from PIL import Image #uncomment if u want to see images pop up

from flask_cors import CORS
from werkzeug.utils import secure_filename

import os

# task_queue = Queue()
# tasks_done = [];
# def process_queue():
#     while True:
#         task = task_queue.get()
#         if task is None:
#             break
#         try:
#             task()
#         except Exception as e:
#             print(f"Error processing task: {e}")
#         finally:
#             task_queue.task_done()

# thread = threading.Thread(target=process_queue)
# thread.start()

# def add_task_to_queue(task):
#     task_queue.put(task)


UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated';


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER


@app.route("/")
def hello_world():
    print("Hit")
    return "Hello, World!"

@app.route("/imageTotext", methods=['post'])
def imageToText():
    try:
        try:
          imagecaption = request.form.get('caption');
          print("Caption to use: " + str(imagecaption));
        except Exception as e:
          print("Unable to determine caption");

        uploaded_files = request.files.getlist('file')
        caption = captionGen()
        for file in uploaded_files:
          print("Saving File Name: "+file.filename);
          file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename));
          # pil_img = Image.open(file); #uncommet to see images pop up
          # pil_img.show();
          secure_filename(file.filename);
          pathurl = os.path.join(app.config['UPLOAD_FOLDER'],file.filename);
          print(pathurl)
          captionGenerated = caption.predict(pathurl)


        res = {'message': 'File uploaded successfully',"caption":captionGenerated}
        res_message = jsonify(res);
        return res_message;

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500


@app.route("/generateLLM", methods=['post'])
def generateLLM():
    try:
        try:
          captionGenerated = request.form.get('captionGenerated');
          tone = request.form.get('tone');
          print("Generated from BLIP and being passed to LLM: " + str(captionGenerated));
        except Exception as e:
          print("Unable to determine caption");


        caption = captionGen()
        funnycaption = caption.createCaption(captionGenerated, tone);
        ##image.save("/.")
        res = {'message': 'File uploaded successfully',"result":funnycaption}
        res_message = jsonify(res);
        return res_message;

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

@app.route("/generate", methods=['post'])
def generate_image():
    try:
        prompt = request.form.get('prompt');
        print("Recieved prompt: " + prompt)
        generator = ImageGen();
        # image = generator.generate(prompt);
        images = []
        for i in range(1):
          images.append({'image_data': generator.generate(prompt)});
        # image.save(os.path.join(app.config['GENERATED_FOLDER'],"generated_image1.jpg"))


        # for i in range(1, 2):  # Assuming there are three images named image1.jpg, image2.jpg, and image3.jpg
        #   image_path = os.path.join(app.config['GENERATED_FOLDER'],f"generated_image{i}.jpg");
        #   with open(image_path, 'rb') as file:
        #       image_data = base64.b64encode(file.read()).decode('utf-8')
        #       images.append({'image_data': image_data})
        # print(len(images))
        return jsonify({'message': 'File uploaded successfully','prompt':prompt,'images':images});

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

@app.route("/editImage", methods=['post'])
def edit_image():
    try:
        uploaded_files = request.files.getlist('file')
        for file in uploaded_files:
          print("Saving File Name: "+file.filename);
          file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename));
          secure_filename(file.filename);
          pathurl = os.path.join(app.config['UPLOAD_FOLDER'],file.filename);

        prompt = request.form.get('prompt');
        """
        # extra parameters
        strengthImg = request.form.get('strength');
        guidance_scaleImg = request.form.get('guidance_scale');
        stepsImg = request.form.get('steps');
        negativeImg = request.form.get('negative');"""
        print("Recieved prompt: " + prompt)
        strengthImg = 0.8
        guidance_scaleImg = 7.5
        stepsImg =100
        negativeImg =""
        """
        basic: StableDiffusionImg2ImgPipeline "runwayml/stable-diffusion-v1-5"
        better: AutoPipelineForImage2Image "stabilityai/stable-diffusion-xl-refiner-1.0"
        """
        editImageGenerate = ImageEdit();
        # def generate(self, img, prompt="Didn't work sorry"):

        # image = generator.generate(prompt);

        images = []
        for i in range(1):
          images.append({'image_data': editImageGenerate.generate(pathurl, prompt, strengthImg, guidance_scaleImg, stepsImg, negativeImg="", num_images=1)});
          images.append({'image_data': editImageGenerate.generateDetailed(pathurl, prompt, strengthImg, guidance_scaleImg, stepsImg, negativeImg="", num_images=1)});

        return jsonify({'message': 'File uploaded successfully','prompt':prompt,'images':images});

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(port=5000, debug=True, threaded=True)
