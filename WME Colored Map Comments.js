// ==UserScript==
// @name         WME Colored Map Comments
// @namespace    Dude495
// @version      2020.06.01.01
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
    function ChangeColor(MCPopacity, MCAopacity) {
        let mcStyle;
        let hoverStyle;
        let selectedStyle;
        let defaultRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.default.rules;
        let highlightRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.highlight.rules;
        let selectRules = W.map.getLayerByUniqueName('mapComments').styleMap.styles.highlightselected.rules;
        for (let i=0; i< defaultRules.length; i++){
            if (defaultRules[i].id === "Waze_Rule_178") {
                mcStyle = defaultRules[i];
                break;
            }
        }
        for (let i=0; i< highlightRules.length; i++){
            if (highlightRules[i].id === "Waze_Rule_180") {
                hoverStyle = highlightRules[i];
                break;
            }
        }
        for (let i=0; i< selectRules.length; i++){
            if (selectRules[i].id === "Waze_Rule_173") {
                selectedStyle = selectRules[i];
                break;
            }
        }
        if (mcStyle) {
            if ($('#MCP').is(':checked')) {
                mcStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                mcStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity');
                hoverStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                hoverStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity')-0.1;
                selectedStyle.symbolizer.Point.fillColor = localStorage.getItem('CMC-Point');
                //selectedStyle.symbolizer.Point.fillOpacity = localStorage.getItem('CMC-MCPOpacity');
                W.map.getLayersByName("Map comments")[0].redraw();
            } else {
                mcStyle.symbolizer.Point.fillColor = '#ffffff';
                mcStyle.symbolizer.Point.fillOpacity = '0.3'
                hoverStyle.symbolizer.Point.fillColor = '#ffffff';
                hoverStyle.symbolizer.Point.fillOpacity = '0.3'
                selectedStyle.symbolizer.Point.fillColor = '#ffffff';
                selectedStyle.symbolizer.Point.fillOpacity = '0.3'
                W.map.getLayersByName("Map comments")[0].redraw();
            }
            if ($('#MCA').is(':checked')) {
                mcStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                mcStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                mcStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity');
                hoverStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                hoverStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                hoverStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity')-0.1;
                selectedStyle.symbolizer.Polygon.fillColor = localStorage.getItem('CMC-Area');
                selectedStyle.symbolizer.Polygon.strokeColor = localStorage.getItem('CMC-Area');
                //selectedStyle.symbolizer.Polygon.fillOpacity = localStorage.getItem('CMC-MCAOpacity')
                W.map.getLayersByName("Map comments")[0].redraw();
            } else {
                mcStyle.symbolizer.Polygon.fillColor = '#ffffff';
                mcStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                mcStyle.symbolizer.Polygon.fillOpacity = '0.3'
                hoverStyle.symbolizer.Polygon.fillColor = '#ffffff';
                hoverStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                hoverStyle.symbolizer.Polygon.fillOpacity = '0.3'
                selectedStyle.symbolizer.Polygon.fillColor = '#ffffff';
                selectedStyle.symbolizer.Polygon.strokeColor = '#ffffff';
                selectedStyle.symbolizer.Polygon.fillOpacity = '0.3'
                W.map.getLayersByName("Map comments")[0].redraw();
            }
        }
    }
    function Save() {
        localStorage.setItem('CMC-Point', $('#CMC-Point').val());
        localStorage.setItem('CMC-Area', $('#CMC-Area').val());
        localStorage.setItem('CMC-MCPOpacity', $('#MCP-Slider').val()/100);
        localStorage.setItem('CMC-MCAOpacity', $('#MCA-Slider').val()/100);
        ChangeColor();
        $('#CMC-colorWheelPoint')[0].value = localStorage.getItem('CMC-Point');
        $('#CMC-colorWheelArea')[0].value = localStorage.getItem('CMC-Area');
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
                                     .append($('<input data-toggle="tooltip">Colored MC Points</input>')
                                             .attr("id", "MCP")
                                             .attr("type", "checkbox")
                                             .attr("title", "Enable Color Highlighting for MC Points")
                                             .css("margin-bottom", "0px")
                                             .click(Save)
                                            )
                                     .append($("<br>"))
                                     .append($('<textarea rows="1" cols="10" maxlength="7">').attr("id", "CMC-Point")
                                             .attr("title", "Enter the HEX Color Code for the color you want Map Comments to appear. (Include the #)")
                                             .css("resize", "none")
                                             .css("width", "60px")
                                             .css("height", "25px")
                                            )
                                     .append($('<input id="CMC-colorWheelPoint" type="color" value="'+localStorage.getItem("CMC-Point")+'">')
                                             .css("margin-left", "5px")
                                             .css("top", "-7px")
                                             .css("position", "relative")
                                             .css("width", "25px")
                                            )
                                     .append($('<div class="rangeslider"><input type="range" min="1" max="100" value="10" class="myslider" id="MCP-Slider"></div>')
                                             .attr("title", "Set opacity level")
                                             .css("resize", "none")
                                             .css("width", "100px")
                                            )
                                     .append($("<br>"))
                                     .append($('<input data-toggle="tooltip">Colored MC Areas</input>')
                                             .attr("id", "MCA")
                                             .attr("type", "checkbox")
                                             //.attr("disabled", "true")
                                             .attr("title", "Enable Color Highlighting for MC Area Polygons")
                                             .css("margin-bottom", "0px")
                                             .click(Save)
                                            )
                                     .append($("<br>"))
                                     .append($('<textarea rows="1" cols="10" maxlength="7">').attr("id", "CMC-Area")
                                             .attr("title", "Enter the HEX Color Code for the color you want Map Comment Areas to appear. (Include the #)")
                                             .css("resize", "none")
                                             .css("width", "60px")
                                             .css("height", "25px")
                                            )
                                     .append($('<input id="CMC-colorWheelArea" type="color" value="'+localStorage.getItem("CMC-Area")+'">')
                                             .css("margin-left", "5px")
                                             .css("top", "-7px")
                                             .css("position", "relative")
                                             .css("width", "25px")
                                            )
                                     .append($('<div class="rangeslider"><input type="range" min="1" max="100" value="10" class="myslider" id="MCA-Slider"></div> ')
                                             .attr("title", "Set opacity level")
                                             .css("resize", "none")
                                             .css("width", "100px")
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
        $('#CMC-colorWheelPoint')[0].onchange = function() {
            $('#CMC-Point')[0].value = $('#CMC-colorWheelPoint')[0].value;
            Save();
        }
        $("#CMC-Point").val(localStorage.getItem('CMC-Point'));
        $('#MCP-Slider').val(localStorage.getItem("CMC-MCPOpacity"));
        $('#MCA-Slider').val(localStorage.getItem("CMC-MCAOpacity"));
        $('#CMC-colorWheelArea')[0].onchange = function() {
            $('#CMC-Area')[0].value = $('#CMC-colorWheelArea')[0].value;
            Save();
        }
        $('#MCP-Slider')[0].onchange = function() {
            Save();
        }
        $('#MCA-Slider')[0].onchange = function() {
            Save();
        }
        $("#CMC-Area").val(localStorage.getItem('CMC-Area'));
        ChangeColor();
        $('[data-toggle="tooltip"]').tooltip();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready) {
            console.log(GM_info.script.name, 'Initialized');
            init();
            WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, '<ul><li>Fixed WME Rules<ol style="list-style-type: lower-alpha; padding-bottom: 0;"><li>Latest WME update changed the MC rule numbers. (Fixed)</li></li></ul><br><br><br>', "https://greasyfork.org/en/scripts/380974-wme-colored-map-comments","https://www.waze.com/forum/viewtopic.php?f=819&t=279838");
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
