import os
import datetime
import jwt

from bson.objectid import ObjectId
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, request, session
from pymongo import (
    MongoClient,
    ReturnDocument,
)  # Used to connect to the database

from imageGen import ImageGen
from imageEdit import ImageEdit
from captionGen import captionGen

# Connect to MongoDB
client = MongoClient(
    "mongodb+srv://imagegen:KF7pSnJVxSZIfyIU@imagegen.jz2d0rr.mongodb.net/?retryWrites=true&w=majority&appName=ImageGen"
)
db = client["ImageGen"]
users_collection = db["users"]
images_collection = db["images"]


UPLOAD_FOLDER = "uploads"
GENERATED_FOLDER = "generated"


app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["GENERATED_FOLDER"] = GENERATED_FOLDER
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def hello_world():
    """
    Used to debug the server and determine wether it is running
    """
    print("Hit")
    return "Connection Established"


@app.route("/Archive", methods=["GET", "POST"])
def archive():
    """
    Save Image to archive page
    """
    token = request.headers.get("Authorization")
    print("Token: " + str(token))
    if not token:
        return jsonify({"error": "Unauthorized No Token"}), 401

    try:
        token = token.split()[1]  # Remove 'Bearer' from the token
        payload = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        username = payload["username"]

        user = users_collection.find_one({"username": username})
        image = request.form["image"]
        if user:
            prompt = request.form["prompt"]
            description = (
                "Default no description Sorry"  # request.form['description'];
            )
            model = request.form["model"]
            images_collection.insert_one(
                {
                    "src": image,
                    "username": username,
                    "model": model,
                    "date": datetime.datetime.now(),
                    "prompt": prompt,
                    "description": description,
                }
            )
            return (
                jsonify(
                    {
                        "username": user["username"],
                        "email": user.get("email", ""),
                    }
                ),
                200,
            )
        else:
            return jsonify({"error": "User not found"}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


@app.route("/get_user_info", methods=["GET", "POST"])
def get_user_info():
    """
    This function is used to determine
    if the user is logged in and authinticated
    """
    token = request.headers.get(
        "Authorization"
    )  # Get the token from the request headers
    print("Token: " + str(token))
    if not token:  # If the token is not present return an error
        return jsonify({"error": "Unauthorized No Token"}), 401

    try:  # Try to decode the token and get the user information from token
        token = token.split()[1]  # Remove 'Bearer' from the token
        payload = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        username = payload["username"]

        user = users_collection.find_one(
            {"username": username}
        )  # Get the user from the database
        if user:  # If the user is found return the user information
            return (
                jsonify(
                    {
                        "username": user["username"],
                        "email": user.get("email", ""),
                    }
                ),
                200,
            )
        else:  # If the user is not found return an error
            return jsonify({"error": "User not found"}), 404

    except (
        jwt.ExpiredSignatureError
    ):  # If the token is expired return an error
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:  # If the token is invalid return an error
        return jsonify({"error": "Invalid token"}), 401


@app.route("/getArchivedImages", methods=["GET", "POST"])
def get_archived_images():
    """
    This function is used to get a user private images from the database
    """
    token = request.headers.get(
        "Authorization"
    )  # Get the token from the request headers
    print("Token: " + str(token))
    if not token:  # If the token is not present return an error
        return jsonify({"error": "Unauthorized No Token"}), 401

    try:
        token = token.split()[1]  # Remove 'Bearer' from the token
        payload = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"]
        )  # Decode the token and get the user information from the token
        username = payload["username"]

        images_data = list(
            images_collection.find({"username": username})
        )  # attempts to find all images with the user's username
        # Convert ObjectId to strings for each document
        for (
            image
        ) in (
            images_data
        ):  # Convert object id to a string so it can be jsonified
            image["_id"] = str(image["_id"])

        if (
            images_data
        ):  # If the user is found return all the images it found to the user
            return (
                jsonify(
                    {"message": "Got Public Images", "images": images_data}
                ),
                200,
            )
        else:  # If the user is not found return an error
            return jsonify({"error": "User not found"}), 404

    except (
        jwt.ExpiredSignatureError
    ):  # If the token is expired return an error
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:  # If the token is invalid return an error
        return jsonify({"error": "Invalid token"}), 401


