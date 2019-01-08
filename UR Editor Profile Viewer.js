// ==UserScript==
// @name         UR Editor Profile Viewer
// @namespace    Dude495
// @version      2019.01.07.01
// @description  Changes the editor names in URs to a link direct to the editor profile.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==
// HUGE Thanks to Joyriding & MoM for their patience and helping me learn to the basics and walk me through my first script!!!

(async function() {
    'use strict';
    const NY = 'https://spreadsheets.google.com/feeds/list/1sHxgBQ5rVBkYFHcJ5t4p8R2aHxM1WnFFSW-lwqPf0Tg/4/public/values?alt=json';
    const STATE = NY
    const NYdata = await fetch(STATE).then(response => response.json());
    const ENRegEx = /([A-Za-z ])*: /g
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_ALERT = true;
    var UPDATE_NOTES = [
        SCRIPT_NAME + ' has been updated to v' + VERSION,
        '',
        '* Added Color Highlights [NY Only]',
        '* Green means the user has been sent a Welcome Letter by another editor already',
        '* If the user is not highlighted and the name is not familiar please check if a welcome letter is needed.',
        '* Additional support for the rest of NOR & NER soon.',
    ].join('\n');

    if (UPDATE_ALERT) {
        SCRIPT_NAME = SCRIPT_NAME.replace( /\s/g, '') + VERSION;
        if (localStorage.getItem(SCRIPT_NAME) !== VERSION) {
            alert(UPDATE_NOTES);
            localStorage.setItem(SCRIPT_NAME, VERSION);
        }
    }
    function NYEPV() {
        var i;
        for (i = 0; i < $('span.username').length; i++) {
            if ($('span.username')[i].textContent.includes('(')) {
                var epvusername = $('span.username')[i].textContent.match(/(.*)\(\d\)/);
                var username = epvusername[1];
                var profilelink = '<a href="https://www.waze.com/user/editor/' + username + '" target="_blank">' + epvusername[0] + '</a>';
                $('span.username')[i].innerHTML = profilelink;
                NYdata.feed.entry.forEach(function(entry) {
                    let username1 = entry['gsx$usehttpj.mpneweditorsorttosortlist'].$t;
                    let testName = username1.replace(ENRegEx,'');
                    if (username.toLowerCase() == testName.toLowerCase()) {
                        $('span.username')[i].style.backgroundColor = "#5cd65c";
                    };
                });
            };
        };
    };
    function EPV() {
        var i;
        for (i = 0; i < $('span.username').length; i++) {
            if ($('span.username')[i].textContent.includes('(')) {
                var epvusername = $('span.username')[i].textContent.match(/(.*)\(\d\)/);
                var username = epvusername[1];
                var profilelink = '<a href="https://www.waze.com/user/editor/' + username + '" target="_blank">' + epvusername[0] + '</a>';
                $('span.username')[i].innerHTML = profilelink;
            }
        }
    }
    function PURPM() {
        if ($('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user')[0].childNodes[1].textContent.includes('(')) {
            var center = W.map.center.clone().transform(W.map.projection.projCode, W.map.displayProjection.projCode);
            var LON = center.lon;
            var LAT = center.lat;
            var ZOOM = W.map.zoom;
            var ENVL = $('#sidepanel-prefs > div > div > form > div:nth-child(4) > select')[0].value;
            var ENV = $('#env-select > div > select')[0].value;
            if ($('#landmark-edit-general > ul > li:nth-child(2)')[0] !== undefined) {
                let VenueID = $('#landmark-edit-general > ul > li:nth-child(2)')[0].textContent.match(/([0-9].*)/)[1];
                var PermaLink = encodeURIComponent('https://www.waze.com/' + ENVL + '/editor?env=' + ENV + '&lon=' + LON + '&lat=' + LAT + '&zoom=' + ZOOM + '&venues=' + VenueID);
            } else {
                PermaLink = encodeURIComponent('https://www.waze.com/' + ENVL + '/editor?env=' + ENV + '&lon=' + LON + '&lat=' + LAT + '&zoom=' + ZOOM);
            }
            var epvusername = $('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user')[0].childNodes[1].textContent.match(/(.*)\(\d\)/);
            var username = epvusername[1];
            var profilelink = '  <a href="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&username=' + username + '&subject=About This Place Update Request&message=[url=' + PermaLink + ']PermaLink[/url] " target="_blank">(PM)</a>';
            $('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user')[0].innerHTML += profilelink;
        };
    };
    function StateCheck() {
        var RegEx = /([A-Za-z ])*, /g
        var StateDiv = $('#topbar-container > div > div > div.location-info-region > div > span')[0].textContent
        var State = StateDiv.replace(RegEx, '');
        if (State == 'New York') {
            NYEPV();
        };
        if (State !== 'New York') {
            EPV();
        };
    };
    function init() {
        var mo = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if ($(node).hasClass('conversation-view') || $(node).hasClass('map-comment-feature-editor')) StateCheck();
                else if ($(node).hasClass('place-update-edit')) PURPM();
            }));
        });
        mo.observe(document.querySelector('#panel-container'), {childList: true, subtree:true});
        mo.observe($('#edit-panel .contents')[0], {childList:true, subtree:true});
    };
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && $('#panel-container').length) {
            init();
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
