import datetime
from flask import Flask, jsonify, request, session
from pymongo import MongoClient, ReturnDocument #Used to connect to the database
import json
from PIL import Image
from imageGen import ImageGen
from imageEdit import ImageEdit
from queue import Queue
import threading
import uuid
import jwt
from bson import json_util
from bson.objectid import ObjectId

import base64
from captionGen import captionGen
# from PIL import Image #uncomment if u want to see images pop up

from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash


import os

# Attempts at creating a queue for processing tasks that would require a lot of time and GPU resources.

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
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

#Used to debug the server and determine wether it is running
@app.route("/")
def hello_world():
    print("Hit")
    return "Connection Established"

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
    if user:
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

#This function is used to determine if the user is logged in and authinticated
@app.route('/get_user_info', methods=['GET','POST'])
def get_user_info():
  token = request.headers.get('Authorization') #Get the token from the request headers
  print("Token: " + str(token))
  if not token:#If the token is not present return an error
    return jsonify({'error': 'Unauthorized No Token'}), 401

  try:#Try to decode the token and get the user information from the token
    token = token.split()[1]  # Remove 'Bearer' from the token
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    username = payload['username']

    user = users_collection.find_one({'username': username}) #Get the user from the database
    if user: #If the user is found return the user information
      return jsonify({'username': user['username'], 'email': user.get('email', '')}), 200
    else: #If the user is not found return an error
      return jsonify({'error': 'User not found'}), 404

  except jwt.ExpiredSignatureError: #If the token is expired return an error
    return jsonify({'error': 'Token expired'}), 401
  except jwt.InvalidTokenError: #If the token is invalid return an error
    return jsonify({'error': 'Invalid token'}), 401


#This function is used to get a user private images from the database
@app.route('/getArchivedImages', methods=['GET','POST'])
def get_Archived_Images():
  token = request.headers.get('Authorization') #Get the token from the request headers
  print("Token: " + str(token))
  if not token: #If the token is not present return an error
    return jsonify({'error': 'Unauthorized No Token'}), 401

  try:
    token = token.split()[1]  # Remove 'Bearer' from the token
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256']) #Decode the token and get the user information from the token
    username = payload['username']

    images_data = list(images_collection.find({'username': username}))  # attempts to find all images with the user's username
    # Convert ObjectId to strings for each document
    for image in images_data: #Convert the object id to a string so it can be jsonified without errors
        image['_id'] = str(image['_id'])

    if images_data: #If the user is found return all the images it found to the user
      return jsonify({'message': 'Got Public Images', 'images': images_data}), 200
    else: #If the user is not found return an error
      return jsonify({'error': 'User not found'}), 404

  except jwt.ExpiredSignatureError: #If the token is expired return an error
    return jsonify({'error': 'Token expired'}), 401
  except jwt.InvalidTokenError: #If the token is invalid return an error
    return jsonify({'error': 'Invalid token'}), 401

#This function is used to turn sepecific images publc or private
@app.route('/toggleImagePrivacy/<image_id>', methods=['PUT'])
def toggle_image_privacy(image_id): #Get the image id from the url (from POST request)
  token = request.headers.get('Authorization') #Get the token from the request headers
  print("Token: " + str(token))
  if not token: #If the token is not present return an error
    return jsonify({'error': 'Unauthorized No Token'}), 401

  try:
    print("Beginning to toggle image privacy")
    token = token.split()[1]  # Remove 'Bearer' from the token
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    username = payload['username'] # Extract the current user's username from JWT token
    # Extract the current user's username from JWT token

    print("Current User: " + str(username))
    # Check if the image exists in MongoDB
    image = images_collection.find_one({"_id": ObjectId(image_id), "username": username})
    if not image:
        return jsonify({"error": "Image not found"}), 404

    data = request.get_json()
    is_public = data.get('isPublic') # Get the isPublic value from the request body
    # Update the privacy status of the image in MongoDB
    update_query = {"$set": {"public": is_public}} # Set the 'public' field to the value of isPublic
    if 'public' not in image:  # If the 'public' field doesn't exist, add it
        update_query = {"$set": {"public": is_public}}
    updated_image = images_collection.find_one_and_update( #Update the image in the database
            {"_id": ObjectId(image_id)},
            update_query,
            return_document=ReturnDocument.AFTER
    )
    # Return a success message with the updated privacy status
    return jsonify({"message": f"Privacy status of image {image_id} updated successfully","public": is_public}), 200

  except jwt.ExpiredSignatureError: #If the token is expired return an error
    return jsonify({'error': 'Token expired'}), 401 # Return an error if the token is expired
  except jwt.InvalidTokenError: #If the token is invalid return an error
    return jsonify({'error': 'Invalid token'}), 401 # Return an error if the token is invalid


