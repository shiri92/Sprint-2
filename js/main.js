'use strict';

function init() {
    gCanvas = document.getElementById('edit-canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.font = gFont;
    createImgs();
    renderImgs();
    $(window).resize(function() {
        changeText();
    });
    renderKeywordsList();
}


function renderImgs() {
    var imgs = getImgs();
    var newImgs = imgs.reduce(function(acc, img) {
        if (img.isShown === true) {
            acc.push(img);
        }
        return acc;
    }, [])

    var strHtml = newImgs.map(function(img) {
        return `<img onclick="chooseImgFromGallery(this)" src="${img.url}" alt="img">`
    })
    $('.photo-gallery').html(strHtml.join(''));
}



function searchImgByWord() {
    var inputTxt = $('#search').val();
    for (var i = 0; i < gImgs.length; i++) {
        var imgKeywords = gImgs[i].keywords;
        for (var j = 0; j < imgKeywords.length; j++) {
            gAllkeywords.push(imgKeywords[j]);
            gKeywordsFiltered = gAllkeywords.filter(function(keyword, i) {
                return gAllkeywords.indexOf(keyword) === i;
            })
            if (imgKeywords[j].indexOf(inputTxt.toLowerCase()) > -1) {
                gImgs[i].isShown = true;
                break;
            } else {
                gImgs[i].isShown = false;
            }
        }
    }
    renderImgs();
    renderKeywordsList();
}

function showKeyWordsOnSearch() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById('keywords-searchbox');
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('a')[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function renderKeywordsList() {
    var strUl = gKeywordsFiltered.map(function(keyword) {
        return `<li><a href="#">${keyword}</a></li>`
    })
    $('.keywords-searchbox').html(strUl.join(''));
}



function checkPages(val) {
    if (val === 'gallery') {
        $('.main-gallery').css('display', 'flex');
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

    if (isFirstEdit) {
        onRenderNewLine();
        onRenderNewLine();
        $('.line-text-1').focus();
        isFirstEdit = false;
    }
}


function renderCanvasGallery(img) {
    if (img) {
        gCurrImg = img;
        gWidthImg = img.naturalWidth;
        gHeightImg = img.naturalHeight;
        gWidthWindow = $(window).innerWidth();
        gHeightWindow = $(window).innerHeight(); ////////////////////////////////לבדוק וינדואו פחות הקנבס 
        var headerH = $('header').innerHeight();
        var titleH = $('.title-container').innerHeight();
        var inputsH = $('.input-bar').innerHeight();
        var footerH = $('footer').innerHeight();
        var sum = headerH + titleH + inputsH + footerH;

        gCanvas.width = (gWidthImg < gWidthWindow) ? gWidthImg : gWidthWindow;
        gCanvas.height = (gHeightImg < gHeightWindow - sum) ? gHeightImg : gHeightWindow - sum - 4;

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
            gTopInput = top;
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
    }
}

// Select img to upload
function onFileInputChange(ev) {
    handleImageFromUpload(ev, renderCanvasGallery);
    moveToEdit();
}

//UPLOAD IMG WITH INPUT FILE
function handleImageFromUpload(ev, onImageReady) {
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
    // gCtx.clearRect(0, 0, gWidthImg, gHeightImg);
    renderCanvasGallery(gCurrImg);
}

function clearText() {
    updateStrLinesValue(true);
}

function downloadCanvas(elLink) {
    var imgContent = gCanvas.toDataURL('image/png');
    elLink.href = imgContent
}

function changeText() {
    clearCanvas();
    renderCanvasGallery(gCurrImg);
    drawLines();
    printInputsRect();
}

function printInputsRect() {
    for (var i = 0; i < gLineNumber; i++) {
        var lineLength = (gCtx.measureText(gMainLines[i]['inputs']['val']).width);
        if (lineLength === 0 || lineLength === 201.2578125) {
            gCtx.lineWidth = '0';
            lineLength = 0;
        } else {
            gCtx.lineWidth = '2';
            lineLength += 6;
            var lineHeight = gMainLines[i]['font-size'] * 4 + 2;
            var lineTop = gMainLines[i]['inputs']['top'] - lineHeight + 8;
            var lineLeft = (gCanvas.width / 2) - (lineLength / 2);
            gCtx.beginPath();
            gCtx.strokeStyle = 'rgb(36, 36, 36)';
            gCtx.rect(lineLeft, lineTop, lineLength, lineHeight);
            gCtx.stroke();
        }
    }
}

function drawLines() {
    gCtx.textAlign = 'center';
    gCtx.lineWidth = 3;
    var spaceLeft = gCanvas.width / 2;
    for (var i = 0; i < gLineNumber; i++) {
        gCtx.font = gFont[i];
        // gCtx.fillStyle = gTextColor[i];
        gCtx.fillStyle = gMainLines[i]['text-color'];
        // gCtx.strokeStyle = gStrokeColor[i];
        gCtx.strokeStyle = gMainLines[i]['stroke-color'];

        var classToChange = '.line-text-' + (i + 1);

        var inputLocation = changeLocatinAndPlaceholder(classToChange, i);
        var valNewLine = $(classToChange).val();
        if (valNewLine) {
            gCtx.fillText(valNewLine, spaceLeft, inputLocation);
            gCtx.strokeText(valNewLine, spaceLeft, inputLocation);
        }
        // gInputs[i] = valNewLine;
        gMainLines[i]['inputs']['val'] = valNewLine;
        gMainLines[i]['inputs']['width'] = gCtx.measureText(valNewLine).width;
        gMainLines[i]['inputs']['top'] = inputLocation;
    }
}

function changeLocatinAndPlaceholder(classToChange, i) {
    if (i === 0 || i === 1) {
        if (!i) {
            $(classToChange).attr('placeholder', 'write first line✍');
            return 50 + gTopInput;
        } else {
            $(classToChange).attr('placeholder', 'write second line✍');
            return gCanvas.height - 10 - gTopInput;
        }
    } else {
        $(classToChange).attr('placeholder', 'write line ' + (i + 1) + ' ✍');
        return gCanvas.height / 2;
    }
}

function changeTextColor(textColor, number) {
    // gTextColor[number - 1] = textColor;
    gMainLines[number - 1]['text-color'] = textColor;
    changeText();
}

function changeStrokeColor(strokeColor, number) {
    // gStrokeColor[number - 1] = strokeColor;
    gMainLines[number - 1]['stroke-color'] = strokeColor;
    changeText();
}

function onChangeFontSize(number) {
    var classToChange = '.input-text-size-' + number;
    // gFontSize[number - 1] = $(classToChange).val();
    gMainLines[number - 1]['font-size'] = $(classToChange).val();
    // gFont[number - 1] = (gFontSize[number - 1] * 4) + 'px ' + gFontFamily[number - 1];
    gFont[number - 1] = (gMainLines[number - 1]['font-size'] * 4) + 'px ' + gMainLines[number - 1]['font-family'];
    changeText();
}


function onSetFontFamily(newFont, number) {
    // gFontFamily[number - 1] = newFont;
    gMainLines[number - 1]['font-family'] = newFont;
    // gFont[number - 1] = (gFontSize[number - 1] * 4) + 'px ' + gFontFamily[number - 1];
    gFont[number - 1] = (gMainLines[number - 1]['font-size'] * 4) + 'px ' + gMainLines[number - 1]['font-family'];
    changeText();
}

function onRemoveInputText(elBtn, number) {
    var textDiv = elBtn.parentElement;
    textDiv.innerHTML = '';
    gStrLines[number - 1] = '';
    gMainLines[number - 1]['inputs']['width'] = '';
    changeText();
}

function updateStrLinesValue(isClear) {
    for (var i = 0; i < gStrLines.length; i++) {

        if (isClear) {
            gMainLines[i]['inputs']['val'] = '';
            gMainLines[i]['inputs']['width'] = 0;
            gMainLines[i]['inputs']['top'] = 0;
            gMainLines[i]['text-color'] = '#ffffff';
            gMainLines[i]['stroke-color'] = '#000000';
            gMainLines[i]['font-size'] = 12;
            gMainLines[i]['font-family'] = 'impact';
        }

        var classToUpdate = '.line-text-' + (i + 1);
        // $(classToUpdate).val((isClear) ? '' : gInputs[i]);
        $(classToUpdate).val(gMainLines[i]['inputs']['val']);

        classToUpdate = '.color-text-' + (i + 1);
        // $(classToUpdate).val((isClear) ? '#ffffff' : gTextColor[i]);
        $(classToUpdate).val(gMainLines[i]['text-color']);

        classToUpdate = '.color-stroke-' + (i + 1);
        // $(classToUpdate).val((isClear) ? '#000000' : gStrokeColor[i]);
        $(classToUpdate).val(gMainLines[i]['stroke-color']);

        classToUpdate = '.input-text-size-' + (i + 1);
        // $(classToUpdate).val((isClear) ? 12 : gFontSize[i]);
        $(classToUpdate).val(gMainLines[i]['font-size']);

        classToUpdate = '.input-font-' + (i + 1);
        // $(classToUpdate).val((isClear) ? 'impact' : gFontFamily[i]);
        $(classToUpdate).val(gMainLines[i]['font-family']);

        // if (isClear) {
        //     gInputs[i] = '';
        //     gTextColor[i] = '#ffffff';
        //     gStrokeColor[i] = '#000000';
        //     gFontSize[i] = 12;
        //     gFontFamily[i] = 'impact';
        // }
    }
}

function onRenderNewLine() {
    gLineNumber++;
    var strLine = `
    <div>
        <input class="text line-text-${gLineNumber}" oninput="changeText()" type="text" placeholder="write line✍">
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
    </div>`;

    gStrLines.push(strLine);

    $('.new-lines').html(gStrLines.join(''));

    // gInputs.push('');
    // gTextColor.push('#ffffff');
    // gStrokeColor.push('#000000');
    // gFontSize.push(12);
    // gFontFamily.push('impact');

    gMainLines.push({
        inputs: { val: '', width: 0, top: 0 },
        'text-color': '#ffffff',
        'stroke-color': '#000000',
        'font-size': 12,
        'font-family': 'impact',
    });

    // gFont.push((gFontSize[gLineNumber - 1] * 4) + 'px ' + gFontFamily[gLineNumber - 1]);
    gFont.push((gMainLines[gLineNumber - 1]['font-size'] * 4) + 'px ' + gMainLines[gLineNumber - 1]['font-family']);



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