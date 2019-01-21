// ==UserScript==
// @name         WME Outreach Checker
// @namespace    Dude495
// @version      2019.01.21.01
// @description  Checks if a user has been contacted and listed in the outreach sheet.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
/* global W */
/* global $ */
/* global WazeWrap */
// ==/UserScript==

(async function() {
    'use strict';
    const ENRegEx = /([A-Za-z ])*: /g;
    const INCRegEx = /(.*)\(\d\)/;
    const RRE = /\(\d\)/g;
    const SS = 'https://spreadsheets.google.com/feeds/list/1sHxgBQ5rVBkYFHcJ5t4p8R2aHxM1WnFFSW-lwqPf0Tg/4/public/values?alt=json';
    var ORCFeedList = [];
    const whitelistColor = '#ffffff';
    const inSheetColor = '#F7E000';
    const notInSheetColor = '#ff0000';
    const managementColor = '#99bbff';
    const youColor = '#ffffff';
    await $.getJSON(SS, function(data){
        ORCFeedList = data;
    });
    let mapped = ORCFeedList.feed.entry.map(obj =>{
        return {username: obj['gsx$usehttpj.mpneweditorsorttosortlist'].$t.replace(ENRegEx,'').trim(), responses: obj.gsx$changescantakeupto.$t, reporter: obj.gsx$minutesdelaytoappear.$t, dateC: obj['gsx$httpj.mpneweditorformtoreport'].$t
               };
    });
    var RegMgt = [];
    await $.getJSON('https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/od6/public/values?alt=json', function(data){
        RegMgt = data;
    });
    const MgtList = RegMgt.feed.entry.map(obj =>{
        return obj.gsx$neormanagement.$t
    });
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_ALERT = false;
    var UPDATE_NOTES = [
        SCRIPT_NAME + ' has been updated to v' + VERSION,
        '',
        '* Added Segment and Place support.',
        '* Added highlighting to identify N(EO)R SM+.',
        '* Rank 4+ Editors auto whitelisted.',
        '* Modified code to improve WME lag (Thanks Justin!)'
    ].join('\n');
    if (UPDATE_ALERT) {
        SCRIPT_NAME = SCRIPT_NAME.replace( /\s/g, '') + VERSION;
        if (localStorage.getItem(SCRIPT_NAME) !== VERSION) {
            alert(UPDATE_NOTES);
            localStorage.setItem(SCRIPT_NAME, VERSION);
        };
    };
    function runORC() {
        const LandMark1 = $('#landmark-edit-general > ul > li:nth-child(1) > a')[0]
        const LandMark2 = $('#landmark-edit-general > ul > li:nth-child(2) > a')[0]
        const Seg2 = $('#segment-edit-general > ul > li:nth-child(2) > a')[0]
        const Seg3 = $('#segment-edit-general > ul > li:nth-child(3) > a')[0]
        const MapComment1 = $('#edit-panel > div > div > div.tab-content > ul > li:nth-child(1) > a:nth-child(1)')[0]
        const MapComment2 = $('#edit-panel > div > div > div.tab-content > ul > li:nth-child(2) > a:nth-child(1)')[0]
        const URName = $('span.username')
        if (localStorage.getItem('ORWL') == null) {
            localStorage.setItem('ORWL', 'ORWList: ');
        };
        var ORWL = localStorage.getItem('ORWL').toLowerCase();
        if (WazeWrap.hasPlaceSelected()) {
            if (LandMark1.textContent.includes('(')) {
                if (LandMark1.textContent.includes('staff')) {
                    return;
                } else {
                    if (LandMark1.textContent.includes('(')) {
                        let ORCusername = LandMark1.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = LandMark1.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let ORCME = W.loginManager.user.userName;
                        let entry = getFromSheetList(username);
                        if (entry != null) {
                            LandMark1.style.backgroundColor = inSheetColor;
                            LandMark1.title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            LandMark1.style.backgroundColor = youColor;
                            LandMark1.title = 'This is you';
                            return true;
                        }
                        else if (MgtList.includes(username.toLowerCase())) {
                            LandMark1.style.backgroundColor = managementColor;
                            LandMark1.title = username + ' is N(EO)R Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            LandMark1.style.backgroundColor = whitelistColor;
                            LandMark1.title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            LandMark1.style.backgroundColor = notInSheetColor
                            LandMark1.title = username + ' is not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
            if (LandMark2.textContent.includes('(')) {
                if (LandMark2.textContent.includes('staff')) {
                    return;
                } else {
                    if (LandMark2.textContent.includes('(')) {
                        let ORCusername = LandMark2.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = LandMark2.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let ORCME = W.loginManager.user.userName;
                        let entry = getFromSheetList(username);
                        if (entry != null) {
                            LandMark2.style.backgroundColor = inSheetColor;
                            LandMark2.title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            LandMark2.style.backgroundColor = youColor;
                            LandMark2.title = 'This is you';
                            return true;
                        }
                        else if (MgtList.includes(username.toLowerCase())) {
                            LandMark2.style.backgroundColor = managementColor;
                            LandMark2.title = username + ' is N(EO)R Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            LandMark2.style.backgroundColor = whitelistColor;
                            LandMark2.title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            LandMark2.style.backgroundColor = notInSheetColor
                            LandMark2.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
        };
        if (WazeWrap.hasSegmentSelected()) {
            if (Seg2.textContent.includes('(')) {
                if (Seg2.textContent.includes('staff')) {
                    return;
                } else {
                    if (Seg2.textContent.includes('(')) {
                        let ORCusername = Seg2.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = Seg2.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let ORCME = W.loginManager.user.userName;
                        let entry = getFromSheetList(username);
                        if (entry != null) {
                            Seg2.style.backgroundColor = inSheetColor;
                            Seg2.title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            Seg2.style.backgroundColor = youColor;
                            Seg2.title = 'This is you';
                            return true;
                        }
                        else if (MgtList.includes(username.toLowerCase())) {
                            Seg2.style.backgroundColor = managementColor;
                            Seg2.title = username + ' is N(EO)R Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            Seg2.style.backgroundColor = whitelistColor;
                            Seg2.title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            Seg2.style.backgroundColor = notInSheetColor
                            Seg2.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
            if (Seg3.textContent.includes('(')) {
                if (Seg3.textContent.includes('staff')) {
                    return;
                } else {
                    if (Seg3.textContent.includes('(')) {
                        let ORCusername = Seg3.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = Seg3.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let ORCME = W.loginManager.user.userName;
                        let entry = getFromSheetList(username);
                        if (entry != null) {
                            Seg3.style.backgroundColor = inSheetColor;
                            Seg3.title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            Seg3.style.backgroundColor = youColor;
                            Seg3.title = 'This is you';
                            return true;
                        }
                        else if (MgtList.includes(username.toLowerCase())) {
                            Seg3.style.backgroundColor = managementColor;
                            Seg3.title = username + ' is N(EO)R Management';
                        }
                        else if (ORWL.includes(username.toLowerCase() || RANK >= '4')) {
                            Seg3.style.backgroundColor = whitelistColor;
                            Seg3.title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            Seg3.style.backgroundColor = notInSheetColor
                            Seg3.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
        };
        if (WazeWrap.hasMapCommentSelected()) {
            if (MapComment1.textContent.includes('(')) {
                if (MapComment1.textContent.includes('staff')) {
                    return;
                } else {
                    if (MapComment1.textContent.includes('(')) {
                        let ORCusername = MapComment1.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = MapComment1.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let ORCME = W.loginManager.user.userName;
                        let entry = getFromSheetList(username);
                        if (entry != null) {
                            MapComment1.style.backgroundColor = inSheetColor;
                            MapComment1.title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            MapComment1.style.backgroundColor = youColor;
                            MapComment1.title = 'This is you';
                            return true;
                        }
                        else if (MgtList.includes(username.toLowerCase())) {
                            MapComment1.style.backgroundColor = managementColor;
                            MapComment1.title = username + ' is N(EO)R Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            MapComment1.style.backgroundColor = whitelistColor;
                            MapComment1.title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            MapComment1.style.backgroundColor = notInSheetColor
                            MapComment1.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
            if (MapComment2.textContent.includes('(')) {
                if (MapComment2.textContent.includes('staff')) {
                    return;
                } else {
                    if (MapComment2.textContent.includes('(')) {
                        let ORCusername = MapComment2.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = MapComment2.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let ORCME = W.loginManager.user.userName;
                        let entry = getFromSheetList(username);
                        if (entry != null) {
                            MapComment2.style.backgroundColor = inSheetColor;
                            MapComment2.title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                            return true;
                        }
                        else if (username.toLowerCase() == ORCME.toLowerCase()) {
                            MapComment2.style.backgroundColor = youColor;
                            MapComment2.title = 'This is you';
                            return true;
                        }
                        else if (MgtList.includes(username.toLowerCase())) {
                            MapComment2.style.backgroundColor = managementColor;
                            MapComment2.title = username + ' is N(EO)R Management';
                        }
                        else if (ORWL.includes(username.toLowerCase() || RANK >= '4')) {
                            MapComment2.style.backgroundColor = whitelistColor;
                            MapComment2.title = username + ' is listed in the WhiteList';
                            return true;
                        }
                        else {
                            MapComment2.style.backgroundColor = notInSheetColor
                            MapComment2.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
        } else {
            let i;
            for (i = 0; i < URName.length; i++) {
                if (URName[i].textContent.includes('(')) {
                    let ORCusername = URName[i].textContent.match(INCRegEx);
                    let username = ORCusername[1];
                    let ORCME = W.loginManager.user.userName;
                    let RUN = URName[i].textContent.match(RRE);
                    let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                    let entry = getFromSheetList(username);
                    if (entry != null) {
                        URName[i].style.backgroundColor = inSheetColor;
                        URName[i].title = username + ' is located in the outreach spreadsheet. \n\n' + entry.reporter + '\nDate(s) ' + entry.dateC + '\n' + entry.responses + '.';
                        continue;
                    }
                    else if (username.toLowerCase() == ORCME.toLowerCase()) {
                        URName[i].style.backgroundColor = youColor;
                        URName[i].title = 'This is you';
                        continue;
                    }
                    else if (MgtList.includes(username.toLowerCase())) {
                        URName[i].style.backgroundColor = managementColor;
                        URName[i].title = username + ' is N(EO)R Management';
                    }
                    else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                        URName[i].style.backgroundColor = whitelistColor;
                        URName[i].title = username + ' is listed in the WhiteList';
                        continue;
                    }
                    else {
                        URName[i].style.backgroundColor = notInSheetColor;
                        URName[i].title = username + ' not located in the outreach spreadsheet.';
                    };
                };
            };
        };
    };
    function getFromSheetList(editorName){
        for(let i=0; i<mapped.length; i++){
            if(mapped[i].username.toLowerCase() === editorName.toLowerCase())
                return mapped[i];
        };
        return null;
    };
    function StateCheck() {
        var State = W.model.states.additionalInfo[0].name
        if (State == 'New York' || State == 'New Jersey' || State == 'Delaware' || State == 'Pennsylvania' || State == 'Massachusetts' || State == 'Vermont' || State == 'New Hampshire' || State == 'Rhode Island' || State == 'Maine' || State == 'Connecticut') {
            runORC();
            //console.log('ORC: State set to ' + State)
            $('#ORC-State')[0].innerHTML = 'Current State: ' + State
            $('#ORC-State')[0].style.backgroundColor = ''
        } else {
            //console.log('ORC: This script only supports the N(EO)R Regions at this time.');
            $('#ORC-State')[0].innerHTML = 'Current State: ' + State
            $('#ORC-State')[0].style.backgroundColor = 'red'
        };
    };
    function createTab() {
        var $section = $('<div>');
        $section.html([
            '<div id="ORC-Top"><div id="ORC-title">',
            '<h1>Outreach Checker</h2>',
            '<br><h4>This script is currently restricted to the N(EO)R Regions Only.<h4></div>',
            '<br><h5><div id="ORC-State">Current State: </div></h5>',
            '<br><div id="ORC-info">',
            '<br><span style="color: white; background-color: #ff0000">Red: User has not been contacted or whitelisted.</span>',
            '<br><span style="color: black; background-color: #F7E000" title="User has been contacted but does not mean they have replied or joined Discord">Yellow: User has been contacted.</span>',
            '<br><span style="color: black; background-color: #99bbff" title="N(EO)R Leadership">Light Blue: N(EO)R Management.</span>',
            //'<br><span style="color: black; background-color: #99ff99">Green: User has been contacted and responded.</span>',
            '<br><span style="color: black; background-color: white" title="All R4+ users are automatically whitelisted.">White: Yourself/Whitelisted users (R4+).</span>',
            '</div>',
            '<p><div id="ORC-resources"><p><b>Resources:</b><br><a href="https://www.bit.ly/NewEditorForm" target="_blank">N(EO)R New Editor Contact Form</a><br><a href="https://www.bit.ly/NewEditorSheet" target="_blank">Published Contacts Sheet</a>',
            '</div></div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('ORC', $section.html());
        var btn = document.createElement("BUTTON");
        btn.id = 'ORCBtn';
        var Button = document.getElementById('ORCBtn');
        btn.textContent = 'Save';
        var WLLabel = document.createElement('LABEL');
        WLLabel.innerHTML = '<br><b><h6>Username(s) to be whitelisted (separated by comma):</h6>';
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
        setTimeout(StateCheck, 1000);
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
            W.selectionManager.events.register("selectionchanged", null, StateCheck);
            W.map.events.register("moveend", W.map, StateCheck);
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        };
    };
    bootstrap();
})();
