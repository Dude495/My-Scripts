// ==UserScript==
// @name         WME NY UR Project Timer
// @namespace    Dude495
// @version      2018.08.09.003
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
        var phaseTime = new Date('aug 11, 2018 00:00:00 EDT').getTime();
        //var phaseTime = new Date('aug 09, 2018 11:35:00 EDT').getTime();
        var now = new Date().getTime();
        var time = phaseTime - now;
        var days = Math.floor(time / 86400000);
        var hours = Math.floor((time%(86400000))/3600000);
        var minutes = Math.floor((time % (3600000)) / 60000);
        var seconds = Math.floor((time % (60000)) / 1000);
        var div = [];
        if (time > 0) {
            div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
        }
        if (time < 0) {
            div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
        }
        /*if (time > 18000001) {
            div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
        }
        if ((time < 18000000) && (time > 0)) {
            div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
        }
        if (time < 0) {
            div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
        }*/
        if ($('#countdown-timer').length <= 0) {
            div;
            $('#user-box').after(div);
            $('#user-profile').css('margin-bottom','5px');
        }
        $('#user-box').css('padding-bottom','5px');
        document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase begins in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
        if (time < 0) {
            document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase has started, Happy Editing!';
        }
        /*document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase ends in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
        if ((time < 18000000) && (time > 0)) {
            document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase ends in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
        if (time < 0) {
            document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase has ended! <br> Thank you for all your efforts!';
        }*/
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