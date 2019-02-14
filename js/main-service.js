'use strict';

var gCanvas;
var gCtx;

const PAGE_SIZE = 6;
var currPageIdx = 0;

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


function addSomething(someId) {
    var some = createSomeone(someId);
    gGlobal.push(some);
}

function updateSomething(someId, someUpdate) {
    var someIdx = gGlobal.findIndex(function(global) {
        return global.id === someId;
    })
    gGlobal[someIdx].theUpdateKey = someUpdate;
}

function deleteSomething(someId) {
    var someIdx = gGlobal.findIndex(function(global) {
        return global.id === someId;
    })
    gGlobal.splice(someIdx, 1);
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