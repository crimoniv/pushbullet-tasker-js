if ( typeof tk === 'undefined' ) {
    // Allow test from web browsers
    var tk = {
        local: function () {},
        global: function () {},
        flashLong: console.log,
    }
}

var PB = (function(tk, window, undefined) {
    'use strict';

    var API = {},
        BASE_URL = 'https://api.pushbullet.com/v2/',
        PUSH_URL = BASE_URL + 'pushes',
        UPLOAD_REQUEST_URL = BASE_URL + 'upload-request';

    var HttpStatus = {
        OK: 200,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
    };

    API.debug = getenv('pb_debug', false);
    API.token = getenv('pb_token', null);

    function push(type, data) {
        var req = buildRequest('POST', PUSH_URL, {
            'Access-Token': API.token,
        })

        data.type = type;
        req.send(buildFormData(data));

        if ( API.debug ) {
            tk.flashLong(req.responseText)
        }

        if ( req.status !== HttpStatus.OK ) {
            throw new Error('Unable to push data: ' + req.status)
        }

        return req.responseText;
    }

    function uploadRequest(file_name, file_path, file_type) {
        var req = buildRequest('POST', UPLOAD_REQUEST_URL, {
            'Access-Token': API.token,
        })

        req.send(buildFormData({
            file_name: file_name,
            file_type: file_type,
        }));

        if ( API.debug ) {
            tk.flashLong(req.responseText)
        }

        if ( req.status !== HttpStatus.OK ) {
            throw new Error('Unable to request upload URL: ' + req.status)
        }

        return JSON.parse(req.responseText);
    }

    function readFileAsBlob(path) {
        /**
         * Read file as Blob
         *
         * @see: https://developer.mozilla.org/en-US/docs/Web/API/
         *          XMLHttpRequest/Using_XMLHttpRequest#Handling_binary_data
         */
        var req = buildRequest('GET', path)
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.send();

        var res = req.responseText;
        var bytes = new window.Uint8Array(res.length);

        for ( var i = 0, len = res.length; i < len; i++ ) {
            bytes[i] = res.charCodeAt(i);
        }

        return new window.Blob([bytes]);
    }

    function uploadFile(file_name, file_path, file_type) {
        var upload = uploadRequest(file_name, file_type);
        var req = buildRequest('POST', upload.upload_url)

        req.send(buildFormData({
            file: readFileAsBlob(file_path),
        }));

        if ( req.status !== HttpStatus.NO_CONTENT ) {
            throw new Error('Unable to upload file: ' + req.status)
        }

        return upload.file_url;
    }

    function buildFormData(data) {
        var formData = new window.FormData();

        for ( var key in data ) {
            if ( data.hasOwnProperty(key) ) {
                formData.append(key, data[key]);
            }
        }

        return formData;
    };

    function buildRequest(method, url, headers) {
        var req = new window.XMLHttpRequest();
        req.open(method.toUpperCase(), url, false); /* ensure sync request */
        for ( var key in (headers || {}) ) {
            if ( headers.hasOwnProperty(key) ) {
                req.setRequestHeader(key, headers[key]);
            }
        }
        return req
    }

    function getenv(varName, defVal) {
        var val = typeof window[varName] !== 'undefined' ? window[varName] : (
            tk.local(varName.toLowerCase()) ||
            tk.global(varName.toUpperCase()) ||
            defVal );

        if ( typeof val === 'undefined' ) {
            throw new Error('Undefined variable "' + varName + '"!');
        }

        return val
    }

    API.pushNote = function (options) {
        var options = options || {};
        return push('note', {
            title: options.title || getenv('pb_title', ''),
            body: options.body || getenv('pb_body', ''),
        });
    };

    API.pushFile = function (options) {
        var options = options || {};
        var file_name = options.file_name || getenv('pb_file_name')
        var file_path = options.file_path || getenv('pb_file_path')
        var file_type = options.file_type || getenv('pb_file_type')
        return push('file', {
            title: options.title || getenv('pb_title', ''),
            body: options.body || getenv('pb_body', ''),
            file_name: file_name,
            file_type: file_type,
            file_url: uploadFile(file_name, file_path, file_type),
        });
    }

    return API;
})(tk, this);
