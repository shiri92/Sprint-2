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


function searchImgByWord(value) {
    getUniqueKeywords();
    renderKeywordsList(value);
    for (var i = 0; i < gImgs.length; i++) {
        var imgKeywords = gImgs[i].keywords;
        for (var j = 0; j < imgKeywords.length; j++) {
            if (imgKeywords[j].indexOf(value.toLowerCase()) > -1) {
                gImgs[i].isShown = true;
                break;
            } else {
                gImgs[i].isShown = false;
            }
        }
    }
    renderImgs();
}

function searchImgByPressOnKey(value) {
    var txt = $(value).html();
    for (var i = 0; i < gImgs.length; i++) {
        var imgKeywords = gImgs[i].keywords;
        for (var j = 0; j < imgKeywords.length; j++) {
            if (imgKeywords[j].indexOf(txt.toLowerCase()) > -1) {
                gImgs[i].isShown = true;
                break;
            } else {
                gImgs[i].isShown = false;
            }
        }
    }
    renderImgs();
}

function renderKeywordsList(word) {
    var keysToShow = [];
    for (var i = 0; i < gKeywordsFiltered.length; i++) {
        if (gKeywordsFiltered[i].search(word) !== -1) {
            keysToShow.push(gKeywordsFiltered[i]);
        }
    }
    var strUl = keysToShow.map(function(keyword) {
        return `<option value="${keyword}">`
    })
    $('.keywords-searchbox').html(strUl.join(''));
}

