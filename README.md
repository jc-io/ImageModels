# ImageGen
## OS Requirments
This program uses models that require CUDA cores, ensure GPU requirements are met. 
Run on Windows 10 64bit using GitBash Terminal.
## Setup Repository
1. Clone this repository to your machine.
```$ git clone git@github.com:jc-io/ImageModels.git```
2. In terminal navigate to ImageModels repository
```$ cd ImageModels```
3. Change branch to finalRelease 
```$ git checkout finalRelease```
### Environment 
This program runs in Python Version 3.10
Either run natively or use a virtual environment.
#### Virtual Environment Setup
##### On Windows:
1. Install and run Python 3.10 installer, https://www.python.org/ftp/python/3.10.1/python-3.10.1-amd64.exe
2. In the root of the ImageModels folder install virtualenv
```$ pip install virtualenv ```
3. Create virtual environment
```$ python -m venv myenv ``` 
4. Activate virtualenv
```$ source  myenv/Scripts/activate``` or ```$ source  myenv\Scripts\activate```
5. To deactivate virtualenv
```$ deactivate```
## How to Run the Frontend

Navigate to the `frontend` directory and install dependencies, then start the development server:

```bash
cd frontend
npm install
npm install react-axios
npm install --save react-toastify
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser to access the webpage.

## How to Run the Backend
While running `frontend`, open seperate terminal in ImageModels.
Navigate to the `backend` directory, install Python dependencies, and start the backend server:

```bash
cd backend
python -m pip install -r requirements.txt
# if transformers fails to install comment it in requirements.txt out and run
pip install git+https://github.com/huggingface/transformers
python main.py
```

This will create a backend REST API running on port 80, which is used to interact with the upload page in the React frontend.
## Utilizing Machine Learning and Backend

You can add your machine learning models to the backend and test your functionality. Replace responses with altered images or other relevant data. The Models used were Stable Diffusion and BLIP models. These models were researched and sourced from HuggingFace

## Documentation
You can find the documentation for the backend APIs in [docs/](docs/)
- APIs [docs/API.md](docs/API.md)
- CaptionGen   [docs/CaptionGen.md](docs/CaptionGen.md)
- ImageEdit [docs/ImageEdit.md](docs/ImageEdit.md)
- ImageGen [docs/ImageGen.md](docs/ImageGen.md)
## Testing Resources
Visit [http://localhost:3000/ImageGen](http://localhost:3000/ImageGen):
- Sidenote, using CaptionGen LLM and Edit Image/ImageGen XL Stable Diffusion Models will take a long period to time based on your hardware.
### Testing CaptionGen
#### BLIP Stage
##### Valid Response
- Upload Image File 
``` Info Message: "Attempting Image Upload! -> ```
```Success Message: "Success!"```
##### Invalid Response
- Upload empty file
```Warning message: "Upload a File"```
- Upload non-Image file
```Info Message: "Attempting Image Upload! Please wait for it to finish!" ->```
```Error Message: "CaptionGen Failed to Generate."```
#### LLM Stage
##### Valid Response
- Tone Chosen
 ```Info message: "Attempting Image Upload! ->```
 ```Generating a ... Caption! Please wait for it to finish! -> "Success!"```
##### Invalid Response
- No Tone Chosen
```Error Message: "Choose a tone!"```
##### Model Failure
- ```Error Message: "CaptionGen Failed to Generate."```

### Testing Edit Image
##### Valid Response
- Upload Image File and Prompt
``` Info Message: "Loading Image Upload! Please wait for it to finish!"" -> ```
```Success Message: "Success: Image Generated!"```
##### Invalid Response
- No Image File or Prompt
```Warning Message: "Upload a File!"```
```Warning Message: "Enter a Prompt!"```
- Does not have Image File but has Prompt
```Warning Message: "Upload a File!"```
- Upload  Image File but no Prompt
```Warning Message: "Enter a Prompt!"```
- Upload non-Image File but no Prompt
```Warning Message: "Enter a Prompt!"```
- Upload non-Image File and Prompt
```Info Message: "Loading Image Upload! Please wait for it to finish!" -> ```
```Error Message: "Edit Image Failed to Generate."```
##### Model Failure
- ```Error Message: "Edit Image Failed to Generate."```

### Testing ImageGen
##### Valid Response
- Upload Prompt
```Info Message: Loading Image(s)! Please wait for it to finish! -> ```
```Success Message: "Success: Image 1 Generated!" ->```
```Info Message: "Loading next Image! Please wait for it to finish!"```
```...```
```Success Message: "Success: All Image(s) Generated!"```
##### Invalid Response
- No Prompt
```Warning Message: "Enter a Prompt!"```
##### Model Failure
- ```Error Message: "ImageGen Failed to Generate."```

## Side Note

This project utilizes a basic frontend boilerplate based on Facebook's Create React App. You can find more information about it [here](https://github.com/facebook/create-react-app).
