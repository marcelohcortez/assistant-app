# Assistant App
React Native app that uses ChatGPT and DALL-E APIs with speech-to-text and text-to-speech.

The app is fully functional and responsive.

## Tech & 3rd party used in the project:
- [React](https://react.dev/)
- [React Native](https://reactnative.dev/)
- [Axios](https://axios-http.com/docs/intro)
- [Nativewind](https://www.nativewind.dev/)
- [React Native TTS](https://www.npmjs.com/package/react-native-tts)
- [React Native Voice](https://github.com/react-native-voice/voice)

# Get API KEY:
- Go to https://openai.com
- Create a new account and get your api key
- Inside the main folder, create a file callend: '.env'
- Add the api key in the .env file, like this:
```bash
  REACT_APP_OPENAI_KEY=YOUR_KEY_HERE
```

# How to run the project:
- Clone the repository
- In the main folder, run
```bash
  npm install
```
If you are using iOS, build Pod file
```bash
  cd ios
  pod install
```
- Start Metro with
```bash
  npm start
```


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

