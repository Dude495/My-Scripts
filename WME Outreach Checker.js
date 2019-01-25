// ==UserScript==
// @name         WME Outreach Checker
// @namespace    Dude495
// @version      2019.01.25.01
// @description  Checks if a user has been contacted and listed in the outreach sheet.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/27023-jscolor/code/JSColor.js
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @license      GNU GPLv3
// @grant        none
/* global W */
/* global $ */
/* global WazeWrap */
/* global jscolor */
// ==/UserScript==

(async function() {
    'use strict';
    var ORCSettings = [];
    var attributes = {
        name: ""
    };
    var currColor;
    var currFColor;
    const ENRegEx = /([A-Za-z ])*: /g;
    const INCRegEx = /(.*)\(\d\)/;
    const RRE = /\(\d\)/g;
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_ALERT = true;
    var UPDATE_NOTES = [
        SCRIPT_NAME + ' has been updated to v' + VERSION,
        '',
        '* Auto-load regional sheets when you cross region boundaries.',
        '* Added PLN Support'
    ].join('\n');
    if (UPDATE_ALERT) {
        SCRIPT_NAME = SCRIPT_NAME.replace( /\s/g, '') + VERSION;
        if (localStorage.getItem(SCRIPT_NAME) !== VERSION) {
            alert(UPDATE_NOTES);
            localStorage.setItem(SCRIPT_NAME, VERSION);
        };
    };
    //Color Change Box code from BeenThere with premissions of JustinS89
    function LoadSettings(){
        if ($('#colorPicker1')[0].jscolor && $('#colorPicker2')[0].jscolor && $('#colorPicker3')[0].jscolor && $('#colorPicker4')[0].jscolor){
            $('#colorPicker1')[0].jscolor.fromString(ORCSettings.CP1);
            $('#colorPicker2')[0].jscolor.fromString(ORCSettings.CP2);
            $('#colorPicker3')[0].jscolor.fromString(ORCSettings.CP3);
            $('#colorPicker4')[0].jscolor.fromString(ORCSettings.CP4);
            $('#fontPicker1')[0].jscolor.fromString(ORCSettings.FP1);
            $('#fontPicker2')[0].jscolor.fromString(ORCSettings.FP2);
            $('#fontPicker3')[0].jscolor.fromString(ORCSettings.FP3);
            $('#fontPicker4')[0].jscolor.fromString(ORCSettings.FP4);
        };
    };
    function updatePanel() {
        $('#ORCMenu-NotContacted > span')[0].style.backgroundColor = ORCSettings.CP1
        $('#ORCMenu-Contacted > span')[0].style.backgroundColor = ORCSettings.CP2
        $('#ORCMenu-Leadership > span')[0].style.backgroundColor = ORCSettings.CP3
        $('#ORCMenu-WhiteListed > span')[0].style.backgroundColor = ORCSettings.CP4
        $('#ORCMenu-NotContacted > span')[0].style.color = ORCSettings.FP1
        $('#ORCMenu-Contacted > span')[0].style.color = ORCSettings.FP2
        $('#ORCMenu-Leadership > span')[0].style.color = ORCSettings.FP3
        $('#ORCMenu-WhiteListed > span')[0].style.color = ORCSettings.FP4
    }
    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                CP1: ORCSettings.CP1,
                CP2: ORCSettings.CP2,
                CP3: ORCSettings.CP3,
                CP4: ORCSettings.CP4,
                FP1: ORCSettings.FP1,
                FP2: ORCSettings.FP2,
                FP3: ORCSettings.FP3,
                FP4: ORCSettings.FP4,
            };
        };
        localStorage.setItem("ORC_Settings", JSON.stringify(localsettings));
        updatePanel();
    };
    function LoadSettingsObj() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("ORC_Settings"));
        }
        catch(err){
            loadedSettings = null;
        };
        var defaultSettings = {
            CP1: "#ff0000",
            CP2: "#F7E000",
            CP3: "#99bbff",
            CP4: "#ffffff",
            FP1: "#ffffff",
            FP2: "#000000",
            FP3: "#000000",
            FP4: "#000000",
        };
        ORCSettings = loadedSettings ? loadedSettings : defaultSettings;
        currColor = ORCSettings.CP1;
        currFColor = ORCSettings.FP1;
    };
    function resetDefault() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("ORC_Settings"));
        }
        catch(err){
            loadedSettings = null;
        };
        var defaultSettings = {
            CP1: "#ff0000",
            CP2: "#F7E000",
            CP3: "#99bbff",
            CP4: "#ffffff",
            FP1: "#ffffff",
            FP2: "#000000",
            FP3: "#000000",
            FP4: "#000000",
        };
        ORCSettings = loadedSettings ? loadedSettings : defaultSettings;
        currColor = ORCSettings.CP1;
        currFColor = ORCSettings.FP1;
        updatePanel();
        LoadSettings();
    };
    function jscolorChanged(){
        ORCSettings.CP1 = "#" + $('#colorPicker1')[0].jscolor.toString();
        ORCSettings.CP2 = "#" + $('#colorPicker2')[0].jscolor.toString();
        ORCSettings.CP3 = "#" + $('#colorPicker3')[0].jscolor.toString();
        ORCSettings.CP4 = "#" + $('#colorPicker4')[0].jscolor.toString();
        ORCSettings.FP1 = "#" + $('#fontPicker1')[0].jscolor.toString();
        ORCSettings.FP2 = "#" + $('#fontPicker2')[0].jscolor.toString();
        ORCSettings.FP3 = "#" + $('#fontPicker3')[0].jscolor.toString();
        ORCSettings.FP4 = "#" + $('#fontPicker4')[0].jscolor.toString();
        saveSettings();
    };
    function initColorPicker(tries){
        tries = tries || 1;

        if ($('#colorPicker1')[0].jscolor && $('#colorPicker2')[0].jscolor) {
            $('#colorPicker1')[0].jscolor.fromString(ORCSettings.CP1);
            $('#colorPicker2')[0].jscolor.fromString(ORCSettings.CP2);
            $('#colorPicker3')[0].jscolor.fromString(ORCSettings.CP3);
            $('#colorPicker4')[0].jscolor.fromString(ORCSettings.CP4);
            $('#fontPicker1')[0].jscolor.fromString(ORCSettings.FP1);
            $('#fontPicker2')[0].jscolor.fromString(ORCSettings.FP2);
            $('#fontPicker3')[0].jscolor.fromString(ORCSettings.FP3);
            $('#fontPicker4')[0].jscolor.fromString(ORCSettings.FP4);
            $('[id^="colorPicker"]')[0].jscolor.closeText = 'Close';
            $('[id^="fontPicker"]')[0].jscolor.closeText = 'Close';
            $('#colorPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#colorPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#colorPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#colorPicker4')[0].jscolor.onChange = jscolorChanged;
            $('#fontPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#fontPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#fontPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#fontPicker4')[0].jscolor.onChange = jscolorChanged;

        } else if (tries < 1000) {
            setTimeout(function () {initColorPicker(tries++);}, 200);
        };
    };
    const RegNEOR = 'New York,New Jersey,Delaware,Pennsylvania,Massachusetts,Vermont,New Hampshire,Rhode Island,Maine,Connecticut'
    const RegMAR = 'Maryland,District of Columbia,West Virginia,Virginia'
    const RegSWR = 'Arizona,California,Colorado,Hawaii,Nevada,New Mexico,Utah'
    const RegGLR = 'Ohio'
    const RegPLN = 'Iowa,Kansas,Minnesota,Missouri,Nebraska,North Dakota,South Dakota'
    const SState = [
        RegNEOR,
        RegMAR,
        RegSWR,
        RegGLR,
        RegPLN
    ].join(',')
    function runORC() {
        const whitelistColor = ORCSettings.CP4;
        const whitelistFColor = ORCSettings.FP4
        const inSheetColor = ORCSettings.CP2;
        const inSheetFColor = ORCSettings.FP2
        const notInSheetColor = ORCSettings.CP1;
        const notInSheetFColor = ORCSettings.FP1
        const managementColor = ORCSettings.CP3;
        const managementFColor = ORCSettings.FP3;
        const youColor = ORCSettings.CP4;
        const youFColor = ORCSettings.FP4;
        const LandMark1 = $('#landmark-edit-general > ul > li:nth-child(1) > a')[0];
        const LandMark2 = $('#landmark-edit-general > ul > li:nth-child(2) > a')[0];
        const Seg1 = $('#segment-edit-general > ul > li:nth-child(2) > a')[0];
        const Seg2 = $('#segment-edit-general > ul > li:nth-child(3) > a')[0];
        const MultiSeg1 = $('#segment-edit-general > ul > li:nth-child(2) > span > a:nth-child(1)');
        const MultiSeg2 = $('#segment-edit-general > ul > li:nth-child(3) > span > a:nth-child(1)');
        const MultiSeg3 = $('#segment-edit-general > ul > li:nth-child(2) > ul > li > a');
        const MultiSeg4 = $('#segment-edit-general > ul > li:nth-child(3) > ul > li > a');
        const MultiSeg5 = $('#segment-edit-general > ul > li:nth-child(3) > span.value > a');
        const MapComment1 = $('#edit-panel > div > div > div.tab-content > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(1) > a')[0];
        const MapComment2 = $('#edit-panel > div > div > div.tab-content > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(2) > a')[0];
        const Camera1 = $('#edit-panel > div > div > div > div.tab-content > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(1) > a')[0];
        const Camera2 = $('#edit-panel > div > div > div > div.tab-content > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(2) > a')[0];
        const PURBig = $('#dialog-region > div > div > div > div.modal-body > div > div.small.user > a')[0];
        const PUR = $('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user')[0];
        const URName = $('span.username');
        const ORCME = W.loginManager.user.userName;
        if (localStorage.getItem('ORWL') == null) {
            localStorage.setItem('ORWL', 'ORWList: ');
        };
        var ORWL = localStorage.getItem('ORWL').toLowerCase();
        if (WazeWrap.hasPlaceSelected() && PUR == undefined && WazeWrap.getSelectedFeatures()[0].model.attributes.categories[0] !== 'RESIDENCE_HOME' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (LandMark1.textContent.includes('(')) {
                if (LandMark1.textContent.includes('staff')) {
                    return;
                } else {
                    if (LandMark1.textContent.includes('(')) {
                        let ORCusername = LandMark1.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = LandMark1.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let leadership = getMgtFromSheetList(username);
                        let entry = getFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            LandMark1.style.backgroundColor = youColor;
                            LandMark1.style.color = youFColor;
                            LandMark1.title = 'This is you';
                        }
                        else if (leadership != null) {
                            LandMark1.style.backgroundColor = managementColor;
                            LandMark1.style.color = managementFColor;
                            LandMark1.title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            LandMark1.style.backgroundColor = whitelistColor;
                            LandMark1.style.color = whitelistFColor;
                            LandMark1.title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                LandMark1.style.backgroundColor = inSheetColor;
                                LandMark1.style.color = inSheetFColor;
                                LandMark1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                LandMark1.style.backgroundColor = inSheetColor;
                                LandMark1.style.color = inSheetFColor;
                                LandMark1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            LandMark1.style.backgroundColor = notInSheetColor;
                            LandMark1.style.color = notInSheetFColor;
                            LandMark1.title = username + ' is not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
            if (LandMark2 !== undefined) {
                if (LandMark2.textContent.includes('(')) {
                    if (LandMark2.textContent.includes('staff')) {
                        return;
                    } else {
                        if (LandMark2.textContent.includes('(')) {
                            let ORCusername = LandMark2.textContent.match(INCRegEx);
                            let username = ORCusername[1];
                            let RUN = LandMark2.textContent.match(RRE);
                            let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                            let entry = getFromSheetList(username);
                            let leadership = getMgtFromSheetList(username);
                            if (username.toLowerCase() == ORCME.toLowerCase()) {
                                LandMark2.style.backgroundColor = youColor;
                                LandMark2.style.color = youFColor;
                                LandMark2.title = 'This is you';
                            }
                            else if (leadership != null) {
                                LandMark2.style.backgroundColor = managementColor;
                                LandMark2.style.color = managementFColor;
                                LandMark2.title = username + ' is Regional Management';
                            }
                            else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                                LandMark2.style.backgroundColor = whitelistColor;
                                LandMark2.style.color = whitelistFColor;
                                LandMark2.title = username + ' is listed in the WhiteList';
                            }
                            else if (entry != null) {
                                if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                    LandMark2.style.backgroundColor = inSheetColor;
                                    LandMark2.style.color = inSheetFColor;
                                    LandMark2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                                } else {
                                    LandMark2.style.backgroundColor = inSheetColor;
                                    LandMark2.style.color = inSheetFColor;
                                    LandMark2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                                };
                            }
                            else {
                                LandMark2.style.backgroundColor = notInSheetColor;
                                LandMark2.style.color = notInSheetFColor;
                                LandMark2.title = username + ' not located in the outreach spreadsheet.';
                            };
                        };
                    };
                };
            };
        };
        if (WazeWrap.hasSegmentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if ((MultiSeg1.length > '0') && MultiSeg1[0].textContent.includes('(')) {
                if (MultiSeg1[0].textContent.includes('staff')) {
                    return;
                }
                else if ((MultiSeg1.length > '0') && MultiSeg1[0].textContent.includes('(')) {
                    let ORCusername = MultiSeg1[0].textContent.match(INCRegEx);
                    let username = ORCusername[1];
                    let RUN = MultiSeg1[0].textContent.match(RRE);
                    let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                    let leadership = getMgtFromSheetList(username);
                    let entry = getFromSheetList(username);
                    if (username.toLowerCase() == ORCME.toLowerCase()) {
                        MultiSeg1[0].style.backgroundColor = youColor;
                        MultiSeg1[0].style.color = youFColor;
                        MultiSeg1[0].title = 'This is you';
                    }
                    else if (leadership != null) {
                        MultiSeg1[0].style.backgroundColor = managementColor;
                        MultiSeg1[0].style.color = managementFColor;
                        MultiSeg1[0].title = username + ' is Regional Management';
                    }
                    else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                        MultiSeg1[0].style.backgroundColor = whitelistColor;
                        MultiSeg1[0].style.color = whitelistFColor;
                        MultiSeg1[0].title = username + ' is listed in the WhiteList';
                    }
                    else if (entry != null) {
                        if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                            MultiSeg1[0].style.backgroundColor = inSheetColor;
                            MultiSeg1[0].style.color = inSheetFColor;
                            MultiSeg1[0].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                        } else {
                            MultiSeg1[0].style.backgroundColor = inSheetColor;
                            MultiSeg1[0].style.color = inSheetFColor;
                            MultiSeg1[0].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                        };
                    }
                    else {
                        MultiSeg1[0].style.backgroundColor = notInSheetColor;
                        MultiSeg1[0].style.color = notInSheetFColor;
                        MultiSeg1[0].title = username + ' not located in the outreach spreadsheet.';
                    };
                };
            };
            if (MultiSeg2.length > '0') {
                if (MultiSeg2[0].textContent.includes('(')) {
                    if (MultiSeg2[0].textContent.includes('staff')) {
                        return;
                    } else {
                        if (MultiSeg2[0].textContent.includes('(')) {
                            let ORCusername = MultiSeg2[0].textContent.match(INCRegEx);
                            let username = ORCusername[1];
                            let RUN = MultiSeg2[0].textContent.match(RRE);
                            let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                            let entry = getFromSheetList(username);
                            let leadership = getMgtFromSheetList(username);
                            if (username.toLowerCase() == ORCME.toLowerCase()) {
                                MultiSeg2[0].style.backgroundColor = youColor;
                                MultiSeg2[0].style.color = youFColor;
                                MultiSeg2[0].title = 'This is you';
                            }
                            else if (leadership != null) {
                                MultiSeg2[0].style.backgroundColor = managementColor;
                                MultiSeg2[0].style.color = managementFColor;
                                MultiSeg2[0].title = username + ' is Regional Management';
                            }
                            else if (ORWL.includes(username.toLowerCase() || RANK >= '4')) {
                                MultiSeg2[0].style.backgroundColor = whitelistColor;
                                MultiSeg2[0].style.color = whitelistFColor;
                                MultiSeg2[0].title = username + ' is listed in the WhiteList';
                            }
                            else if (entry != null) {
                                if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                    MultiSeg2[0].style.backgroundColor = inSheetColor;
                                    MultiSeg2[0].style.color = inSheetFColor;
                                    MultiSeg2[0].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                                } else {
                                    MultiSeg2[0].style.backgroundColor = inSheetColor;
                                    MultiSeg2[0].style.color = inSheetFColor;
                                    MultiSeg2[0].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                                };
                            }
                            else {
                                MultiSeg2[0].style.backgroundColor = notInSheetColor;
                                MultiSeg2[0].style.color = notInSheetFColor;
                                MultiSeg2[0].title = username + ' not located in the outreach spreadsheet.';
                            };
                        };
                    };
                };
            };
            if (MultiSeg3.length > '0') {
                let i;
                for (i = 0; i < MultiSeg3.length; i++) {
                    if (MultiSeg3[i].textContent.includes('staff')) {
                        return;
                    }
                    else {
                        if (MultiSeg3[i].textContent.includes('(')) {
                            let ORCusername = MultiSeg3[i].textContent.match(INCRegEx);
                            let username = ORCusername[1];
                            let RUN = MultiSeg3[i].textContent.match(RRE);
                            let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                            let entry = getFromSheetList(username);
                            let leadership = getMgtFromSheetList(username);
                            if (username.toLowerCase() == ORCME.toLowerCase()) {
                                MultiSeg3[i].style.backgroundColor = youColor;
                                MultiSeg3[i].style.color = youFColor;
                                MultiSeg3[i].title = 'This is you';
                                continue;
                            }
                            else if (leadership != null) {
                                MultiSeg3[i].style.backgroundColor = managementColor;
                                MultiSeg3[i].style.color = managementFColor;
                                MultiSeg3[i].title = username + ' is Regional Management';
                            }
                            else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                                MultiSeg3[i].style.backgroundColor = whitelistColor;
                                MultiSeg3[i].style.color = whitelistFColor;
                                MultiSeg3[i].title = username + ' is listed in the WhiteList';
                                continue;
                            }
                            else if (entry != null) {
                                if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                    MultiSeg3[i].style.backgroundColor = inSheetColor;
                                    MultiSeg3[i].style.color = inSheetFColor;
                                    MultiSeg3[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                                    continue;
                                } else {
                                    MultiSeg3[i].style.backgroundColor = inSheetColor;
                                    MultiSeg3[i].style.color = inSheetFColor;
                                    MultiSeg3[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                                    continue;
                                };
                                continue;
                            }
                            else {
                                MultiSeg3[i].style.backgroundColor = notInSheetColor;
                                MultiSeg3[i].style.color = notInSheetFColor;
                                MultiSeg3[i].title = username + ' not located in the outreach spreadsheet.';
                            };
                        };
                    };
                };
            };
            if (MultiSeg4.length > '0') {
                let i;
                for (i = 0; i < MultiSeg4.length; i++) {
                    if (MultiSeg4[i].textContent.includes('staff')) {
                        return;
                    }
                    else {
                        if (MultiSeg4[i].textContent.includes('(')) {
                            let ORCusername = MultiSeg4[i].textContent.match(INCRegEx);
                            let username = ORCusername[1];
                            let RUN = MultiSeg4[i].textContent.match(RRE);
                            let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                            let entry = getFromSheetList(username);
                            let leadership = getMgtFromSheetList(username);
                            if (username.toLowerCase() == ORCME.toLowerCase()) {
                                MultiSeg4[i].style.backgroundColor = youColor;
                                MultiSeg4[i].style.color = youFColor;
                                MultiSeg4[i].title = 'This is you';
                                continue;
                            }
                            else if (leadership != null) {
                                MultiSeg4[i].style.backgroundColor = managementColor;
                                MultiSeg4[i].style.color = managementFColor;
                                MultiSeg4[i].title = username + ' is Regional Management';
                            }
                            else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                                MultiSeg4[i].style.backgroundColor = whitelistColor;
                                MultiSeg4[i].style.color = whitelistFColor;
                                MultiSeg4[i].title = username + ' is listed in the WhiteList';
                                continue;
                            }
                            else if (entry != null) {
                                if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                    MultiSeg4[i].style.backgroundColor = inSheetColor;
                                    MultiSeg4[i].style.color = inSheetFColor;
                                    MultiSeg4[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                                    continue;
                                } else {
                                    MultiSeg4[i].style.backgroundColor = inSheetColor;
                                    MultiSeg4[i].style.color = inSheetFColor;
                                    MultiSeg4[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                                    continue;
                                };
                                continue;
                            }
                            else {
                                MultiSeg4[i].style.backgroundColor = notInSheetColor;
                                MultiSeg4[i].style.color = notInSheetFColor;
                                MultiSeg4[i].title = username + ' not located in the outreach spreadsheet.';
                            };
                        };
                    };
                };
            };
            if (MultiSeg5.length > '0') {
                let i;
                for (i = 0; i < MultiSeg5.length; i++) {
                    if (MultiSeg5[i].textContent.includes('staff')) {
                        return;
                    }
                    else {
                        if (MultiSeg5[i].textContent.includes('(')) {
                            let ORCusername = MultiSeg5[i].textContent.match(INCRegEx);
                            let username = ORCusername[1];
                            let RUN = MultiSeg5[i].textContent.match(RRE);
                            let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                            let entry = getFromSheetList(username);
                            let leadership = getMgtFromSheetList(username);
                            if (username.toLowerCase() == ORCME.toLowerCase()) {
                                MultiSeg5[i].style.backgroundColor = youColor;
                                MultiSeg5[i].style.color = youFColor;
                                MultiSeg5[i].title = 'This is you';
                                continue;
                            }
                            else if (leadership != null) {
                                MultiSeg5[i].style.backgroundColor = managementColor;
                                MultiSeg5[i].style.color = managementFColor;
                                MultiSeg5[i].title = username + ' is Regional Management';
                            }
                            else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                                MultiSeg5[i].style.backgroundColor = whitelistColor;
                                MultiSeg5[i].style.color = whitelistFColor;
                                MultiSeg5[i].title = username + ' is listed in the WhiteList';
                                continue;
                            }
                            else if (entry != null) {
                                if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                    MultiSeg5[i].style.backgroundColor = inSheetColor;
                                    MultiSeg5[i].style.color = inSheetFColor;
                                    MultiSeg5[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                                    continue;
                                } else {
                                    MultiSeg5[i].style.backgroundColor = inSheetColor;
                                    MultiSeg5[i].style.color = inSheetFColor;
                                    MultiSeg5[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                                    continue;
                                };
                                continue;
                            }
                            else {
                                MultiSeg5[i].style.backgroundColor = notInSheetColor;
                                MultiSeg5[i].style.color = notInSheetFColor;
                                MultiSeg5[i].title = username + ' not located in the outreach spreadsheet.';
                            };
                        };
                    };
                };
            };
            if (Seg1 !== undefined) {
                if (Seg1.textContent.includes('(')) {
                    if (Seg1.textContent.includes('staff')) {
                        return;
                    } else {
                        let ORCusername = Seg1.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = Seg1.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let leadership = getMgtFromSheetList(username);
                        let entry = getFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            Seg1.style.backgroundColor = youColor;
                            Seg1.style.color = youFColor;
                            Seg1.title = 'This is you';
                        }
                        else if (leadership != null) {
                            Seg1.style.backgroundColor = managementColor;
                            Seg1.style.color = managementFColor;
                            Seg1.title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            Seg1.style.backgroundColor = whitelistColor;
                            Seg1.style.color = whitelistFColor;
                            Seg1.title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                Seg1.style.backgroundColor = inSheetColor;
                                Seg1.style.color = inSheetFColor;
                                Seg1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                Seg1.style.backgroundColor = inSheetColor;
                                Seg1.style.color = inSheetFColor;
                                Seg1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            Seg1.style.backgroundColor = notInSheetColor;
                            Seg1.style.color = notInSheetFColor;
                            Seg1.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
            if (Seg2 !== undefined) {
                if (Seg2.textContent.includes('(')) {
                    if (Seg2.textContent.includes('staff')) {
                        return;
                    } else {
                        if (Seg2.textContent.includes('(')) {
                            let ORCusername = Seg2.textContent.match(INCRegEx);
                            let username = ORCusername[1];
                            let RUN = Seg2.textContent.match(RRE);
                            let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                            let entry = getFromSheetList(username);
                            let leadership = getMgtFromSheetList(username);
                            if (username.toLowerCase() == ORCME.toLowerCase()) {
                                Seg2.style.backgroundColor = youColor;
                                Seg2.style.color = youFColor;
                                Seg2.title = 'This is you';
                            }
                            else if (leadership != null) {
                                Seg2.style.backgroundColor = managementColor;
                                Seg2.style.color = managementFColor;
                                Seg2.title = username + ' is Regional Management';
                            }
                            else if (ORWL.includes(username.toLowerCase() || RANK >= '4')) {
                                Seg2.style.backgroundColor = whitelistColor;
                                Seg2.style.color = whitelistFColor;
                                Seg2.title = username + ' is listed in the WhiteList';
                            }
                            else if (entry != null) {
                                if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                    Seg2.style.backgroundColor = inSheetColor;
                                    Seg2.style.color = inSheetFColor;
                                    Seg2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                                } else {
                                    Seg2.style.backgroundColor = inSheetColor;
                                    Seg2.style.color = inSheetFColor;
                                    Seg2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                                };
                            }
                            else {
                                Seg2.style.backgroundColor = notInSheetColor;
                                Seg2.style.color = notInSheetFColor;
                                Seg2.title = username + ' not located in the outreach spreadsheet.';
                            };
                        };
                    };
                };
            };
        };
        if (WazeWrap.hasMapCommentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (MapComment1.textContent.includes('(')) {
                if (MapComment1.textContent.includes('staff')) {
                    return;
                } else {
                    if (MapComment1.textContent.includes('(')) {
                        let ORCusername = MapComment1.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = MapComment1.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let leadership = getMgtFromSheetList(username);
                        let entry = getFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            MapComment1.style.backgroundColor = youColor;
                            MapComment1.style.color = youFColor;
                            MapComment1.title = 'This is you';
                        }
                        else if (leadership != null) {
                            MapComment1.style.backgroundColor = managementColor;
                            MapComment1.style.color = managementFColor;
                            MapComment1.title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            MapComment1.style.backgroundColor = whitelistColor;
                            MapComment1.style.color = whitelistFColor;
                            MapComment1.title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                MapComment1.style.backgroundColor = inSheetColor;
                                MapComment1.style.color = inSheetFColor;
                                MapComment1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                MapComment1.style.backgroundColor = inSheetColor;
                                MapComment1.style.color = inSheetFColor;
                                MapComment1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            MapComment1.style.backgroundColor = notInSheetColor;
                            MapComment1.style.color = notInSheetFColor;
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
                        let entry = getFromSheetList(username);
                        let leadership = getMgtFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            MapComment2.style.backgroundColor = youColor;
                            MapComment2.style.color = youFColor;
                            MapComment2.title = 'This is you';
                        }
                        else if (leadership != null) {
                            MapComment2.style.backgroundColor = managementColor;
                            MapComment2.style.color = managementFColor;
                            MapComment2.title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            MapComment2.style.backgroundColor = whitelistColor;
                            MapComment2.style.color = whitelistFColor;
                            MapComment2.title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                MapComment2.style.backgroundColor = inSheetColor;
                                MapComment2.style.color = inSheetFColor;
                                MapComment2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                MapComment2.style.backgroundColor = inSheetColor;
                                MapComment2.style.color = inSheetFColor;
                                MapComment2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            MapComment2.style.backgroundColor = notInSheetColor;
                            MapComment2.style.color = notInSheetFColor;
                            MapComment2.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
        };
        if (W.selectionManager.getSelectedFeatures()[0] && W.selectionManager.getSelectedFeatures()[0].model.type == 'camera' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (Camera1.textContent.includes('(')) {
                if (Camera1.textContent.includes('staff')) {
                    return;
                } else {
                    if (Camera1.textContent.includes('(')) {
                        let ORCusername = Camera1.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = Camera1.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let entry = getFromSheetList(username);
                        let leadership = getMgtFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            Camera1.style.backgroundColor = youColor;
                            Camera1.style.color = youFColor;
                            Camera1.title = 'This is you';
                        }
                        else if (leadership != null) {
                            Camera1.style.backgroundColor = managementColor;
                            Camera1.style.color = managementFColor;
                            Camera1.title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            Camera1.style.backgroundColor = whitelistColor;
                            Camera1.style.color = whitelistFColor;
                            Camera1.title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                Camera1.style.backgroundColor = inSheetColor;
                                Camera1.style.color = inSheetFColor;
                                Camera1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                Camera1.style.backgroundColor = inSheetColor;
                                Camera1.style.color = inSheetFColor;
                                Camera1.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            Camera1.style.backgroundColor = notInSheetColor;
                            Camera1.style.color = notInSheetFColor;
                            Camera1.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
            if (Camera2.textContent.includes('(')) {
                if (Camera2.textContent.includes('staff')) {
                    return;
                } else {
                    if (Camera2.textContent.includes('(')) {
                        let ORCusername = Camera2.textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = Camera2.textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let entry = getFromSheetList(username);
                        let leadership = getMgtFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            Camera2.style.backgroundColor = youColor;
                            Camera2.style.color = youFColor;
                            Camera2.title = 'This is you';
                        }
                        else if (leadership != null) {
                            Camera2.style.backgroundColor = managementColor;
                            Camera2.style.color = managementFColor;
                            Camera2.title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase() || RANK >= '4')) {
                            Camera2.style.backgroundColor = whitelistColor;
                            Camera2.style.color = whitelistFColor;
                            Camera2.title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                Camera2.style.backgroundColor = inSheetColor;
                                Camera2.style.color = inSheetFColor;
                                Camera2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                Camera2.style.backgroundColor = inSheetColor;
                                Camera2.style.color = inSheetFColor;
                                Camera2.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            Camera2.style.backgroundColor = notInSheetColor;
                            Camera2.style.color = notInSheetFColor;
                            Camera2.title = username + ' not located in the outreach spreadsheet.';
                        };
                    };
                };
            };
        };
        if ($('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user').is(':visible')) {
            if (PUR.childNodes[1].textContent.includes('(')) {
                if (PUR.childNodes[1].textContent.includes('staff')) {
                    return;
                } else {
                    if (PUR.childNodes[1].textContent.includes('(')) {
                        let ORCusername = PUR.childNodes[1].textContent.match(INCRegEx);
                        let username = ORCusername[1];
                        let RUN = PUR.childNodes[1].textContent.match(RRE);
                        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                        let entry = getFromSheetList(username);
                        let leadership = getMgtFromSheetList(username);
                        if (username.toLowerCase() == ORCME.toLowerCase()) {
                            PUR.childNodes[1].style.backgroundColor = youColor;
                            PUR.childNodes[1].style.color = youFColor;
                            PUR.childNodes[1].title = 'This is you';
                        }
                        else if (leadership != null) {
                            PUR.childNodes[1].style.backgroundColor = managementColor;
                            PUR.childNodes[1].style.color = managementFColor;
                            PUR.childNodes[1].title = username + ' is Regional Management';
                        }
                        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                            PUR.childNodes[1].style.backgroundColor = whitelistColor;
                            PUR.childNodes[1].style.color = whitelistFColor;
                            PUR.childNodes[1].title = username + ' is listed in the WhiteList';
                        }
                        else if (entry != null) {
                            if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                                PUR.childNodes[1].style.backgroundColor = inSheetColor;
                                PUR.childNodes[1].style.color = inSheetFColor;
                                PUR.childNodes[1].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            } else {
                                PUR.childNodes[1].style.backgroundColor = inSheetColor;
                                PUR.childNodes[1].style.color = inSheetFColor;
                                PUR.childNodes[1].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            };
                        }
                        else {
                            PUR.childNodes[1].style.backgroundColor = notInSheetColor;
                            PUR.childNodes[1].style.color = notInSheetFColor;
                            PUR.childNodes[1].title = username + ' not located in the outreach spreadsheet.';
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
                    let RUN = URName[i].textContent.match(RRE);
                    let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
                    let entry = getFromSheetList(username);
                    let leadership = getMgtFromSheetList(username);
                    if (username.toLowerCase() == ORCME.toLowerCase()) {
                        URName[i].style.backgroundColor = youColor;
                        URName[i].style.color = youFColor;
                        URName[i].title = 'This is you';
                        continue;
                    }
                    else if (leadership != null) {
                        URName[i].style.backgroundColor = managementColor;
                        URName[i].style.color = managementFColor;
                        URName[i].title = username + ' is Regional Management';
                    }
                    else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
                        URName[i].style.backgroundColor = whitelistColor;
                        URName[i].style.color = whitelistFColor;
                        URName[i].title = username + ' is listed in the WhiteList';
                        continue;
                    }
                    else if (entry != null) {
                        if (RegPLN.includes(sessionStorage.getItem('ORCState'))) {
                            URName[i].style.backgroundColor = inSheetColor;
                            URName[i].style.color = inSheetFColor;
                            URName[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                            continue;
                        } else {
                            URName[i].style.backgroundColor = inSheetColor;
                            URName[i].style.color = inSheetFColor;
                            URName[i].title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                            continue;
                        };
                        continue;
                    }
                    else {
                        URName[i].style.backgroundColor = notInSheetColor;
                        URName[i].style.color = notInSheetFColor;
                        URName[i].title = username + ' not located in the outreach spreadsheet.';
                    };
                };
            };
        };
    };
    var ORCFeedList = [];
    const NEOR = 'https://spreadsheets.google.com/feeds/list/1sHxgBQ5rVBkYFHcJ5t4p8R2aHxM1WnFFSW-lwqPf0Tg/4/public/values?alt=json';
    const MAR = 'https://spreadsheets.google.com/feeds/list/1DHqS2fhB_6pk_ZGxLzSgnakn7HPPz_YEmzCprUhFg1o/1/public/values?alt=json';
    const SWR = 'https://spreadsheets.google.com/feeds/list/1VN7Ry4BhDrG1aLbGjDA3RULfjjX5R1TcNojbsPp0BwI/1/public/values?alt=json';
    const OH = 'https://spreadsheets.google.com/feeds/list/1HdXxC11jStR8-XdRBL2wmQx-o846dOzETslOsbtxoM8/1/public/values?alt=json';
    const PLN = 'https://spreadsheets.google.com/feeds/list/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/1/public/values?alt=json';
    async function loadMasterList() {
        var SS;
        if (!localStorage.getItem('SS')) {
            localStorage.setItem('SS', NEOR)
            console.log('ORC: Loading Default List (NEOR)....');
            SS = localStorage.getItem('SS');
        }
        else {
            SS = localStorage.getItem('SS');
            console.log('ORC: Loading ' + localStorage.getItem('SS') + ' Master List....');
        }
        await $.getJSON(SS, function(data){
            ORCFeedList = data;
            console.log('ORC: Master List Loaded....');
        });
    };
    var RegMgt = [];
    async function loadLeadershipList() {
        var MgtSheet;
        var MgtReg;
        if (!localStorage.getItem('SS')) {
            localStorage.setItem('SS', NEOR)
            console.log('ORC: Loading Default List (NEOR)....');
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/3/public/values?alt=json'
            MgtReg = 'NEOR'
        }
        else if (localStorage.getItem('SS') == NEOR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/3/public/values?alt=json'
            console.log('ORC: Loading NEOR Leadership Master List....');
            MgtReg = 'NEOR'
        }
        else if (localStorage.getItem('SS') == MAR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/4/public/values?alt=json';
            console.log('ORC: Loading MAR Leadership Master List....');
            MgtReg = 'MAR';
        }
        else if (localStorage.getItem('SS') == SWR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/5/public/values?alt=json';
            console.log('ORC: Loading SWR Leadership Master List....');
            MgtReg = 'SWR';
        }
        else if (localStorage.getItem('SS') == OH) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading Ohio Leadership Master List....');
            MgtReg = 'Ohio';
        }
        else if (localStorage.getItem('SS') == PLN) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/7/public/values?alt=json';
            console.log('ORC: Loading PLN Leadership Master List....');
            MgtReg = 'PLN';
        };
        await $.getJSON(MgtSheet, function(ldata){
            RegMgt = ldata;
            console.log('ORC: '+MgtReg+' Leadership Masterlist Loaded....');
        });
    };
    function getMgtFromSheetList(editorName) {
        let MgtList = RegMgt.feed.entry.map(obj =>{
            return {username: obj.gsx$regionleadership.$t};
        });
        for(let i=0; i<MgtList.length; i++){
            if(MgtList[i].username.toLowerCase() === editorName.toLowerCase()) {
                return MgtList[i];
            };
        };
        return null;
    };
    function getFromSheetList(editorName){
        let mapped = ORCFeedList.feed.entry.map(obj =>{
            if (localStorage.getItem('SS') == NEOR) {
                return {username: obj['gsx$usehttpj.mpneweditorsorttosortlist'].$t.replace(ENRegEx,'').trim(), responses: obj.gsx$changescantakeupto.$t, reporter: obj.gsx$minutesdelaytoappear.$t, dateC: obj['gsx$httpj.mpneweditorformtoreport'].$t
                       };
            };
            if (localStorage.getItem('SS') == MAR) {
                return {username: obj.gsx$editorusername.$t.trim(), responses: obj.gsx$didtheyjoindiscord.$t, reporter: obj.gsx$yourusername.$t, dateC: obj.gsx$timestamp.$t
                       };
            };
            if (localStorage.getItem('SS') == SWR) {
                if (obj.gsx$ndoutreachdate.$t.trim() == null) {
                    return {username: obj.gsx$wazeusername.$t.trim(), responses: obj['gsx$madeconnectionviapmbutdiddidntjoindiscord.'].$t, reporter: obj.gsx$outreacheditor.$t, dateC: obj.gsx$stoutreachdate.$t
                           };
                } else {
                    return {username: obj.gsx$wazeusername.$t.trim(), responses: obj['gsx$madeconnectionviapmbutdiddidntjoindiscord.'].$t, reporter: obj.gsx$outreacheditor.$t, dateC: obj.gsx$ndoutreachdate.$t
                           };
                };
            };
            if (localStorage.getItem('SS') == OH) {
                return {username: obj.gsx$neweditorname.$t.trim(), responses: obj.gsx$readresponded.$t, reporter: obj.gsx$youreditorname.$t, dateC: obj.gsx$outreachdateest.$t
                       };
            };
            if (localStorage.getItem('SS') == PLN) {
                return {username: obj.gsx$contactededitor.$t.trim(), forumread: obj.gsx$forummessageread.$t, responses: obj.gsx$responsereceived.$t, reporter: obj.gsx$yourusername.$t, dateC: obj.gsx$timestamp.$t
                       };
            };
        });
        for(let i=0; i<mapped.length; i++){
            if(mapped[i].username.toLowerCase() === editorName.toLowerCase()) {
                return mapped[i];
            };
        };
        return null;
    };
    function updateMasterList() {
        if ($('#ORCRegList')[0].value == 'NEOR') {
            localStorage.setItem('SS', NEOR);
        }
        else if ($('#ORCRegList')[0].value == 'MAR') {
            localStorage.setItem('SS', MAR);
        }
        else if ($('#ORCRegList')[0].value == 'SWR') {
            localStorage.setItem('SS', SWR);
        }
        else if ($('#ORCRegList')[0].value == 'OH') {
            localStorage.setItem('SS', OH);
        }
        else if ($('#ORCRegList')[0].value == 'PLN') {
            localStorage.setItem('SS', PLN);
        };
        setTimeout(loadMasterList, 500);
        setTimeout(loadLeadershipList, 500);
    };
    function StateCheck() {
        var State = W.model.states.additionalInfo[0].name
        if (RegNEOR.includes(State)) {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: N(EO)R';
            if (localStorage.getItem('SS') !== NEOR) {
                localStorage.setItem('SS', NEOR);
                $('#ORCRegList')[0].value = 'NEOR';
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        }
        else if (RegMAR.includes(State)) {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: MAR';
            if (localStorage.getItem('SS') !== MAR) {
                localStorage.setItem('SS', MAR);
                $('#ORCRegList')[0].value = 'MAR';
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        }
        else if (RegSWR.includes(State)) {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: SWR';
            if (localStorage.getItem('SS') !== SWR) {
                localStorage.setItem('SS', SWR);
                $('#ORCRegList')[0].value = 'SWR';
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        }
        else if (RegGLR.includes(State)) {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: GLR';
            if (localStorage.getItem('SS') !== OH) {
                localStorage.setItem('SS', OH);
                $('#ORCRegList')[0].value = 'OH';
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        }
        else if (RegPLN.includes(State)) {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: PLN';
            if (localStorage.getItem('SS') !== PLN) {
                localStorage.setItem('SS', PLN);
                $('#ORCRegList')[0].value = 'PLN';
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        }
        else {
            $('#ORC-Region')[0].innerHTML = '<b><span style="color: white; background-color: #ff0000">Current Region Not Supported.</span></b>';
        };
        if (SState.includes(State)) {
            sessionStorage.setItem('ORCState', State);
            runORC();
            $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
            $('#ORC-State')[0].style.backgroundColor = '';
        } else {
            $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
            $('#ORC-State')[0].style.backgroundColor = 'red';
        };
    };
    function RemoveWLSLabel() {
        $('#ORC-WLSaveMsg')[0].innerHTML = ''
        $('#ORWLVal')[0].value = ''
    }
    function resetRegList() {
        $('#ORCRegList')[0].value = '0'
    }
    function createTab() {
        var $section = $('<div>');
        $section.html([
            '<div id="ORC-Top"><div id="ORC-title">',
            '<h1>Outreach Checker</h2>',
            '<br><h4>This script is currently limited to the regions listed.<h4></div>',
            '<select id="ORCRegList"><option value="0" selected disabled>Region</option><option value="MAR">MAR</option><option value="NEOR">N(EO)R</option><option value="OH">OHIO</option><option value="PLN">PLN</option><option value="SWR">SWR</option></select><button type="button" id="ORCReloadList" class="btn btn-default btn-sm"><span class="fa fa-repeat" title="Reload Outreach Lists"></span></button>',
            '<br><div id="ORC-Region">Current Region: </div>',
            '<div id="ORC-State">Current State: </div>',
            '<div id="ORC-Warning"></div>',
            '<br><div id="ORC-info">',
            '<div id="ORCColorOpts">',
            '<font size="1.9"><span title="Set Background Color">Bg</span> | <span title="Set Font Color">Txt</span>   </font><button id="ORCResetColors">Reset</button>',
            '<br><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;;width:15px; height:15px;border:2px solid black" id="colorPicker1"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker1"></button><div id="ORCMenu-NotContacted"><span style="color: black; background-color: #ff0000">Not been contacted or whitelisted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="colorPicker2"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker2"></button><div id="ORCMenu-Contacted"><span style="color: black; background-color: #F7E000" title=" User has been contacted but does not mean they have replied or joined Discord">Has been contacted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="colorPicker3"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker3"></button><div id="ORCMenu-Leadership"><span style="color: black; background-color: #99bbff" title="Region Leadership">Regional Management (SM+).</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="colorPicker4"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker4"></button><div id="ORCMenu-WhiteListed"><span style="color: black; background-color: white" title="All R4+ users are automatically whitelisted.">Yourself/Whitelisted users (R4+).</span></div>',
            '</div>',
            '</div>',
            '<p><div id="ORC-resources"><p><b>Resources:</b><br>',
            '<p><div id="ORC-WhiteList"></div>',
            '</div></div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('ORC', $section.html());
        var RSClrBtn = document.getElementById('ORCResetColors');
        RSClrBtn.style.width = '25px';
        RSClrBtn.style.height = '5px';
        RSClrBtn.style.fontSize = '8px';
        RSClrBtn.style.paddingLeft = '1px';
        RSClrBtn.title = 'Reset to default color settings';
        RSClrBtn.onclick = function() {
            localStorage.removeItem("ORC_Settings");
            resetDefault();
        };
        var P = document.createElement('P');
        var btn = document.createElement("BUTTON");
        btn.id = 'ORCBtn';
        var Button = document.getElementById('ORCBtn');
        btn.textContent = 'Add';
        var WLLabel = document.createElement('LABEL');
        WLLabel.innerHTML = '<br><b><h6>Username(s) to be whitelisted (separated by comma):</h6>';
        var ORCResources = document.getElementById('ORC-resources');
        var tb = document.createElement('INPUT');
        tb.id = 'ORWLVal';
        tb.size = '40';
        tb.setAttribute('type', 'text');
        ORCResources.after(tb);
        tb.after(P);
        P.after(btn);
        tb.before(WLLabel);
        var SaveWL = document.createElement('BUTTON');
        SaveWL.id = 'SaveWLButton';
        SaveWL.textContent = 'Save';
        btn.after(SaveWL);
        var ResetWL = document.createElement('BUTTON');
        ResetWL.id = 'SaveWLButton';
        ResetWL.textContent = 'Reset';
        SaveWL.after(ResetWL);
        var WLSLabel = document.createElement('LABEL')
        WLSLabel.id = 'ORC-WLSaveMsg';
        var P1 = P
        ResetWL.after(P1)
        SaveWL.onclick = function() {
            var copyText = localStorage.getItem('ORWL')
            var copied = $('<textarea id="ORCWLCopy" rows="1" cols="1">').val(copyText.replace('ORC ORWL: ', '')).appendTo('body').select();
            var ORCWLCopy = document.getElementById('ORCWLCopy');
            document.execCommand('copy');
            document.body.removeChild(ORCWLCopy);
            //alert('ORC WhiteList saved to clipboard.');
            P1.after(WLSLabel);
            WLSLabel.innerHTML = '<p>ORC WhiteList saved to clipboard.</p>'
            setTimeout(RemoveWLSLabel, 1000);
        };
        ResetWL.onclick = function() {
            localStorage.setItem('ORWL', 'ORWList: ');
            //alert('ORC WhiteList erased.');
            P1.after(WLSLabel);
            WLSLabel.innerHTML = '<p>ORC WhiteList reset.</p>'
            setTimeout(RemoveWLSLabel, 1000);
        };
        var ReloadListBtn = document.getElementById('ORCReloadList');
        ReloadListBtn.onclick = function() {
            P1.after(WLSLabel);
            WLSLabel.innerHTML = '<p>Reloading Outreach Data....</p>';
            loadMasterList();
            loadLeadershipList();
            setTimeout(RemoveWLSLabel, 1500);
        };
        let SelectedRegion = $('#ORCRegList')[0];
        if (localStorage.getItem('SS') == MAR) {
            SelectedRegion.value = 'MAR';
        }
        else if (localStorage.getItem('SS') == NEOR) {
            SelectedRegion.value = 'NEOR';
        }
        else if (localStorage.getItem('SS') == SWR) {
            SelectedRegion.value = 'SWR';
        }
        else if (localStorage.getItem('SS') == OH) {
            SelectedRegion.value = 'OH';
        }
        else if (localStorage.getItem('SS') == PLN) {
            SelectedRegion.value ='PLN';
        };
        SelectedRegion.onchange = function() {
            if (SelectedRegion.value == 'NEOR' && RegNEOR.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', NEOR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MAR' && RegMAR.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', MAR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'SWR' && RegSWR.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', SWR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'OH' && RegGLR.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', OH);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'PLN' && RegPLN.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', PLN);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else {
                $('#ORC-Warning')[0].innerHTML = '<br><span style="color: white; background-color: #ff0000">ERROR: Your selected region list does not match your current WME location.</span>'
                console.log('ORC: Master Lists not updated.');
                setTimeout(resetRegList, 500);
            };
        };
        var ORCRes = document.getElementById('ORC-resources');
        var ORCResList = document.createElement('LABEL');
        if (localStorage.getItem('SS') == NEOR) {
            ORCResList.innerHTML = '<a href="https://www.bit.ly/NewEditorForm" target="_blank">N(EO)R New Editor Contact Form</a><br><a href="https://www.bit.ly/NewEditorSheet" target="_blank">Published Contacts Sheet</a>'
        };
        if (localStorage.getItem('SS') == MAR) {
            ORCResList.innerHTML = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdfiaBesso7HTlAFxYdIW6oLdEOb0UQ9K9R4zys0gMTiyXpmQ/viewform" target="_blank">MAR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1DHqS2fhB_6pk_ZGxLzSgnakn7HPPz_YEmzCprUhFg1o/pubhtml" target="_blank">Published Contacts Sheet</a>'
        };
        if (localStorage.getItem('SS') == SWR) {
            ORCResList.innerHTML = '<a href="https://docs.google.com/spreadsheets/d/1VN7Ry4BhDrG1aLbGjDA3RULfjjX5R1TcNojbsPp0BwI/edit#gid=0" target="_blank">Published Contacts Sheet</a>'
        };
        if (localStorage.getItem('SS') == OH) {
            ORCResList.innerHTML = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSccibGYNPyCDU-oR9MTR5T3q8ZgpoYrdw6sSvXVS4SSSCA6xQ/viewform" target="_blank">Ohio New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1HdXxC11jStR8-XdRBL2wmQx-o846dOzETslOsbtxoM8/pubhtml" target="_blank">Published Contacts Sheet</a>'
        };
        if (localStorage.getItem('SS') == PLN) {
            ORCResList.innerHTML = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSfoXXrC6he-FQqfPgVqvf9aJ5hIOR0IPmGcy63Nw2wC2xEFXQ/viewform" target="_blank">PLN New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/pubhtml?gid=984781548&single=true" target="_blank">Published Contacts Sheet</a>'
        };
        ORCRes.after(ORCResList);
        btn.onclick = function() {
            //console.log('ORC ORWL: ' + tb.value + ' has been added.');
            if (localStorage.getItem('ORWL') == null) {
                localStorage.setItem('ORWL', 'ORWList: ')
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                P1.after(WLSLabel);
                WLSLabel.innerHTML = '<p>ORC WhiteList updated.</p>'
                runORC();
                setTimeout(RemoveWLSLabel, 1000);
            } else {
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                P1.after(WLSLabel);
                WLSLabel.innerHTML = '<p>ORC WhiteList updated.</p>'
                runORC();
                setTimeout(RemoveWLSLabel, 1000);
            };
        };
        setTimeout(StateCheck, 3000);
        LoadSettingsObj();
        setTimeout(initColorPicker, 500);
    };
    function init() {
        var mo = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if ($(node).hasClass('conversation-view') || $(node).hasClass('map-comment-feature-editor') || $(node).hasClass('place-update-edit')) StateCheck();
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
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready && jscolor && ($('#panel-container').length || $('span.username').length >= 1)) {
            sessionStorage.removeItem('ORCState');
            loadMasterList();
            loadLeadershipList();
            init();
            createTab();
            setTimeout(updatePanel, 1000);
            if (!localStorage.getItem('SS')) {
                localStorage.setItem('SS', NEOR);
            }
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
