i. Introducció

Aquest projecte és una versió ampliada del joc Memory, feta amb HTML, CSS, JavaScript i Canvas. Inclou dos modes de joc, rànquing, opcions configurables, 
cartes SVG programades manualment i un sistema complet de guardar i carregar partides

ii. Descripció del disseny del joc

El joc té dos modes:

    Mode 1: clàssic, sense temps, amb nombre de cartes i mida dels grups configurables.

    Mode 2: progressiu, amb dificultat que augmenta automàticament (més cartes, menys temps i penalitzacions més altes).

El menú principal dona accés a: jugar, opcions, carregar partida, rànquing i sortir.
Les cartes estan fetes en SVG programat, mantenint un estil coherent i escalable.
iii. Parts més rellevants de la implementació

El joc calcula la puntuació final de manera simple i coherent:
1. Comences amb 200 punts

A l’inici de cada partida tens una base fixa de 200 punts.
2. Cada error resta punts

Quan gires dues cartes i no coincideixen:

    En Mode 1 restes 25 punts.

    En Mode 2 restes una penalització que augmenta cada nivell

  3. El resultat final és el que queda després de restar totes les penalitzacions

No hi ha bonificacions extra:
el resultat final és simplement els punts que et queden quan acabes la partida o el nivell.
4. Si arribes a 0 punts, perds

Això evita que el jugador pugui continuar indefinidament fent errors.
5. En Mode 2, el rànquing guarda també el nivell assolit

Així es pot comparar millor el rendiment entre jugadors.

Com el joc es fa més difícil (explicació curta)

    Cada nivell té més cartes.

    Els grups són més grans (parelles → trios → quartets).

    Tens menys temps per completar el nivell.

    Les penalitzacions per error són més altes.

    Tot això passa automàticament quan puges de nivell.

Guardar i carregar: he implementat un sistema amb localStorage que permet guardar múltiples partides per àlies i carregar-les des d’una llista. 
    Per això he hagut de crear load.html i load.js.

    Nous HTML: he creat pantalles separades (options, ranking, load) per organitzar millor el joc i complir els requisits.


iv. Conclusions i problemes trobats

He tingut problemes amb:

    mantenir el mateix estil en totes les pantalles,

    adaptar el Mode 2 perquè no trenqués la lògica del joc,

    substituir PNG per SVG i assegurar que Canvas els carregués bé,

    reescriure el sistema de guardat perquè funcionés sense PHP.
