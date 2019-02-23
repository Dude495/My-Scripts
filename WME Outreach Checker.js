// ==UserScript==
// @name         WME Outreach Checker
// @namespace    Dude495
// @version      2019.02.23.02
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
    }
    var currColor;
    var currFColor;
    const ENRegEx = /([A-Za-z ])*: /g;
    const NEORRegEx = /(Read\?:|Responded\?:|Reporter:|Editor:|Contacted:|Rank:)/g
    const INCRegEx = /(.*)\(\d\)/;
    const RRE = /\(\d\)/g;
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_NOTES = 'Added additional location checks to verify current country.<p><h3>Supported Countries</h3><ul><li>United States</li></ul><h3>Supported Regions/States</h3><ul><li>N[EO]R</li><li>MAR</li><li>SWR</li><li>PLN</li><li>Ohio</li><li>Michigan</li><li>Indiana</li><li>Wisconsin</li></ul>';
    //Color Change Box code from BeenThere with premissions of JustinS83
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
        }
    }
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
            }
            }
        localStorage.setItem("ORC_Settings", JSON.stringify(localsettings));
        updatePanel();
    }
    function LoadSettingsObj() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("ORC_Settings"));
        }
        catch(err){
            loadedSettings = null;
        }
        var defaultSettings = {
            CP1: "#ff0000",
            CP2: "#F7E000",
            CP3: "#99bbff",
            CP4: "#ffffff",
            FP1: "#ffffff",
            FP2: "#000000",
            FP3: "#000000",
            FP4: "#000000",
        }
        ORCSettings = loadedSettings ? loadedSettings : defaultSettings;
        currColor = ORCSettings.CP1;
        currFColor = ORCSettings.FP1;
    }
    function resetDefault() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("ORC_Settings"));
        }
        catch(err){
            loadedSettings = null;
        }
        var defaultSettings = {
            CP1: "#ff0000",
            CP2: "#F7E000",
            CP3: "#99bbff",
            CP4: "#ffffff",
            FP1: "#ffffff",
            FP2: "#000000",
            FP3: "#000000",
            FP4: "#000000",
        }
        ORCSettings = loadedSettings ? loadedSettings : defaultSettings;
        currColor = ORCSettings.CP1;
        currFColor = ORCSettings.FP1;
        updatePanel();
        LoadSettings();
    }
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
    }
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
        }
    }
    const RegNEOR = 'New York,New Jersey,Delaware,Pennsylvania,Massachusetts,Vermont,New Hampshire,Rhode Island,Maine,Connecticut';
    const RegMAR = 'Maryland,District of Columbia,West Virginia,Virginia';
    const RegSWR = 'Arizona,California,Colorado,Hawaii,Nevada,New Mexico,Utah';
    const RegOH = 'Ohio';
    const RegIN = 'Indiana';
    const RegMI = 'Michigan';
    const RegWI = 'Wisconsin';
    const RegPLN = 'Iowa,Kansas,Minnesota,Missouri,Nebraska,North Dakota,South Dakota';
    const SState = [
        RegNEOR,
        RegMAR,
        RegSWR,
        RegOH,
        RegIN,
        RegMI,
        RegWI,
        RegPLN
    ].join(',')
    function doHighlight(element) {
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
        let ORCusername = element.textContent.match(INCRegEx);
        var ORWL = localStorage.getItem('ORWL').toLowerCase();
        let ORCME = W.loginManager.user.userName;
        let username = ORCusername[1];
        let RUN = element.textContent.match(RRE);
        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
        let leadership = getMgtFromSheetList(username);
        let entry = getFromSheetList(username);
        if (username.toLowerCase() == ORCME.toLowerCase()) {
            element.style.backgroundColor = youColor;
            element.style.color = youFColor;
            element.title = 'This is you';
        }
        else if (leadership != null) {
            element.style.backgroundColor = managementColor;
            element.style.color = managementFColor;
            element.title = username + ' is Regional Management';
        }
        else if (ORWL.includes(username.toLowerCase()) || RANK >= '4') {
            element.style.backgroundColor = whitelistColor;
            element.style.color = whitelistFColor;
            element.title = username + ' is listed in the WhiteList';
        }
        else if (entry != null) {
            if (RegPLN.includes(sessionStorage.getItem('ORCState')) || RegNEOR.includes(sessionStorage.getItem('ORCState')) || RegWI.includes(sessionStorage.getItem('ORCState'))) {
                element.style.backgroundColor = inSheetColor;
                element.style.color = inSheetFColor;
                element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
            } else {
                element.style.backgroundColor = inSheetColor;
                element.style.color = inSheetFColor;
                element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
            }
        }
        else {
            element.style.backgroundColor = notInSheetColor;
            element.style.color = notInSheetFColor;
            element.title = username + ' is not located in the outreach spreadsheet.';
        }
    }
    function runORC() {
        const LandMark1 = $('#landmark-edit-general > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(1) > a')[0];
        const LandMark2 = $('#landmark-edit-general > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(2) > a')[0];
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
        const PUR = $('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user > a')[0];
        const MP = $('#panel-container > div > div > div.actions > div > div > div.by > a');
        const URName = $('span.username');
        if (localStorage.getItem('ORWL') == null) {
            localStorage.setItem('ORWL', 'ORWList: ');
        }
        if (WazeWrap.hasPlaceSelected() && PUR == undefined && WazeWrap.getSelectedFeatures()[0].model.attributes.categories[0] !== 'RESIDENCE_HOME' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (LandMark1.textContent.includes('(')) {
                if (LandMark1.textContent.includes('staff'))
                    return;
                doHighlight(LandMark1);
            }
            if (LandMark2 !== undefined) {
                if (LandMark2.textContent.includes('(')) {
                    if (LandMark2.textContent.includes('staff'))
                        return;
                    doHighlight(LandMark2);
                }
            }
        }
        if (WazeWrap.hasSegmentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if ((MultiSeg1.length > '0') && MultiSeg1[0].textContent.includes('(')) {
                if (MultiSeg1[0].textContent.includes('staff'))
                    return;
                doHighlight(MultiSeg1[0]);
            }
            if (MultiSeg2.length > '0') {
                if (MultiSeg2[0].textContent.includes('(')) {
                    if (MultiSeg2[0].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg2[0]);
                }
            }
            if (MultiSeg3.length > '0') {
                let i;
                for (i = 0; i < MultiSeg3.length; i++) {
                    if (MultiSeg3[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg3[i]);
                }
            }
            if (MultiSeg4.length > '0') {
                let i;
                for (i = 0; i < MultiSeg4.length; i++) {
                    if (MultiSeg4[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg4[i]);
                }
            }
            if (MultiSeg5.length > '0') {
                let i;
                for (i = 0; i < MultiSeg5.length; i++) {
                    if (MultiSeg5[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg5[i]);
                }
            }
            if (Seg1 !== undefined) {
                if (Seg1.textContent.includes('(')) {
                    if (Seg1.textContent.includes('staff'))
                        return;
                    doHighlight(Seg1);
                }
            }
            if (Seg2 !== undefined) {
                if (Seg2.textContent.includes('(')) {
                    if (Seg2.textContent.includes('staff'))
                        return;
                    doHighlight(Seg2);
                }
            }
        }
        if (WazeWrap.hasMapCommentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (MapComment1.textContent.includes('(')) {
                if (MapComment1.textContent.includes('staff'))
                    return;
                doHighlight(MapComment1);
            }
            if (MapComment2.textContent.includes('(')) {
                if (MapComment2.textContent.includes('staff'))
                    return;
                doHighlight(MapComment2);
            }
        }
        if (MP.is(':visible')) {
            if (MP[0].textContent.includes('(')) {
                if (MP[0].textContent.includes('staff'))
                    return;
                doHighlight(MP[0]);
            }
        }
        if (W.selectionManager.getSelectedFeatures()[0] && W.selectionManager.getSelectedFeatures()[0].model.type == 'camera' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (Camera1.textContent.includes('(')) {
                if (Camera1.textContent.includes('staff'))
                    return;
                doHighlight(Camera1);
            }
            if (Camera2.textContent.includes('(')) {
                if (Camera2.textContent.includes('staff'))
                    return;
                doHighlight(Camera2);
            }
        }
        if ($('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user').is(':visible')) {
            if (PUR.textContent.includes('(')) {
                if (PUR.textContent.includes('staff'))
                    return;
                doHighlight(PUR);
            }
        } else {
            let i;
            for (i = 0; i < URName.length; i++) {
                if (URName[i].textContent.includes('(')) {
                    doHighlight(URName[i]);
                }
            }
        }
    }
    var ORCFeedList = [];
    const NEOR = 'https://spreadsheets.google.com/feeds/list/1sHxgBQ5rVBkYFHcJ5t4p8R2aHxM1WnFFSW-lwqPf0Tg/4/public/values?alt=json';
    const MAR = 'https://spreadsheets.google.com/feeds/list/1DHqS2fhB_6pk_ZGxLzSgnakn7HPPz_YEmzCprUhFg1o/1/public/values?alt=json';
    const SWR = 'https://spreadsheets.google.com/feeds/list/1VN7Ry4BhDrG1aLbGjDA3RULfjjX5R1TcNojbsPp0BwI/1/public/values?alt=json';
    const OH = 'https://spreadsheets.google.com/feeds/list/1HdXxC11jStR8-XdRBL2wmQx-o846dOzETslOsbtxoM8/1/public/values?alt=json';
    const PLN = 'https://spreadsheets.google.com/feeds/list/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/1/public/values?alt=json';
    const IN = 'https://spreadsheets.google.com/feeds/list/1kmYohgu7etJ9CSwN4HOYa7wWIdtotUr0-rflvB1d--8/1/public/values?alt=json';
    const MI = 'https://spreadsheets.google.com/feeds/list/1Mc6nAu770hJeciFZSVPqaSSZ1g34qgForj3fAOpxcyI/4/public/values?alt=json';
    const WI = 'https://spreadsheets.google.com/feeds/list/1wk9kDHtiSGqeehApi0twtr90gk_FUVUpf2iA28bua_4/2/public/values?alt=json';
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
    }
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
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'OH';
        }
        else if (localStorage.getItem('SS') == MI) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'MI';
        }
        else if (localStorage.getItem('SS') == IN) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'IN';
        }
        else if (localStorage.getItem('SS') == WI) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'WI';
        }
        else if (localStorage.getItem('SS') == PLN) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/7/public/values?alt=json';
            console.log('ORC: Loading PLN Leadership Master List....');
            MgtReg = 'PLN';
        }
        await $.getJSON(MgtSheet, function(ldata){
            RegMgt = ldata;
            console.log('ORC: '+MgtReg+' Leadership Masterlist Loaded....');
        });
    }
    function getMgtFromSheetList(editorName) {
        let MgtList = RegMgt.feed.entry.map(obj =>{
            return {username: obj.gsx$regionleadership.$t}
        });
        for(let i=0; i<MgtList.length; i++){
            if(MgtList[i].username.toLowerCase() === editorName.toLowerCase()) {
                return MgtList[i];
            }
        }
        return null;
    }
    function getFromSheetList(editorName){
        if (localStorage.getItem('SS') == MAR) {
            let mapped = ORCFeedList.feed.entry.slice(0).reverse().map(obj =>{
                return {username: obj.gsx$editorusername.$t.trim(), responses: obj.gsx$didtheyjoindiscord.$t, reporter: obj.gsx$yourusername.$t, dateC: obj.gsx$timestamp.$t
                       }
            });
            for(let i=0; i<mapped.length; i++){
                if(mapped[i].username.toLowerCase() === editorName.toLowerCase()) {
                    return mapped[i];
                }
            }
            return null;
        } else {
            let mapped = ORCFeedList.feed.entry.map(obj =>{
                if (localStorage.getItem('SS') == NEOR) {
                    return {username: obj['gsx$usehttpj.mpneweditorsorttosortlist'].$t.replace(ENRegEx,'').replace(NEORRegEx,'').trim(), forumread: obj.gsx$_cre1l.$t.replace(NEORRegEx,''), responses: obj.gsx$changescantakeupto.$t.replace(NEORRegEx,''), reporter: obj.gsx$minutesdelaytoappear.$t.replace(NEORRegEx,''), dateC: obj['gsx$httpj.mpneweditorformtoreport'].$t.replace(NEORRegEx,'')
                           }
                }
                if (localStorage.getItem('SS') == SWR) {
                    if (obj.gsx$ndoutreachdate.$t == null) {
                        return {username: obj.gsx$wazeusername.$t.trim(), responses: obj['gsx$madeconnectionviapmbutdiddidntjoindiscord.'].$t, reporter: obj.gsx$outreacheditor.$t, dateC: obj.gsx$stoutreachdate.$t
                               }
                    } else {
                        return {username: obj.gsx$wazeusername.$t.trim(), responses: obj['gsx$madeconnectionviapmbutdiddidntjoindiscord.'].$t, reporter: obj.gsx$outreacheditor.$t, dateC: obj.gsx$ndoutreachdate.$t
                               }
                    }
                }
                if (localStorage.getItem('SS') == OH) {
                    return {username: obj.gsx$neweditorname.$t.trim(), responses: obj.gsx$readresponded.$t, reporter: obj.gsx$youreditorname.$t, dateC: obj.gsx$outreachdateest.$t
                           }
                }
                if (localStorage.getItem('SS') == IN) {
                    return {username: obj.gsx$editorname.$t.trim(), responses: obj.gsx$readresponded.$t, reporter: obj.gsx$whomadecontact.$t, dateC: obj.gsx$outreachdate.$t
                           }
                }
                if (localStorage.getItem('SS') == MI) {
                    return {username: obj.gsx$_cn6ca.$t.trim(), responses: obj.gsx$welcomepacket.$t, reporter: obj.gsx$userwhosent.$t, dateC: obj.gsx$datewelcomesent.$t
                           }
                }
                if (localStorage.getItem('SS') == WI) {
                    return {username: obj.gsx$username.$t.trim(), forumread: obj.gsx$readpm.$t, responses: obj.gsx$responded.$t, reporter: obj.gsx$bywhom.$t, dateC: obj.gsx$date.$t
                           }
                }
                if (localStorage.getItem('SS') == PLN) {
                    return {username: obj.gsx$contactededitor.$t.trim(), forumread: obj.gsx$forummessageread.$t, responses: obj.gsx$responsereceived.$t, reporter: obj.gsx$yourusername.$t, dateC: obj.gsx$timestamp.$t
                           }
                }
            });
            for(let i=0; i<mapped.length; i++){
                if(mapped[i].username.toLowerCase() === editorName.toLowerCase()) {
                    return mapped[i];
                }
            }
            return null;
        }
    }
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
        else if ($('#ORCRegList')[0].value == 'IN') {
            localStorage.setItem('SS', IN);
        }
        else if ($('#ORCRegList')[0].value == 'MI') {
            localStorage.setItem('SS', MI);
        }
        else if ($('#ORCRegList')[0].value == 'WI') {
            localStorage.setItem('SS', WI);
        }
        else if ($('#ORCRegList')[0].value == 'PLN') {
            localStorage.setItem('SS', PLN);
        }
        setTimeout(loadMasterList, 500);
        setTimeout(loadLeadershipList, 500);
    }
    const NEORResources = '<a href="https://www.bit.ly/NewEditorForm" target="_blank">N(EO)R New Editor Contact Form</a><br><a href="https://www.bit.ly/NewEditorSheet" target="_blank">Published Contacts Sheet</a>';
    const MARResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdfiaBesso7HTlAFxYdIW6oLdEOb0UQ9K9R4zys0gMTiyXpmQ/viewform" target="_blank">MAR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1DHqS2fhB_6pk_ZGxLzSgnakn7HPPz_YEmzCprUhFg1o/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const SWRResources = '<a href="https://docs.google.com/spreadsheets/d/1VN7Ry4BhDrG1aLbGjDA3RULfjjX5R1TcNojbsPp0BwI/edit#gid=0" target="_blank">Published Contacts Sheet</a>';
    const OHResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSccibGYNPyCDU-oR9MTR5T3q8ZgpoYrdw6sSvXVS4SSSCA6xQ/viewform" target="_blank">Ohio New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/pubhtml?gid=984781548&single=true" target="_blank">Published Contacts Sheet</a>';
    const INResources = '<a href="#" target="_blank">Indiana New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1kmYohgu7etJ9CSwN4HOYa7wWIdtotUr0-rflvB1d--8/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const PLNResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSfoXXrC6he-FQqfPgVqvf9aJ5hIOR0IPmGcy63Nw2wC2xEFXQ/viewform" target="_blank">PLN New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/pubhtml?gid=984781548&single=true" target="_blank">Published Contacts Sheet</a>';
    const MIResources = '<a href="#" target="_blank">Michigan New Editor Contact Form</a><br><a href="https://goo.gl/XdFD9e" target="_blank">Published Contacts Sheet</a>';
    const WIResources = '<a href="https://docs.google.com/spreadsheets/d/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/pubhtml?gid=984781548&single=true" target="_blank">Published Contacts Sheet</a>';
    function StateCheck() {
        var Country = W.model.countries.top.name
        var State = W.model.states.additionalInfo[0].name
        var Display = document.getElementById('RegListDiv')
        if (Country == 'United States') {
            if (RegNEOR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: N(EO)R</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== NEOR) {
                    localStorage.setItem('SS', NEOR);
                    $('#ORCRegList')[0].value = 'NEOR';
                    $('#ORCResourceList')[0].innerHTML = NEORResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegMAR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: MAR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== MAR) {
                    localStorage.setItem('SS', MAR);
                    $('#ORCRegList')[0].value = 'MAR';
                    $('#ORCResourceList')[0].innerHTML = MARResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegSWR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: SWR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== SWR) {
                    localStorage.setItem('SS', SWR);
                    $('#ORCRegList')[0].value = 'SWR';
                    $('#ORCResourceList')[0].innerHTML = SWRResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                    Display.style.display = "block";
                }
            }
            else if (RegOH.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== OH) {
                    localStorage.setItem('SS', OH);
                    $('#ORCRegList')[0].value = 'OH';
                    $('#ORCResourceList')[0].innerHTML = OHResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegIN.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== IN) {
                    localStorage.setItem('SS', IN);
                    $('#ORCRegList')[0].value = 'IN';
                    $('#ORCResourceList')[0].innerHTML = INResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegWI.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== WI) {
                    localStorage.setItem('SS', WI);
                    $('#ORCRegList')[0].value = 'WI';
                    $('#ORCResourceList')[0].innerHTML = WIResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegMI.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== MI) {
                    localStorage.setItem('SS', MI);
                    $('#ORCRegList')[0].value = 'MI';
                    $('#ORCResourceList')[0].innerHTML = MIResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                    Display.style.display = "block";
                }
            }
            else if (RegPLN.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Region: PLN</span>';
                Display.style.display = "block";
                if (localStorage.getItem('SS') !== PLN) {
                    localStorage.setItem('SS', PLN);
                    $('#ORCRegList')[0].value = 'PLN';
                    $('#ORCResourceList')[0].innerHTML = PLNResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else {
                $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">Current Region Not Supported.</div></b>';
                $('#ORCResourceList')[0].innerHTML = ''
                Display.style.display = "none";
            }
            if (SState.includes(State)) {
                sessionStorage.setItem('ORCState', State);
                runORC();
                $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
                $('#ORC-State')[0].style.backgroundColor = '';
            } else {
                $('#ORC-State')[0].innerHTML = '';
            }
        }
        else {
            $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">Current Country Not Supported.</div></b>';
            $('#ORCResourceList')[0].innerHTML = '';
            $('#RegListDiv')[0].innerHTML = '';
            $('#ORC-State')[0].innerHTML = '';
            $('#ORCColorOpts')[0].innerHTML = '';
            $('#ORC-resources')[0].innerHTML = '';
            $('#ORC-Top > label:nth-child(12)')[0].innerHTML = '';
            Display.style.display = "none";
        }
    }
    function RemoveWLSLabel() {
        $('#ORC-WLSaveMsg')[0].innerHTML = ''
        $('#ORWLVal')[0].value = ''
    }
    function resetRegList() {
        $('#ORCRegList')[0].value = '0'
    }
    function init() {
        var mo = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if ($(node).hasClass('conversation-view') || $(node).hasClass('map-comment-feature-editor') || $(node).hasClass('place-update-edit') || $(node).hasClass('mapProblem')) StateCheck();
            }));
        });
        mo.observe(document.querySelector('#panel-container'), {childList: true, subtree:true, attributes: true});
        mo.observe($('#edit-panel .contents')[0], {childList:true, subtree:true, attributes: true});
        mo.observe(document.getElementById('edit-panel'), { childList: true, subtree: true, attributes: true });
        if (WazeWrap.hasSegmentSelected() || WazeWrap.hasPlaceSelected() || WazeWrap.hasMapCommentSelected()) {
            StateCheck();
        }
    }
    function createTab() {
        var $section = $('<div>');
        $section.html([
            '<div id="ORC-Top"><div id="ORC-title">',
            '<h1>Outreach Checker</h2></div>',
            '<div id="RegListDiv"><select id="ORCRegList"><option value="0" selected disabled>Region</option><option value="MAR">MAR</option><option value="NEOR">N(EO)R</option><option value="PLN">PLN</option><option value="SWR">SWR</option><option value="1" selected disabled>GLR</option><option value="IN">Indiana</option><option value="MI">Michigan</option><option value="OH">Ohio</option><option value="WI">Wisconsin</option></select><button type="button" id="ORCReloadList" class="btn btn-info" class="btn btn-default btn-sm"><span class="fa fa-repeat" title="Reload Outreach Lists"></span></button></div>',
            '<br><div id="ORC-Region">Current Region: </div>',
            '<div id="ORC-State">Current State: </div>',
            '<div id="ORC-Warning"></div>',
            '<br><div id="ORC-info">',
            '<div id="ORCColorOpts">',
            '<font size="1.9"><span title="Set Background Color">Bg</span> | <span title="Set Font Color">Txt</span>   </font><button type="button" class="btn btn-danger" id="ORCResetColors">Reset</button>',
            '<br><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;;width:15px; height:15px;border:2px solid black" id="colorPicker1"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker1"></button><div id="ORCMenu-NotContacted"><span style="color: black; background-color: #ff0000">Not been contacted or whitelisted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="colorPicker2"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker2"></button><div id="ORCMenu-Contacted"><span style="color: black; background-color: #F7E000" title=" User has been contacted but does not mean they have replied or joined Discord">Has been contacted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="colorPicker3"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker3"></button><div id="ORCMenu-Leadership"><span style="color: black; background-color: #99bbff" title="Region Leadership">Regional Management (SM+).</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="colorPicker4"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="fontPicker4"></button><div id="ORCMenu-WhiteListed"><span style="color: black; background-color: white" title="All R4+ users are automatically whitelisted.">Yourself/Whitelisted users (R4+).</span></div>',
            '</div>',
            '</div>',
            '<p><div id="ORC-resources"><p><b>Resources:</b><br>',
            '<p><div id="ORC-WhiteList"></div>',
            '</div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('ORC', $section.html());
        var RSClrBtn = document.getElementById('ORCResetColors');
        //RSClrBtn.style.width = '25px';
        //RSClrBtn.style.height = '5px';
        //RSClrBtn.style.fontSize = '8px';
        //RSClrBtn.style.paddingLeft = '1px';
        RSClrBtn.title = 'Reset to default color settings';
        RSClrBtn.onclick = function() {
            localStorage.removeItem("ORC_Settings");
            resetDefault();
        }
        var P = document.createElement('P');
        var btn = document.createElement("BUTTON");
        btn.id = 'ORCBtn';
        var Button = document.getElementById('ORCBtn');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Add';
        var Title = $('#ORC-title')[0];
        Title.innerHTML += '<small>v' + VERSION + '</small>'
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
        SaveWL.className = 'btn btn-success';
        SaveWL.id = 'SaveWLButton';
        SaveWL.textContent = 'Save';
        btn.after(SaveWL);
        var ResetWL = document.createElement('BUTTON');
        ResetWL.id = 'ResetWLButton';
        ResetWL.className = 'btn btn-danger';
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
            WLSLabel.innerHTML = '<p><div class="alert alert-success">ORC WhiteList saved to clipboard.</div></p>'
            setTimeout(RemoveWLSLabel, 1000);
        }
        ResetWL.onclick = function() {
            localStorage.setItem('ORWL', 'ORWList: ');
            //alert('ORC WhiteList erased.');
            P1.after(WLSLabel);
            WLSLabel.innerHTML = '<p><div class="alert alert-info">ORC WhiteList reset.</div></p>'
            setTimeout(RemoveWLSLabel, 1000);
        }
        var ReloadListBtn = document.getElementById('ORCReloadList');
        var ORCWarning = document.getElementById('ORC-Warning');
        ReloadListBtn.onclick = function() {
            ORCWarning.after(WLSLabel);
            WLSLabel.innerHTML = '<p><div class="alert alert-info">Reloading Outreach Data....</div></p>';
            loadMasterList();
            loadLeadershipList();
            setTimeout(RemoveWLSLabel, 1500);
        }
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
        else if (localStorage.getItem('SS') == IN) {
            SelectedRegion.value = 'IN';
        }
        else if (localStorage.getItem('SS') == MI) {
            SelectedRegion.value = 'MI';
        }
        else if (localStorage.getItem('SS') == WI) {
            SelectedRegion.value = 'WI';
        }
        else if (localStorage.getItem('SS') == PLN) {
            SelectedRegion.value ='PLN';
        }
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
            else if (SelectedRegion.value == 'OH' && RegOH.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', OH);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'IN' && RegIN.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', IN);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MI' && RegMI.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', MI);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'WI' && RegWI.includes(W.model.states.additionalInfo[0].name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('SS', WI);
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
                $('#ORC-Warning')[0].innerHTML = '<br><div class="alert alert-danger"><strong>ERROR:</strong> The selected region/state list does not match the current WME location.</span>'
                console.log('ORC: Master Lists not updated.');
                setTimeout(resetRegList, 500);
            }
        }
        var ORCRes = document.getElementById('ORC-resources');
        var ORCResList = document.createElement('LABEL');
        ORCResList.id = 'ORCResourceList'
        if (localStorage.getItem('SS') == NEOR) {
            ORCResList.innerHTML = NEORResources;
        }
        if (localStorage.getItem('SS') == MAR) {
            ORCResList.innerHTML = MARResources;
        }
        if (localStorage.getItem('SS') == SWR) {
            ORCResList.innerHTML = SWRResources;
        }
        if (localStorage.getItem('SS') == OH) {
            ORCResList.innerHTML = OHResources;
        }
        if (localStorage.getItem('SS') == IN) {
            ORCResList.innerHTML = INResources;
        }
        if (localStorage.getItem('SS') == MI) {
            ORCResList.innerHTML = MIResources;
        }
        if (localStorage.getItem('SS') == WI) {
            ORCResList.innerHTML = WIResources;
        }
        if (localStorage.getItem('SS') == PLN) {
            ORCResList.innerHTML = PLNResources;
        }
        ORCRes.after(ORCResList);
        btn.onclick = function() {
            //console.log('ORC ORWL: ' + tb.value + ' has been added.');
            if (localStorage.getItem('ORWL') == null) {
                localStorage.setItem('ORWL', 'ORWList: ')
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                P1.after(WLSLabel);
                WLSLabel.innerHTML = '<p><div class="alert alert-success">ORC WhiteList updated.</div></p>'
                runORC();
                setTimeout(RemoveWLSLabel, 1000);
            } else {
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                P1.after(WLSLabel);
                WLSLabel.innerHTML = '<p><div class="alert alert-success">ORC WhiteList updated.</div></p>'
                runORC();
                setTimeout(RemoveWLSLabel, 1000);
            }
        }
        setTimeout(StateCheck, 3000);
        LoadSettingsObj();
        setTimeout(initColorPicker, 500);
        init();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready && jscolor && ($('#panel-container').length || $('span.username').length >= 1)) {
            sessionStorage.removeItem('ORCState');
            loadMasterList();
            loadLeadershipList();
            createTab();
            setTimeout(updatePanel, 1000);
            if (!localStorage.getItem('SS')) {
                localStorage.setItem('SS', NEOR);
            }
            WazeWrap.Events.register("selectionchanged", null, StateCheck);
            WazeWrap.Events.register("moveend", W.map, StateCheck);
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES, "https://greasyfork.org/en/scripts/376700-wme-outreach-checker", "https://www.waze.com/forum/viewtopic.php?f=569&t=275371");
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    setTimeout(bootstrap, 3000);
})();
