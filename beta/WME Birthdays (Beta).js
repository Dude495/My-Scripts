// ==UserScript==
// @name         WME Birthdays (Beta)
// @namespace    Dude495
// @version      2018.08.09.001
// @description  Beta version of WME Birthdays for testing purposes only.
// @author       Dude495
// @include      https://www.waze.com/forum/*
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// ==/UserScript==
// Code to pull editor names by technical_01

(function() {
    'use strict';
    const SCRIPTNAME = GM_info.script.name;
    const arrBirthdayList = [];
    $( 'div#page-body p').eq( 3 ).find( 'strong a' ).each( function( i ){ arrBirthdayList[ i ] = $( this ).text(); } );
    const DIMG = 'data:image/png;base64,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'
    const DIMGP = 'data:image/png;base64,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'
    const PMIMG = 'data:image/png;base64,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'
    const PMIMGP = 'data:image/png;base64,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'
    const today = new Date().toLocaleDateString('en-us', { month: 'long', day: 'numeric', year: 'numeric' });
    const BPMBlink = 'https://www.waze.com/forum/ucp.php?i=pm&mode=compose&subject=Happy Birthday ('+ today +')&username_list=';
    function createMessage() {
        const MYNAME = $('#phpbb > div.waze-header > div > div > div.login_tab > span')[0].textContent.replace('hello ','').replace('  ','');
        const MESSAGE = encodeURIComponent([
            'Good day all,',' ',
            'On behalf of all of the editing community, I just want to stop by and wish you all a very [b]Happy Birthday[/b] and hope its as relaxing and enjoyable as possible. Thank you for all the hard work you do to make Waze such an amazing platform',' ', '- '+MYNAME,' ',' ',
            '[size=85]In case you are not aware, editors can not use Discord to communicate with the editing community worldwide. Here is a list of servers available for you to join:',' ',
            '[b]Global (ROW) & MapRaid[/b] - [url]https://discord.gg/YEtgvCN[/url]',
            '[b]Waze USA[/b] - [url]https://discord.gg/Q3YPQC6[/url]',
            '[b]Great Lakes Region (GLR)[/b] - [url]https://discord.me/wazeglr[/url]',
            '[b]Mid Atlantic Region (MAR)[/b] - [url]https://goo.gl/E5CKDk[/url]',
            '[b]New England Region (NER)[/b] - [url]https://goo.gl/forms/X24ENSZ6ANw2sQpV2[/url]',
            '[b]Northeast Region (NOR)[/b] - [url]https://discord.me/NorthEast_Region[/url]',
            '[b]Northwest Region (NWR)[/b] - [url]https://discord.me/wazenwr[/url]',
            '[b]Plains Region (PLN)[/b] - [url]http://www.discord.me/wazepln[/url]',
            '[b]South Atlantic Region (SAT)[/b] - [url]https://goo.gl/yjKKgv[/url]',
            '[b]South Central Region (SCR)[/b] - [url]https://discord.me/waze_scr[/url]',
            '[b]Southeast Region (SER)[/b] - [url]https://discord.me/southeast[/url]',
            '[b]Southwest Region (SWR)[/b] - [url]https://discord.gg/twxnqnU[/url]',
            '[b]Territories (ATR)[/b] - [url]https://discord.gg/Vup2VEA[/url]',
            '[b]Australia[/b] - [url]https://discord.me/wazeaustralia[/url]',
            '[b]Scripts[/b] - [url]https://discord.me/WazeScripts[/url]',
            '[b]VEOC[/b] - [url]https://discord.me/waze_veoc[/url][/size]',
        ].join('\n'));
        const PMLink = 'https://www.waze.com/forum/ucp.php?i=pm&mode=compose&subject=Happy Birthday ('+ today +')&message=' + MESSAGE + '&username_list=';
        let copyText = arrBirthdayList.join( '\n' );
        console.info('Birthdays for PM: \n\n'+copyText);
        let PMList = PMLink + arrBirthdayList.slice(0, 20).join('%0A%0D');
        window.open(PMList);
        if(arrBirthdayList.length > 20){
            let PMList2 = PMLink + arrBirthdayList.slice(20, 40).join('%0A%0D');
            window.open(PMList2);
        }
    }
    function init() {
        var checked = JSON.parse(localStorage.getItem('PDM'));
        document.getElementById('PDM').checked = checked;
    }
    function createBMessage() {
        const BPMBlink = 'https://www.waze.com/forum/ucp.php?i=pm&mode=compose&subject=Happy Birthday ('+ today +')&username_list=';
        let copyText = arrBirthdayList.join( '\n' );
        console.info('Birthdays for PM: \n\n'+copyText);
        let PMList = BPMBlink + arrBirthdayList.slice(0, 20).join('%0A%0D');
        window.open(PMList);
        if(arrBirthdayList.length > 20){
            let PMList2 = BPMBlink + arrBirthdayList.slice(20, 40).join('%0A%0D');
            window.open(PMList2);
        }
    }
    const link = document.createElement('a');
    link.href = "#";
    const a = link;
    const pdiv = document.createElement('div');
    function BirthdayButton() {
        pdiv.id = 'P-IMG';
        $('#wrap').after(pdiv);
        var box = document.createElement("INPUT");
        box.setAttribute("type", "checkbox");
        box.id = 'PDM'
        var cl = document.createElement("LABEL");
        cl.innerHTML = '  Enable Pre-Defined PM Message';
        pdiv.after(box);
        box.after(cl)
        box.onclick = function() {
            localStorage.setItem('PDM', box.checked);
        }
        let pimg = document.createElement('img');
        pimg.id = 'PM-IMG';
        pimg.src = PMIMG;
        pimg.onmouseout = function() {
            pimg.src = PMIMG;
        };
        pimg.onmouseover = function () {
            pimg.src = PMIMGP;
        };
        pdiv.appendChild(pimg);
        document.getElementById('P-IMG').appendChild(pimg);
        $('#PM-IMG').wrap(a);
        pimg.onclick = function() {
            if (document.getElementById('PDM').checked == true) {
                createMessage();
            }
            if (document.getElementById('PDM').checked == false) {
                createBMessage();
            };
        };
        var dimg = document.createElement('img')
        dimg.id = 'DS-IMG';
        dimg.src = DIMG;
        dimg.onmouseout = function() {
            dimg.src = DIMG
        };
        dimg.onmouseover = function () {
            dimg.src = DIMGP
        }
        document.body.appendChild(dimg);
        document.getElementById('P-IMG').appendChild(dimg);
        $('#DS-IMG').wrap(a);
        $('#wrap').after(pdiv);
        dimg.onclick = function() {
            var copyText = 'Birthdays for ' + ( new Date() ).toLocaleDateString( 'en-us', { month: 'long', day: 'numeric', year: 'numeric' } ) + ':\n\n@' + arrBirthdayList.join( '\n@' ) + '\n\nHappy Birthday everyone!';
            var copied = $('<textarea rows="1" cols="1">').val(copyText).appendTo('body').select();
            document.execCommand('copy');
            console.log( copyText );
            alert('Birthdays Copied for Discord');
        }
    }
    function bootstrap(tries = 1) {
        if ((/forum/.test(location.href)) && $("h3:contains(Birthdays)").length > 0) {
            BirthdayButton();
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }
    bootstrap();
})();
