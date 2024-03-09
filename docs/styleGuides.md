# Project Style Guide

This document outlines the style guide for both the Python backend which uses Flask. And React frontend projects. Following consistent coding styles and practices helps in maintaining readability, reducing errors, and promoting collaboration within the development team.

## Python Backend Style Guide

### 1. Code Formatting

- Use 4 spaces for indentation. This is equivalant to using tabs.
- Use snake_case for variable and function names.
- Use CamelCase for class names. 
- - This was used in ImageGen, EditImage, CaptionGen.
- Limit lines to 79 characters.
- - This is subjective, however the line shouldn't be longer than a screen size.
- Separate top-level function and class should have their own files.

### 2. Import Statements

- Import statements should be grouped in the following order:
  1. Standard library imports
  2. Related third-party imports
  3. Local application/library specific imports
- Separate each group with a blank line.
- Within each group, imports should be sorted alphabetically.
- Do not incude unnecessary libraries which can be done with a few lines instead.


### 3. Naming Conventions

- Use meaningful and descriptive names.
- Avoid single-letter variable names except for iterators.

### 4. Error Handling

- Use specific exception types whenever possible.
- Use try-except blocks judiciously. This is useful for preventing the code from breaking in the middle of production
- Provide helpful error messages and handle exceptions gracefully. The API should give enough information to the frontend user.

### 5. Comments

- Use comments to explain complex code or to provide context where needed.
- Avoid unnecessary comments for obvious code. This would be subjective since not all memebers of the team will know how things work.

## React Frontend Style Guide

### 1. Code Formatting

- Use 2 spaces for indentation.
- Use camelCase for variable and function names.
- Use PascalCase for component names.
- Limit lines to 100 characters. This is subjective, however the line shouldn't be longer than a screen size.
- Separate top-level component definitions with one blank line.

### 2. Component Structure

- Separate presentational components and container components.
- Keep components small and focused on a single responsibility. Ex, is NavBar.

### 3. State Management

- Use React hooks for managing state in functional components.
- use UseState to manage changing variables and keep consistant naming and structure.

### 4. File Structure

- Organize files by feature or module.
- Separate CSS files for each component or module. 
- Each page should have it own folder and be located in src/pages/...

### 5. CSS Styling

- Use CSS modules or styled-components for styling components.
- Avoid inline styles except for dynamic styling.
- Attempt to use tailwindcss and avoid using to much css files.

### 6. Error Handling

- Use try-catch blocks for asynchronous code and handle errors gracefully.
- Use React Error Boundaries to catch and handle errors in components.
- Make sure there are fallbacks and all UseState should be optional 

### 7. Comments

- Use comments to explain complex logic or to provide context where needed.
- Document props and state where necessary.

## Conclusion

Adhering to this style guide ensures consistency and maintainability across both backend and frontend codebases. Consistent coding practices contribute to better readability, easier debugging, and smoother collaboration among team members.