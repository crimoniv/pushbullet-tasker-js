# Pushbullet Tasker JS
Send notes, links and/or local files to PB from Tasker.

## Requirenments
* A [Pushbullet](https://www.pushbullet.com/) account (a free one should suffice).
* An Android device with [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm) installed in.

## How to use it
1) Get a Pushbullet API key from [Settings > Account > Access Tokens > Create Access Token](https://www.pushbullet.com/#settings).
2) In Tasker, create and asign the API key to the `pb_token` variable (see: Push Parameters).
3) Load the library locally or externally:
    1) Local: Create new JavaScript action with the following parameter:
        * Path: `/sdcard/pushbullet-tasker.js`.
    2) External: Create a new JavaScriptlet action with the following parameters:
        * Code: `// Pushbullet Tasker JS - v0.9.0
        * Libraries: `//dom.com/x.x.x/pushbullet-tasker.js` (TODO)

## Parameters
The push paramaters must be set **before** calling the JS library. They can be set in two interchangeable ways: locally (e.g., `pb_token`) and/or globally (e.g., `PB_TOKEN`).
* `PB_TOKEN`: Must contain the requestd API Key. **REQUIRED**.
* `PB_DEBUG`: Enable debug (shows toast messages).
* `PB_TYPE`: If set, the push will be automatically sent after loading the library. Value must be one of `note`, `file` or `link`.
* `PB_TITLE`: The push title (e.g., `My Push Title`).
* `PB_BODY`: The push body (e.g., `My push content.`).
* `PB_URL`: The URL to send (e.g., `https://www.example.com`). Used for `link` pushes.
* `PB_FILE_NAME`: The name of the file you want to upload (e.g., `cat.jpg`). Used for `file` pushes.
* `PB_FILE_TYPE`: The MIME type of the file (e.g., `image/jpeg`). Used for `file` pushes.
* `PB_FILE_PATH`: Absolute path where the file is stored (e.g., `/sdcard/DCIM/Tasker/cat.jpg`). Used for `file` pushes.

## Manual/Multiple pushes
    NOTE: Ensure that the paremeter `PB_TYPE` is not set, or the library will try to send the push automatically

You can call the push methods manually in a JavaScriptlet. The parameters are similar but they drop the "PB_" prefix. Not given parameters will be readed from the environment, as usual.

```
try {
    var pb_title = 'Shared title';
    PB.pushNote({body: "My note content"});
    PB.pushNote({title: 'Overriding the shared title', body: "My note content"});
    PB.pushLink({url: "https://example.com"});
    PB.pushFile({
        file_name: "cat.jpg",
        file_type: "image/jpeg",
        file_path: "/sdcard/cat.jpg"
    });
    // With "pb_file_path" defined as Tasker variable (e.g.: "/sdcard/DCIM/Tasker/photo.jpg")
    PB.pushFile({
        file_name: "photo.jpg",
        file_type: "image/jpeg",
    });
} catch (e) {
    flashLong("Err: " + e.message);
}
```

## Examples
### Push Note using external library
```
Push Note (ext. lib.) (1)
A1: Variable Set [ Name:%pb_token To:XXX Do Maths:Off Append:Off ] 
A2: Variable Set [ Name:%pb_type To:note Do Maths:Off Append:Off ] 
A3: JavaScriptlet [ Code:// Libraries://dom.com/x.x.x/pushbullet-tasker.js Auto Exit:On Timeout (Seconds):45 ] 
```
### Take n' push a photo
(TODO)

## Useful links
* [Pushbullet API](https://docs.pushbullet.com/).
* [Tasker: JavaScript Support](http://tasker.dinglisch.net/userguide/en/javascript.html).

## Todo
* Select target devices.
