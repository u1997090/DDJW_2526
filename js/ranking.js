document.addEventListener("DOMContentLoaded", function() {

    // Llegir ranking
    let ranking = localStorage.ranking ? JSON.parse(localStorage.ranking) : [];

    // Ordenar de major a menor
    ranking.sort((a, b) => b.score - a.score);

    // Agafar només top 10
    ranking = ranking.slice(0, 10);

    let tbody = document.querySelector("#rankingTable tbody");

    if (ranking.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Encara no hi ha puntuacions</td></tr>`;
        return;
    }

    ranking.forEach((entry, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.score}</td>
            <td>${entry.level}</td>
            <td>${entry.date}</td>
        `;

        tbody.appendChild(row);
    });

});
