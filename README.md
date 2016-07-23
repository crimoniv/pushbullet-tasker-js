# Pushbullet Tasker JS

Send notes, links and/or local files to Pushbullet from Tasker.

## Requirenments

-  A [Pushbullet](https://www.pushbullet.com/) account (a free one should
   suffice).

-  An Android device with [Tasker][tk-play-store] installed in.

## How to use it

1. Get a Pushbullet API key from [Settings > Account > Access Tokens >
   Create Access Token][pb-settings].

2. In Tasker, create and asign the API key to the `pb_token` variable (see:
   [Parameters](#parameters)).

3. Load the library (locally or externally):

    - **Local**: Create new JavaScript action with the following parameter:

        - **Path**: `/sdcard/pushbullet-tasker.js`

    - **External**: Create a new JavaScriptlet action with the following
      parameters:

        - **Code**: `// pushbullet-tasker-js/1.0.0`

        - **Libraries**: `https://cdn.jsdelivr.net/pushbullet-tasker-js/1.0.0/pushbullet-tasker.min.js`

## Parameters

The push paramaters must be set **before** calling the JS library. They can be
set in two interchangeable ways: locally (e.g., `pb_token`) and/or globally
(e.g., `PB_TOKEN`).

-  `PB_TOKEN`: **(required)** Must contain the requestd API Key.

-  `PB_DEBUG`: Enable debug (shows toast messages).

-  `PB_TYPE`: If set, the push will be automatically sent after loading the
   library. Value must be one of `note`, `file` or `link`.

-  `PB_TITLE`: The push title (e.g., `My Push Title`).

-  `PB_BODY`: The push body (e.g., `My push content.`).

-  `PB_URL`: The URL to send (e.g., `https://www.example.com`). Used for `link`
   pushes.

-  `PB_FILE_NAME`: The name of the file you want to upload (e.g., `cat.jpg`).
   Used for `file` pushes.

-  `PB_FILE_TYPE`: The MIME type of the file (e.g., `image/jpeg`). Used for
   `file` pushes.

-  `PB_FILE_PATH`: Absolute path where the file is stored (e.g.,
   `/sdcard/DCIM/Tasker/cat.jpg`). Used for `file` pushes.

## Manual/Multiple pushes

> **NOTE**: Ensure that the paremeter `PB_TYPE` is not set, otherwise the
> library will try to send the push automatically

You can call the push methods manually in a JavaScriptlet. The parameters are
similar but they drop the "PB_" prefix. Not given parameters will be readed
from the environment, as usual.

```javascript
try {
    var pb_title = 'Shared title';
    PB.pushNote({body: "My note content"});
    PB.pushNote({title: 'Overriding the shared title', body: "My content"});
    PB.pushLink({url: "https://example.com"});
    PB.pushFile({
        file_name: "cat.jpg",
        file_type: "image/jpeg",
        file_path: "/sdcard/cat.jpg"
    });
    // In Tasker: pb_file_path = "/sdcard/DCIM/Tasker/photo.jpg"
    PB.pushFile({
        file_name: "photo.jpg",
        file_type: "image/jpeg",
    });
} catch (e) {
    flashLong("Err: " + e.message);
}
```

## Examples

### Push note using external library

```
Push Note (ext. lib.) (1)
A1: Variable Set [ Name:%pb_token To:<insert-your-token> Do Maths:Off Append:Off ]
A2: Variable Set [ Name:%pb_type To:note Do Maths:Off Append:Off ]
A3: JavaScriptlet [ Code:// Libraries:https://cdn.jsdelivr.net/pushbullet-tasker-js/1.0.0/pushbullet-tasker.min.js Auto Exit:On Timeout (Seconds):45 ]
```

### Take and push a photo

(TODO)

## Useful links

- [Pushbullet API][pb-api-docs].
- [Tasker: JavaScript Support][tk-js-support].

## Todo

- Select target devices.

## Changelog

### 1.0.0 (2016-07-22)

- First release

<!-- references -->

[pb-api-docs]: https://docs.pushbullet.com/
[pb-settings]: https://www.pushbullet.com/#settings
[tk-js-support]: http://tasker.dinglisch.net/userguide/en/javascript.html
[tk-play-store]: https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm
