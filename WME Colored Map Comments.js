// ==UserScript==
// @name         WME Colored Map Comments
// @namespace    Dude495
// @version      2019.03.26.02
// @author       Dude495
// @description  Change the color of Map Comments based on HEX Color Code.
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
/* global W */
/* global $ */
/* global WazeWrap */
// ==/UserScript==

(function() {
    'use strict';
    var LayerID = W.map.getLayerByUniqueName('mapComments').id;
    function ChangeColor() {
        var CommentPoints = $("circle[id^='OpenLayers_Geometry_Point_']");
        for (let i = 0; i < CommentPoints.length; i++) {
            if (W.map.getLayerVisibility("mapComments") && CommentPoints[i].parentNode.id == LayerID+'_vroot') {
                if (localStorage.getItem('CMC') !== null) {
                    CommentPoints[i].style.fill = localStorage.getItem('CMC');
                } else {
                    CommentPoints[i].style.fill = 'white';
                }
            }
        }
    }
    function Save() {
        localStorage.setItem('CMC', $('#CMC').val());
        ChangeColor();
    }
    function init() { //Copied from WME HardHats by RickZ
        $('#sidepanel-prefs').append($("<div>").css("clear", "both")
                                     .css("margin-bottom", "10px")
                                     .append($("<h5>").html("Colored Map Comments v"+GM_info.script.version+",")
                                             .css("color", "black")
                                             .css("text-align", "left")
                                            )
                                     .append($('<textarea rows="1" cols="10" maxlength="7">').attr("id", "CMC")
                                             .attr("title", "Enter the HEX Color Code for the color you want Map Comments to appear. (Include the #)")
                                             .css("resize", "none")
                                            )
                                     .append($('<br><button class="btn btn-success">Save</button>')
                                             .click(Save)
                                             .attr("title", "WME Colored Map Comments")
                                             .css("margin-bottom", "50px")
                                            )
                                    );
        $("#CMC").val(localStorage.getItem('CMC'));
        ChangeColor();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready) {
            console.log(GM_info.script.name, 'Initialized');
            init();
            WazeWrap.Events.register("moveend", null, ChangeColor);
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
