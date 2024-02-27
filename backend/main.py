from flask import Flask, jsonify, request, session
from pymongo import MongoClient
import json
from PIL import Image
from imageGen import ImageGen
from imageEdit import ImageEdit
from queue import Queue
import threading
from bson import json_util
import base64
from captionGen import captionGen
# from PIL import Image #uncomment if u want to see images pop up

from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash


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


# Connect to MongoDB
client = MongoClient('mongodb+srv://imagegen:KF7pSnJVxSZIfyIU@imagegen.jz2d0rr.mongodb.net/?retryWrites=true&w=majority&appName=ImageGen')
db = client['ImageGen']
users_collection = db['users']
images_collection = db['images']


UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated';


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
app.secret_key = "your_secret_key"


@app.route("/")
def hello_world():
    print("Hit")
    return "Hello, World!"

@app.route("/getImages",  methods=['GET'])
def getImages():
    limit = 100  # Set your desired limit here
    images_data = list(images_collection.find({}).limit(limit))  # Fetch documents with the specified limit
    
    # Convert ObjectId to strings for each document
    for image in images_data:
        image['_id'] = str(image['_id'])
    
    return jsonify({'message': 'Got Public Images', 'images': images_data})

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    print("signup")
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = generate_password_hash(password)
        if users_collection.find_one({'username': username}):
            res = {'response': 'Username already exists!'}
            res_message = jsonify(res);
            return res_message;
        else:
            users_collection.insert_one({'username': username, 'password': hashed_password})
            res = {'response': 'Signed Up Successful'}
            res_message = jsonify(res);
            return res_message;
    res = {'response': 'Wrong method'}
    res_message = jsonify(res);
    return res_message;

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = users_collection.find_one({'username': username})
        if user and check_password_hash(user['password'], password):
            session['username'] = username
            res = {'response': 'Login Sucessful'}
            res_message = jsonify(res);
            print(res)
            return res_message;
        else:
            res = {'response': 'Invalid username or password'}
            print(res)
            res_message = jsonify(res);
            return res_message;
    res = {'response': 'Wrong method'}
    res_message = jsonify(res);
    return res_message;

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
        for i in range(6):
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
        print("Recieved prompt: " + prompt)
        editImageGenerate = ImageEdit();
        # def generate(self, img, prompt="Didn't work sorry"):
           
        # image = generator.generate(prompt);
        images = []
        for i in range(1):
          images.append({'image_data': editImageGenerate.generate(pathurl, prompt)});
        
        return jsonify({'message': 'File uploaded successfully','prompt':prompt,'images':images});

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500
  
if __name__ == '__main__':
   app.run(port=5000, debug=True, threaded=True)







    
