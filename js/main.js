'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    createImgs();
    renderImgs();
}

function renderImgs() {
    var imgs = getImgs();
    var strHtml = imgs.map(function(img) {
        return `<img onclick="chooseImgFromGallery(this)" src="${img.url}" alt="img">`
    })
    $('.photo-gallery').html(strHtml.join(''));
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
// function onAddSomething() {
//     addSomething(someId);
//     renderAll();
// }

// function onReadSomething(someId) {
//     readSomething(someId);
// }

// function readSomething(someId) {
//     var global = getCarById(someId);
//     var $modal = $('.modal');
//     $modal.find('h5').text(global.name);
//     $modal.find('p').text(global.details);
//     $modal.show();
// }

// function onUpdateSomething(someId) {
//     updateSomething(someId, someUpdate);
//     renderAll();
// }

// function onDeleteSomething(someId) {
//     deleteSomething(someId);
//     renderAll();
// }


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
    reader.onload = function(event) {
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

function onNextPage() {
    nextPage();
    renderImgs();
}

function onPrevPage() {
    prevPage();
    renderImgs();
}