@app.route("/toggleImagePrivacy/<image_id>", methods=["PUT"])
def toggle_image_privacy(
    image_id,
):
    """
    This function is used to turn sepecific images publc or private
    Get the image id from the url (from POST request)
    """
    token = request.headers.get(
        "Authorization"
    )  # Get the token from the request headers
    print("Token: " + str(token))
    if not token:  # If the token is not present return an error
        return jsonify({"error": "Unauthorized No Token"}), 401

    try:
        print("Beginning to toggle image privacy")
        token = token.split()[1]  # Remove 'Bearer' from the token
        payload = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        username = payload[
            "username"
        ]  # Extract the current user's username from JWT token
        # Extract the current user's username from JWT token

        print("Current User: " + str(username))
        # Check if the image exists in MongoDB
        image = images_collection.find_one(
            {"_id": ObjectId(image_id), "username": username}
        )
        if not image:
            return jsonify({"error": "Image not found"}), 404

        data = request.get_json()
        is_public = data.get(
            "isPublic"
        )  # Get the isPublic value from the request body
        # Update the privacy status of the image in MongoDB
        update_query = {
            "$set": {"public": is_public}
        }  # Set the 'public' field to the value of isPublic
        if (
            "public" not in image
        ):  # If the 'public' field doesn't exist, add it
            update_query = {"$set": {"public": is_public}}
        updated_image = images_collection.find_one_and_update(
            {"_id": ObjectId(image_id)},
            update_query,
            return_document=ReturnDocument.AFTER,
        )
        # Return a success message with the updated privacy status
        return (
            jsonify(
                {
                    "message": f"Privacy status of image {image_id} updated successfully",
                    "public": is_public,
                }
            ),
            200,
        )

    except (
        jwt.ExpiredSignatureError
    ):  # If the token is expired return an error
        return (
            jsonify({"error": "Token expired"}),
            401,
        )  # Return an error if the token is expired
    except jwt.InvalidTokenError:  # If the token is invalid return an error
        return (
            jsonify({"error": "Invalid token"}),
            401,
        )  # Return an error if the token is invalid


# Updates the description of an image
@app.route("/updateImageDescription/<image_id>", methods=["PUT"])
def update_image_description(
    image_id,
):
    """
    Updates the description of an image
    Get the image id from the url (from POST request)
    """
    token = request.headers.get(
        "Authorization"
    )  # Get the token from the request headers
    print("Token: " + str(token))
    if not token:  # If the token is not present return an error
        return jsonify({"error": "Unauthorized No Token"}), 401

    try:
        print("Beginning to toggle image privacy")
        token = token.split()[1]  # Remove 'Bearer' from the token
        payload = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        username = payload[
            "username"
        ]  # Extract the current user's username from JWT token
        # Extract the current user's username from JWT token

        print("Current User: " + str(username))
        # Check if the image exists in MongoDB
        image = images_collection.find_one(
            {"_id": ObjectId(image_id), "username": username}
        )
        if not image:
            return jsonify({"error": "Image not found"}), 404

        data = request.get_json()
        description = data.get(
            "description"
        )  # Get the description value from the request body
        # Update the privacy status of the image in MongoDB
        update_query = {
            "$set": {"description": description}
        }  # Set the description field to the value of description
        if "description" not in image:  # If descripion not exist, add it
            update_query = {"$set": {"description": description}}
        updated_image = images_collection.find_one_and_update(
            {"_id": ObjectId(image_id)},
            update_query,
            return_document=ReturnDocument.AFTER,
        )
        # Return a success message with the updated privacy status
        return (
            jsonify(
                {
                    "message": f"Updated the description of image {image_id} successfully",
                    "description": description,
                }
            ),
            200,
        )

    except (
        jwt.ExpiredSignatureError
    ):  # If the token is expired return an error
        return (
            jsonify({"error": "Token expired"}),
            401,
        )  # Return an error if the token is expired
    except jwt.InvalidTokenError:  # If the token is invalid return an error
        return (
            jsonify({"error": "Invalid token"}),
            401,
        )  # Return an error if the token is invalid


