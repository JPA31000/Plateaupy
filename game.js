// Définition des phases avec nom complet et acronyme
const phases = [
  { name: "Faisabilité", acronym: "FAI" },
  { name: "Programme", acronym: "PROG" },
  { name: "Esquisse", acronym: "ESQ" },
  { name: "Avant-Projet Sommaire", acronym: "APS" },
  { name: "Avant-Projet Définitif", acronym: "APD" },
  { name: "Permis de Construire", acronym: "PC" },
  { name: "Phase PRO", acronym: "PRO" },
  { name: "Phase VISA", acronym: "VISA" },
  { name: "Exécution", acronym: "EXE" },
  { name: "Suivi de chantier", acronym: "SUI" },
  { name: "DOE (Dossier des Ouvrages Exécutés)", acronym: "DOE" }
];

let currentPhase = 0;
let score = 0;
const container = document.getElementById("game-container");
const truck = document.getElementById("truck");
const messageBox = document.getElementById("message");
const scoreBox = document.getElementById("score");
let panels = [];
const fallSpeed = 0.5; // vitesse de chute plus lente

// Initialisation du jeu
window.addEventListener("load", () => {
  spawnInitialPanels();
  gameLoop();
  setupControls();
});

// Création des panneaux initiaux
function spawnInitialPanels() {
  panels.forEach(p => p.element.remove());
  panels = [];
  for (let i = 0; i < 3; i++) spawnPanel();
}

// Génère un panneau de phase aléatoire
function spawnPanel() {
  const idx = Math.floor(Math.random() * phases.length);
  const phase = phases[idx];
  const el = document.createElement("div");
  el.className = "phase";
  el.textContent = phase.acronym;
  el.title = phase.name;
  el.style.left = `${50 + Math.random() * (container.clientWidth - 100)}px`;
  container.appendChild(el);
  panels.push({ element: el, phaseIndex: idx });
}

// Boucle principale du jeu
function gameLoop() {
  panels.forEach((panel, i) => {
    // Mouvement vers le bas
    panel.element.style.top = (panel.element.offsetTop + fallSpeed) + "px";

    // Détection de collision avec le camion
    if (isColliding(truck, panel.element)) {
      handleCatch(panel, i);
    }

    // Recyclage si hors du conteneur
    if (panel.element.offsetTop > container.clientHeight) {
      panel.element.remove();
      panels.splice(i, 1);
      spawnPanel();
    }
  });
  requestAnimationFrame(gameLoop);
}

// Gestion de la capture d'un panneau
function handleCatch(panel, index) {
  if (panel.phaseIndex === currentPhase) {
    currentPhase++;
    score++;
    if (scoreBox) {
      scoreBox.textContent = `Score : ${score}`;
    }
    panel.element.remove();
    panels.splice(index, 1);
    spawnPanel();
    hideMessage();
    if (currentPhase === phases.length) {
      setTimeout(() => alert(`Félicitations ! Vous avez complété toutes les phases.\nScore : ${score}`), 100);
    }
  } else {
    showMessage(`Phase attendue : ${phases[currentPhase].name}`);
  }
}

// Affichage du message pédagogique
function showMessage(text) {
  messageBox.textContent = text;
  messageBox.style.display = "block";
  setTimeout(hideMessage, 2000);
}

function hideMessage() {
  messageBox.style.display = "none";
}

// Configuration des contrôles clavier pour déplacer le camion
function setupControls() {
  document.addEventListener("keydown", e => {
    let left = truck.offsetLeft;
    if (e.key === "ArrowLeft" && left > 0) {
      left -= 15;
    } else if (e.key === "ArrowRight" && left < container.clientWidth - truck.clientWidth) {
      left += 15;
    }
    truck.style.left = `${left}px`;
  });
}

// Détection de collision AABB
function isColliding(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.right < r2.left || r1.left > r2.right);
}
