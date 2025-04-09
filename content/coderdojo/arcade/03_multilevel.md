+++
title = "3. Aggiungiamo più livelli"
date = 2024-04-05
authors = [ "Riccardo Sacchetto" ]
description = "Chi ha detto che il nostro gioco deve durare così poco? Scopriamo come aggiungere nuovi livelli!"
weight = 3

[extra]
category = [ "Arcade Library" ]
+++

Qual è lo scopo di raccogliere tutte quelle monete se non ci sono nuovi livelli in cui proseguire la nostra avventura?

In questo capitolo scopriremo come caricare una nuova mappa quando il giocatore ha raccolto tutte le monete della precedente. Nota che puoi mettere in pratica quello che leggi qui per passare al livello successivo quando raggiungi un cartello "Exit" o qualche altro obiettivo a tua scelta.

## Modifichiamo il nostro gioco

Parti dal codice del capitolo precedente e inserisci queste modifiche. Se fatichi a orientarti, in fondo alla pagina trovi l'esempio completo su cui puoi basarti per capire dove mettere le mani.

Iniziamo:

### Spiegazione passo per passo

1. All'interno della funzione `__init__` della tua classe di gioco dichiara una nuova variabile `self.level`:

   ```python
   self.level = 0
   ```
   - Al suo interno ci annoteremo a quale livello siamo arrivatri in modo da essere sicuri di caricare sempre la mappa corretta
   
2. Subito dopo la init aggiungi questa nuova funzione:

   ```python
    def load_level(self):
        if self.level == 0:
            map_name = ":resources:tiled_maps/map2_level_1.json"
            self.load_map(map_name)
        elif self.level == 1:
            map_name = ":resources:tiled_maps/map2_level_2.json"
            self.load_map(map_name)
   ```

   - Questa funzione appena `def`inita si occuperà di caricare una mappa diversa in funzione (ha!) del livello che abbiamo raggiunto
   - Nota infatti che al suo interno vengono eseguiti comandi diversi a seconda (`if`) che il livello sia 0 (`self.level == 0`) oppure (`elif`, contrattura di `else if`) 1
   - La tecnica utile a caricare efettivamente la mappa è la stessa vista nei passaggi precedenti: prima salviamo il percorso al file JSON della mappa in una variabile, poi utilizziamo questo per eseguire il caricamento vero e proprio con la funzione `load_map`

3. A questo punto, visto che abbiamo scritto una nuova logica di caricamento della mappa, rimuoviamo dalla funzione `setup_hook` le righe

   ```python
   map_name = ":resources:tiled_maps/map.json"
   self.load_map(map_name)
   ```
   
   e rimpiazziamole con
   
   ```python
   self.load_level()
   ```
   
   - Nota che all'avvio la variabile `self.level` sarà uguale a 0 (l'abbiamo definita così nella init!); di conseguenza, chiamare `load_level` nel setup hook non farà altro che caricare il livello 0
   - La ragione dell'utilizzo di questa funzione anche in questo punto risiede nel tentativo di scongiurare duplicati dello stesso codice, onde evitare di generare errori a fronte di una modifica futura (ad esempio, aggiornando solo una delle due parti dove questo compare)
   
4. Infine, non ci resta che aggiungere un paio di righe in fondo all'`update_hook`:

   ```python
   if not self.scene["Coins"]:
	   self.level += 1
	   self.load_level()
   ```
   
   - Qui diciamo al gioco che, se (`if`) non rimangono (`not`) più monete (`"Coins"`) nella scena (`self.scene`) dobbiamo:
     1. Incrementare di 1 (`+= 1`) il livello (`self.level`) per passare al successivo
	 2. Chiamare la funzione `load_level` per effettuare il caricamento vero e proprio di quest'ultimo
   - Nota che, qualora dovessimo esaurire tutte le monete anche nell'ultimo livello da noi sviluppato (nel nostro caso, il 2), `self.level` passerà al successivo, ma `load_level`, non avendo nessuna istruzione per questo caso, si limiterà a non fare nulla

## Riassumendo

Ecco il nostro esempio completo:

```python
import arcade
from platformer.platformer_base import PlatformerBase


class Platformer(PlatformerBase):
    def __init__(self):
        super().__init__()

        self.collect_coin_sound = arcade.load_sound(":resources:sounds/coin1.wav")

        self.level = 0

    def load_level(self):
        if self.level == 0:
            map_name = ":resources:tiled_maps/map2_level_1.json"
            self.load_map(map_name)
        elif self.level == 1:
            map_name = ":resources:tiled_maps/map2_level_2.json"
            self.load_map(map_name)

    def setup_hook(self):
        image_source = ":resources:images/animated_characters/female_adventurer/femaleAdventurer_idle.png"
        self.set_player(image_source)

        self.load_level()

    def update_hook(self):
        coin_hit_list = arcade.check_for_collision_with_list(
            self.player_sprite, self.scene["Coins"]
        )

        for coin in coin_hit_list:
            coin.remove_from_sprite_lists()
            arcade.play_sound(self.collect_coin_sound)

        if not self.scene["Coins"]:
            self.level += 1
            self.load_level()


def main():
    Platformer.startup()


if __name__ == "__main__":
    main()
```

Se tutto è andato a buon fine, dovresti riuscire a passare al livello successivo non appena raccolto tutte le monete del precedente.

## Challenge!

Se sei riuscito a introdurre il tuo secondo livello, complimenti!

Prenditi ora un paio di minuti per rileggere il codice che hai scritto e per assicurarti di aver capito tutto, poi prova a fare queste personalizzazioni:

- Aggiungi un terzo livello al gioco, caricando un'altra delle mappe disponibili tra gli asset predefiniti;
- Riproduci un suono quando il giocatore riesce a passare da un livello a un altro.
