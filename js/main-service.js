'use strict';

var gGlobal;

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