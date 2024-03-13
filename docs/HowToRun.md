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
