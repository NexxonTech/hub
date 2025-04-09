+++
title = "5. Aggiungiamo l'HUD"
date = 2024-04-09
authors = [ "Riccardo Sacchetto" ]
description = "Quanti punti siamo riusciti ad accumulare? Scompriamo come mostrarlo a schermo!"
weight = 5

[extra]
category = [ "Arcade Library" ]
+++

Se vogliamo che i nostri giocatori inizino a segnare qualche record mondiale con il nostro platformer non possiamo certo dimenticarci di aggiungere un contatore di punteggio.

In questo capitolo vedremo come aggiungere una semplicissima HUD che mostri il numero di monete raccolte fin'ora. Con la stessa tecnica sarà poi possibile creare schermate di Game Over da mostrare quando il player tocca uno Sprite in grado di danneggiarlo.

## Modifichiamo il nostro gioco

Parti dal codice del capitolo precedente e inserisci queste modifiche. Se fatichi a orientarti, in fondo alla pagina trovi l'esempio completo su cui puoi basarti per capire dove mettere le mani.

Iniziamo:

### Spiegazione passo per passo

1. Prima di tutto, aggiungiamo due nuove variabili nella init del nostro gioco:

   ```python
   self.score = 0
   self.score_text = arcade.Text(f"Score: {self.score}", 30, 620)
   ```
   - Queste contengono, rispettivamente, il numero di punti accumulati e il testo con cui mostrarli a schermo.
   - Quest'ultimo, in particolare, è scritto utilizzando una "format string", una stringa al cui interno, al posto delle parentesi grafe, verrà sostituito il valore della variabile in esse specificato, in questo caso `self.score`, il punteggio. All'inizio, ad esempio, `self.score_text` conterrà "Score: 0"

2. In secundis, in fondo al ciclo `for coin in coin_hit_list` nell'`update_hook` andiamo ad aggiungere le righe:

   ```python
   self.score += 1
   self.score_text.text = f"Score: {self.score}"
   ```
   
   - In questo modo, ogni volta che il player tocca una moneta andremo ad incrementare di 1 il punteggio e ad aggiornare il testo da mostrare a schermo con questo nuovo valore
   - Per ripassare il funzionamento dell'`update_hook`, ritorna al capitolo 2
   
3. Infine, aggiungiamo una nuova funzione alla classe di gioco:

   ```python
    def draw_gui_hook(self):
        self.score_text.draw()
    ```
	
	- Questo semplicissimo hook verrà chiamato ogni volta che dovrà essere aggiornata l'HUD
	- Al suo interno, specifichiamo semplicemente che deve essere disegnato (`draw()`), ovvero mostrato, il testo con il punteggio generato poco fa (`self.score_text`)

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

        self.collect_coin_sound = arcade.load_sound(":resources:sounds/coin1.wav")

        self.level = 0
        self.score = 0

        self.score_text = arcade.Text(f"Score: {self.score}", 30, 620)

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
            self.score += 1
            self.score_text.text = f"Score: {self.score}"

        if not self.scene["Coins"]:
            self.level += 1
            self.load_level()

        self.player_sprite.update_animation()

    def draw_gui_hook(self):
        self.score_text.draw()


def main():
    Platformer.startup()


if __name__ == "__main__":
    main()
```

Se tutto è andato a buon fine, avviando il gioco dovresti riuscire a vedere il punteggio aggiornato in tempo reale mano a mano che raccogli le monete.

## Challenge!

Se sei riuscito a programmare la tua prima HUD, complimenti!

Prenditi ora un paio di minuti per rileggere il codice che hai scritto e per assicurarti di aver capito tutto, poi prova a fare queste personalizzazioni:

- Fai in modo che il punteggio non aumenti di uno per ogni moneta, ma di 75;
- Fai in modo che il punteggio venga azzerato di livello in livello;
- Fai in modo che le monete raccolte nel livello 2 valgano (in punti) il doppio di quelle raccolte nel livello 1 (e così via).
