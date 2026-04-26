addEventListener('load', function() {

    // --- JUGAR ---
    document.getElementById('play').addEventListener('click', function() {
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
    });

    // --- OPCIONS ---
    document.getElementById('options').addEventListener('click', function() {
        window.location.assign("./html/options.html");
    });

    // --- CARREGAR (VERSIÓ ANTIGA DEL PROFE, LA DEIXEM) ---
    document.getElementById('saves').addEventListener('click', function() {
        let to_load = localStorage.save;

        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error) ? JSON.stringify(json.save) : localStorage.save)
        .catch(err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }

        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    // --- RÀNQUING ---
    document.getElementById('ranking').addEventListener('click', function() {
        window.location.assign("./html/ranking.html");
    });

    // --- CARREGAR PARTIDA (SISTEMA NOU AMB MULTIPLES PARTIDES) ---
    document.getElementById('load').addEventListener('click', function() {
        window.location.assign("./html/load.html");
    });

    // --- SORTIR ---
    document.getElementById('exit').addEventListener('click', function() {
        console.warn("No es pot sortir!");
    });

});
