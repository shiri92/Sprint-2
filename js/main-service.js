'use strict';

var gCanvas;
var gCtx;

var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 5,
    txts: [{
        line: 'I never eat Falafel',
        size: 20,
        align: 'left',
        color: 'red'
    }]
}



function createAll() {

}

function createSomeone(someId) {
    return {
        id: makeId(),
        name: getRandomWord(3, 6),
        age: getRandomIntInclusive(1, 100)
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