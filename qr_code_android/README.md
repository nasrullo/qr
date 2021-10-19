## QR code authentication

A new Flutter project on QR login for personal and business usage.

### Getting started

##### Start Client Server

1. Clone project from GitHub repository:

   https://github.com/akmaljalilov/qr-code-server.git

2. Run main.go

By default authorized user is a user written in the folder DB, file users.json
You can add more...

#### Start UI
1. Clone project from GitHub repository:

   https://github.com/akmaljalilov/qr_code_android.git

2. Get the Flutter SDK.

   sudo snap install flutter --classic

3. Get the Android SDK.

   sudo apt update && sudo apt install android-sdk

The location of Android SDK on Linux can be any of the following:

/home/AccountName/Android/Sdk

/usr/lib/android-sdk

/Library/Android/sdk/

/Users/[USER]/Library/Android/sdk

Find the SDKs path and set them to IntelliJ IDEA settings.

- Go to File>Settings>Appearance & Behaviour>System Settings>Android SDK
- In the Android SDK Location specify the path to your downloaded android sdk like one mentioned above
- Go to File>Settings>Languages & Frameworks>Flutter
- In the Flutter SDK path specify the path to flutter directory

### Run application
- Go to Tools>Flutter>Flutter Pub get
- From Flutter Device Selection Drop Down menu in top right of window select the device on which you want to run application
- Press run or debug button to start application

### How to use?

- Run application on multiple devices
- Login with one of the devices with provided login and password (by default login=1, password=1)
- You will be redirected to the home page where you can press the button - Connect via QR
- After you press the button the camera scanner opens
- Place the camera focus on other devices' QR code image on login page, which are not authorized
- After you scan QR, your unauthenticated device will be authenticated and redirected to the home page