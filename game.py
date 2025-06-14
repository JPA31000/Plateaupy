from browser import document, html, timer, window
import random

# Phases avec nom complet et acronyme
phases = [
    {"name": "Faisabilité", "acronym": "FAI"},
    {"name": "Programme", "acronym": "PROG"},
    {"name": "Esquisse", "acronym": "ESQ"},
    {"name": "Avant-Projet Sommaire", "acronym": "APS"},
    {"name": "Avant-Projet Définitif", "acronym": "APD"},
    {"name": "Permis de Construire", "acronym": "PC"},
    {"name": "Phase PRO", "acronym": "PRO"},
    {"name": "Phase VISA", "acronym": "VISA"},
    {"name": "Exécution", "acronym": "EXE"},
    {"name": "Suivi de chantier", "acronym": "SUI"},
    {"name": "DOE (Dossier des Ouvrages Exécutés)", "acronym": "DOE"}
]

current_phase = 0
panels = []
fall_speed = 0.5

container = document["game-container"]
truck = document["truck"]
message_box = document["message"]

# Génère un panneau aléatoire
def spawn_panel():
    idx = random.randrange(len(phases))
    phase = phases[idx]
    el = html.DIV(phase["acronym"], Class="phase")
    el.attrs["title"] = phase["name"]
    left = 50 + random.random() * (container.offsetWidth - 100)
    el.style.left = f"{int(left)}px"
    container <= el
    panels.append({"element": el, "phaseIndex": idx})

# Initialise plusieurs panneaux
def spawn_initial_panels():
    for p in panels:
        p["element"].remove()
    panels.clear()
    for _ in range(3):
        spawn_panel()

# Boucle de jeu
def game_loop():
    for panel in panels.copy():
        top = int(panel["element"].style.top.strip('px') or -40)
        panel["element"].style.top = f"{top + fall_speed}px"

        # Collision
        a = truck.getBoundingClientRect()
        b = panel["element"].getBoundingClientRect()
        if not (a.top > b.bottom or a.bottom < b.top or a.right < b.left or a.left > b.right):
            handle_catch(panel)
        # Hors-jeu
        if top > container.offsetHeight:
            panel["element"].remove()
            panels.remove(panel)
            spawn_panel()

    timer.request_animation_frame(lambda _: game_loop())

# Capture
def handle_catch(panel):
    global current_phase
    if panel["phaseIndex"] == current_phase:
        current_phase += 1
        panel["element"].remove()
        panels.remove(panel)
        spawn_panel()
        hide_message()
        if current_phase == len(phases):
            window.alert(
                "Félicitations ! Vous avez complété toutes les phases."
            )
    else:
        show_message(f"Phase attendue : {phases[current_phase]['name']}")

# Messages
def show_message(text):
    message_box.text = text
    message_box.style.display = "block"
    timer.set_timeout(hide_message, 2000)

def hide_message():
    message_box.style.display = "none"

# Contrôles du camion
def on_keydown(ev):
    left = truck.offsetLeft
    if ev.key == 'ArrowLeft' and left > 0:
        left -= 15
    elif ev.key == 'ArrowRight' and left < container.offsetWidth - truck.offsetWidth:
        left += 15
    truck.style.left = f"{left}px"

# Lancement
spawn_initial_panels()
document.bind('keydown', on_keydown)
timer.request_animation_frame(lambda _: game_loop())
