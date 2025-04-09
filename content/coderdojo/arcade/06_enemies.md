+++
title = "6. Implementiamo il primo Nemico"
date = 2024-04-10
authors = [ "Riccardo Sacchetto" ]
description = "Feels lonely in here, huh? Scopriamo come implementare il nostro primo nemico!"
weight = 5

[extra]
category = [ "Arcade Library" ]
+++

Finalmente è giunta l'ora di alzare un po' l'asticella della difficoltà inserendo nel nostro platformer il primo nemico.

Come primo esempio giocattolo proveremo a implementare un semplicissimo mostro che, senza fare salti o evitare ostacoli, si muoverà avanti e indietro in un'area ben individuata.

Utilizzando l'approccio OOP di Python sarà facilissimo implementare una volta per tutte la logica utile ad animare questo NPC per poi utilizzarla tutte le volte che si rivelerà necessario. Fai solo attenzione a non rendere le tue mappe troppo affollate!

## Modifichiamo il nostro gioco

Parti dal codice del capitolo precedente e inserisci queste modifiche. Se fatichi a orientarti, in fondo alla pagina trovi l'esempio completo su cui puoi basarti per capire dove mettere le mani.

Iniziamo:

### Spiegazione passo per passo

1. Prima di tutto, creiamo una nuova classe `SimpleEnemy` dopo `AnimatedPlayerSprite`:

   ```python
   class SimpleEnemy(Sprite):
   ```
   
   - Come nel capitolo 4, iniziamo la nostra avventura definendo una nuova classe che estende `Sprite`; dopotutto, anche i nemici sono personaggi del gioco!

