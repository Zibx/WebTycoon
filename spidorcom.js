// LICENSE: MPL 2.0

// 2018. Zibx.
//
// State machine for game.web-tycoon.com
// Description: content creation. single thread

// How to use: open browser console (F12 in chrome for win\linux)
// Copy-paste the whole code.

var state = 'observe';
//state = 'postContent'
var stateLogics = {
    observe: function(){
        if(currentPosition != 'stats'){
            document.querySelector('.link.linkStats').click();
            currentPosition = 'stats';
            return;
        }
        var bad = [].slice.call(document.querySelectorAll('.traffic .arrowWr .less')).map(function(el){
            return el.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.domain a')
        });
        if(bad.length>0){
            bad[bad.length - 1].click();
            state = 'postContent';
            currentPosition = bad[bad.length - 1].href;
        }
    },
    postContent: function(){
        var contents = [].slice.call(document.querySelectorAll('.cardContainer.containerClickable.contentCardWr'));

        if(contents.length>0){
            contents[0].click();
            state = 'observe'
        }else{
            state = 'createContent';
        }
    },
    createContent: function(){
        document.querySelector('.taskItem.marketing .addWorker').click();
        state = 'selectWorker';
    },
    selectWorker: function(){
        document.querySelector('.popupContent .cardContainer.containerClickable').click()
        state = 'waitContent';
    },
    waitContent: function(){
        var contents = [].slice.call(document.querySelectorAll('.cardContainer.containerClickable.contentCardWr'));
        if(contents.length>0){
            state = 'removeWorker';
        }

    },
    removeWorker: function(){
        document.querySelector('.taskItem.marketing .cancelTask').click();
        state = 'postContent';
    }
};
var currentPosition = 'notStats';
var mainloop = function(){
    var lastState = state;
    stateLogics[state]();
    if(state!==lastState) {
        console.log('From:', lastState, 'To:', state);
    }
    setTimeout(mainloop, 2000+(Math.random()*5000)|0)
};

mainloop();








