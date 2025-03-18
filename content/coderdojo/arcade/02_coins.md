+++
title = "2. Raccogliamo le Monete"
date = 2024-01-06
authors = [ "Riccardo Sacchetto" ]
description = "Finito con il boilerplate? Iniziamo ad aggiungere la primissima logica del nostro gioco"
weight = 2

[extra]
category = [ "Arcade Library" ]
hidden = true
+++

Ora è il momento di aggiungere la primissima logica al nostro gioco, scrivendo il codice necessario a far "raccogliere" le monete al giocatore.

{{ resize_image(path="/images/coderdojo/arcade/step_01.png", width=600, height=0, op="fit_width") }}

## Modifichiamo il nostro gioco

Parti dal codice del capitolo precedente e inserisci queste modifiche. Se fatichi a orientarti, in fondo alla pagina trovi l'esempio completo su cui puoi basarti per capire dove mettere le mani.

Iniziamo:

### Spiegazione passo per passo

1. Nella primissima riga del tuo programma, prima ancora di `from ...`, inserisci questa istruzione:

   ```python
   import arcade
   ```
   - Questo comando ci mette a disposizione delle importantissime funzioni di base che semplificheranno enormemente il nostro lavoro nei prossimi minuti
   
2. Subito dopo la riga `class Platformer...` aggiungi questa funzione:

   ```python
   def __init__(self):
     super().__init__()

     self.collect_coin_sound = arcade.load_sound(":resources:sounds/coin1.wav")
   ```
   - Qui non stiamo facendo altro che `def`inire una nuova funzione `__init__` all'interno del nostro gioco (che, come vedevamo, è interamente descritto dalla `class`e Platformer)
   - La `__init__` è la funzione che si occupa di caricare in RAM tutti gli asset che torneranno utili al gioco
   - Qui, in effetti, stiamo proprio salvando nel gioco (in `self`) il file WAV con il suono che dovrà essere riprodotto ogni volta che raccoglieremo una moneta, dandogli il nome `collect_coin_sound`
   - La riga `super().__init__()` nasconde un concetto un pochino avanzato e ha a che fare con la necessità di assicurarsi che altre risorse importanti per il gioco siano caricate con successo in RAM

3. Immediatamente dopo la `def`inizione del `setup_hook`, dopo la riga `self.load_map(map_name)`, aggiungiamo questa nuova funzione:

   ```python
   def update_hook(self):
     coin_hit_list = arcade.check_for_collision_with_list(
       self.player_sprite, self.scene["Coins"]
     )

     for coin in coin_hit_list:
       coin.remove_from_sprite_lists()
       arcade.play_sound(self.collect_coin_sound)
   ```
   - Questa nuova funzione gancio (`hook`) ha a che fare con la fase di "update" del gioco, ovvero quella che viene eseguita ogni volta che il computer deve aggiorare l'immagine mostrata sul display
   - Idealmente, questa funzione che stiamo per definire verrà eseguita del nostro computer 60 volte al secondo (cfr. 60 FPS) e potrà essere da noi sfruttata per implementare le meccaniche di gioco
   - In questo caso specifico, sfrutteremo questo `update_hook` per controllare se nell'ultimo ~1/60 di secondo il giocatore ha toccato una moneta e, in tal caso, rimuoverla dallo schermo per poi riprodurre il suono di cattura
     - Per fare ciò, chiediamo ad `arcade` di controllare se il giocatore (`self.player_sprite`) ha fatto collisione (`check_for_collision_with_list`) con uno degli elementi "Moneta" (`["Coins"]`) della scena (`self.scene`)
	 - Qualora ciò dovesse essere accaduto, `arcade` provvederà a fornirci una lista di monete "prese" che andremo a memorizzare nella variabile `coin_hit_list`
	 - Dopodichè, per ogni (`for`) moneta (`coin`) nella (`in`) lista delle monete prese (`coin_hit_list`), andremo a:
	   - Rimuovere dalla scena (`remove_from_sprite_lists`) lo sprite della moneta presa (`coin`) in modo da essere sicuri che non sia più visibile a schermo
	   - Chiedere ad `arcade` di riprodurre (`play_sound`) il suono della moneta che viene raccolta dal protagonista (`self.collect_coin_sound`)


## Riassumendo

Ecco il nostro esempio completo:

```python
import arcade
from platformer.platformer_base import PlatformerBase


class Platformer(PlatformerBase):
    def __init__(self):
        super().__init__()

        self.collect_coin_sound = arcade.load_sound(":resources:sounds/coin1.wav")

    def setup_hook(self):
        image_source = ":resources:images/animated_characters/female_adventurer/femaleAdventurer_idle.png"
        self.set_player(image_source)

        map_name = ":resources:tiled_maps/map.json"
        self.load_map(map_name)

    def update_hook(self):
        coin_hit_list = arcade.check_for_collision_with_list(
            self.player_sprite, self.scene["Coins"]
        )

        for coin in coin_hit_list:
            coin.remove_from_sprite_lists()
            arcade.play_sound(self.collect_coin_sound)


def main():
    Platformer.startup()


if __name__ == "__main__":
    main()
```

Se tutto è andato a buon fine, dovresti riuscire a raccogliere le monete che prima potevi solo limitarti a trapassare, sentendo di volta in volta il suono importato.

## Challenge!

Se sei riuscito a introdurre la prima logica nel tuo videogioco, complimenti!

Prenditi ora un paio di minuti per rileggere il codice che hai scritto e per assicurarti di aver capito tutto, poi prova a fare queste personalizzazioni:

- Cambia il suono che viene riprodotto quando raccogli una moneta
- Fai in modo che il suono venga riprodotto due volte per moneta raccolta (o, magari, che vengano riprodotti due suoni diversi per volta)