2. Aggiungiamo ora l'init di questa classe:

   ```python
    def __init__(self, enemy_image, min_x = 0, max_x = 0, center_y = 0, speed = 5):
        super().__init__(enemy_image)

        self.speed = speed
        self.min_x = min_x
        self.max_x = max_x

        self.center_x = (min_x + max_x)/2
        self.center_y = center_y
   ```
   
   - Come parametri riceviamo ben 5 variabili, `enemy_image`, `min_x`, `max_x`, `center_y` e `speed`:
     - La prima, che conterrà il percorso al PNG con la texture del nostro nemico, verrà trasferita immediatamente al costruttore della superclasse (`Sprite`, nel nostro caso) per utilizzarla
	 - Le altre quattro le salviamo all'interno di self per utilizzarle più tardi. A titolo di spoiler possiamo dire che `min_x` rappresenterà la minima coordinata X che il nemico portà raggiungere, `max_x` la massima, `center_y` l'altezza a cui il nostro nemico si troverà e `speed` la velocità con cui viaggerà tra le due X
   - Nota come vengono aggiornate le variabili `center_x` e `center_y` per individuare la posizione in cui verrà piazzato inizialmente il nemico. La Y sarà ovviamente il valore ricevuto in input e sarà fissa, mentre la X è calcolata come l'ascissa del punto medio tra il massimo e il minimo raggiungibile dall'NPC (se le formula non ti convince, è purtroppo arrivata l'ora di [ripassare geometria analitica](https://www.youmath.it/formulari/formulari-di-geometria-analitica/427-punto-medio-di-un-segmento.html#formule-coordinate-punto-medio))
   
3. Sempre nella nostra classe `SimpleEnemy` andiamo ora a definire la funzione di aggiornamento:

   ```python
    def update(self, delta_time: float = 1 / 60, *args, **kwargs) -> None:
        if self.center_x < self.min_x or self.center_x > self.max_x:
            self.speed *= -1

        self.center_x += self.speed
    ```
	
	- Questa funzione si occupa di spostare il nemico frame per frame e, dunque, di aggiornare la sua coordinata X
	- Per assicurarci che non esca dai limiti definiti poco fa (`min_x` e `max_x`) controlliamo se la sua posizione ne è al di fuori, ovvero se la sua X è minore del minimo (`self.center_x < self.min_x`) oppure (`or`) maggiore del massimo (`self.center_x > self.max_x`)
	  - Qualora questo sia il caso, procediamo immediatamente a moltiplicare per -1 (`*= -1`) la sua velocità (`self.speed`) in modo da invertire il suo moto
	- Una volta sicuri che spostare il nemico non lo faccia scappare dai bordi designati, procediamo a cambiarne la posizione sommando (`+=`) la velocità (`self.speed`) alla sua X (`self.center_x`)
	
4. Visto che queste poche righe di codice definiscono pienamente un generico nemico, procediamo ora ad aggiungerne uno ad una mappa; in fondo al ramo `if self.level == 0` della funzione `load_level`, ad esempio, aggiungiamo:

   ```python
   self.scene.add_sprite_list("Enemies")
   self.scene["Enemies"].append(
	   SimpleEnemy(":resources:/images/enemies/slimeBlock.png", 600, 1000, 256, 3)
   )
   ```
   
   - Prima di tutto, visto che la mappa appena caricata (`self.scene`) non prevede ancora la presenza di nemici, provvediamo ad aggiungere la lista di questi ultimi al suo interno (`add_sprite_list("Enemies")`)
   - In questa nuova lista (`self.scene["Enemies"]`) andiamo dunque ad aggiungere (`append`) una nuova istanza di nemico (`SimpleEnemy`) il cui costruttore deve ricevere il percorso a `slimeBlock.png` come `enemy_image`, `600` come `min_x`, `1000` come `max_x`, `256` come `center_y` e `3` come `speed`
   
5. Per ultimo - ma non per importanza - andiamo dunque a far sì che il gioco si ricordi di muovere mano a mano il nemico. In fondo a `update_hook` aggiungi:

   ```python
   self.scene["Enemies"].update()
   ```
   
   - Questa riga non fa altro che segnalare al gioco che, per ogni update della schermata, sarà necessario eseguire la funzione `update` di tutti gli elementi nella lista Enemies della mappa (ovverosia i nemici)

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


class SimpleEnemy(Sprite):
    def __init__(self, enemy_image, min_x = 0, max_x = 0, center_y = 0, speed = 5):
        super().__init__(enemy_image)

        self.speed = speed
        self.min_x = min_x
        self.max_x = max_x

        self.center_x = (min_x + max_x)/2
        self.center_y = center_y

    def update(self, delta_time: float = 1 / 60, *args, **kwargs) -> None:
        if self.center_x < self.min_x or self.center_x > self.max_x:
            self.speed *= -1

        self.center_x += self.speed


class Platformer(PlatformerBase):
    def __init__(self):
        super().__init__()

        self.collect_coin_sound = arcade.load_sound(":resources:sounds/coin1.wav")

        self.level = 0
        self.score = 0

        self.score_text = arcade.Text(f"Score: {self.score}", 30, 620)

    def load_level(self):
        if self.level == 0:
            map_name = ":resources:tiled_maps/map2_level_1.json"
            self.load_map(map_name)

            self.scene.add_sprite_list("Enemies")
            self.scene["Enemies"].append(
                SimpleEnemy(":resources:/images/enemies/slimeBlock.png", 600, 1000, 256, 3)
            )
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
            self.score += 1
            self.score_text.text = f"Score: {self.score}"

        if not self.scene["Coins"]:
            self.level += 1
            self.load_level()

        self.player_sprite.update_animation()
        self.scene["Enemies"].update()

    def draw_gui_hook(self):
        self.score_text.draw()


def main():
    Platformer.startup()


if __name__ == "__main__":
    main()
```

Se tutto è andato a buon fine, avviando il gioco dovresti riuscire a vedere il tuo primo nemico che si muove avanti e indietro per il livello.

## Challenge!

Se sei riuscito a programmare il tuo primo nemico, complimenti!

Prenditi ora un paio di minuti per rileggere il codice che hai scritto e per assicurarti di aver capito tutto, poi prova a fare queste personalizzazioni:

- Aggiungi un secondo nemico al livello;
- Crea una classe di nemico che si possa muovere in verticale (in su e in giù) e aggiungine un paio di istanze ad un livello;
- Fai in modo che toccare un nemico ti riporti all'inizio del livello (puoi resettare la posizione del player chiamando in ogni momento la funzione `self.reset_player_pos()` nella classe di gioco).
