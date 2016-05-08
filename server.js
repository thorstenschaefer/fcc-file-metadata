'use strict';

var express = require('express');

var app = express();
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Bind the page
app.get("/", function(req, res) {
    return res.send(`
      <html>
        <head>
        <script src="https://code.jquery.com/jquery-2.2.3.min.js" integrity="sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo=" crossorigin="anonymous"></script>
        <script>
          var performUpload = function() {
            var formData = new FormData($('form')[0]);
            $.ajax({
                url: '/upload',
                type: 'POST',
                xhr: function() {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // Check if upload property exists
                        myXhr.upload.addEventListener('progress',function(p) { console.log(p); }, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                //Ajax events
                success: function(result) { alert("The size of your file is: " + result.size + " bytes"); },
                error: function(e) { alert("Error: " + JSON.stringify(e)); },
                // Form data
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
          };
        </script>
        </head>
        <body>
          <h1>FCC File Metadata Challenge</h1>
          Please choose a file and then click upload.
          <form action="upload" method="post" enctype="multipart/form-data">
            <input name="userFile" type="file" size="50"> 
            <button type="button" onclick="{ performUpload(); }">
              Upload
            </button>
          </form>
        </body>
      </html>
    `);
});

// Bind the upload
app.post('/upload', upload.single('userFile'), function (req, res) {
  console.log("Received upload request");
    var file = req.file;
    var result = { "size" : file.size };
    console.log("Sending result: " + JSON.stringify(result));
    res.send(result);
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});