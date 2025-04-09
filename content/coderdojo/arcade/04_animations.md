+++
title = "4. Animiamo il nostro Player"
date = 2024-04-05
authors = [ "Riccardo Sacchetto" ]
description = "Sì, in effetti fa un po' strano guardarlo slittare. Vediamo come sistemarlo."
weight = 4

[extra]
category = [ "Arcade Library" ]
+++

Non si può certo dire che il nostro gioco non stia venendo bene; lo sprite del giocatore che slitta quando lo muovi, però, non è esattamente quello che si potrebbe definire un marchio di qualità.

Grazie tuttavia ai costrutti fondamentali che abbiamo visto fino ad ora possiamo provare a mettere assieme una bella animazione che dovrebbe aiutarci a risolvere questa incresciosa situazione.

Prima di tutto, facciamoci un'idea di quello che voremmo accadesse: dando un'occhiata alle risorse nello Starterpack è possibile notare che, per ogni `animated_character`, sono a disposizione 8 "pezzi" di una animazione di camminata,  oltre a un'immagine "idle" (quella utilizzata fino ad ora) e una "jumping"; il nostro obbiettivo sarebbe proprio sostituire l'immagine idle con i vari "frame" della camminata, facendoli succedere uno dopo l'altro mentre teniamo premuto A e D.

Per realizzare questo nostro piano andremo a creare una nuova classe `AnimatedPlayerSprite`, che estende `acrade.Sprite` e contiene un po' di logica utile ad animare il nostro personaggio.

## Modifichiamo il nostro gioco

Parti dal codice del capitolo precedente e inserisci queste modifiche. Se fatichi a orientarti, in fondo alla pagina trovi l'esempio completo su cui puoi basarti per capire dove mettere le mani.

Iniziamo:

### Spiegazione passo per passo

1. Nella primissima riga del tuo programma, dopo `import arcade`, inserisci questa istruzione:

   ```python
   from arcade import Sprite, TextureAnimation, TextureKeyframe
   ```

   - Questo comando ci mette a disposizione delle classi di base (`Sprite`, `TextureAnimation` e `TextureKeyframe`) che ci torneranno utili nei prossimi minuti
   
2. Prima di `class Platformer(PlatformerBase)` aggiungi una nuova classe:

   ```python
   class AnimatedPlayerSprite(Sprite):
   ```
   
   - Questa nuova classe conterrà tutte le parti e le funzioni del nostro player "avanzato", ovvero in grado di muoversi.
   
3. All'interno di questa nuova classe, ovvero su una nuova riga immediatamente successiva e indentata di un livello, aggiungi il costruttore:

   ```python
    def __init__(self, player_textures_prefix, keyframe_duration = 60):
        super().__init__()

        self.direction = 1
        self.current_tick = 0
        self.idle_texture = arcade.load_texture(player_textures_prefix + "_idle.png")
        self.jumping_texture = arcade.load_texture(player_textures_prefix + "_jump.png")

        keyframes = [TextureKeyframe(arcade.load_texture(player_textures_prefix + "_walk" + str(frame_id) + ".png"), keyframe_duration) for frame_id in range(0, 8)]
        self.animation = TextureAnimation(keyframes)

        self.update_animation()
	```
	
	- Qui andiamo prima di tutto a definire due variabili che ci risulteranno fondamentali a momenti,
	  - `self.direction` rappresenta, per l'appunto, la direzione del player; quando è `1` vuol dire che sta guardando verso destra, quando è `-1`, viceversa;
	  - `self.current_tick` si ricorda quanto tempo (in secondi) è passato da quando l'animazione di movimento è iniziata. `0` significa che non è ancora partita, ma incrementeremo questo numero fra pochissimo.
	- Preparate le variabili andiamo a caricare in RAM le prime due texture del nostro Sprite (`idle_texture` e `jumping_texture`). Nota come, onde evitare di cucire la nostra classe attorno a un personaggio particolare, andiamo a "costruire" il percorso ai PNG partendo da un prefisso (`player_textures_prefix`) che riceviamo come parametro; poi vedremo bene da dove arriva;
	- A questo punto andiamo a costruire una lista di `keyframes`, inserendoci, per ogni (`for`) numero (`frame_id`) da 0 a 7 (`range(0, 8)`) il `TextureKeyframe` con al suo interno la texture "walk" realizzata (`arcade.load_texture`) partendo dal PNG numerato `frame_id` e con durata pari al valore (`keyframe_duration`) ricevuto come parametro del costruttore (di default pari a 60ms);
	- Da questa lista procediamo quindi a creare l'intera animazione (`self.animation`) e lanciamo il primo aggiornamento (`self.update_animation()`, di cui studieremo immediatamente i dettagli).
	
