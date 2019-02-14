'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.font = gFontSize;
    createImgs();
    renderImgs();
}

function renderImgs() {
    var imgs = getImgs();
    var strHtml = imgs.map(function (img) {
        return `<img onclick="chooseImgFromGallery(this)" src="${img.url}" alt="img">`
    })
    $('.photo-gallery').html(strHtml.join(''));
}

function checkPages(val) {
    if (val === 'gallery') {
        $('.main-gallery').css('display', 'block');
        $('.main-edit').css('display', 'none');
        $('.title').html('Gallery');

    }
    if (val === 'edit') {
        $('.main-gallery').css('display', 'none');
        $('.main-edit').css('display', 'block');
        $('.title').html('Edit');
    }
}

function moveToEdit() {
    $('.main-gallery').css('display', 'none');
    $('.main-edit').css('display', 'block');
    $('.title').html('Edit');
}

function renderCanvasUpload(img) {
    gCurrImg = img;
    gWidthImg = img.naturalWidth;
    gHeightImg = img.naturalHeight;
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0);
}

function renderCanvasGallery(img) {
    gCurrImg = img;
    gWidthImg = img.naturalWidth;
    gHeightImg = img.naturalHeight;
    gWidthWindow = $(window).innerWidth();
    gHeightWindow = $(window).innerHeight();
    var headerH = $('header').innerHeight();
    var titleH = $('.title-container').innerHeight();
    var inputsH = $('.input-bar').innerHeight();
    var footerH = $('footer').innerHeight();
    var sum = headerH + titleH + inputsH + footerH;
    // console.log('headerH', headerH);
    // console.log('titleH', titleH);
    // console.log('inputsH', inputsH);
    // console.log('fotterH', footerH);

    if (gWidthImg < gWidthWindow) {
        gCanvas.width = gWidthImg;
    } else {
        gCanvas.width = gWidthWindow;
    }
    // console.log(sum);
    if (gHeightImg < gHeightWindow - sum) {
        gCanvas.height = gHeightImg;
    } else {
        gCanvas.height = gHeightWindow - sum;
    }

    // var wRatio = gCanvas.width / gWidthImg;
    // var hRatio = gCanvas.height / gHeightImg;
    // var ratio = Math.min(wRatio, hRatio);

    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
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
    changeText();
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gWidthImg, gHeightImg);
    $("#canvasimg").css('display', 'none');
    renderCanvasGallery(gCurrImg);
}

function clearText() {
    $('.line-text-up').val('');
    $('.line-text-down').val('');
    gColorText = 'white';
    gStrokeColor = 'black';
}

function downloadCanvas(elLink) {
    var imgContent = gCanvas.toDataURL('image/png');
    elLink.href = imgContent
}

function changeText() {

    clearCanvas();
    renderCanvasGallery(gCurrImg);

    var spaceLeft = gCanvas.width / 2;
    gCtx.fillStyle = gColorText;
    gCtx.textAlign = 'center';
    gCtx.font = gFontSize;
    gCtx.color = gColorText;
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = gStrokeColor;

    var spaceInputUp = 60;
    var elUp = $('.line-text-up').val();
    gCtx.fillText(elUp, spaceLeft, spaceInputUp);
    gCtx.strokeText(elUp, spaceLeft, spaceInputUp);

    var spaceInputDown = gHeightImg - 20;
    var elDown = $('.line-text-down').val();
    gCtx.fillText(elDown, spaceLeft, spaceInputDown);
    gCtx.strokeText(elDown, spaceLeft, spaceInputDown);

}

function changeTextColor(textColor) {
    gColorText = textColor;
    changeText();
}

function changeStrokeColor(strokeColor) {
    gStrokeColor = strokeColor;
    changeText();
}

function setColors() {
    var backColor = loadFromStorage('backgroundColor');
    $('body').css('backgroundColor', backColor);
    $('.color-back').val(backColor);

    var textColor = loadFromStorage('color');
    $('body').css('color', textColor);
    $('.color-text').val(textColor);
}

function onNextPage() {
    nextPage();
    renderImgs();
}

function onPrevPage() {
    prevPage();
    renderImgs();
}