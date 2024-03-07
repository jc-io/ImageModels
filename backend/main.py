import datetime
from flask import Flask, jsonify, request, session
from pymongo import MongoClient
import json
from PIL import Image
from imageGen import ImageGen
from imageEdit import ImageEdit
from queue import Queue
import threading
import uuid
import jwt
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
users_archive_collection = db['users_archive']

images_collection = db['images']



UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated';


app = Flask(__name__)
# CORS(app, origins='https://amp.d1t6iofhrx2j14.amplifyapp.com');
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for all routes

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def hello_world():
    print("Hit")
    return "Hello, World!"

@app.route('/get_user_info', methods=['GET','POST'])
def get_user_info():
  token = request.headers.get('Authorization')
  print("Token: " + str(token))
  if not token:
    return jsonify({'error': 'Unauthorized No Token'}), 401

  try:
    token = token.split()[1]  # Remove 'Bearer' from the token
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    username = payload['username']
    
    user = users_collection.find_one({'username': username})
    if user:
      return jsonify({'username': user['username'], 'email': user.get('email', '')}), 200
    else:
      return jsonify({'error': 'User not found'}), 404

  except jwt.ExpiredSignatureError:
    return jsonify({'error': 'Token expired'}), 401
  except jwt.InvalidTokenError:
    return jsonify({'error': 'Invalid token'}), 401
  


@app.route('/Archive', methods=['GET','POST'])
def archive():
  token = request.headers.get('Authorization')
  print("Token: " + str(token))
  if not token:
    return jsonify({'error': 'Unauthorized No Token'}), 401

  try:
    token = token.split()[1]  # Remove 'Bearer' from the token
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    username = payload['username']
    
    user = users_collection.find_one({'username': username})
    image = request.form['image']
    if user :
      
      prompt = request.form['prompt'];
      description = "Default no description Sorry" #request.form['description'];
      model = request.form['model'];
      images_collection.insert_one({'src': image, 'username': username, 'model':  model, 'date': datetime.datetime.now(),'prompt': prompt,'description': description})
      return jsonify({'username': user['username'], 'email': user.get('email', '')}), 200
    else:
      return jsonify({'error': 'User not found'}), 404

  except jwt.ExpiredSignatureError:
    return jsonify({'error': 'Token expired'}), 401
  except jwt.InvalidTokenError:
    return jsonify({'error': 'Invalid token'}), 401
  
    
@app.route("/getImages",  methods=['GET','POST'])
def getImages():
    # token = request.headers.get('Authorization')
    # if not token:
    #   return jsonify({'error': 'Unauthorized No Token'}), 401
    limit = 100  # Set your desired limit here
    images_data = list(images_collection.find({}).limit(limit))  # Fetch documents with the specified limit
      
      # Convert ObjectId to strings for each document
    for image in images_data:
        image['_id'] = str(image['_id'])
      
    return jsonify({'message': 'Got Public Images', 'images': images_data}),200

@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        hashed_password = generate_password_hash(password)
        
        if users_collection.find_one({'username': username}):
            res = {'response': 'Username already exists!'}
            return jsonify(res), 400

        else:
            users_collection.insert_one({'username': username, 'password': hashed_password, 'email': email})
            # Set the user's username in the session
            # session['username'] = username
            payload = {
                'username': username,
                # Other data if needed (user_id, roles, etc.)
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30) # Expiration
            }
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
            res = {'response': 'Signed Up Successful','token': token}
            return jsonify(res), 200
    
    res = {'response': 'Wrong method'}
    return jsonify(res), 405

@app.route('/signout', methods=['POST'])
def signout():
    if request.method == 'POST':
        # Remove user from session
        session.pop('user', None)
        res = {'response': 'Signed Out Successful'}
        return jsonify(res)
    else:
        res = {'response': 'Wrong method'}
        return jsonify(res)
    
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        user = users_collection.find_one({'username': username})

        if user and check_password_hash(user['password'], password):
            payload = {
                'username': username,
                # Other data if needed (user_id, roles, etc.)
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30) # Expiration
            }
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

            res = {'response': 'Login Successful', 'token': token}
            return jsonify(res), 200
        else:
            res = {'response': 'Invalid username or password'}
            return jsonify(res), 401

# Example restricted route that requires authentication
# @app.route('/restricted')
# def restricted():
#     if 'token' in session:
#         # Here you can check for additional permissions if needed
#         res = {'response': 'Welcome to the restricted area, ' + session['username']}
#         return jsonify(res), 200
#     else:
#         res = {'response': 'Unauthorized'}
#         return jsonify(res), 401
    
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
          print("With Tone:" + str(tone));
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
        model = request.form.get('model');
        guidance = request.form.get('guidance');
        inferenceSteps = request.form.get('inferenceSteps');

        print("Recieved prompt: " + prompt)
        generator = ImageGen();
        # image = generator.generate(prompt);
        images = []
        if model == 'runwayml/stable-diffusion-v1-5':
          images.append({'image_data': generator.generate(prompt, guidance, inferenceSteps)});
        else: 
          images.append({'image_data': generator.generateDetailed(prompt, guidance, inferenceSteps)});
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
   app.run(port=80, debug=True, threaded=True)







    
