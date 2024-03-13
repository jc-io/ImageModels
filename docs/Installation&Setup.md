## OS Requirements
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
