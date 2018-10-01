// LICENSE: MPL 2.0

// 2018. Zibx.
//
// State machine for game.web-tycoon.com
// Description: website auto level up

// How to use: open browser console (F12 in chrome for win\linux)
// Copy-paste the whole code.

// Set amount of your qualified workers
var workersConfig = {
    design: 1,
    frontend: 1,
    backend: 1
};

var state = 'observe';
var currentPosition = 'someShit';
var curWork;

var stateLogics = {
    observe: function() {

        if (currentPosition !== 'sites') {
            document.querySelector('.link.linkSites').click();
            currentPosition = 'sites';
            return;
        }

        var data = [].slice.call(document.querySelectorAll('.siteCard')).map(function (el) {
            var version = el.querySelector('.previewTitle .type').innerHTML.replace('Версия ', '').trim().split(' из ');
            var percents = [].slice.call(el.querySelector('.footerCard .tableWrapper').childNodes);
            var href = el.parentNode;
            return {
                el: href,
                version: version[0] - 0,
                maxVersion: (version[1] || 0) - 0,
                percents: percents.slice(0, 3).map(function (el) {
                    var versionProgress = el.querySelector('.versionProgress');
                    if (versionProgress) {
                        versionProgress = versionProgress.style.height;
                    } else {
                        versionProgress = '0%'
                    }

                    var fullWork = (el.style.width.replace('%', '') - 0) * 4 / 3;
                    return {
                        inProgress: el.querySelector('.taskProgress')!== null,
                        type: el.className,
                        full: fullWork,
                        // uncomment this to simultaneously level up low level websites
                        //speculative: version[0]-0,

                        // and comment this
                        // workers would take simplest possible job
                        speculative: fullWork / 100 * (Math.pow(version[0] - (-1), 2.9) + 9),
                        done: versionProgress.replace('%', '') - 0,
                        href: href
                    };
                })
            };
        });

        for(var i = 0; i < data.length; i++){
            var perc = data[i].percents;
            for(var j = 0; j < perc.length; j++){
                if(perc[j].done >= 100 && perc[j].inProgress){
                    state = 'removeWorkers';
                    data[i].el.click();
                    return;
                }
            }
        }

        var canBeUpgraded = data.filter(function (el) {
            return el.percents
                .map(function (a) {
                    return a.done
                })
                .filter(function (a) {
                    return a >= 100
                }).length === 3;
        });

        if (canBeUpgraded.length) {
            state = 'upgrade';
            canBeUpgraded[0].el.click();
            return;
        }

        data = data.filter(function (item) {
            return item.maxVersion !== item.version;
        });

        var workers = Object.create(workersConfig);

        var jobs = [];

        data.forEach(function (item) {
            item.percents.forEach(function (work) {
                if(work.inProgress)
                    workers[work.type]--;
            })
        });

        if(Object.values(workers).reduce(function (a, b) {
                return a+b;
            })>0){
            data.forEach(function (item) {
                item.percents.forEach(function (work) {
                    if(!work.inProgress && workers[work.type]>0 && work.done<100){
                        jobs.push(work);
                    }
                });
            });

            jobs.sort(function (a,b) {
                return a.speculative-b.speculative;
            });

            var job = jobs[0];
            state = 'assignWork';
            curWork = job;
            job.href.click();
        }
    },
    removeWorkers: function () {
        var cancels = [].slice.call(document.querySelectorAll('.tasks .group')[0].querySelectorAll('.taskItem')).filter(function(el){
            var progress = el.querySelector('.versionInProgress .versionProgress');
            if(!progress)
                return false;
            return progress.style.width.replace('%', '') - 0 === 100
        }).map(function(el){return el.querySelector('.cancelTask')});

        if(cancels.length === 0){
            currentPosition = 'removeWorkers';
            state = 'observe';
            return;
        }else{
            cancels[0].click();
        }
    },
    upgrade: function () {
        var btn = document.querySelector('.versionUpload');
        if(btn.classList.contains('buttonDisabled'))btn = false;
        if(btn) {
            btn.click();
        }else{
            currentPosition = 'upgrade';
            state = 'observe';
            return;
        }
    },
    assignWork: function () {
        document.querySelector('.taskItem.'+curWork.type+' .addWorker').click();
        state = 'selectWorker';
    },


    selectWorker: function(){
        document.querySelector('.popupContent .cardContainer.containerClickable').click()
        currentPosition = 'selectWorker';
        state = 'observe';
        return;
    }
};

var mainloop = function(goOn){
    var lastState = state;
    stateLogics[state]();
    if(state!==lastState)
        console.log('From:', lastState, 'To:', state)
    //if(goOn)
    setTimeout(mainloop, 2000+(Math.random()*5000)|0)
};

mainloop();


/*


var x = {1: 10,
    2: 4+3+7,
    3:6+4+10,
    4:7+5+12,
    5:10+7+17,
    6:13+9+22,
    7:18+12+30,
    8:24+16+40,
    9:32+21+52,
    10:45+30+75,
    11:75+50+125,
    12:173+115+287,
    14: 1275,
    15: 1875,16:2496,
    19:4047,
    22:1223+3058+1835
};x*/
