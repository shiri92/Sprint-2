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
    // listen for mouse events
    gCanvas.onmousedown = onDown;
    gCanvas.onmouseup = onUp;
    gCanvas.onmousemove = onMove;
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


function renderKeywordsList() {
    var strUl = gKeywordsFiltered.map(function(keyword) {
        return `<li><a href="#">${keyword}</a></li>`
    })
    $('.keywords-searchbox').html(strUl.join(''));
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
    var strUl = gKeywordsFiltered.map(function(keyword) {
        return `<li><a href="#">${keyword}</a></li>`
    })
    $('.keywords-searchbox').html(strUl.join(''));


    renderImgs();
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

function onNextPage() {
    nextPage();
    renderImgs();
}

function onPrevPage() {
    prevPage();
    renderImgs();
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
        gHeightWindow = $(window).innerHeight(); /////// לבדוק וינדואו פחות הקנבס 
        var headerH = $('header').innerHeight();
        var titleH = $('.title-container').innerHeight();
        var inputsH = $('.input-bar').innerHeight();
        var footerH = $('footer').innerHeight();
        var sum = headerH + titleH + inputsH + footerH;

        gCanvas.width = (gWidthImg < gWidthWindow) ? gWidthImg : gWidthWindow - 2;
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
    printRects();
}

function printRects() {
    for (var i = 0; i < gMainLines.length; i++) {
        var rectWidth = gMainLines[i]['inputs']['width'];
        if (!(rectWidth === 0 || rectWidth === 201.2578125)) {
            gCtx.rectWidth = BORDER_BOX;
            rectWidth += 6;
            var rectHeight = gMainLines[i]['font-size'] * 4 + 2;
            var rectTop = gMainLines[i]['inputs']['top'] - rectHeight + 8;
            if (gMainLines[i]['inputs']['isMoveOnce'] === false) {
                gMainLines[i]['inputs']['left'] = (gCanvas.width / 2) - (rectWidth / 2);
            }
            var rectLeft = gMainLines[i]['inputs']['left'];
            gCtx.beginPath();
            gCtx.strokeStyle = 'rgb(36, 36, 36)';
            gCtx.rect(rectLeft, rectTop, rectWidth, rectHeight);
            gCtx.stroke();
        }
    }
}

function drawLines() {
    gCtx.textAlign = 'center';
    gCtx.lineWidth = 3;
    for (var i = 0; i < gLineNumber; i++) {

        if (gMainLines[i]['inputs']['isMoveOnce'] === false) {
            var spaceLeft = (gCanvas.width / 2);
        } else {
            var rectWidth = gMainLines[i]['inputs']['width'];
            var spaceLeft = gMainLines[i]['inputs']['left'] + (rectWidth / 2) + 3;
        }

        gCtx.font = gFont[i];
        gCtx.fillStyle = gMainLines[i]['text-color'];
        gCtx.strokeStyle = gMainLines[i]['stroke-color'];

        var classToChange = '.line-text-' + (i + 1);

        if (gMainLines[i]['inputs']['isMoveOnce'] === false) {
            var spaceTop = changeLocatinAndPlaceholder(classToChange, i);
            gMainLines[i]['inputs']['top'] = spaceTop;
        } else {
            var spaceTop = gMainLines[i]['inputs']['top'];
        }
        var valNewLine = $(classToChange).val();

        if (valNewLine) {
            gCtx.fillText(valNewLine, spaceLeft, spaceTop);
            gCtx.strokeText(valNewLine, spaceLeft, spaceTop);
        }

        gMainLines[i]['inputs']['val'] = valNewLine;
        gMainLines[i]['inputs']['width'] = gCtx.measureText(valNewLine).width;
    }
}

function changeLocatinAndPlaceholder(classToChange, i) {
    if (i === 0 || i === 1) {
        if (!i) {
            $(classToChange).attr('placeholder', 'write first line✍');
            return 50 + gTopInput;
        } else {
            $(classToChange).attr('placeholder', 'write second line✍');
            return gCanvas.height - 16 - gTopInput;
        }
    } else {
        $(classToChange).attr('placeholder', 'write line ' + (i + 1) + ' ✍');
        return gCanvas.height / 2;
    }
}

function changeTextColor(textColor, number) {
    gMainLines[number - 1]['text-color'] = textColor;
    changeText();
}

function changeStrokeColor(strokeColor, number) {
    gMainLines[number - 1]['stroke-color'] = strokeColor;
    changeText();
}

function onChangeFontSize(number) {
    var classToChange = '.input-text-size-' + number;
    gMainLines[number - 1]['font-size'] = $(classToChange).val();
    gFont[number - 1] = (gMainLines[number - 1]['font-size'] * 4) + 'px ' + gMainLines[number - 1]['font-family'];
    changeText();
}

function onSetFontFamily(newFont, number) {
    gMainLines[number - 1]['font-family'] = newFont;
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

function onTextAlign(elBtn, number, direction) {
    var classToUpdate = '.btn-align-' + (number - 1);
    $(classToUpdate).css('border', '0px solid blue');
    $("p").css("background-color", "yellow");

    if (gMainLines[number - 1]['text-align'] === direction) {
        gMainLines[number - 1]['text-align'] = '';
    } else {
        gMainLines[number - 1]['text-align'] = direction;
        elBtn.style.border = '2px solid blue';
    }
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
            gMainLines[i]['font-size'] = FIRST_FONT_SIZE;
            gMainLines[i]['font-family'] = 'impact';
            gMainLines[i]['text-align'] = '';
        }
        var classToUpdate = '.line-text-' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['inputs']['val']);

        classToUpdate = '.color-text-' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['text-color']);

        classToUpdate = '.color-stroke-' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['stroke-color']);

        classToUpdate = '.input-text-size-' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['font-size']);

        classToUpdate = '.input-font-' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['font-family']);

        classToUpdate = '.input-font-' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['text-align']);
    }
}

