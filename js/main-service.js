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

var gImgs;
var gImgsIsShown;
var gAllkeywords = [];
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

function createImgs() {
    gImgs = [
        createImg('img/memes/1.jpg', ['image', 'sound', 'music', 'flowers', 'mountains', 'dress', 'snow', 'happy', 'girl']),
        createImg('img/memes/2.jpg', ['image', 'trump', 'presidente', 'finger', 'usa', 'face', 'fake', 'news', 'blond']),
        createImg('img/memes/3.jpg', ['image', 'happy', 'cute', 'dogs', 'kiss', 'fur', 'tongue', 'love']),
        createImg('img/memes/4.jpg', ['image', 'dog', 'baby', 'bad', 'sleep', 'white', 'blanket', 'fur', 'head', 'cute']),
        createImg('img/memes/5.jpg', ['image', 'baby', 'child', 'victory', 'beach', 'sea', 'sand', 'angry', 'boy']),
        createImg('img/memes/6.jpg', ['image', 'cat', 'cumputer', 'cute', 'sleepy', 'hears', 'blanket', 'tired']),
        createImg('img/memes/7.jpg', ['image', 'hat', 'clown', 'hair', 'smile', 'purple', 'teeth']),
        createImg('img/memes/8.jpg', ['image', 'baby', 'filed', 'lake', 'smile', 'grass', 'cunning', 'squares', 'boy']),
        createImg('img/memes/9.jpg', ['image', 'fingers', 'eyes', 'old', 'man', 'just', 'beard']),
        createImg('img/memes/10.jpg', ['image', 'shout', 'boy', 'hand', 'eyes', 'fear', 'nervous']),
        createImg('img/memes/11.jpg', ['image', 'hair', 'HD', 'hands', 'sophisticated', 'dumb', 'japanese', 'eyes']),
        createImg('img/memes/12.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/13.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/14.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/15.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/16.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/17.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/18.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/19.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/20.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/21.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/22.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/23.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two']),
        createImg('img/memes/24.jpg', ['image', 'fingers', '4', 'four', 'peace', 'suit', 'gray', 'bald', 'weird', '2', 'two'])

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