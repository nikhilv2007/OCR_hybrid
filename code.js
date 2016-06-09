
document.addEventListener("deviceready", onDeviceReady, false);
		
function onDeviceReady() {
		
	//document.addEventListener("online", onOnline, false);
	//document.addEventListener("offline", onOffline, false);
	
}

function invokeCamera(){	
    navigator.camera.getPicture(cameraSuccess, cameraFail, {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        //popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
        //cameraDirection:Camera.Direction.BACK
    });
}

function cameraSuccess(imageURI) {
    // Load image on html
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageURI;
}

function cameraFail(message) {
	if(message != "Camera cancelled."){
		alert('Camera Failed because: ' + message);
	}  
}

function cleanSuccess() {
	console.log("Camera cleanup success.");
}
	
function cleanFail(message) {
    alert('Failed because: ' + message);
}

/*
* Load image data from html element and make API call
*/
function getText(){
    alert("inside getText");
    
    var image = document.getElementById("myImage").getAttribute('src');
    dataURItoBlob(image);
    //ocrSpace(blob);
}

/*
* Load image from local storage
*/
function previewFile() {
    alert("inside previewFile");
    
    //var preview = document.getElementById("myImage");
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
        alert(reader.result);
        document.getElementById("myImage").src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

/*
* Converts dataURI to a blob instance
*/
function dataURItoBlob(dataURI) {
    alert("inside dataURItoBlob");
    alert(dataURI);
    
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }
    alert(byteString);
    
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    alert("mimeString = "+ mimeString);
    
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    alert(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    var blob = new Blob([ia], {
        type: mimeString
    });
    alert(blob);
    
    //return blob;
    ocrSpace(blob);
}

/*
* API call to ocrSpace
*/
function ocrSpace(imageBlob){
    alert("inside ocrSpace");
    
    //Prepare form data
    var formData = new FormData();
    formData.append("file", imageBlob, "ocr-file.jpg");
    formData.append("apikey", "helloworld");
    //formData.append("url", image);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", true);
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == 4 && request.status == 200) {
            var response = JSON.parse(request.responseText);
            if(response.IsErroredOnProcessing){
                alert("Error occured & error message - " + response.ErrorMessage)
            }
            else{
                document.getElementById("imageText").value = response.ParsedResults[0].ParsedText;
            }
        }
        /*else{
            alert("Error occured while communicating to server");
        }*/
    }
    request.open("POST", "https://api.ocr.space/parse/image");
    request.send(formData);
    
}

/*
* Share text to other apps
*/
function shareText(){
    // Purpose - Used to share text on social media apps.
    // Source - https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/blob/ac66d5d/README.md
    //alert("inside share function");
    
    var message = document.getElementById("imageText").value;
    window.plugins.socialsharing.share(message)
}