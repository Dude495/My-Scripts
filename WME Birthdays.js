// ==UserScript==
// @name         WME Birthdays
// @namespace    Dude495
// @version      2018.04.02.01
// @description  Creates a button in the top bar of the Waze Forums to access editor birthday information.
// @author       Dude495
// @include      https://www.waze.com/forum/*
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// ==/UserScript==
//arrBirthdayList.select(); document.execCommand('copy')
(function() {
    'use strict';

    function BirthdayButton() {
        var PM = document.URL + 'ucp.php?i=pm&mode=compose'
        var PMB = document.createElement('button');
        PMB.onclick = function(){ var arrBirthdayList = []; $( 'div#page-body p').eq( 3 ).find( 'strong a' ).each( function( i ){ arrBirthdayList[ i ] = $( this ).text(); } ); console.log( 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!' ); console.info( 'Forum name list:\n\n' + arrBirthdayList.join( '\n' ) ); var copyText = arrBirthdayList.join( '\n' ); var copied = $('<textarea rows="1" cols="1">').val(copyText).appendTo('body').select(); document.execCommand('copy'); alert('Birthdays Copied for PM'); window.open(PM); }
        var tp = document.createTextNode("Birthdays (PM)")
        PMB.appendChild(tp);
        document.body.appendChild(PMB);
        $('#wrap').after(PMB);
        var discord = document.createElement('button');
        discord.onclick = function(){ var arrBirthdayList = []; $( 'div#page-body p').eq( 3 ).find( 'strong a' ).each( function( i ){ arrBirthdayList[ i ] = $( this ).text(); } ); console.log( 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!' ); console.info( 'Forum name list:\n\n' + arrBirthdayList.join( '\n' ) ); var copyText = 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!'; var copied = $('<textarea rows="1" cols="1">').val(copyText).appendTo('body').select(); document.execCommand('copy'); alert('Birthdays Copied for Discord') }
        var td = document.createTextNode("Birthdays (Discord)")
        discord.appendChild(td);
        document.body.appendChild(discord);
        $('#wrap').after(discord)
    }
    BirthdayButton();
})();