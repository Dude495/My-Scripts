// ==UserScript==
// @name         WME Outreach Checker
// @namespace    Dude495
// @version      2019.01.16.01
// @description  Checks if a user has been contacted and listed in the outreach sheet.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    var NEOR = '1sHxgBQ5rVBkYFHcJ5t4p8R2aHxM1WnFFSW-lwqPf0Tg'
    var TAB = '4'
    var STATE = NEOR;
    const SS = 'https://spreadsheets.google.com/feeds/list/'+STATE+'/'+TAB+'/public/values?alt=json';
    const SSFEED = await fetch(SS).then(response => response.json());
    const ENRegEx = /([A-Za-z ])*: /g;
    const INCRegEx = /(.*)\(\d\)/
    //const STAFF = $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].textContent.includes('staff')
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_ALERT = true;
    var UPDATE_NOTES = [
        SCRIPT_NAME + ' has been updated to v' + VERSION,
        '',
        '* Added Segment and Place Venue support.'
    ].join('\n');
    if (UPDATE_ALERT) {
        SCRIPT_NAME = SCRIPT_NAME.replace( /\s/g, '') + VERSION;
        if (localStorage.getItem(SCRIPT_NAME) !== VERSION) {
            alert(UPDATE_NOTES);
            localStorage.setItem(SCRIPT_NAME, VERSION);
        };
    };
    function runORC() {
        if (localStorage.getItem('ORWL') == null) {
            localStorage.setItem('ORWL', 'ORWList: ');
        };
        var ORWL = localStorage.getItem('ORWL').toLowerCase();
        if (WazeWrap.hasPlaceSelected()) {
            if ($('#landmark-edit-general > ul > li:nth-child(1) > a')[0].textContent.includes('(')) {
                let ORCusername = $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].textContent.match(INCRegEx);
                let username = ORCusername[1];
                SSFEED.feed.entry.some(function(entry) {
                    let username1 = entry['gsx$usehttpj.mpneweditorsorttosortlist'].$t;
                    let testName = username1.replace(ENRegEx,'');
                    let ORCME = W.loginManager.user.userName;
                    if (username.toLowerCase() == testName.toLowerCase()) {
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].style.backgroundColor = '#F7E000';
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].title = username + ' located in the outreach spreadsheet.';
                        return true;
                    }
                    else if (username.toLowerCase() == ORCME.toLowerCase()) {
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].style.backgroundColor = '#ffffff';
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].title = 'This is you';
                        return true;
                    }
                    else if (ORWL.includes(username.toLowerCase())) {
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].style.backgroundColor = '#ffffff';
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].title = username + ' is listed in the WhiteList';
                        return true;
                    }
                    else {
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].style.backgroundColor = '#ff0000'
                        $('#landmark-edit-general > ul > li:nth-child(1) > a')[0].title = username + ' not located in the outreach spreadsheet.';
                    };
                });
            };
            if ($('#landmark-edit-general > ul > li:nth-child(2) > a')[0].textContent.includes('(')) {
                let ORCusername = $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].textContent.match(INCRegEx);
                let username = ORCusername[1];
                SSFEED.feed.entry.some(function(entry) {
                    let username1 = entry['gsx$usehttpj.mpneweditorsorttosortlist'].$t;
                    let testName = username1.replace(ENRegEx,'');
                    let ORCME = W.loginManager.user.userName;
                    if (username.toLowerCase() == testName.toLowerCase()) {
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#F7E000';
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].title = username + ' located in the outreach spreadsheet.';
                        return true;
                    }
                    else if (username.toLowerCase() == ORCME.toLowerCase()) {
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#ffffff';
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].title = 'This is you';
                        return true;
                    }
                    else if (ORWL.includes(username.toLowerCase())) {
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#ffffff';
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].title = username + ' is listed in the WhiteList';
                        return true;
                    }
                    else {
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#ff0000'
                        $('#landmark-edit-general > ul > li:nth-child(2) > a')[0].title = username + ' not located in the outreach spreadsheet.';
                    };
                });
            };
        }
        if (WazeWrap.hasSegmentSelected()) {
            console.log('ORC-Segments Activated');
            if ($('#segment-edit-general > ul > li:nth-child(2) > a')[0].textContent.includes('(')) {
                let ORCusername = $('#segment-edit-general > ul > li:nth-child(2) > a')[0].textContent.match(INCRegEx);
                let username = ORCusername[1];
                SSFEED.feed.entry.some(function(entry) {
                    let username1 = entry['gsx$usehttpj.mpneweditorsorttosortlist'].$t;
                    let testName = username1.replace(ENRegEx,'');
                    let ORCME = W.loginManager.user.userName;
                    if (username.toLowerCase() == testName.toLowerCase()) {
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#F7E000';
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].title = username + ' located in the outreach spreadsheet.';
                        return true;
                    }
                    else if (username.toLowerCase() == ORCME.toLowerCase()) {
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#ffffff';
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].title = 'This is you';
                        return true;
                    }
                    else if (ORWL.includes(username.toLowerCase())) {
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#ffffff';
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].title = username + ' is listed in the WhiteList';
                        return true;
                    }
                    else {
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].style.backgroundColor = '#ff0000'
                        $('#segment-edit-general > ul > li:nth-child(2) > a')[0].title = username + ' not located in the outreach spreadsheet.';
                    };
                });
            };
            if ($('#segment-edit-general > ul > li:nth-child(3) > a')[0].textContent.includes('(')) {
                let ORCusername = $('#segment-edit-general > ul > li:nth-child(3) > a')[0].textContent.match(INCRegEx);
                let username = ORCusername[1];
                SSFEED.feed.entry.some(function(entry) {
                    let username1 = entry['gsx$usehttpj.mpneweditorsorttosortlist'].$t;
                    let testName = username1.replace(ENRegEx,'');
                    let ORCME = W.loginManager.user.userName;
                    if (username.toLowerCase() == testName.toLowerCase()) {
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].style.backgroundColor = '#F7E000';
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].title = username + ' located in the outreach spreadsheet.';
                        return true;
                    }
                    else if (username.toLowerCase() == ORCME.toLowerCase()) {
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].style.backgroundColor = '#ffffff';
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].title = 'This is you';
                        return true;
                    }
                    else if (ORWL.includes(username.toLowerCase())) {
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].style.backgroundColor = '#ffffff';
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].title = username + ' is listed in the WhiteList';
                        return true;
                    }
                    else {
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].style.backgroundColor = '#ff0000'
                        $('#segment-edit-general > ul > li:nth-child(3) > a')[0].title = username + ' not located in the outreach spreadsheet.';
                    };
                });
            };
        } else {
            var i;
            for (i = 0; i < $('span.username').length; i++) {
                if ($('span.username')[i].textContent.includes('(')) {
                    let ORCusername = $('span.username')[i].textContent.match(INCRegEx);
                    let username = ORCusername[1];
                    SSFEED.feed.entry.some(function(entry) {
                        let username1 = entry['gsx$usehttpj.mpneweditorsorttosortlist'].$t;
                        let testName = username1.replace(ENRegEx,'');
                        let ORCME = W.loginManager.user.userName;
                        if (username.toLowerCase() == testName.toLowerCase()) {
                            $('span.username')[i].style.backgroundColor = '#F7E000';
                            $('span.username')[i].title = username + ' located in the outreach spreadsheet.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            $('span.username')[i].style.backgroundColor = '#ffffff';
                            $('span.username')[i].title = 'This is you';
                            return true;
                        }
                        else if (ORWL.includes(username.toLowerCase())) {
                            $('span.username')[i].style.backgroundColor = '#ffffff';
                            $('span.username')[i].title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            $('span.username')[i].style.backgroundColor = '#ff0000';
                            $('span.username')[i].title = username + ' not located in the outreach spreadsheet.';
                        };
                    });
                };
            };
        };
    };
    function StateCheck() {
        var State = W.model.states.top.name
        if (State == 'New York' || State == 'New Jersey' || State == 'Delaware' || State == 'Pennsylvania' || State == 'Massachusetts' || State == 'Vermont' || State == 'New Hampshire' || State == 'Rhode Island' || State == 'Maine' || State == 'Connecticut') {
            runORC();
            console.log('ORC: State set to ' + State)
        } else {
            console.log('ORC: This script only supports the N(EO)R Regions at this time.');
        };
    };
    function createTab() {
        var $section = $('<div>');
        $section.html([
            '<div id="ORC-Top"><div id="ORC-title">',
            '<h1>Outreach Checker</h2>',
            '<br><h4>This script is currently restricted to N(EO)R Regions Only.<h4></div>',
            '<br><br><div id="ORC-info">',
            '<p style="color: white; background-color: #ff0000">Red: User has not been contacted or whitelisted.</p>',
            '<p style="color: black; background-color: #F7E000">Yellow: User has been contacted.</p>',
            '<p style="color: black; background-color: white">White: Yourself/Whitelisted user.</p>',
            '</div></div>',
        ].join(' '));
        new WazeWrap.Interface.Tab('ORC', $section.html());
        var btn = document.createElement("BUTTON");
        btn.id = 'ORCBtn';
        var Button = document.getElementById('ORCBtn');
        btn.textContent = 'Save';
        var WLLabel = document.createElement('LABEL')
        WLLabel.innerHTML = '<br><b><h6>Username(s) to be whitelisted (separated by comma):</h6>'
        var ORCTOP = document.getElementById('ORC-Top');
        var tb = document.createElement('INPUT');
        tb.id = 'ORWLVal';
        tb.setAttribute('type', 'text');
        ORCTOP.after(tb);
        tb.after(btn);
        tb.before(WLLabel);
        btn.onclick = function() {
            console.log('ORC ORWL: ' + tb.value + ' has been added.');
            if (localStorage.getItem('ORWL') == null) {
                localStorage.setItem('ORWL', 'ORWList: ')
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                runORC();
            } else {
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                runORC();
            };
        };
    };
    function init() {
        var mo = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if ($(node).hasClass('conversation-view') || $(node).hasClass('map-comment-feature-editor') || $(node).hasClass('place-update-edit')) StateCheck();
                else if ($(node).hasClass('address-edit-view')) { console.log ('Selected. Selected'); }
            }));
        });
        mo.observe(document.querySelector('#panel-container'), {childList: true, subtree:true});
        mo.observe($('#edit-panel .contents')[0], {childList:true, subtree:true});
        mo.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
        if (WazeWrap.hasSegmentSelected() || WazeWrap.hasPlaceSelected() || WazeWrap.hasMapCommentSelected()) {
            StateCheck();
        };
    };
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && ($('#panel-container').length || $('span.username').length >= 1)) {
            createTab();
            init();
            W.selectionManager.events.register("selectionchanged", null, runORC);
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
