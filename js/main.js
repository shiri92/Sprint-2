'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.font = gFont;
    createImgs();
    renderImgs();
    // setColors();
    $(window).resize(function() {
        changeText();
    });
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
        $('.title').html('Gallery🎞');

    }
    if (val === 'edit') {
        $('.main-gallery').css('display', 'none');
        $('.main-edit').css('display', 'block');
        $('.title').html('Edit🖊');
    }
}

function moveToEdit() {
    $('.main-gallery').css('display', 'none');
    $('.main-edit').css('display', 'block');
    $('.title').html('Edit🖊');
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

    if (gWidthImg < gWidthWindow) {
        gCanvas.width = gWidthImg;
    } else {
        gCanvas.width = gWidthWindow;
    }
    // gCanvas.width = (gWidthImg < gWidthWindow) ? gWidthImg : gWidthWindow;
    if (gHeightImg < gHeightWindow - sum) {
        gCanvas.height = gHeightImg;
    } else {
        gCanvas.height = gHeightWindow - sum - 4;
    }
    // gCanvas.height = (gHeightImg < gHeightWindow - sum) ? gHeightImg : gHeightWindow - sum - 4;

    var wRatio = gCanvas.width / gWidthImg;
    var hRatio = gCanvas.height / gHeightImg;
    var ratio = Math.min(wRatio, hRatio);
    if (ratio === wRatio) {
        var left = 0;
        if (hRatio === 1) {
            var top = (1 - ratio) * gCanvas.height / 2;
        } else {
            var top = (1 - (wRatio / hRatio)) * gCanvas.height / 2;
        }
    } else {
        if (ratio === hRatio) {
            var top = 0;
            if (wRatio === 1) {
                var left = (1 - ratio) * gCanvas.width / 2;
            } else {
                var left = (1 - (hRatio / wRatio)) * gCanvas.width / 2;
            }
        }
    }
    gCtx.drawImage(img, left, top, gWidthImg * ratio, gHeightImg * ratio);

    gTopInput = top;
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

    gColorText[0] = '#ffffff';
    gColorText[1] = '#ffffff';
    gStrokeColor[0] = '#000000';
    gStrokeColor[1] = '#000000';
    $('.color-text').val('#ffffff');
    $('.color-stroke').val('#000000');
    $('.input-text-size-1').val(12);
    $('.input-text-size-2').val(12);
    $('.input-font-1').val('impact');
    $('.input-font-2').val('impact');
    // saveToStorage('textColor', gColorText);
    // saveToStorage('strokeColor', gStrokeColor);

    updateStrLinesValue(true);
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

    var spaceInputUp = 50 + gTopInput;
    var valUp = $('.line-text-up').val();
    if (valUp) {
        gCtx.font = gFont[0];
        gCtx.fillStyle = gColorText[0];
        gCtx.strokeStyle = gStrokeColor[0];
        gCtx.fillText(valUp, spaceLeft, spaceInputUp);
        gCtx.strokeText(valUp, spaceLeft, spaceInputUp);
    }
    var spaceInputDown = gHeightImg - 10 - gTopInput;
    var valDown = $('.line-text-down').val();
    if (valDown) {
        gCtx.font = gFont[1];
        gCtx.fillStyle = gColorText[1];
        gCtx.strokeStyle = gStrokeColor[1];
        gCtx.fillText(valDown, spaceLeft, spaceInputDown);
        gCtx.strokeText(valDown, spaceLeft, spaceInputDown);
    }

    for (var i = 2; i < gLineNumber; i++) {
        gCtx.font = gFont[i];
        gCtx.fillStyle = gColorText[i];
        gCtx.strokeStyle = gStrokeColor[i];
        var classToChange = '.line-text-' + (i + 1);
        var valNewLine = $(classToChange).val();
        if (valNewLine) {
            gCtx.fillText(valNewLine, spaceLeft, gCanvas.height / 2);
            gCtx.strokeText(valNewLine, spaceLeft, gCanvas.height / 2);
        }
        gInputs[i - 2] = valNewLine;
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
    gFontSize[number - 1] = $(classToChange).val();
    gFont[number - 1] = (gFontSize[number - 1] * 4) + 'px ' + gFontFamily[number - 1];
    changeText();
}


function onSetFontFamily(newFont, number) {
    gFontFamily[number - 1] = newFont;
    gFont[number - 1] = (gFontSize[number - 1] * 4) + 'px ' + gFontFamily[number - 1];
    changeText();
}

function onRemoveInputText(elBtn, number) {
    var textDiv = elBtn.parentElement;
    textDiv.innerHTML = '';
    // gStrLines.splice((number - 1), 1);
    gStrLines[number - 1] = '';
    changeText();
}

function updateStrLinesValue(isClear) {
    for (var i = 0; i < gStrLines.length; i++) {

        var classToUpdate = '.line-text-' + (i + 3);
        $(classToUpdate).val((isClear) ? '' : gInputs[i]);

        classToUpdate = '.color-text-' + (i + 3);
        $(classToUpdate).val((isClear) ? '#ffffff' : gColorText[i + 2]);

        classToUpdate = '.color-stroke-' + (i + 3);
        $(classToUpdate).val((isClear) ? '#000000' : gStrokeColor[i + 2]);

        classToUpdate = '.input-text-size-' + (i + 3);
        $(classToUpdate).val((isClear) ? 12 : gFontSize[i + 2]);

        classToUpdate = '.input-font-' + (i + 3);
        $(classToUpdate).val((isClear) ? 'impact' : gFontFamily[i + 2]);
    }
}

function onRenderNewLine() {
    gLineNumber++;
    var strLine = `
    <div>
                    <input class="line-text-${gLineNumber}" oninput="changeText()" type="text" placeholder="write line✍">
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
                    <select class="input-font-${gLineNumber}" onchange="onSetFontFamily(this.value,${gLineNumber})">
                        <option value="impact">Impact</option>
                        <option value="ubuntu">Ubuntu</option>
                        <option value="Play">play</option>
                        <option value="Inconsolata">inconsolata</option>
                    </select>
                </div>
    `;

    gStrLines.push(strLine);

    $('.new-lines').html(gStrLines.join(''));

    gInputs.push('');

    gColorText.push('#ffffff');
    gStrokeColor.push('#000000');

    gFontSize.push(12);
    gFontFamily.push('impact');
    gFont.push((gFontSize[gLineNumber - 1] * 4) + 'px ' + gFontFamily[gLineNumber - 1]);

    updateStrLinesValue(false);

    changeText();

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