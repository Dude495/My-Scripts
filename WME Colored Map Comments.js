// ==UserScript==
// @name         WME Colored Map Comments
// @namespace    Dude495
// @version      2019.03.30.01
// @author       Dude495
// @description  Change the color of Map Comment Points based on HEX Color Code.
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
        $('#colorWheel')[0].value = localStorage.getItem('CMC');
    }
    function init() { //Side Panel based off code from RickZ via HardHats
        $('#sidepanel-prefs').append($("<div>").css("clear", "both")
                                     .css("margin-bottom", "10px")
                                     .append($("<h5>").html("Colored Map Comments v"+GM_info.script.version+",")
                                             .css("color", "black")
                                             .css("text-align", "left")
                                            )
                                     .append($('<textarea rows="1" cols="10" maxlength="7">').attr("id", "CMC")
                                             .attr("title", "Enter the HEX Color Code for the color you want Map Comments to appear. (Include the #)")
                                             .css("resize", "none")
                                             .css("width", "60px")
                                             .css("height", "25px")
                                            )
                                     .append($('<input id="colorWheel" type="color" name="favcolor" value="'+localStorage.getItem("CMC")+'">')
                                             .css("margin-left", "5px")
                                             .css("top", "-10px")
                                             .css("position", "relative")
                                             .css("width", "25px")
                                            )
                                     .append($('<br><button class="btn btn-success" data-toggle="tooltip">Save</button>')
                                             .click(Save)
                                             .attr("title", "This button is only needed if you manually change the HEX Code")
                                             .css("margin-bottom", "50px")
                                            )
                                    );
        $('#colorWheel')[0].onchange = function() {
            $('#CMC')[0].value = $('#colorWheel')[0].value;
            Save();
        }
        $("#CMC").val(localStorage.getItem('CMC'));
        ChangeColor();
        $('[data-toggle="tooltip"]').tooltip();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready) {
            console.log(GM_info.script.name, 'Initialized');
            init();
            WazeWrap.Events.register("moveend", null, ChangeColor);
            WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, "<ul><li>Added a color wheel picker</li></ul>", "https://greasyfork.org/en/scripts/380974-wme-colored-map-comments","");
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
