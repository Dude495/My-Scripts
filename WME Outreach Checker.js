// ==UserScript==
// @name         WME Outreach Checker
// @namespace    Dude495
// @version      2019.04.26.03
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
/* global I18n */
/* global WazeWrap */
/* global jscolor */
// ==/UserScript==

(async function() {
    'use strict';
    const PMImg = 'data:image/png;base64,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';
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
    var UPDATE_NOTES = '<ul><li>Clicking the PM button from a UR will now include the text from that response.</li></ul>';
    //Color Change Box code from BeenThere with premissions of JustinS83
    function LoadSettings(){
        if ($('#ORCcolorPicker1')[0].jscolor && $('#ORCcolorPicker2')[0].jscolor && $('#ORCcolorPicker3')[0].jscolor && $('#ORCcolorPicker4')[0].jscolor){
            $('#ORCcolorPicker1')[0].jscolor.fromString(ORCSettings.CP1);
            $('#ORCcolorPicker2')[0].jscolor.fromString(ORCSettings.CP2);
            $('#ORCcolorPicker3')[0].jscolor.fromString(ORCSettings.CP3);
            $('#ORCcolorPicker4')[0].jscolor.fromString(ORCSettings.CP4);
            $('#ORCfontPicker1')[0].jscolor.fromString(ORCSettings.FP1);
            $('#ORCfontPicker2')[0].jscolor.fromString(ORCSettings.FP2);
            $('#ORCfontPicker3')[0].jscolor.fromString(ORCSettings.FP3);
            $('#ORCfontPicker4')[0].jscolor.fromString(ORCSettings.FP4);
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
        ORCSettings.CP1 = "#" + $('#ORCcolorPicker1')[0].jscolor.toString();
        ORCSettings.CP2 = "#" + $('#ORCcolorPicker2')[0].jscolor.toString();
        ORCSettings.CP3 = "#" + $('#ORCcolorPicker3')[0].jscolor.toString();
        ORCSettings.CP4 = "#" + $('#ORCcolorPicker4')[0].jscolor.toString();
        ORCSettings.FP1 = "#" + $('#ORCfontPicker1')[0].jscolor.toString();
        ORCSettings.FP2 = "#" + $('#ORCfontPicker2')[0].jscolor.toString();
        ORCSettings.FP3 = "#" + $('#ORCfontPicker3')[0].jscolor.toString();
        ORCSettings.FP4 = "#" + $('#ORCfontPicker4')[0].jscolor.toString();
        saveSettings();
    }
    function initORCcolorPicker(tries){
        tries = tries || 1;

        if ($('#ORCcolorPicker1')[0].jscolor && $('#ORCcolorPicker2')[0].jscolor) {
            $('#ORCcolorPicker1')[0].jscolor.fromString(ORCSettings.CP1);
            $('#ORCcolorPicker2')[0].jscolor.fromString(ORCSettings.CP2);
            $('#ORCcolorPicker3')[0].jscolor.fromString(ORCSettings.CP3);
            $('#ORCcolorPicker4')[0].jscolor.fromString(ORCSettings.CP4);
            $('#ORCfontPicker1')[0].jscolor.fromString(ORCSettings.FP1);
            $('#ORCfontPicker2')[0].jscolor.fromString(ORCSettings.FP2);
            $('#ORCfontPicker3')[0].jscolor.fromString(ORCSettings.FP3);
            $('#ORCfontPicker4')[0].jscolor.fromString(ORCSettings.FP4);
            $('[id^="ORCcolorPicker"]')[0].jscolor.closeText = 'Close';
            $('[id^="ORCfontPicker"]')[0].jscolor.closeText = 'Close';
            $('#ORCcolorPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#ORCcolorPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#ORCcolorPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#ORCcolorPicker4')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker4')[0].jscolor.onChange = jscolorChanged;

        } else if (tries < 1000) {
            setTimeout(function () {initORCcolorPicker(tries++);}, 200);
        }
    }
    const COUNTRIES = 'United States,Malaysia,Guam,Virgin Islands (U.S.),America Samoa,Northern Mariana Islands,Peutro Rico';
    const RegNEOR = 'New York,New Jersey,Delaware,Pennsylvania,Massachusetts,Vermont,New Hampshire,Rhode Island,Maine,Connecticut';
    const RegMAR = 'Maryland,District of Columbia,West Virginia,Virginia';
    const RegSWR = 'Arizona,California,Colorado,Hawaii,Nevada,New Mexico,Utah';
    const RegNWR = 'Alaska,Idaho,Montana,Oregon,Washington,Wyoming';
    const RegSER = 'Alabama,Florida,Georgia';
    const RegOH = 'Ohio';
    const RegIN = 'Indiana';
    const RegMI = 'Michigan';
    const RegWI = 'Wisconsin';
    const RegPLN = 'Iowa,Kansas,Minnesota,Missouri,Nebraska,North Dakota,South Dakota';
    const RegMYS = 'Malaysia';
    const RegATR ='Guam,Virgin Islands (U.S.),America Samoa,Northern Mariana Islands,Peutro Rico';
    const SState = [
        RegNEOR,
        RegMAR,
        RegSWR,
        RegOH,
        RegIN,
        RegMI,
        RegWI,
        RegPLN,
        RegNWR
    ].join(',')
    function injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username){
        let PMLink = document.createElement('DIV');
        PMLink.className = 'ORCPMBtn';
        PMLink.style.display = 'inline';
        let center = W.map.center.clone().transform(W.map.projection.projCode, W.map.displayProjection.projCode);
        let LON = center.lon;
        let LAT = center.lat;
        let PermaLink = encodeURIComponent('https://www.waze.com/' + I18n.currentLocale() + '/editor?env=' + W.app.getAppRegionCode() + '&lon=' + LON + '&lat=' + LAT + '&zoom=' + W.map.zoom + '&' + TYPE + '=' + ID);
        PMLink.innerHTML = '  <a href="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&username=' + username + '&subject=' + SUBJECT + '&message=' + MESSAGE + '[url=' + PermaLink + ']PermaLink[/url] " target="_blank"><img src=' + PMImg +'></img></a></div>';
        element.after(PMLink);
    }
    function addPMBttn(element, MESSAGE) {
        if (localStorage.getItem('ORCPM') == 'true') {
            let ID;
            let SUBJECT;
            let TYPE;
            let ORCusername = element.textContent.match(INCRegEx);
            let username = ORCusername[1];
            if (WazeWrap.hasPlaceSelected()) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    ID = $('#landmark-edit-general > ul > li:contains("ID:")')[0].textContent.match(/\d.*/)[0];
                    SUBJECT = 'About this Venue';
                    TYPE = 'venues';
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
            if (WazeWrap.hasSegmentSelected()) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    SUBJECT = 'About this Segment';
                    TYPE = 'segments';
                    ID = $('#segment-edit-general > ul > li:contains("ID:")')[0].textContent.match(/\d.*/)[0];
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
            if (WazeWrap.hasMapCommentSelected()) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    SUBJECT = 'About this Map Comment';
                    TYPE = 'mapComments';
                    ID = $('.map-comment-feature-editor > .tab-content > ul > li:contains("ID:")')[0].textContent.match('ID:.*')[0].match(/\d.*/)[0];
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
            if ($('div.map-problem.user-generated.selected').is(':visible') == true) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    SUBJECT = 'About this Update Request';
                    TYPE = 'mapUpdateRequest';
                    ID = $('div.map-problem.user-generated.selected').data('id');
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
        } else
            return;
    }
    function doHighlight(element) {
        var CurCountry = W.model.countries.top.name;
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
        if (COUNTRIES.includes(CurCountry)) {
            if (username.toLowerCase() == ORCME.toLowerCase()) {
                element.style.backgroundColor = youColor;
                element.style.color = youFColor;
                element.title = 'This is you';
            }
            else if (leadership != null) {
                element.style.backgroundColor = managementColor;
                element.style.color = managementFColor;
                element.title = username + ' is Leadership';
            }
            else if (ORWL.includes(username.toLowerCase()) || (localStorage.getItem('ORCR4WL') == "true" && RANK >= '4')) {
                element.style.backgroundColor = whitelistColor;
                element.style.color = whitelistFColor;
                element.title = username + ' is listed in the WhiteList';
            }
            else if (entry != null) {
                if (RegPLN.includes(sessionStorage.getItem('ORCState')) || RegNEOR.includes(sessionStorage.getItem('ORCState')) || RegWI.includes(sessionStorage.getItem('ORCState'))) {
                    element.style.backgroundColor = inSheetColor;
                    element.style.color = inSheetFColor;
                    element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                    if (CurCountry == 'Malaysia') {
                        element.style.backgroundColor = inSheetColor;
                        element.style.color = inSheetFColor;
                        element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nCity: ' + entry.city + '\nState: ' + entry.state + '\nDate(s): ' + entry.dateC + '\nPM Read?:' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                    }
                    if (RegATR.includes(CurCountry)) {
                        element.style.backgroundColor = inSheetColor;
                        element.style.color = inSheetFColor;
                        element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '\nJoined GHO/Discord: ' + entry.joined + '.';
                    }
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
        else {
            return;
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
        const URText = $('#panel-container > div > div > div.top-section > div.body > div > div.conversation.section > div.collapsible.content > div > div > ul > li > div > div.text');
        if (localStorage.getItem('ORWL') == null) {
            localStorage.setItem('ORWL', 'ORWList: ');
        }
        if (WazeWrap.hasPlaceSelected() && PUR == undefined && WazeWrap.getSelectedFeatures()[0].model.attributes.categories[0] !== 'RESIDENCE_HOME' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            $('div.toggleHistory')[0].onclick = setTimeout(function() {
                var HXLandMark = $('#landmark-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a')
                for (let i = 0; i < HXLandMark.length; i++) {
                    doHighlight(HXLandMark[i]);
                    setTimeout(addPMBttn(HXLandMark[i]), 1000);
                }
            }, 1500)
            if (LandMark1.textContent.includes('(')) {
                if (LandMark1.textContent.includes('staff'))
                    return;
                doHighlight(LandMark1);
                setTimeout(addPMBttn(LandMark1), 1000);
            }
            if (LandMark2 !== undefined) {
                if (LandMark2.textContent.includes('(')) {
                    if (LandMark2.textContent.includes('staff'))
                        return;
                    doHighlight(LandMark2);
                    setTimeout(addPMBttn(LandMark2), 1000);
                }
            }
        }
        if (WazeWrap.hasSegmentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            $('div.toggleHistory')[0].onclick = setTimeout(function() {
                var HXSeg = $('#segment-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a');
                for (let i = 0; i < HXSeg.length; i++) {
                    doHighlight(HXSeg[i]);
                    setTimeout(addPMBttn(HXSeg[i]), 1000);
                }
            }, 1500)
            if ((MultiSeg1.length > '0') && MultiSeg1[0].textContent.includes('(')) {
                $('div.toggleHistory')[0].onclick = setTimeout(function() {
                    var HXMultiSeg = $('#segment-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a');
                    for (let i = 0; i < HXMultiSeg.length; i++) {
                        doHighlight(HXMultiSeg[i]);
                        setTimeout(addPMBttn(HXMultiSeg[i]), 1000);
                    }
                }, 1500)
                if (MultiSeg1[0].textContent.includes('staff'))
                    return;
                doHighlight(MultiSeg1[0]);
                setTimeout(addPMBttn(MultiSeg1[0]), 1000);
            }
            if (MultiSeg2.length > '0') {
                if (MultiSeg2[0].textContent.includes('(')) {
                    if (MultiSeg2[0].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg2[0]);
                    setTimeout(addPMBttn(MultiSeg2[0]), 1000);
                }
            }
            if (MultiSeg3.length > '0') {
                for (let i = 0; i < MultiSeg3.length; i++) {
                    if (MultiSeg3[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg3[i]);
                    setTimeout(addPMBttn(MultiSeg3[i]), 1000);
                }
            }
            if (MultiSeg4.length > '0') {
                for (let i = 0; i < MultiSeg4.length; i++) {
                    if (MultiSeg4[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg4[i]);
                    setTimeout(addPMBttn(MultiSeg4[i]), 1000);
                }
            }
            if (MultiSeg5.length > '0') {
                for (let i = 0; i < MultiSeg5.length; i++) {
                    if (MultiSeg5[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg5[i]);
                    setTimeout(addPMBttn(MultiSeg5[i]), 1000);
                }
            }
            if (Seg1 !== undefined) {
                if (Seg1.textContent.includes('(')) {
                    if (Seg1.textContent.includes('staff'))
                        return;
                    doHighlight(Seg1);
                    addPMBttn(Seg1);
                }
            }
            if (Seg2 !== undefined) {
                if (Seg2.textContent.includes('(')) {
                    if (Seg2.textContent.includes('staff'))
                        return;
                    doHighlight(Seg2);
                    addPMBttn(Seg2);
                }
            }
        }
        if (WazeWrap.hasMapCommentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (MapComment1.textContent.includes('(')) {
                if (MapComment1.textContent.includes('staff'))
                    return;
                doHighlight(MapComment1);
                setTimeout(addPMBttn(MapComment1), 1000);
            }
            if (MapComment2.textContent.includes('(')) {
                if (MapComment2.textContent.includes('staff'))
                    return;
                doHighlight(MapComment2);
                setTimeout(addPMBttn(MapComment2), 1000);
            }
        }
        if (MP.is(':visible')) {
            if (MP[0].textContent.includes('(')) {
                if (MP[0].textContent.includes('staff'))
                    return;
                doHighlight(MP[0]);
                setTimeout(addPMBttn(MP[0]), 1000);
            }
        }
        if (W.selectionManager.getSelectedFeatures()[0] && W.selectionManager.getSelectedFeatures()[0].model.type == 'camera' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (Camera1.textContent.includes('(')) {
                if (Camera1.textContent.includes('staff'))
                    return;
                doHighlight(Camera1);
                setTimeout(addPMBttn(Camera1), 1000);
            }
            if (Camera2.textContent.includes('(')) {
                if (Camera2.textContent.includes('staff'))
                    return;
                doHighlight(Camera2);
                setTimeout(addPMBttn(Camera2), 1000);
            }
        }
        if ($('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user').is(':visible')) {
            if (PUR.textContent.includes('(')) {
                if (PUR.textContent.includes('staff'))
                    return;
                doHighlight(PUR);
                setTimeout(addPMBttn(PUR), 1000);
            }
        } else {
            let MESSAGE;
            for (let i=0; i < URName.length; i++) {
                if (URName[i].textContent.includes('(')) {
                    MESSAGE = encodeURIComponent('[quote="' + URName[i].textContent.replace(RRE,"") + '"]' + URText[i].textContent + '[/quote]')
                    doHighlight(URName[i]);
                    setTimeout(addPMBttn(URName[i], MESSAGE), 1000);
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
    const NWR = 'https://spreadsheets.google.com/feeds/list/1hD-_0rd1JSug472ORDMu3Evb6iZcdo1L-Oidnvwgc0E/1/public/values?alt=json';
    const SER = '';
    const MYS = 'https://spreadsheets.google.com/feeds/list/103oO-48KkSBe4NUBorRKrMZtWVruhsx5TbaRkrhqkgs/1/public/values?alt=json';
    const ATR = 'https://spreadsheets.google.com/feeds/list/1Qa1GAlO9lqopFZbvErzp5VDHbcaprZOJ0xbecRhVYhw/1/public/values?alt=json';
    async function loadMasterList() {
        var SS;
        if (!localStorage.getItem('ORCSS')) {
            localStorage.setItem('ORCSS', NEOR)
            console.log('ORC: Loading Default List (NEOR)....');
            SS = localStorage.getItem('ORCSS');
        }
        else {
            SS = localStorage.getItem('ORCSS');
            console.log('ORC: Loading ' + localStorage.getItem('ORCSS') + ' Master List....');
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
        if (!localStorage.getItem('ORCSS')) {
            localStorage.setItem('ORCSS', NEOR)
            console.log('ORC: Loading Default List (NEOR)....');
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/3/public/values?alt=json'
            MgtReg = 'NEOR'
        }
        else if (localStorage.getItem('ORCSS') == NEOR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/3/public/values?alt=json'
            console.log('ORC: Loading NEOR Leadership Master List....');
            MgtReg = 'NEOR'
        }
        else if (localStorage.getItem('ORCSS') == MAR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/4/public/values?alt=json';
            console.log('ORC: Loading MAR Leadership Master List....');
            MgtReg = 'MAR';
        }
        else if (localStorage.getItem('ORCSS') == SWR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/5/public/values?alt=json';
            console.log('ORC: Loading SWR Leadership Master List....');
            MgtReg = 'SWR';
        }
        else if (localStorage.getItem('ORCSS') == OH) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'OH';
        }
        else if (localStorage.getItem('ORCSS') == MI) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'MI';
        }
        else if (localStorage.getItem('ORCSS') == IN) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'IN';
        }
        else if (localStorage.getItem('ORCSS') == WI) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/6/public/values?alt=json';
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'WI';
        }
        else if (localStorage.getItem('ORCSS') == PLN) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/7/public/values?alt=json';
            console.log('ORC: Loading PLN Leadership Master List....');
            MgtReg = 'PLN';
        }
        else if (localStorage.getItem('ORCSS') == NWR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/8/public/values?alt=json';
            console.log('ORC: Loading NWR Leadership Master List....');
            MgtReg = 'NWR';
        }
        else if (localStorage.getItem('ORCSS') == SER) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/9/public/values?alt=json';
            console.log('ORC: Loading SER Leadership Master List....');
            MgtReg = 'SER';
        }
        else if (localStorage.getItem('ORCSS') == MYS) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/12/public/values?alt=json';
            console.log('ORC: Loading Malaysia Leadership Master List....');
            MgtReg = 'MYS';
        }
        else if (localStorage.getItem('ORCSS') == ATR) {
            MgtSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/13/public/values?alt=json';
            console.log('ORC: Loading ATR Leadership Master List....');
            MgtReg = 'ATR';
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
        if (localStorage.getItem('ORCSS') == MAR) {
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
                if (localStorage.getItem('ORCSS') == NEOR) {
                    return {username: obj['gsx$usehttpj.mpneweditorsorttosortlist'].$t.replace(ENRegEx,'').replace(NEORRegEx,'').trim(), forumread: obj.gsx$_cre1l.$t.replace(NEORRegEx,''), responses: obj.gsx$changescantakeupto.$t.replace(NEORRegEx,''), reporter: obj.gsx$minutesdelaytoappear.$t.replace(NEORRegEx,''), dateC: obj['gsx$httpj.mpneweditorformtoreport'].$t.replace(NEORRegEx,'')
                           }
                }
                if (localStorage.getItem('ORCSS') == SWR) {
                    if (obj.gsx$ndoutreachdate.$t == null) {
                        return {username: obj.gsx$wazeusername.$t.trim(), responses: obj['gsx$madeconnectionviapmbutdiddidntjoindiscord.'].$t, reporter: obj.gsx$outreacheditor.$t, dateC: obj.gsx$stoutreachdate.$t
                               }
                    } else {
                        return {username: obj.gsx$wazeusername.$t.trim(), responses: obj['gsx$madeconnectionviapmbutdiddidntjoindiscord.'].$t, reporter: obj.gsx$outreacheditor.$t, dateC: obj.gsx$ndoutreachdate.$t
                               }
                    }
                }
                if (localStorage.getItem('ORCSS') == OH) {
                    return {username: obj.gsx$neweditorname.$t.trim(), responses: obj.gsx$readresponded.$t, reporter: obj.gsx$youreditorname.$t, dateC: obj.gsx$outreachdateest.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == IN) {
                    return {username: obj.gsx$editorname.$t.trim(), responses: obj.gsx$readresponded.$t, reporter: obj.gsx$whomadecontact.$t, dateC: obj.gsx$outreachdate.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == MI) {
                    return {username: obj.gsx$_cn6ca.$t.trim(), responses: obj.gsx$welcomepacket.$t, reporter: obj.gsx$userwhosent.$t, dateC: obj.gsx$datewelcomesent.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == WI) {
                    return {username: obj.gsx$username.$t.trim(), forumread: obj.gsx$readpm.$t, responses: obj.gsx$responded.$t, reporter: obj.gsx$bywhom.$t, dateC: obj.gsx$date.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == PLN) {
                    return {username: obj.gsx$contactededitor.$t.trim(), forumread: obj.gsx$forummessageread.$t, responses: obj.gsx$responsereceived.$t, reporter: obj.gsx$yourusername.$t, dateC: obj.gsx$timestamp.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == NWR) {
                    return {username: obj.gsx$usernameofcontactededitor.$t.trim(), forumread: obj.gsx$forummessageread.$t, responses: obj.gsx$responsereceived.$t, reporter: obj.gsx$yourusername.$t, dateC: obj.gsx$timestamp.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == MYS) {
                    return {username: obj.gsx$wazeuseridyousentpmto.$t.trim(), forumread: obj.gsx$pmread.$t, responses: obj.gsx$pmreplied.$t, reporter: obj.gsx$yourwazeuserid.$t, dateC: obj.gsx$timestamp.$t, state: obj.gsx$state.$t, city: obj.gsx$city.$t
                           }
                }
                if (localStorage.getItem('ORCSS') == ATR) {
                    return {username: obj.gsx$neweditorwazeusername.$t.trim(), joined: obj.gsx$neweditorjoineddiscordgho, responses: obj.gsx$neweditorresponded.$t, reporter: obj.gsx$reporterusername.$t, dateC: obj.gsx$outreachdate.$t
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
            localStorage.setItem('ORCSS', NEOR);
        }
        else if ($('#ORCRegList')[0].value == 'MAR') {
            localStorage.setItem('ORCSS', MAR);
        }
        else if ($('#ORCRegList')[0].value == 'SWR') {
            localStorage.setItem('ORCSS', SWR);
        }
        else if ($('#ORCRegList')[0].value == 'OH') {
            localStorage.setItem('ORCSS', OH);
        }
        else if ($('#ORCRegList')[0].value == 'IN') {
            localStorage.setItem('ORCSS', IN);
        }
        else if ($('#ORCRegList')[0].value == 'MI') {
            localStorage.setItem('ORCSS', MI);
        }
        else if ($('#ORCRegList')[0].value == 'WI') {
            localStorage.setItem('ORCSS', WI);
        }
        else if ($('#ORCRegList')[0].value == 'PLN') {
            localStorage.setItem('ORCSS', PLN);
        }
        else if ($('#ORCRegList')[0].value == 'NWR') {
            localStorage.setItem('ORCSS', NWR);
        }
        else if ($('#ORCRegList')[0].value == 'SER') {
            localStorage.setItem('ORCSS', SER);
        }
        else if ($('#ORCRegList')[0].value == 'MYS') {
            localStorage.setItem('ORCSS', MYS);
        }
        else if ($('#ORCRegList')[0].value == 'ATR') {
            localStorage.setItem('ORCSS', ATR);
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
    const NWRResources = '<a href="https://goo.gl/forms/naZYgt5oWbG5BBjm1" target="_blank">NWR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1hD-_0rd1JSug472ORDMu3Evb6iZcdo1L-Oidnvwgc0E/edit#gid=97729408">Update Existing Record(s)</a><br><a href="https://docs.google.com/spreadsheets/d/1hD-_0rd1JSug472ORDMu3Evb6iZcdo1L-Oidnvwgc0E/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const SERResources = '';
    const MYSResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSf08H5mK-siIkXNS3ECu8oyKQQWthMjrm8smaD0mjiXuufVMQ/viewform" target="_blank">Malaysia New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRqrKMcCW39c5FeYWaLFMln694TR4oNt1Wc9d_JFEugRdCZytG3fzExyIjR1cWHVaSvVWrUQ3vl33Nn/pubhtml?gid=365459402&single=true" target="_blank">Published Contacts Sheet</a>';
    const ATRResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdg7NXrvYffCI7Hukb8zfSEZ7euO0efuWim8lI9cjWkHijd7Q/viewform" target="_blank">ATR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1Qa1GAlO9lqopFZbvErzp5VDHbcaprZOJ0xbecRhVYhw/edit?usp=sharing" target="_blank">Published Contact Sheet</a>';
    function showPanel() {
        $('#ORCSettingsBtn').show();
        $('#ORCResourceList').show();
        $('#RegListDiv').show();
        $('#ORC-State').show();
        $('#ORCColorOpts').show();
        $('#ORC-resources').show();
        $('#ORCWLLabel').show();
        $('#ORWLVal').show();
        $('#ORCBtn').show();
        $('#SaveWLButton').show();
        $('#ResetWLButton').show();
    }
    function hidePanel() {
        $('#ORCSettingsBtn').hide();
        $('#ORCResourceList').hide();
        $('#RegListDiv').hide();
        $('#ORC-State').hide();
        $('#ORCColorOpts').hide();
        $('#ORC-resources').hide();
        $('#ORCWLLabel').hide();
        $('#ORWLVal').hide();
        $('#ORCBtn').hide();
        $('#SaveWLButton').hide();
        $('#ResetWLButton').hide();
    }
    function StateCheck() {
        var State = W.model.states.top.name
        var Display = document.getElementById('RegListDiv')
        if (W.model.countries.top.name == 'United States') {
            if (RegNEOR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: N(EO)R</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== NEOR) {
                    localStorage.setItem('ORCSS', NEOR);
                    $('#ORCRegList')[0].value = 'NEOR';
                    $('#ORCResourceList')[0].innerHTML = NEORResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegMAR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: MAR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== MAR) {
                    localStorage.setItem('ORCSS', MAR);
                    $('#ORCRegList')[0].value = 'MAR';
                    showPanel();
                    $('#ORCResourceList')[0].innerHTML = MARResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegSWR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: SWR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== SWR) {
                    localStorage.setItem('ORCSS', SWR);
                    $('#ORCRegList')[0].value = 'SWR';
                    $('#ORCResourceList')[0].innerHTML = SWRResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                    Display.style.display = "block";
                }
            }
            else if (RegOH.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== OH) {
                    localStorage.setItem('ORCSS', OH);
                    $('#ORCRegList')[0].value = 'OH';
                    showPanel();
                    $('#ORCResourceList')[0].innerHTML = OHResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegIN.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== IN) {
                    localStorage.setItem('ORCSS', IN);
                    $('#ORCRegList')[0].value = 'IN';
                    $('#ORCResourceList')[0].innerHTML = INResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegWI.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== WI) {
                    localStorage.setItem('ORCSS', WI);
                    $('#ORCRegList')[0].value = 'WI';
                    $('#ORCResourceList')[0].innerHTML = WIResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegMI.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== MI) {
                    localStorage.setItem('ORCSS', MI);
                    $('#ORCRegList')[0].value = 'MI';
                    $('#ORCResourceList')[0].innerHTML = MIResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                    Display.style.display = "block";
                }
            }
            else if (RegPLN.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: PLN</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== PLN) {
                    localStorage.setItem('ORCSS', PLN);
                    $('#ORCRegList')[0].value = 'PLN';
                    $('#ORCResourceList')[0].innerHTML = PLNResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegNWR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: NWR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== NWR) {
                    localStorage.setItem('ORCSS', NWR);
                    $('#ORCRegList')[0].value = 'NWR';
                    $('#ORCResourceList')[0].innerHTML = NWRResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegSER.includes(State)) {
                let ORCME = W.loginManager.user.userName;
                let Approved = getSERApproved(ORCME);
                if (Approved != null) {
                    $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '<br>Current Region: SER</span>';
                    Display.style.display = "block";
                    if (localStorage.getItem('ORCSS') !== SER) {
                        showPanel();
                        localStorage.setItem('ORCSS', SER);
                        $('#ORCRegList')[0].value = 'SER';
                        $('#ORCResourceList')[0].innerHTML = SERResources;
                        $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
                        setTimeout(loadMasterList, 100);
                        setTimeout(loadLeadershipList, 100);
                    }
                } else {
                    console.warn('You are not authorized to use this script in this region. Please reach out to your leadership if you feel this is in error.');
                    hidePanel();
                    $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">You are NOT AUTHORIZED to use ORC in this region.<br>Please contact your leadership if this is in error.</div></b>';
                    Display.style.display = "none";
                }
            }
            else {
                $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">Current Country: ' + W.model.countries.top.name + '<br>Current Region Not Supported.</div></b>';
                hidePanel();
                Display.style.display = "none";
            }
            if (SState.includes(State)) {
                sessionStorage.setItem('ORCState', State);
                runORC();
                showPanel();
                $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
                $('#ORC-State')[0].style.backgroundColor = '';
            }
        }
        else if (W.model.countries.top.name == 'Malaysia') {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '.';
            Display.style.display = "block";
            runORC();
            $('#ORC-State')[0].innerHTML = '';
            if (localStorage.getItem('ORCSS') !== MYS) {
                localStorage.setItem('ORCSS', MYS);
                $('#ORCRegList')[0].value = 'MYS';
                showPanel();
                runORC();
                $('#ORCResourceList')[0].innerHTML = MYSResources;
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            }
        }
        else if (W.model.countries.top.name == 'Puerto Rico' || W.model.countries.top.name == 'Virgin Islands (U.S.)' || W.model.countries.top.name == 'Guam' || W.model.countries.top.name == 'American Samoa' || W.model.countries.top.name == 'Northern Mariana Islands') {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.countries.top.name + '.';
            Display.style.display = "block";
            runORC();
            if (localStorage.getItem('ORCSS') !== ATR) {
                localStorage.setItem('ORCSS', ATR);
                $('#ORCRegList')[0].value = 'ATR';
                showPanel();
                runORC();
                $('#ORCResourceList')[0].innerHTML = ATRResources;
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            }
        }
        else {
            $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">Current Country: ' + W.model.countries.top.name + '<br>Current Country Not Supported.</div></b>';
            hidePanel();
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
    var SERApproved = [];
    async function loadSAUApproved() {
        console.log('ORC: Loading SER Approved Users....');
        var SAUSheet = 'https://spreadsheets.google.com/feeds/list/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/11/public/values?alt=json'
        var SAUReg = 'SER'
        await $.getJSON(SAUSheet, function(ldata){
            SERApproved = ldata;
            console.log('ORC: '+SAUReg+' Leadership Masterlist Loaded....');
        });
    }
    function getSERApproved(editorName) {
        let AppList = SERApproved.feed.entry.map(obj =>{
            return {username: obj.gsx$serapprovedusers.$t}
        });
        for(let i=0; i<AppList.length; i++){
            if(AppList[i].username.toLowerCase() === editorName.toLowerCase()) {
                return AppList[i];
            }
        }
        return null;
    }
    function createTab() {
        var $section = $('<div>');
        $section.html([
            '<div id="ORC-Top"><div id="ORC-title">',
            '<h1>Outreach Checker</h2></div>',
            '<div id="RegListDiv"><select id="ORCRegList"><option value="0" selected disabled>Country</option><option value="MYS">Malaysia</option><optgroup label="USA"><option value="ATR">ATR</option><option value="MAR">MAR</option><option value="NEOR">N(EO)R</option><option value="NWR">NWR</option><option value="PLN">PLN</option><option value="SER">SER</option><option value="SWR">SWR</option><option value="3" disabled>GLR</option><option value="IN">Indiana</option><option value="MI">Michigan</option><option value="OH">Ohio</option><option value="WI">Wisconsin</option></optgroup></select><button type="button" id="ORCReloadList" class="btn btn-info" class="btn btn-default btn-sm" data-toggle="tooltip" title="Reload Outreach Lists"><span class="fa fa-repeat"></span></button></div>',
            '<br><button id="ORCSettingsBtn" data-toggle="collapse" data-target="#ORCSettings">Settings</button><div id="ORCSettings" class="collapse"><br><input type="checkbox" id="R4WL"> <label data-toggle="tooltip" title="Auto-Whitelist any editor Rank 4+">Auto-WL R4+</label><br><input type="checkbox" id="ORCPM-Btn"> <label data-toggle="tooltip" title="Enable PM button next to usernames">Enable ORCs PM Button</label>',
            '<div id="ORCColorOpts">',
            '<font size="1.9"><span data-toggle="tooltip" title="Set Background Color">Bg</span> | <span data-toggle="tooltip" title="Set Font Color">Txt</span>   </font><button type="button" class="btn btn-danger" data-toggle="tooltip" title="Reset to default color settings" id="ORCResetColors">Reset</button>',
            '<br><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker1"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker1"></button><div id="ORCMenu-NotContacted"><span style="color: black; background-color: #ff0000">Not been contacted or whitelisted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker2"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker2"></button><div id="ORCMenu-Contacted"><span style="color: black; background-color: #F7E000" data-toggle="tooltip" title=" User has been contacted but does not mean they have replied or joined Discord">Has been contacted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker3"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker3"></button><div id="ORCMenu-Leadership"><span style="color: black; background-color: #99bbff" data-toggle="tooltip" title="Region Leadership">Regional Management (SM+).</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker4"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker4"></button><div id="ORCMenu-WhiteListed"><span style="color: black; background-color: white" data-toggle="tooltip" title="All R4+ editors will be whitelisted if enabled.">Yourself/Whitelisted users.</span></div>',
            '</div></div></div>',
            '<br><div id="ORC-Region">Current Region: </div>',
            '<div id="ORC-State">Current State: </div>',
            '<div id="ORC-Warning"></div>',
            '<br><div id="ORC-info"></div>',
            '<p><div id="ORC-resources"><p><b>Resources:</b><br></div>',
            '<p><div id="ORC-WhiteList"></div>',
            '</div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('ORC', $section.html());
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
        var RSClrBtn = document.getElementById('ORCResetColors');
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
        WLLabel.id = 'ORCWLLabel'
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
        var R4WL = document.getElementById('R4WL')
        if (localStorage.getItem('ORCR4WL') == 'true') {
            $('#R4WL')[0].checked = true
        } else {
            $('#R4WL')[0].checked = false
        }
        R4WL.onclick = function() {
            ORCWarning.after(WLSLabel);
            localStorage.setItem('ORCR4WL', R4WL.checked)
            if (R4WL.checked == true) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">All Editors R4+ will be Auto Whitelisted.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            if (R4WL.checked == false) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">All Editors R4+ will not be Auto Whitelisted.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            StateCheck();
        }
        var ORCPM = document.getElementById('ORCPM-Btn')
        if (localStorage.getItem('ORCPM') == 'true') {
            $('#ORCPM-Btn')[0].checked = true
        } else {
            $('#ORCPM-Btn')[0].checked = false
        }
        ORCPM.onclick = function() {
            ORCWarning.after(WLSLabel);
            localStorage.setItem('ORCPM', ORCPM.checked)
            if (ORCPM.checked == true) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">Enabled ORCs PM Button.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            if (ORCPM.checked == false) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">Disabled ORCs PM Button.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            StateCheck();
        }
        let SelectedRegion = $('#ORCRegList')[0];
        if (localStorage.getItem('ORCSS') == MAR) {
            SelectedRegion.value = 'MAR';
        }
        else if (localStorage.getItem('ORCSS') == NEOR) {
            SelectedRegion.value = 'NEOR';
        }
        else if (localStorage.getItem('ORCSS') == SWR) {
            SelectedRegion.value = 'SWR';
        }
        else if (localStorage.getItem('ORCSS') == OH) {
            SelectedRegion.value = 'OH';
        }
        else if (localStorage.getItem('ORCSS') == IN) {
            SelectedRegion.value = 'IN';
        }
        else if (localStorage.getItem('ORCSS') == MI) {
            SelectedRegion.value = 'MI';
        }
        else if (localStorage.getItem('ORCSS') == WI) {
            SelectedRegion.value = 'WI';
        }
        else if (localStorage.getItem('ORCSS') == PLN) {
            SelectedRegion.value ='PLN';
        }
        else if (localStorage.getItem('ORCSS') == NWR) {
            SelectedRegion.value ='NWR';
        }
        else if (localStorage.getItem('ORCSS') == SER) {
            SelectedRegion.value ='SER';
        }
        else if (localStorage.getItem('ORCSS') == MYS) {
            SelectedRegion.value ='MYS';
        }
        else if (localStorage.getItem('ORCSS') == ATR) {
            SelectedRegion.value = 'ATR';
        }
        SelectedRegion.onchange = function() {
            if (SelectedRegion.value == 'NEOR' && RegNEOR.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', NEOR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MAR' && RegMAR.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', MAR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'SWR' && RegSWR.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', SWR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'SER' && RegSER.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', SER);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'OH' && RegOH.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', OH);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'IN' && RegIN.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', IN);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MI' && RegMI.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', MI);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'WI' && RegWI.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', WI);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'PLN' && RegPLN.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', PLN);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'NWR' && RegNWR.includes(W.model.states.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', NWR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MYS' && RegMYS.includes(W.model.countries.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', MYS);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'ATR' && RegATR.includes(W.model.countries.top.name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', ATR);
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
        if (localStorage.getItem('ORCSS') == NEOR) {
            ORCResList.innerHTML = NEORResources;
        }
        if (localStorage.getItem('ORCSS') == MAR) {
            ORCResList.innerHTML = MARResources;
        }
        if (localStorage.getItem('ORCSS') == SWR) {
            ORCResList.innerHTML = SWRResources;
        }
        if (localStorage.getItem('ORCSS') == SER) {
            ORCResList.innerHTML = SERResources;
        }
        if (localStorage.getItem('ORCSS') == OH) {
            ORCResList.innerHTML = OHResources;
        }
        if (localStorage.getItem('ORCSS') == IN) {
            ORCResList.innerHTML = INResources;
        }
        if (localStorage.getItem('ORCSS') == MI) {
            ORCResList.innerHTML = MIResources;
        }
        if (localStorage.getItem('ORCSS') == WI) {
            ORCResList.innerHTML = WIResources;
        }
        if (localStorage.getItem('ORCSS') == PLN) {
            ORCResList.innerHTML = PLNResources;
        }
        if (localStorage.getItem('ORCSS') == NWR) {
            ORCResList.innerHTML = NWRResources;
        }
        if (localStorage.getItem('ORCSS') == MYS) {
            ORCResList.innerHTML = MYSResources;
        }
        if (localStorage.getItem('ORCSS') == ATR) {
            ORCResList.innerHTML = ATRResources;
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
        setTimeout(initORCcolorPicker, 500);
        init();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready && jscolor && ($('#panel-container').length || $('span.username').length >= 1)) {
            sessionStorage.removeItem('ORCState');
            loadMasterList();
            loadLeadershipList();
            loadSAUApproved();
            createTab();
            setTimeout(function(){if(W.selectionManager._selectedFeatures.length > 0){StateCheck();}}, 15000);
            setTimeout(updatePanel, 1000);
            if (!localStorage.getItem('ORCPM')) {
                localStorage.setItem('ORCPM', 'false');
            }
            if (!localStorage.getItem('ORCSS')) {
                localStorage.setItem('ORCSS', NEOR);
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
