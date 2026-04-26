document.addEventListener("DOMContentLoaded", () => {

    let llista = document.getElementById("llista");

    let totes = localStorage.partides ? JSON.parse(localStorage.partides) : {};

    if (Object.keys(totes).length === 0) {
        llista.innerHTML = "<li>No hi ha partides guardades</li>";
        return;
    }

    Object.keys(totes).forEach(alias => {

        let li = document.createElement("li");
        li.innerHTML = `
            <button data-alias="${alias}">
                Carregar partida de <b>${alias}</b>
            </button>
        `;

        li.querySelector("button").addEventListener("click", () => {
            sessionStorage.load = JSON.stringify(totes[alias]);
            window.location.assign("./game.html");
        });

        llista.appendChild(li);
    });
});
