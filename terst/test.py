
class InputValidationError(Exception):
    def __init__(self, error: jsonschema.exceptions.ValidationError):
        self._error_message = error.message

    def __str__(self):
        return f"InputValidationError: {self._error_message}"

class OutputValidationError(Exception):
    def __init__(self, error: jsonschema.exceptions.ValidationError):
        self._error_message = error.message

    def __str__(self):
        return f"OutputValidationError: {self._error_message}"

with open(validation_path/'validation'/'input_validation.json', 'r') as f:
    self._input_schema = json.load(f)
with open(validation_path/'validation'/'output_validation.json', 'r') as f:
    self._output_schema = json.load(f)

def _validate_input_json(self, input_json_data):
try:
    jsonschema.validate(instance=input_json_data,
                        schema=self._input_schema)
except jsonschema.exceptions.ValidationError as err:
    raise InputValidationError

def _validate_input_json(self, ouput_json_data):
try:
    jsonschema.validate(instance=ouput_json_data,
                        schema=self._output_schema)
except jsonschema.exceptions.ValidationError as err:
    raise OutputValidationError