# Updates the description of an image
@app.route('/updateImageDescription/<image_id>', methods=['PUT'])
def update_image_description(image_id): #Get the image id from the url (from POST request)
  token = request.headers.get('Authorization') #Get the token from the request headers
  print("Token: " + str(token))
  if not token: #If the token is not present return an error
    return jsonify({'error': 'Unauthorized No Token'}), 401

  try:
    print("Beginning to toggle image privacy")
    token = token.split()[1]  # Remove 'Bearer' from the token
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    username = payload['username'] # Extract the current user's username from JWT token
    # Extract the current user's username from JWT token

    print("Current User: " + str(username))
    # Check if the image exists in MongoDB
    image = images_collection.find_one({"_id": ObjectId(image_id), "username": username})
    if not image:
        return jsonify({"error": "Image not found"}), 404

    data = request.get_json()
    description = data.get('description') # Get the description value from the request body
    # Update the privacy status of the image in MongoDB
    update_query = {"$set": {"description": description}} # Set the description field to the value of description
    if 'description' not in image:  # If descripion not exist, add it
        update_query = {"$set": {"description": description}}
    updated_image = images_collection.find_one_and_update( #Update the image in the database
            {"_id": ObjectId(image_id)},
            update_query,
            return_document=ReturnDocument.AFTER
    )
    # Return a success message with the updated privacy status
    return jsonify({"message": f"Updated the description of image {image_id} successfully","description": description}), 200


  except jwt.ExpiredSignatureError: #If the token is expired return an error
    return jsonify({'error': 'Token expired'}), 401 # Return an error if the token is expired
  except jwt.InvalidTokenError: #If the token is invalid return an error
    return jsonify({'error': 'Invalid token'}), 401 # Return an error if the token is invalid


@app.route("/getImages",  methods=['GET'])
def getImages():
    limit = 100  # Set your desired limit here
    images_data = list(images_collection.find({"public":True}).limit(limit))  # Fetch documents with the specified limit

    # Convert ObjectId to strings for each document
    for image in images_data:
        image['_id'] = str(image['_id'])

    return jsonify({'message': 'Got Public Images', 'images': images_data}),200

@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST': #If the request method is a post request then get the username, password and email from the request body
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        hashed_password = generate_password_hash(password) #Hash the password so it can be stored in the database securely

        if users_collection.find_one({'username': username}): #Check if the username already exists in the database
            res = {'response': 'Username already exists!'}
            return jsonify(res), 400 #Return an error if the username already exists

        else: #If the username does not exist then add the user to the database and return a success message
            users_collection.insert_one({'username': username, 'password': hashed_password, 'email': email})
            # Set the user's username in the session
            payload = {
                'username': username,
                # Other data if needed (user_id, roles, etc.)
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30) # Expiration
            }
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
            res = {'response': 'Signed Up Successful','token': token}
            return jsonify(res), 200

    res = {'response': 'Wrong method'}
    return jsonify(res), 405 #Return an error if the request method is not a post request

@app.route('/signout', methods=['POST'])
def signout():
    if request.method == 'POST': #If the request method is a post request then remove the user from the session and return a success message
        # Remove user from session
        session.pop('user', None) #Remove the user from the session
        res = {'response': 'Signed Out Successful'}
        return jsonify(res)
    else:
        res = {'response': 'Wrong method'}
        return jsonify(res)

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST': #If the request method is a post request then get the username and password from the request body
        username = request.json.get('username')
        password = request.json.get('password')
        user = users_collection.find_one({'username': username}) #Get the user from the database

        if user and check_password_hash(user['password'], password): #Check to make sure the given password hashed matches stored password hash
            payload = {
                'username': username, #Set the user's username in the session
                # Other data if needed (user_id, roles, etc.)
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30) # Expiration
            }
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256') #Encode the user's information into a token

            res = {'response': 'Login Successful', 'token': token}
            return jsonify(res), 200 #Return a success message with the token
        else:
            res = {'response': 'Invalid username or password'}
            return jsonify(res), 401 #Return an error if the username or password is invalid



