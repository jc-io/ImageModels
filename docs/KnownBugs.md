# Known Bugs
- A black image may be returned for Edit Image and ImageGen generation if the model detects NSFW content in the image or prompt, for which the reason is not shown to the user
- The account settings page does not correctly save changed settings to the account (It is an incomplete feature)
- The account dropdown blob at the top right of the page when logged in may not align with the position of the button
- The image preview of the uploaded image for both CaptionGen and Edit Image may appear broken in some system configurations
- If the backend is stopped and restarted after while the frontend is still running and an account is logged in, the archive/explore page will not work properly
- Clicking the Advanced Image Settings button in the Edit Image page may have a visual glitch(whitespace) at the bottom of the page
- The sign up page is accessible through the home page while a user is already logged in
- While a picture is generating in both ImageGen and Edit Image with pending images, clicking back will forcibly put the user in the results page