// ==UserScript==
// @name         WME Colored Map Comments
// @namespace    Dude495
// @version      2019.04.01.01
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
    function ChangeColor() {
        let mcStyle;
        let rules = W.map.getLayersByName("Map comments")[0].styleMap.styles.default.rules;
        for(let i=0; i< rules.length; i++){
            if (rules[i].id === "Waze_Rule_180"){
                mcStyle = rules[i];
                break;
            }
        }
        if (mcStyle) {
            if ($('#MCP').is(':checked')) {
                mcStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC');
                W.map.getLayersByName("Map comments")[0].redraw();
            } else {
                mcStyle.symbolizer.Point.fillColor = '#ffffff';
                W.map.getLayersByName("Map comments")[0].redraw();
            }
            if ($('#MCA').is(':checked')) {
                mcStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC');
                mcStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC');
                W.map.getLayersByName("Map comments")[0].redraw();
            } else {
                mcStyle.symbolizer.Polygon.fillColor = '#ffffff';
                W.map.getLayersByName("Map comments")[0].redraw();
            }
        }
    }
    function Save() {
        localStorage.setItem('CMC', $('#CMC').val());
        ChangeColor();
        $('#colorWheel')[0].value = localStorage.getItem('CMC');
        localStorage.setItem('MCP', $('#MCP').is(':checked'));
        localStorage.setItem('MCA', $('#MCA').is(':checked'));
    }
    function init() { //Side Panel based off code from RickZ via HardHats
        $('#sidepanel-prefs').append($('<div>')
                                     .css("clear", "both")
                                     .attr("id", "CMC-Panel")
                                     .append($("<h5>").html("Colored Map Comments v"+GM_info.script.version+",")
                                             .css("color", "black")
                                             .css("text-align", "left")
                                            )
                                     .append($('<input data-toggle="tooltip">Enable MC Points</input>')
                                             .attr("id", "MCP")
                                             .attr("type", "checkbox")
                                             .attr("title", "Enable Color Highlighting for MC Points")
                                             .css("margin-bottom", "0px")
                                             .click(Save)
                                            )
                                     .append($("<br>"))
                                     .append($('<input data-toggle="tooltip">Enable MC Areas</input>')
                                             .attr("id", "MCA")
                                             .attr("type", "checkbox")
                                             //.attr("disabled", "true")
                                             .attr("title", "Enable Color Highlighting for MC Area Polygons")
                                             .css("margin-bottom", "0px")
                                             .click(Save)
                                            )
                                     .append($("<br>"))
                                     .append($('<textarea rows="1" cols="10" maxlength="7">').attr("id", "CMC")
                                             .attr("title", "Enter the HEX Color Code for the color you want Map Comments to appear. (Include the #)")
                                             .css("resize", "none")
                                             .css("width", "60px")
                                             .css("height", "25px")
                                            )
                                     .append($('<input id="colorWheel" type="color" value="'+localStorage.getItem("CMC")+'">')
                                             .css("margin-left", "5px")
                                             .css("top", "-7px")
                                             .css("position", "relative")
                                             .css("width", "25px")
                                            )
                                     .append($("<br>"))
                                     .append($('<button class="btn btn-success" data-toggle="tooltip">Save</button>')
                                             .click(Save)
                                             .attr("title", "This button is only needed if you manually change the HEX Code")
                                             .css("margin-bottom", "25px")
                                            )
                                    );
        if (localStorage.getItem('MCP') === "true") {
            $('#MCP')[0].checked = true
        } else {
            $('#MCP')[0].checked = false
        }
        if (localStorage.getItem('MCA') === "true") {
            $('#MCA')[0].checked = true
        } else {
            $('#MCA')[0].checked = false
        }
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
            WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, "<ul><li>Code adjustment (Thanks Justin!)</li><li>Added MC Area support.</li></ul>", "https://greasyfork.org/en/scripts/380974-wme-colored-map-comments","");
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
