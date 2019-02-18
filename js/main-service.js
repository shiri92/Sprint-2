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
var FIRST_FONT_SIZE = 12;

var gStrLines = [];
var gFont = [];

var gMainLines = [];

var isFirstEdit = true;

// drag related variables
var isDragOn = false;
var gStartX;
var gStartY;
var BORDER_BOX = 2;

// key touch
var ongoingTouches = [];

var gImgs;
var gImgsIsShown;
var gKeywordsFiltered = [];

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
    gImgsIsShown = gImgs.reduce(function(acc, img) {
        if (img.isShown) {
            acc.push(img);
        }
        return acc;
    }, []);
    var imgs = gImgsIsShown.slice(fromIdx, fromIdx + PAGE_SIZE);
    return imgs;
}

function getUniqueKeywords() {
    var arr = [];
    for (var i = 0; i < gImgs.length; i++) {
        var imgKeywords = gImgs[i].keywords;
        for (var j = 0; j < imgKeywords.length; j++) {
            arr.push(imgKeywords[j])
        }
    }

    for (var k = 0; k < arr.length; k++) {
        var word = arr[k];
        for (var l = (k + 1); l < arr.length; l++) {
            if (word === arr[l]) {
                arr.splice(l, 1);
                l--;
            }
        }
    }
    gKeywordsFiltered = arr;
}

function findMostSearchedWords() {
    return ['image', 'music', 'happy', 'dog', 'trump'];
}

function createImgs() {
    gImgs = [
        createImg('img/memes/1.jpg', ['image', 'sound', 'music', 'flowers', 'mountains', 'dress', 'snow', 'happy', 'girl', 'hello', 'world!']),
        createImg('img/memes/2.jpg', ['image', 'trump', 'presidente', 'finger', 'usa', 'face', 'fake', 'news', 'blond']),
        createImg('img/memes/3.jpg', ['image', 'happy', 'cute', 'dogs', 'kiss', 'fur', 'tongue', 'love']),
        createImg('img/memes/4.jpg', ['image', 'dog', 'baby', 'bad', 'sleep', 'white', 'blanket', 'fur', 'head', 'cute']),
        createImg('img/memes/5.jpg', ['image', 'baby', 'child', 'victory', 'beach', 'sea', 'sand', 'angry', 'boy', 'hello', 'world!']),
        createImg('img/memes/6.jpg', ['image', 'cat', 'cumputer', 'cute', 'sleepy', 'hears', 'blanket', 'tired']),
        createImg('img/memes/7.jpg', ['image', 'hat', 'clown', 'hair', 'smile', 'purple', 'teeth', 'sushi', 'hello', 'world!']),
        createImg('img/memes/8.jpg', ['image', 'baby', 'filed', 'lake', 'smile', 'grass', 'cunning', 'squares', 'boy']),
        createImg('img/memes/9.jpg', ['image', 'fingers', 'eyes', 'old', 'man', 'just', 'beard']),
        createImg('img/memes/10.jpg', ['image', 'shout', 'boy', 'hand', 'eyes', 'fear', 'nervous']),
        createImg('img/memes/11.jpg', ['image', 'dog', 'hair', 'HD', 'hands', 'sophisticated', 'dumb', 'japanese', 'eyes']),
        createImg('img/memes/12.jpg', ['image', 'fingers', '4', 'four', 'sushi', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/13.jpg', ['image', 'fingers', '4', 'four', 'hello', 'world!', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/14.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/15.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'sushi', '2', 'two']),
        createImg('img/memes/16.jpg', ['image', 'hello', 'world!', 'dog', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/17.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/18.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'sushi', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/19.jpg', ['image', 'fingers', '4', 'four', 'hello', 'world!', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/20.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/21.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'hello', 'world!', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/22.jpg', ['image', 'fingers', '4', 'four', 'peace', 'dog', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/23.jpg', ['image', 'fingers', '4', 'four', 'sushi', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/24.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'hello', 'world!', '2', 'two'])

    ];
}

function createImg(url, keywords) {
    return {
        id: makeId(),
        url: url,
        keywords: keywords,
        isShown: true
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
    var number = Math.ceil(gImgsIsShown.length / PAGE_SIZE);
    return number;
}

//
//
// copies function for touch phone
function startup() {
    var el = gCanvas;
    el.addEventListener('touchstart', onDown, false);
    el.addEventListener('touchend', onUp, false);
    el.addEventListener('touchmove', onMove, false);
    // el.addEventListener('touchstart', handleStart, false);
    // el.addEventListener('touchend', handleEnd, false);
    // el.addEventListener('touchcancel', handleCancel, false);
    // el.addEventListener('touchmove', handleMove, false);
    console.log('initialized.');
}

// function handleStart(evt) {
//     evt.preventDefault();
//     console.log('touchstart.');
//     var el = gCanvas;
//     var touches = evt.changedTouches;

//     for (var i = 0; i < touches.length; i++) {
//         console.log('touchstart:' + i + '...');
//         ongoingTouches.push(copyTouch(touches[i]));
//         gCtx.beginPath();
//         gCtx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
//         gCtx.fill();
//         console.log('touchstart:' + i + '.');
//     }
// }

// function handleMove(evt) {
//     // evt.preventDefault();
//     var el = gCanvas;
//     var touches = evt.changedTouches;

//     for (var i = 0; i < touches.length; i++) {
//         var idx = ongoingTouchIndexById(touches[i].identifier);

//         if (idx >= 0) {
//             console.log('continuing touch ' + idx);
//             gCtx.beginPath();
//             console.log('ctx.moveTo(' + ongoingTouches[idx].pageX + ', ' + ongoingTouches[idx].pageY + ');');
//             gCtx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
//             console.log('ctx.lineTo(' + touches[i].pageX + ', ' + touches[i].pageY + ');');
//             gCtx.lineTo(touches[i].pageX, touches[i].pageY);
//             gCtx.lineWidth = 4;
//             gCtx.stroke();

//             ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
//             console.log('.');
//         } else {
//             console.log('can\'t figure out which touch to continue');
//         }
//     }
// }

// function handleEnd(evt) {
//     evt.preventDefault();
//     var el = gCanvas;
//     var touches = evt.changedTouches;

//     for (var i = 0; i < touches.length; i++) {
//         var idx = ongoingTouchIndexById(touches[i].identifier);

//         if (idx >= 0) {
//             gCtx.lineWidth = 4;
//             gCtx.beginPath();
//             gCtx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
//             gCtx.lineTo(touches[i].pageX, touches[i].pageY);
//             gCtx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
//             ongoingTouches.splice(idx, 1); // remove it; we're done
//         } else {
//             console.log('can\'t figure out which touch to end');
//         }
//     }
// }

// function handleCancel(evt) {
//     evt.preventDefault();
//     console.log('touchcancel.');
//     var touches = evt.changedTouches;

//     for (var i = 0; i < touches.length; i++) {
//         var idx = ongoingTouchIndexById(touches[i].identifier);
//         ongoingTouches.splice(idx, 1); // remove it; we're done
//     }
// }

// function copyTouch(touch) {
//     return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
// }

// function ongoingTouchIndexById(idToFind) {
//     for (var i = 0; i < ongoingTouches.length; i++) {
//         var id = ongoingTouches[i].identifier;

//         if (id == idToFind) {
//             return i;
//         }
//     }
//     return -1; // not found
// }