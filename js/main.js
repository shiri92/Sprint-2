'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    createAll();
    renderAll();
    gCtx.font = "30px Arial";
}

function renderAll() {

}

function checkPages(val) {
    if (val === 'gallery') {
        $('.main-gallery').css('display', 'block');
        $('.main-edit').css('display', 'none');
    }
    if (val === 'edit') {
        $('.main-gallery').css('display', 'none');
        $('.main-edit').css('display', 'block');
    }
}


function moveToEdit() {
    $('.main-gallery').css('display', 'none');
    $('.main-edit').css('display', 'block');
}


// CRUDl - create read update delete
function onAddSomething() {
    addSomething(someId);
    renderAll();
}

function onReadSomething(someId) {
    readSomething(someId);
}

function readSomething(someId) {
    var global = getCarById(someId);
    var $modal = $('.modal');
    $modal.find('h5').text(global.name);
    $modal.find('p').text(global.details);
    $modal.show();
}

function onUpdateSomething(someId) {
    updateSomething(someId, someUpdate);
    renderAll();
}

function onDeleteSomething(someId) {
    deleteSomething(someId);
    renderAll();
}


function renderCanvasUpload(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0);
}

function renderCanvasGallery(img) {
    gCanvas.width = img.naturalWidth;
    gCanvas.height = img.naturalHeight;
    var wRatio = gCanvas.width / img.naturalWidth;
    var hRatio = gCanvas.height / img.naturalHeight;
    var ratio = Math.min(wRatio, hRatio);
    gCtx.drawImage(img, 0, 0, gCanvas.width * ratio, gCanvas.height * ratio);
}

// Select img to upload
function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvasUpload);
    moveToEdit();
}

//UPLOAD IMG WITH INPUT FILE
function handleImageFromInput(ev, onImageReady) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}


function chooseImgFromGallery(img) {
    renderCanvasGallery(img);
    moveToEdit();
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    $("#canvasimg").css('display', 'none');
}

// function downloadCanvas(elBtn) {
//     var image = gCanvas.toDataURL('image/png');
//     elBtn.href = image;
// }

function downloadCanvas(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function changeText(textVal) {
    console.log(textVal);
    clearCanvas();
    var spaceUp = gCanvas.width/2;
    var spaceLeft = gCanvas.height/2;
    gCtx.fillStyle = gColorText;
    gCtx.textAlign = "center";
    gCtx.fillText(textVal, spaceLeft, spaceUp);
}

var gColorText = 'black';
var gShadowColor = '';

function changeTextColor(textColor) {
    gColorText = textColor;
    changeText($('.line-text'));
}

function changeShadowColor(shadowColor){
    gShadowColor = shadowColor;
    changeText($('.line-text'));
}

function setColors() {
    var backColor = loadFromStorage('backgroundColor');
    $('body').css('backgroundColor', backColor);
    $('.color-back').val(backColor);
  
    var textColor = loadFromStorage('color');
    $('body').css('color', textColor);
    $('.color-text').val(textColor);
  }