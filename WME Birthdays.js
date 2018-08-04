// ==UserScript==
// @name         WME Birthdays
// @namespace    Dude495
// @version      2018.08.04.004
// @description  Creates buttons on the top bar of the Waze Forums to access editor birthday information.
// @author       Dude495
// @include      https://www.waze.com/forum/*
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// ==/UserScript==
// Code to pull editor names by technical_01

(function() {
    'use strict';
    const DIMG = 'data:image/png;base64,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'
    const PMIMG = 'data:image/png;base64,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'
    const PM = document.URL + 'ucp.php?i=pm&mode=compose'
    const link = document.createElement('a');
    link.href = "#";
    const a = link
    function BirthdayButton() {
        var pdiv = document.createElement('div')
        pdiv.id = 'P-IMG'
        $('#wrap').after(pdiv);
        var pimg = document.createElement('img');
        pimg.id = 'PM-IMG'
        pimg.src = PMIMG
        pdiv.appendChild(pimg);
        document.getElementById('P-IMG').appendChild(pimg);
        $('#PM-IMG').wrap(a);
        pimg.onclick = function() {
            var arrBirthdayList = [];
            $( 'div#page-body p').eq( 3 ).find( 'strong a' ).each( function( i ){ arrBirthdayList[ i ] = $( this ).text(); } );
            console.log( 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!' );
            console.info( 'Forum name list:\n\n' + arrBirthdayList.join( '\n' ) ); var copyText = arrBirthdayList.join( '\n' );
            var copied = $('<textarea rows="1" cols="1">').val(copyText).appendTo('body').select(); document.execCommand('copy');
            alert('Birthdays Copied for PM');
            window.open(PM);
        }
        var dimg = document.createElement('img')
        dimg.id = 'DS-IMG'
        dimg.src = DIMG
        document.body.appendChild(dimg);
        document.getElementById('P-IMG').appendChild(dimg);
        $('#DS-IMG').wrap(a);
        $('#wrap').after(pdiv);
        dimg.onclick = function() {
            var arrBirthdayList = [];
            $( 'div#page-body p').eq( 3 ).find( 'strong a' ).each( function( i ){ arrBirthdayList[ i ] = $( this ).text(); } );
            console.log( 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!' );
            console.info( 'Forum name list:\n\n' + arrBirthdayList.join( '\n' ) );
            var copyText = 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!';
            var copied = $('<textarea rows="1" cols="1">').val(copyText).appendTo('body').select();
            document.execCommand('copy');
            alert('Birthdays Copied for Discord')
        }
    }
    function bootstrap(tries) {
        tries = tries || 1;

        if (/index/.test(location.href) && $('#page-body li').length > 19) {
            BirthdayButton();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }
    bootstrap();
})();