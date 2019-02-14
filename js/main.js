'use strict';

function init() {
    createAll();
    renderAll();
}

function renderAll() {

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

// Select img to upload
function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas)
}

//UPLOAD IMG WITH INPUT FILE
function handleImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    console.log(ev)
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}