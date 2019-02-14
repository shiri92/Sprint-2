'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    createAll();
    renderAll();
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


function renderCanvas(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0);
}

// Select img to upload
function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas)
    moveToEdit();
}

//UPLOAD IMG WITH INPUT FILE
function handleImageFromInput(ev, onImageReady) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}


function chooseImgFromGallery(img) {
    renderCanvas(img);
    moveToEdit();
}