function checkPages(val) {
    if (val === 'gallery') {
        $('.main-gallery').css('display', 'flex');
        $('.main-edit').css('display', 'none');
        $('.li-gallery').css('backgroundColor', 'rgb(32, 45, 54)');
        $('.li-edit').css('backgroundColor', 'rgb(57, 97, 122)');
    }

    if (val === 'edit') {
        $('.main-gallery').css('display', 'none');
        $('.main-edit').css('display', 'block');
        $('.li-edit').css('backgroundColor', 'rgb(32, 45, 54)');
        $('.li-gallery').css('backgroundColor', 'rgb(57, 97, 122)');
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
    $('.li-edit').css('backgroundColor', 'rgb(32, 45, 54)');
    $('.li-gallery').css('backgroundColor', 'rgb(57, 97, 122)');

    if (isFirstEdit) {
        onRenderNewLine();
        onRenderNewLine();
        $('.line-text-1').focus();
        isFirstEdit = false;
    }
    // service func to touch phone
    startup();
}

function renderCanvasGallery(img) {
    if (img) {
        gCurrImg = img;
        gWidthImg = img.naturalWidth;
        gHeightImg = img.naturalHeight;
        gWidthWindow = $(window).innerWidth();
        gHeightWindow = $(window).innerHeight();
        var headerH = $('header').innerHeight();
        // var titleH = $('.title-container').innerHeight();
        var titleH = 0;
        var inputsH = $('.input-bar').innerHeight();
        var footerH = $('footer').innerHeight();
        var sum = headerH + titleH + inputsH + footerH;

        gCanvas.width = (gWidthImg < gWidthWindow) ? gWidthImg : gWidthWindow - 2;
        gCanvas.height = (gHeightImg < gHeightWindow - sum - 4 - 4) ? gHeightImg : gHeightWindow - sum - 4 - 4;

        var wRatio = gCanvas.width / gWidthImg;
        var hRatio = gCanvas.height / gHeightImg;
        var ratio = Math.min(wRatio, hRatio);
        if (ratio === wRatio) {
            var left = 0;
            if (hRatio === 1) {
                // var top = (1 - ratio) * gCanvas.height / 2;
                var top = 0;
                gCanvas.height = gCanvas.height - ((1 - ratio) * gCanvas.height);
            } else {
                // var top = (1 - (wRatio / hRatio)) * gCanvas.height / 2;
                var top = 0;
                gCanvas.height = gCanvas.height - ((1 - ratio) * gCanvas.height);
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
        if (!(rectWidth === 0)) {
            if (rectWidth === 201.2578125 || rectWidth === 202) {
                rectWidth = 0;
                var rectHeight = 0;
            } else {
                rectWidth += 6;
                var rectHeight = gMainLines[i]['font-size'] * 4 + 2;
            }
            gCtx.rectWidth = BORDER_BOX;
            var rectTop = gMainLines[i]['inputs']['top'] - rectHeight + 8;
            if (gMainLines[i]['inputs']['isMoveOnce'] === false && !(gMainLines[i]['text-align'])) {
                gMainLines[i]['inputs']['left'] = (gCanvas.width / 2) - (rectWidth / 2);
            }
            var rectLeft = gMainLines[i]['inputs']['left'];
            gCtx.beginPath();
            gCtx.strokeStyle = 'rgb(36, 36, 36)';
            gCtx.rect(rectLeft, rectTop, 0, 0);
            gCtx.stroke();
        }
    }
}

function drawLines() {
    gCtx.textAlign = 'center';
    gCtx.lineWidth = 3;
    for (var i = 0; i < gLineNumber; i++) {
        var align = gMainLines[i]['text-align'];
        var rectWidth = gMainLines[i]['inputs']['width'];
        if (gMainLines[i]['inputs']['isMoveOnce'] === false) {
            if (align) {
                if (align === 'right') {
                    var spaceLeft = 0 + rectWidth / 2 + 6;
                }
                if (align === 'center') {
                    var spaceLeft = (gCanvas.width / 2);
                }
                if (align === 'left') {
                    var spaceLeft = (gCanvas.width - rectWidth / 2 - 10);
                }
                gMainLines[i]['inputs']['left'] = spaceLeft - (rectWidth / 2);
            } else {
                var spaceLeft = (gCanvas.width / 2);
            }
        } else {
            if (align) {
                if (align === 'right') {
                    var spaceLeft = 0 + rectWidth / 2 + 6;
                }
                if (align === 'center') {
                    var spaceLeft = (gCanvas.width / 2);
                }
                if (align === 'left') {
                    var spaceLeft = (gCanvas.width - rectWidth / 2 - 10);
                }
                gMainLines[i]['inputs']['left'] = spaceLeft - (rectWidth / 2);
            } else {
                var spaceLeft = gMainLines[i]['inputs']['left'] + (rectWidth / 2) + 3;
            }
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
    gMainLines[number - 1]['inputs']['val'] = '';
    gMainLines[number - 1]['inputs']['width'] = 0;
    gMainLines[number - 1]['inputs']['top'] = 0;
    gMainLines[number - 1]['inputs']['left'] = 0;
    gMainLines[number - 1]['inputs']['isDrag'] = false;
    changeText();
}

function onTextAlign(elBtn, number, direction) {

    if (gMainLines[number - 1]['text-align'] === direction) {
        gMainLines[number - 1]['text-align'] = '';
        // elBtn.style.border = '0px solid blue';
    } else {
        gMainLines[number - 1]['text-align'] = direction;
        // elBtn.style.border = '2px solid blue';
    }
    changeText();
}

function updateStrLinesValue(isClear) {
    for (var i = 0; i < gStrLines.length; i++) {
        if (isClear) {
            gMainLines[i]['inputs']['val'] = '';
            gMainLines[i]['inputs']['width'] = 0;
            gMainLines[i]['inputs']['top'] = 0;
            gMainLines[i]['inputs']['left'] = 0;
            gMainLines[i]['inputs']['isDrag'] = false;
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

        classToUpdate = '.text-align' + (i + 1);
        $(classToUpdate).val(gMainLines[i]['text-align']);
    }
}

function onRenderNewLine() {
    gLineNumber++;
    var strLine = `
    <div class="flex wrap space-between">
        <input class="line-text line-text-${gLineNumber}" oninput="changeText()" type="text" placeholder="write line✍">
        <button class="delete-line" onclick="onRemoveInputText(this,${gLineNumber})">🗑️</button>
        <input class="btn-color color-text-${gLineNumber}" onchange="changeTextColor(this.value,${gLineNumber})" type="color" value="#ffffff">
        <input class="btn-color color-stroke-${gLineNumber}" onchange="changeStrokeColor(this.value,${gLineNumber})" type="color" value="#000000">
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
        <div class="btn-align-all flex space-even">
        <button class="btn-align btn-align-${gLineNumber}" onclick="onTextAlign(this,${gLineNumber},'right')">⇚</button>
        <button class="btn-align btn-align-${gLineNumber}" onclick="onTextAlign(this,${gLineNumber},'center')">⤄</button>
        <button class="btn-align btn-align-${gLineNumber}" onclick="onTextAlign(this,${gLineNumber},'left')">⇛</button>
        </div>
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

    var touches = event.changedTouches;
    // get the current mouse position
    if (touches) {
        var mouseX = touches[0].pageX;
        var mouseY = touches[0].pageY;
    } else {
        var mouseX = parseInt(event.clientX);
        var mouseY = parseInt(event.clientY);
    }
    isDragOn = false;


    var distanceW = (gWidthWindow - gWidthImg) / 2;
    if (distanceW >= 0) {
        var distance = distanceW;
    } else {
        var distance = 0;
    }
    for (var i = 0; i < gMainLines.length; i++) {
        var r = gMainLines[i]['inputs'];
        var fontSize = (gMainLines[i]['font-size'] * 4 + 2)
        var firstSize = FIRST_FONT_SIZE * 4 + 2;
        if (mouseX > r.left - BORDER_BOX + distance &&
            mouseX < r.left + r.width + 6 + BORDER_BOX + distance &&
            mouseY > r.top - BORDER_BOX - (fontSize - firstSize) &&
            mouseY < r.top + (firstSize + BORDER_BOX)) {
            // if yes, set that rects isDrag = true
            isDragOn = true;
            r.isDrag = true;
            break;
        }
    }
    // save the current mouse position
    gStartX = mouseX;
    gStartY = mouseY;

    console.log(event.changedTouches)
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

        var touches = event.changedTouches;
        // get the current mouse position
        if (touches) {
            var mouseX = touches[0].pageX;
            var mouseY = touches[0].pageY;
        } else {
            var mouseX = parseInt(event.clientX);
            var mouseY = parseInt(event.clientY);
        }

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
                gMainLines[i]['text-align'] = '';
            }
        }

        // redraw the scene with the new rect positions
        changeText();

        // reset the starting mouse position for the next mousemove
        gStartX = mouseX;
        gStartY = mouseY;

    }
}