@app.route("/getImages", methods=["GET"])
def get_images():
    """
    This function preforms GET request
    """
    limit = 100  # Set your desired limit here
    images_data = list(
        images_collection.find({"public": True}).limit(limit)
    )  # Fetch documents with the specified limit

    # Convert ObjectId to strings for each document
    for image in images_data:
        image["_id"] = str(image["_id"])

    return (
        jsonify({"message": "Got Public Images", "images": images_data}),
        200,
    )


@app.route("/signup", methods=["POST"])
def signup():
    """
    This function preforms Sign-up request
    """
    if (
        request.method == "POST"
    ):  # If the request method is a post request then get the
        # username, password and email from the request body
        username = request.form["username"]
        password = request.form["password"]
        email = request.form["email"]
        hashed_password = generate_password_hash(
            password
        )  # Hash the password so it can be stored in the database securely

        if users_collection.find_one(
            {"username": username}
        ):  # Check if the username already exists in the database
            res = {"response": "Username already exists!"}
            return (
                jsonify(res),
                400,
            )  # Return an error if the username already exists

        else:  # If the username does not exist then add
            # the user to the database and return a success message
            users_collection.insert_one(
                {
                    "username": username,
                    "password": hashed_password,
                    "email": email,
                }
            )
            # Set the user's username in the session
            payload = {
                "username": username,
                # Other data if needed (user_id, roles, etc.)
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(minutes=30),  # Expiration
            }
            token = jwt.encode(
                payload, app.config["SECRET_KEY"], algorithm="HS256"
            )
            res = {"response": "Signed Up Successful", "token": token}
            return jsonify(res), 200

    res = {"response": "Wrong method"}
    return (
        jsonify(res),
        405,
    )  # Return an error if the request method is not a post request


@app.route("/signout", methods=["POST"])
def signout():
    """
    This function preforms Sign-out request
    """
    if (
        request.method == "POST"
    ):  # If the request method is a post request then remove the user
        # from the session and return a success message
        # Remove user from session
        session.pop("user", None)  # Remove the user from the session
        res = {"response": "Signed Out Successful"}
        return jsonify(res)
    else:
        res = {"response": "Wrong method"}
        return jsonify(res)


@app.route("/login", methods=["POST"])
def login():
    """
    This function preforms Login request
    """
    if (
        request.method == "POST"
    ):  # If the request method is a post request then
        # get the username and password from the request body
        username = request.json.get("username")
        password = request.json.get("password")
        user = users_collection.find_one(
            {"username": username}
        )  # Get the user from the database

        if user and check_password_hash(
            user["password"], password
        ):  # Check to make sure the given
            # password hashed matches stored password hash
            payload = {
                "username": username,  # Set the user's username in session
                # Other data if needed (user_id, roles, etc.)
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(minutes=30),  # Expiration
            }
            token = jwt.encode(
                payload, app.config["SECRET_KEY"], algorithm="HS256"
            )  # Encode the user's information into a token

            res = {"response": "Login Successful", "token": token}
            return jsonify(res), 200  # Return a success message with token
        else:
            res = {"response": "Invalid username or password"}
            return (
                jsonify(res),
                401,
            )  # Return an error if the username or password is invalid


