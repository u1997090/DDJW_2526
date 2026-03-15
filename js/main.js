import $ from "../library/jquery-4.0.0.slim.module.min.js";

$(document).ready(function() {

    $("#play").on("click", function() {
        let alias = prompt("Introdueix el teu àlies:");
        console.log("Àlies del jugador:", alias);

        window.location.assign("html/game.html");
    });

    $("#options").on("click", function() {
        console.error("Opció no implementada");
    });

    $("#saves").on("click", function() {
        console.error("Opció no implementada");
    });

    $("#exit").on("click", function() {
        console.warn("No es pot sortir!");
    });

});