function onRenderNewLine() {
    gLineNumber++;
    var strLine = `
    <div class="flex wrap space-between">
        <input class="line-text line-text-${gLineNumber}" oninput="changeText()" type="text" placeholder="write line✍">
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
            <input class="input-text-size-${gLineNumber}" onchange="onChangeFontSize(${gLineNumber})" type="text" name="format" value="${FIRST_FONT_SIZE}" />
        </div>
        <select class="input-font input-font-${gLineNumber}" onchange="onSetFontFamily(this.value,${gLineNumber})">
            <option value="impact">Impact</option>
            <option value="ubuntu">Ubuntu</option>
            <option value="Play">play</option>
            <option value="Inconsolata">inconsolata</option>
        </select>
        <button class="btn-align-${gLineNumber}" onclick="onTextAlign(this,${gLineNumber},'right')">⇚</button>
        <button class="btn-align-${gLineNumber}" onclick="onTextAlign(this,${gLineNumber},'center')">⤄</button>
        <button class="btn-align-${gLineNumber}" onclick="onTextAlign(this,${gLineNumber},'left')">⇛</button>
    </div>`;

    gStrLines.push(strLine);

    $('.new-lines').html(gStrLines.join(''));

    gMainLines.push({
        inputs: {
            val: '',
            width: 0,
            top: 0,
            left: 0,
            isDrag: false,
            isMoveOnce: false
        },
        'text-color': '#ffffff',
        'stroke-color': '#000000',
        'font-size': FIRST_FONT_SIZE,
        'font-family': 'impact',
        'text-align': ''

    });

    gFont.push((gMainLines[gLineNumber - 1]['font-size'] * 4) + 'px ' + gMainLines[gLineNumber - 1]['font-family']);

    updateStrLinesValue(false);

    changeText();
}

// handle mousedown events
function onDown(event) {
    // tell the browser we're handling this mouse event
    event.preventDefault();
    event.stopPropagation();

    // get the current mouse position
    var mouseX = parseInt(event.clientX);
    var mouseY = parseInt(event.clientY);
    isDragOn = false;
    for (var i = 0; i < gMainLines.length; i++) {
        var r = gMainLines[i]['inputs'];
        if (mouseX > r.left - BORDER_BOX &&
            mouseX < r.left + r.width + 6 + BORDER_BOX &&
            mouseY > r.top + (FIRST_FONT_SIZE * 4 + 2) - BORDER_BOX &&
            mouseY < r.top + ((gMainLines[i]['font-size'] * 4 + 2) +
                (FIRST_FONT_SIZE * 4 + 2) + BORDER_BOX)) {
            // if yes, set that rects isDrag = true
            isDragOn = true;
            r.isDrag = true;
            break;
        }
    }
    // save the current mouse position
    gStartX = mouseX;
    gStartY = mouseY;
}

// handle mouseup events
function onUp(event) {
    // tell the browser we're handling this mouse event
    event.preventDefault();
    event.stopPropagation();

    // clear all the dragging flags
    isDragOn = false;
    for (var i = 0; i < gMainLines.length; i++) {
        gMainLines[i]['inputs'].isDrag = false;
    }
}

function onMove(event) {
    // if we're dragging anything...
    if (isDragOn) {

        // tell the browser we're handling this mouse event
        event.preventDefault();
        event.stopPropagation();

        // get the current mouse position
        var mouseX = parseInt(event.clientX);
        var mouseY = parseInt(event.clientY);

        // calculate the distance the mouse has moved since the last mousemove
        var distanceX = mouseX - gStartX;
        var distanceY = mouseY - gStartY;

        // move each rect that isDrag 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < gMainLines.length; i++) {
            var r = gMainLines[i]['inputs'];
            if (r.isDrag) {
                r.left += distanceX;
                r.top += distanceY;
                r.isMoveOnce = true;
            }
        }

        // redraw the scene with the new rect positions
        changeText();

        // reset the starting mouse position for the next mousemove
        gStartX = mouseX;
        gStartY = mouseY;

    }
}