@app.route("/imageTotext", methods=["post"])
def image_to_text():
    """
    This API is used to convert an image to text using BLIP model
    """
    try:
        try:  # Get the image from the request body
            imagecaption = request.form.get("caption")
            print("Caption to use: " + str(imagecaption))
        except Exception as e:
            print("Unable to determine caption")

        uploaded_files = request.files.getlist(
            "file"
        )  # Get the image from the request body
        caption = captionGen()  # Create a new instance of the
        # captionGen class containing the BLIP model
        for f in uploaded_files:  #
            print("Saving File Name: " + f.filename)
            f.save(os.path.join(app.config["UPLOAD_FOLDER"], f.filename))
            # pil_img = Image.open(f); #uncommet to see images pop up
            # pil_img.show();
            secure_filename(f.filename)
            pathurl = os.path.join(app.config["UPLOAD_FOLDER"], f.filename)
            print(pathurl)
            caption_generated = caption.blip_create_caption(
                pathurl
            )  # Get the caption from the image using the BLIP model

        res = {
            "message": "File uploaded successfully",
            "caption": caption_generated,
        }  # Return a success message with the caption
        res_message = jsonify(res)
        return res_message

    except Exception as e:  # Return an error if an error occurs
        print(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/generateLLM", methods=["post"])
def generate_llm():
    """
    This API takes a caption/description of an image to
    generate a funny caption using LLM model for instagram posts
    """
    try:
        try:
            caption_generated = request.form.get("captionGenerated")
            # Get the caption from the request
            # body which was generated from BLIP
            tone = request.form.get("tone")
            # Get the tone from the request body
            print(
                "Generated from BLIP and being passed to LLM: "
                + str(caption_generated)
            )
            print("With Tone:" + str(tone))
        except Exception as e:
            print("Unable to determine caption")

        caption = captionGen()  # Create a new instance of the
        # captionGen class containing the LLM model
        llm_caption = caption.llm_create_caption(caption_generated, tone)
        # Generate a caption based on given tone using the LLM model
        ##image.save("/.")
        res = {"message": "File uploaded successfully", "result": llm_caption}
        res_message = jsonify(res)
        # Return a success message with the generated caption
        return res_message

    except Exception as e:
        print(str(e))
        # Return an error if an error occurs
        return jsonify({"error": str(e)}), 500


@app.route("/generate", methods=["post"])
def generate_image():
    """
    This API is used to convert text to
    image using a Stable Diffusion model
    """
    try:
        prompt = request.form.get("prompt")
        model = request.form.get("model")
        guidance = float(request.form.get("guidance"))
        inference_steps = int(request.form.get("inferenceSteps"))

        print("Recieved prompt: " + prompt)

        generator = ImageGen()
        # image = generator.generate(prompt);
        images = []
        if model == "runwayml/stable-diffusion-v1-5":
            images.append(
                {
                    "image_data": generator.generate(
                        prompt, guidance, inference_steps
                    )
                }
            )
        else:
            images.append(
                {
                    "image_data": generator.generate_xl(
                        prompt, guidance, inference_steps
                    )
                }
            )
        return jsonify(
            {
                "message": "File uploaded successfully",
                "prompt": prompt,
                "images": images,
            }
        )

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/editImage", methods=["post"])
# This API is used to edit an image based on
# a given prompt using the Stable Diffusion model
def edit_image():
    """
    This API is used to convert image to
    image using a Stable Diffusion model
    """
    try:
        uploaded_files = request.files.getlist(
            "file"
        )  # Get the image from the request body
        for f in uploaded_files:  # Save the image to the uploads folder
            print("Saving File Name: " + f.filename)
            f.save(os.path.join(app.config["UPLOAD_FOLDER"], f.filename))
            secure_filename(f.filename)
            pathurl = os.path.join(app.config["UPLOAD_FOLDER"], f.filename)

        prompt = request.form.get("prompt")
        # Get the prompt from the request body
        model = request.form.get("model")
        guidance = float(request.form.get("guidance"))
        strength = float(request.form.get("strength"))
        inference_steps = int(request.form.get("inferenceSteps"))
        print("Recieved prompt: " + prompt)
        edit_image_generate = ImageEdit()
        # Create a new instance of the ImageEdit class
        # containing the Stable Diffusion model

        images = []
        # Generate an image based on the given prompt

        if model == "runwayml/stable-diffusion-v1-5":
            images.append(
                {
                    "image_data": edit_image_generate.generate(
                        pathurl, prompt, strength, guidance, inference_steps
                    )
                }
            )
        else:
            images.append(
                {
                    "image_data": edit_image_generate.generate_xl(
                        pathurl, prompt, strength, guidance, inference_steps
                    )
                }
            )
        return jsonify(
            {
                "message": "File uploaded successfully",
                "prompt": prompt,
                "images": images,
            }
        )
        # Return a success message with the generated image

    except Exception as e:  # Return an error if an error occurs
        print(str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    """
    Run the server on port 80 with
    deubg mode enabled and threading enabled
    """
    app.run(port=80, debug=True, threaded=True)
