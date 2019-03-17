// ==UserScript==
// @name         WME Land of the Pure Timer
// @namespace    Dude495
// @version      2019.03.16.03
// @description  Adds count down timer for the Land of the Pure (Pakistan) WoW
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
        var PHASE = 'Land of the Pure';
        var phaseTime;
        let entry = getData('WoWs2Pak');
        const ProjStatus = entry.status;
        if (ProjStatus == 'Inactive') {
            phaseTime = new Date(entry.start).getTime();
        } else {
            phaseTime = new Date(entry.end).getTime();
        }
        var now = new Date().getTime();
        var time = phaseTime - now;
        var weeks = Math.floor(time / 604800000);
        var days = Math.floor(time%(604800000)/86400000);
        var hours = Math.floor((time%(86400000))/3600000);
        var minutes = Math.floor((time % (3600000)) / 60000);
        var seconds = Math.floor((time % (60000)) / 1000);
        var div = [];
        var mdiv = [];
        if (ProjStatus == 'Inactive') {
            if (time > 18000001) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
                mdiv = $('<div>', {id: 'message-alert'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
            }
            if ((time < 18000000) && (time > 0)) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
                mdiv = $('<div>', {id: 'message-alert'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
            }
            if (time <= 0) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
                mdiv = $('<div>', {id: 'message-alert'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
            }
        } else {
            if (time > 18000001) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
                mdiv = $('<div>', {id: 'message-alert'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
            }
            if ((time < 18000000) && (time > 0)) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
                mdiv = $('<div>', {id: 'message-alert'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
            }
            if (time <= 0) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
                mdiv = $('<div>', {id: 'message-alert'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
            }
        }
        if ($('#countdown-timer').length <= 0) {
            div;
            mdiv;
            $('#user-box').after(div);
            div.after(mdiv);
            mdiv.innerHTML = '';
            $('#user-profile').css('margin-bottom','5px');
        }
        $('#user-box').css('padding-bottom','5px');
        if (ProjStatus == 'Inactive') {
            if (time > 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW begins in ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW begins in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if ((time <= 18000000) && (time >= 1)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW begins in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW has started, Happy Editing!';
            }
        }
        if (ProjStatus == 'Active') {
            if (time > 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if ((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if ((time <= 18000000) && (time > 0)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW has ended! <br> Thank you for all your efforts!';
            }
        }
    }
    function checkAlert() {
        let entry = getData('WoWs2Pak');
        var AlertStatus = entry.alert
        if (AlertStatus == 'Yes') {
            document.getElementById('message-alert').innerHTML = '<marquee>'+entry.message+'</marquee>';
        } else {
            document.getElementById('message-alert').innerHTML = '';
        }
    }
    var TimerData = [];
    async function loadData() {
        var SS = 'https://spreadsheets.google.com/feeds/list/1L8yxoTQEmnoLpENw5hzoL6W4p0rSsMME8G3bgRjdbHM/22/public/values?alt=json'
        await $.getJSON(SS, function(data){
            TimerData = data;
        });
        setInterval(loadData, 5000);
    }
    function getData(data){
        let mapped = TimerData.feed.entry.map(obj =>{
            return {name: obj.gsx$name.$t, status: obj.gsx$status.$t.trim(), start: obj.gsx$startdate.$t, end: obj.gsx$enddate.$t, alert: obj.gsx$alert.$t, message: obj.gsx$message.$t
                   }
        });
        for(let i=0; i<mapped.length; i++){
            return mapped[i];
        }
        return null;
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            loadData();
            setInterval(checkAlert, 15000);
            setInterval(startClock, 1000);
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