@app.route("/imageTotext", methods=['post']) # This API is used to convert an image to text using BLIP model
def imageToText():
    try:
        try: #Get the image from the request body
          imagecaption = request.form.get('caption');
          print("Caption to use: " + str(imagecaption));
        except Exception as e:
          print("Unable to determine caption");

        uploaded_files = request.files.getlist('file') #Get the image from the request body
        caption = captionGen() #Create a new instance of the captionGen class containing the BLIP model
        for file in uploaded_files: #
          print("Saving File Name: "+file.filename);
          file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename));
          # pil_img = Image.open(file); #uncommet to see images pop up
          # pil_img.show();
          secure_filename(file.filename);
          pathurl = os.path.join(app.config['UPLOAD_FOLDER'],file.filename);
          print(pathurl)
          captionGenerated = caption.predict(pathurl) #Get the caption from the image using the BLIP model


        res = {'message': 'File uploaded successfully',"caption":captionGenerated} #Return a success message with the caption
        res_message = jsonify(res);
        return res_message;

    except Exception as e:#Return an error if an error occurs
        print(str(e));
        return jsonify({'error': str(e)}), 500


@app.route("/generateLLM", methods=['post'])
def generate_LLM(): #This API takes a caption/description of an image to generate a funny caption using LLM model for instagram posts
    try:
        try:
          captionGenerated = request.form.get('captionGenerated'); #Get the caption from the request body which was generated from BLIP
          tone = request.form.get('tone'); #Get the tone from the request body
          print("Generated from BLIP and being passed to LLM: " + str(captionGenerated));
          print("With Tone:" + str(tone));
        except Exception as e:
          print("Unable to determine caption");


        caption = captionGen() #Create a new instance of the captionGen class containing the LLM model
        funnycaption = caption.createCaption(captionGenerated, tone); #Generate a caption based on given tone using the LLM model
        ##image.save("/.")
        res = {'message': 'File uploaded successfully',"result":funnycaption}
        res_message = jsonify(res); #Return a success message with the generated caption
        return res_message;

    except Exception as e:
        print(str(e)); #Return an error if an error occurs
        return jsonify({'error': str(e)}), 500

@app.route("/generate", methods=['post'])
def generate_image():
    try:
        prompt = request.form.get('prompt');
        model = request.form.get('model');
        guidance = float(request.form.get('guidance'));
        inferenceSteps = int(request.form.get('inferenceSteps'));

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

@app.route("/editImage", methods=['post']) #This API is used to edit an image based on a given prompt using the Stable Diffusion model
def edit_image():
    try:
        uploaded_files = request.files.getlist('file')  # Get the image from the request body
        for file in uploaded_files: #Save the image to the uploads folder
          print("Saving File Name: "+file.filename);
          file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename));
          secure_filename(file.filename);
          pathurl = os.path.join(app.config['UPLOAD_FOLDER'],file.filename);

        prompt = request.form.get('prompt'); #Get the prompt from the request body
        model = request.form.get('model');
        guidance = float(request.form.get('guidance'));
        strength = float(request.form.get('strength'));
        inferenceSteps = int(request.form.get('inferenceSteps'));
        print("Recieved prompt: " + prompt)
        editImageGenerate = ImageEdit(); #Create a new instance of the ImageEdit class containing the Stable Diffusion model

        images = []
        # images.append({'image_data': editImageGenerate.generate(pathurl, prompt)}); #Generate an image based on the given prompt

        if model == 'runwayml/stable-diffusion-v1-5':
          images.append({'image_data': editImageGenerate.generate(pathurl,prompt,  strength, guidance, inferenceSteps)});
        else:
          images.append({'image_data': editImageGenerate.generateDetailed(pathurl, prompt,  strength, guidance, inferenceSteps)});
        return jsonify({'message': 'File uploaded successfully','prompt':prompt,'images':images}); #Return a success message with the generated image

    except Exception as e: # Return an error if an error occurs
        print(str(e));
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(port=80, debug=True, threaded=True) #Run the server on port 5000 with deubg mode enabled and threading enabled
