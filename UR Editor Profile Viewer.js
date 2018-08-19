// ==UserScript==
// @name         UR Editor Profile Viewer
// @namespace    Dude495
// @version      2018.08.19.001
// @description  Changes the editor names in URs to a link direct to the editor profile.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==
// HUGE Thanks to Joyriding & MoM for their patience and helping me learn to the basics and walk me through my first script!!!

(function() {
    'use strict';

    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_ALERT = true;
    var UPDATE_NOTES = [
        SCRIPT_NAME + ' has been updated to v' + VERSION,
        '',
        '* Public Release',
        '* Huge Thanks to Joyriding and MoM for their patience and help learning this process!'
    ].join('\n');

    if (UPDATE_ALERT) {
        SCRIPT_NAME = SCRIPT_NAME.replace( /\s/g, '') + VERSION;
        if (localStorage.getItem(SCRIPT_NAME) !== VERSION) {
            alert(UPDATE_NOTES);
            localStorage.setItem(SCRIPT_NAME, VERSION);
        }
    }

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

    function init() {
        var mo = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if ($(node).hasClass('conversation-view')) EPV();
            }));
        });
        mo.observe(document.querySelector('#panel-container'), {childList: true, subtree:true})
    }
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
