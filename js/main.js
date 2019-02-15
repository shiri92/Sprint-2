'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.font = gFont;
    createImgs();
    renderImgs();
    // setColors();
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
    $('.color-text').val('#ffffff');
    saveToStorage('textColor', gColorText);

    gStrokeColor = 'black';
    $('.color-stroke').val('#000000');
    saveToStorage('strokeColor', gStrokeColor);
}

function downloadCanvas(elLink) {
    var imgContent = gCanvas.toDataURL('image/png');
    elLink.href = imgContent
}

function changeText() {

    clearCanvas();
    renderCanvasGallery(gCurrImg);

    gCtx.textAlign = 'center';
    gCtx.lineWidth = 3;

    var spaceLeft = gCanvas.width / 2;

    var spaceInputUp = 60;
    var elUp = $('.line-text-up').val();
    if (elUp) {
        gCtx.font = gFont[0];
        gCtx.fillStyle = gColorText[0];
        gCtx.strokeStyle = gStrokeColor[0];
        gCtx.fillText(elUp, spaceLeft, spaceInputUp);
        gCtx.strokeText(elUp, spaceLeft, spaceInputUp);
    }
    var spaceInputDown = gHeightImg - 20;
    var elDown = $('.line-text-down').val();
    if (elDown) {
        gCtx.font = gFont[1];
        gCtx.fillStyle = gColorText[1];
        gCtx.strokeStyle = gStrokeColor[1];
        gCtx.fillText(elDown, spaceLeft, spaceInputDown);
        gCtx.strokeText(elDown, spaceLeft, spaceInputDown);
    }

    for (var i = 2; i < gLineNumber; i++) {
        gCtx.font = gFont[i];
        gCtx.fillStyle = gColorText[i];
        gCtx.strokeStyle = gStrokeColor[i];
        var classToChange = '.line-text-' + (i + 1);
        var elNewLine = $(classToChange).val();
        if (elNewLine) {
            gCtx.fillText(elNewLine, spaceLeft, gCanvas.height / 2);
            gCtx.strokeText(elNewLine, spaceLeft, gCanvas.height / 2);
        }
    }

}

function changeTextColor(textColor, number) {
    gColorText[number - 1] = textColor;
    changeText();
    // saveToStorage('textColor', textColor);
}

function changeStrokeColor(strokeColor, number) {
    gStrokeColor[number - 1] = strokeColor;
    changeText();
    // saveToStorage('strokeColor', strokeColor);
}

function onChangeFontSize(number) {
    var classToChange = '.input-text-size-' + number;
    var newSize = $(classToChange).val();
    gFontSize[number - 1] = newSize * 4 + 'px';
    gFont[number - 1] = gFontSize[number - 1] + ' ' + gFontFamily[number - 1];
    changeText();
}

function onRemoveInputText(elBtn, number) {
    var textDiv = elBtn.parentElement;
    textDiv.innerHTML = '';
    // gStrLines.splice((number - 1), 1);
    gStrLines[number - 1] = '';
}

function onSetFont(newFont, number) {
    var classToChange = '.font-input-' + number;
    gFontFamily[number - 1] = newFont;
    gFont[number - 1] = gFontSize[number - 1] + ' ' + gFontFamily[number - 1];

    changeText();
}

function onRenderNewLine() {
    gLineNumber++;

    var strLine = `
    <div>
                    <input class="line-text-${gLineNumber}" oninput="changeText()" type="text" placeholder="write line">
                    <button class="delete-line" onclick="onRemoveInputText(this,${gLineNumber})">🗑️</button>
                    <input class="color-text-${gLineNumber}" onchange="changeTextColor(this.value,${gLineNumber})" type="color" value="#ffffff">
                    <input class="color-stroke-${gLineNumber}" onchange="changeStrokeColor(this.value,${gLineNumber})" type="color" value="#000000">
                    <div class="select-editable">
                        <select onchange="this.nextElementSibling.value=this.value; onChangeFontSize(${gLineNumber})">
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            </select>
                        <input class="input-text-size-${gLineNumber}" onchange="onChangeFontSize(${gLineNumber})" type="text" name="format" value="12" />
                    </div>
                    <select class="font-input-${gLineNumber}" onchange="onSetFont(this.value,${gLineNumber})">
                        <option value="impact">Impact</option>
                        <option value="ubuntu">Ubuntu</option>
                        <option value="Play">play</option>
                        <option value="Inconsolata">inconsolata</option>
                    </select>
                </div>
    `;

    gStrLines.push(strLine);

    $('.new-lines').html(gStrLines.join(''));

    gColorText.push('white');
    gStrokeColor.push('black');

    gFontSize.push('50px');
    gFontFamily.push('impact-meme');
    gFont.push('50px impact-meme');

}

function onNextPage() {
    nextPage();
    renderImgs();
}

function onPrevPage() {
    prevPage();
    renderImgs();
}




// function setColors() {
//     var stokeColor = loadFromStorage('strokeColor');
//     gStrokeColor = stokeColor;
//     $('.color-stroke').val(stokeColor);

//     var textColor = loadFromStorage('textColor');
//     if (textColor) {
//         gColorText = textColor;
//         $('.color-text').val(textColor);
//     } else {
//         gColorText = 'white';
//         $('.color-text').val('#ffffff');
//     }
// }