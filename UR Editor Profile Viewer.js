// ==UserScript==
// @name         UR Editor Profile Viewer
// @namespace    Dude495
// @version      2018.07.17.021b
// @description  Changes the editor names in URs to a link direct to the editor profile.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==
// HUGE Thanks to Joyriding for his patience and helping me learn to the basics and walk me through my first script!!!
// Update message code based on work from RickZabel

(function() {
    var Version = GM_info.script.version;
    var ScriptName = GM_info.script.name;
    var ConsoleSN = GM_info.script.name;
    var UpdateAlert = "yes";
    var UpdateNotes = ScriptName + " has been updated to v" + Version;
    UpdateNotes = UpdateNotes + "\n" +
        "* Beta Releae";
    if (UpdateAlert === "yes") {
        ScriptName = ScriptName.replace( /\s/g, "") + "Version";
        if (localStorage.getItem(ScriptName) !== Version) {
            alert(UpdateNotes);
            localStorage.setItem(ScriptName, Version);
        }
    }
    'use strict';

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

    function checkUR() {
        var isvisible = ($('.comment-list').is(':visible'))
        if (isvisible == true) {
            EPV();
        }
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            checkUR();
            console.log(ConsoleSN, 'Initialized');
        } else {
            console.log(ConsoleSN, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();