4. Subito dopo il costruttore, andiamo a `def`inire un funzione `update_animation`, che andremo a chiamare nell'`update_hook` del gioco:

   ```python
   def update_animation(self, delta_time = 1 / 60, *args, **kwargs):
	   if self.change_y == 0:
           if self.change_x != 0:
               self.current_tick += delta_time

               if (self.change_x * self.direction) < 0:
                   self.direction *= -1

               curr_keyframe = self.animation.get_keyframe(self.current_tick, True)
               self.texture = curr_keyframe[1].texture if self.direction == 1 else curr_keyframe[1].texture.flip_horizontally()
           else:
               self.current_tick = 0
               self.texture = self.idle_texture if self.direction == 1 else self.idle_texture.flip_horizontally()
       else:
           self.texture = self.jumping_texture if self.direction == 1 else self.jumping_texture.flip_horizontally()
   ```
   
   - Lo scopo di questa funzione è, ogni volta che un frame del gioco viene disegnato sullo schermo, caricare la texture giusta per quello che sta facendo in questo momento il giocatorel
   - Per questo, se (`if`) la sua velocità verticale (`self.change_y`) è 0 (ovvero NON sta saltando/cadendo):
     - Se la sua velocità orizzontale (`self.change_x`) NON è 0 (ovvero si sta muovendo a destra/sinistra):
	   - Incrementiamo (`+=`) il tempo da quando l'animazione è iniziata (`self.current_tick`) di un numero pari al tempo trascorso dall'ultima volta che Python ha aggiornato la schermata di gioco (`delta_time`);
	   - A questo punto, se il prodotto tra la velocità orizzontale (`self.change_x`) e la variabile che memorizza la direzione (`self.direction`) è un numero negativo (`< 0`), ovvero la direzione in cui ha iniziato a muoversi il giocatore (una quantità positiva o negativa sull'asse delle ascisse) ha segno discordante rispetto a quella che ricordavamo noi, invertiamo la direzione da noi memorizzata;
	   - Recuperiamo dall'animazione (`self.animation`) il keyframe (`get_keyframe`) adatto da mostrare in questo momento (`self.current_tick`), ricordandoci che l'animazione è autorizzata a continuare in loop (`True`)
	   - Configuriamo come texture corrente (`self.texture`) quella del keyframe (`curr_keyframe[1]`) sse la direzione (`self.direction`) è pari a 1; in caso contrario utilizziamo la sua versione specchiata (`.flip_horizzontally()`)
     - Se la sua velocità orizzontale (`self.change_x`) è 0 (ovvero NON si sta muovendo a destra/sinistra):
	   - Resettiamo la durata dell'animazione di movimento (`self.current_tick`) a 0
	   - Configuriamo come texture corrente (`self.texture`) quella idle (`self.idle_texture`) sse la direzione (`self.direction`) è pari a 1; in caso contrario utilizziamo la sua versione specchiata (`.flip_horizzontally()`)
   - Se invece la sua velocità verticale (`self.change_y`) NON è 0 (ovvero sta saltando/cadendo):
     - Configuriamo come texture corrente (`self.texture`) quella jumping (`self.jumping_texture`) sse la direzione (`self.direction`) è pari a 1; in caso contrario utilizziamo la sua versione specchiata (`.flip_horizzontally()`)
	 
5. Ora non ci resta che iniziare ad utilizzare questo `AnimatedPlayerSprite`; modifichiamo il `setup_hook` sostituendo le sue prime due riche con:

   ```python
   player_textures_prefix = ":resources:images/animated_characters/female_adventurer/femaleAdventurer"
   self.set_player(AnimatedPlayerSprite(player_textures_prefix))
   ```
   
   - Qui andiamo a definire qual'è il prefisso specifico (`player_textures_prefix`) dei PNG del personaggio che ci interessa (in questo caso, `female_adventurer`), la variabile che avevamo visto utilizzata nel costruttore di `AnimatedPlayerSprite`;
   - Dopodichè andiamo a settare come player del gioco una istanza di `AnimatedPlayerSprite` costruendo utilizzando il prefisso appena definito

6. Modifichiamo anche l'`update_hook` del gioco per ricordargli di aggiornare l'animazione; in fondo alla sua definizione aggiungiamo la riga:

   ```python
   self.player_sprite.update_animation()
   ```

   - Questa riga non fa altro che invocare effettivamente la funzione `update_animation` che avevamo definito (e commentato) al passo 4 ogni volta che Python aggiorna la nostra schermata di gioco

## Riassumendo

Ecco il nostro esempio completo:

```python
import arcade
from arcade import Sprite, TextureAnimation, TextureKeyframe

from platformer.platformer_base import PlatformerBase


class AnimatedPlayerSprite(Sprite):
    def __init__(self, player_textures_prefix, keyframe_duration = 60):
        super().__init__()

        self.direction = 1
        self.current_tick = 0
        self.idle_texture = arcade.load_texture(player_textures_prefix + "_idle.png")
        self.jumping_texture = arcade.load_texture(player_textures_prefix + "_jump.png")

        keyframes = [TextureKeyframe(arcade.load_texture(player_textures_prefix + "_walk" + str(frame_id) + ".png"), keyframe_duration) for frame_id in range(0, 8)]
        self.animation = TextureAnimation(keyframes)

        self.update_animation()

    def update_animation(self, delta_time = 1 / 60, *args, **kwargs):
        if self.change_y == 0:
            if self.change_x != 0:
                self.current_tick += delta_time

                if (self.change_x * self.direction) < 0:
                    self.direction *= -1
                    self.reverse()

                curr_keyframe = self.animation.get_keyframe(self.current_tick, True)
                self.texture = curr_keyframe[1].texture if self.direction == 1 else curr_keyframe[1].texture.flip_horizontally()
            else:
                self.current_tick = 0
                self.texture = self.idle_texture if self.direction == 1 else self.idle_texture.flip_horizontally()
        else:
            self.texture = self.jumping_texture if self.direction == 1 else self.jumping_texture.flip_horizontally()


class Platformer(PlatformerBase):
    def __init__(self):
        super().__init__()

        self.score = 0
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
        player_textures_prefix = ":resources:images/animated_characters/female_adventurer/femaleAdventurer"
        self.set_player(AnimatedPlayerSprite(player_textures_prefix))

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

        self.player_sprite.update_animation()


def main():
    Platformer.startup()


if __name__ == "__main__":
    main()
```

Se tutto è andato a buon fine, avviando il gioco dovresti riuscire a vedere l'animazione in tutto il suo splendore.

## Challenge!

Se sei riuscito a programmare la tua prima animazione, complimenti!

Prenditi ora un paio di minuti per rileggere il codice che hai scritto e per assicurarti di aver capito tutto, poi prova a fare queste personalizzazioni:

- Cambia il personaggio da `female_adventurer` a `male_adventurer`; non dovresti dover modificare più di quattro caratteri (di numero!);
- Velocizza (o rallenta) l'animazione, come se il tuo personaggio camminasse più veloce (o lento).
