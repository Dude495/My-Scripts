// ==UserScript==
// @name         WME NY UR Project Timer
// @namespace    Dude495
// @version      2018.08.02.001
// @description  Adds count down timer for the NY UR Project (2018).
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==
//Some code based off PA MapRaid Countdown Timer by MoM

(function() {
    'use strict';
function startClock() {
 var PHASE = 'Brooklyn'
    var startTime = new Date('aug 11, 2018 00:00:00 EDT').getTime();
    var now = new Date().getTime();
    var time = startTime - now;
    var days = Math.floor (time / (1000 * 60 * 60 * 24));
    var hours = Math.floor((time%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
    var minutes = Math.floor((time % (100 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    var div = [];
    if (time > 0) {
        div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
    }
    if (time < 0) {
        div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
    }
        if ($('#countdown-timer').length <= 0) {
            div;
            $('#user-box').after(div);
        $('#user-profile').css('margin-bottom','5px');
        }
        $('#user-box').css('padding-bottom','5px');
        document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase begins in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
        if (time < 0) {
            document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase has ended!' + '<br>' + 'Thank you for your support.';
        }
}

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            setInterval(startClock, 1000);
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();