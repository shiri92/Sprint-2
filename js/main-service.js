'use strict';

var gCanvas;
var gCtx;

const PAGE_SIZE = 6;
var currPageIdx = 0;

var gCurrImg;
var gWidthImg = 500;
var gHeightImg = 500;

var gWidthWindow = 500;
var gHeightWindow = 500;

var gLineNumber = 0;

var gTopInput;

var gStrLines = [];
var gFont = [];

var gMainLines = [];
// var gInputs = [];
// var gTextColor = [];
// var gStrokeColor = [];
// var gFontSize = [];
// var gFontFamily = [];

var isFirstEdit = true;

var gImgs;
var gMeme = {
    selectedImgId: 5,
    txts: [{
        line: 'I never eat Falafel',
        size: 20,
        align: 'left',
        color: 'red'
    }]
}

function getImgs() {
    var fromIdx = currPageIdx * PAGE_SIZE;
    var imgs = gImgs.slice(fromIdx, fromIdx + PAGE_SIZE);
    return imgs;
}

function createImgs() {
    var imgs = [
        createImg('img/memes/1.jpg'),
        createImg('img/memes/2.jpg'),
        createImg('img/memes/3.jpg'),
        createImg('img/memes/4.jpg'),
        createImg('img/memes/5.jpg'),
        createImg('img/memes/6.jpg'),
        createImg('img/memes/7.jpg'),
        createImg('img/memes/8.jpg'),
        createImg('img/memes/9.jpg'),
        createImg('img/memes/10.jpg'),
        createImg('img/memes/11.jpg'),
        createImg('img/memes/12.jpg')
    ];
    gImgs = imgs;
}

function createImg(url) {
    return {
        id: makeId(),
        url: url,
        keywords: []
    }
}

function nextPage() {
    if (currPageIdx < howManyPages() - 1) {
        currPageIdx++;
    }
}

function prevPage() {
    if (currPageIdx > 0) {
        currPageIdx--;
    }
}

function howManyPages() {
    var number = Math.ceil(gImgs.length / PAGE_SIZE);
    return number;
}