+++
title = "1. Introduzione ad Arcade Library"
date = 2024-01-06
authors = [ "Riccardo Sacchetto" ]
description = "Mai sentito parlare della libreria Arcade? Allora inizia da qui per diventare un vero esperto!"
weight = 1

[extra]
category = [ "Arcade Library" ]
hidden = true
+++

👾 **Benvenuti nel mondo dei videogiochi con Python e Arcade!** 🎮🐍

Ciao Ninja del CoderDojo! 🥷✨

Siete pronti a creare il vostro primo **videogioco platformer** usando **Python** e la libreria **Arcade**? 🚀 Se avete già messo le mani sul codice Python e sapete cos’è una variabile, un ciclo `for` e magari anche una classe, allora siete nel posto giusto!

In questo tutorial, esploreremo insieme:

- **Come funziona un platformer** (avete presente Super Mario, vero?)
- **La sintassi di Python** applicata ai videogiochi
- **I concetti base della programmazione orientata agli oggetti (OOP)**, ma senza farci esplodere il cervello!

Passo dopo passo, attraverso brevi spiegazioni e piccole challenge, costruiremo un semplice gioco dove il nostro personaggio potrà **saltare, correre e superare ostacoli**. E alla fine, avrete un gioco funzionante che potrete personalizzare a vostro piacimento!

Pronti a premere **Start** e cominciare questa avventura?

## Installazione

Prima di iniziare a creare il nostro videogioco, dobbiamo assicurarci che tutto sia pronto. I passaggi qui sotto ti guideranno nella configurazione del tuo futuro ambiente di lavoro su un computer Windows.

1. **Apri il terminale di Windows**

   - Premi **Win + R**, digita `cmd` e premi **Invio**.
   - Oppure cerca **"Prompt dei comandi"** nella barra di ricerca di Windows.

2. **Assicurati di avere Python installato**

   - Nel terminale, digita:
     ```cmd
     python --version
     ```
   - Se vedi `Python 3.10.11`, sei a posto!
   - Se ricevi un errore, vai sulla pagina di download di Python ([https://www.python.org/downloads/release/python-31011/](https://www.python.org/downloads/release/python-31011/)) e scarica l’installer per Windows a 64bit. Durante l’installazione, assicurati di selezionare **"Add Python to PATH"**.

3. **Installa la libreria Arcade**

   - Sempre nel terminale, digita:
     ```cmd
     pip install arcade
     ```
   - Se tutto va bene, vedrai scorrere una serie di righe che indicano che Arcade è stato scaricato e installato correttamente.
   
4. **Scarica Tiled Map Editor**

   - Programmare è divertente, ma avere a disposizione un tool che ci assiste nel disegnare le mappe è un aiuto non da poco: recati sulla [pagina Itch di Tiled Map Editor](https://thorbjorn.itch.io/tiled) e fai click su "Download Now" per scaricare l'installer di questo pratico strumento
   
   - Installa il programma sul tuo PC seguendo tutti i passaggi che ti vengono proposti aprendo il file scaricato nel passaggio immediatamente precedente
   
5. **Scarica lo StarterPack**

   - Visita la pagina all'indirizzo [https://311to.site/79](https://311to.site/79) per scaricare lo StarterPack che ti permetterà di iniziare a lavorare al tuo videogioco senza preoccuparti delle meccaniche più avanzate e degli asset (come tiles, sprites e suoni)
   
   - Una volta concluso il download troverai sul tuo computer un file ZIP: estrai il suo contenuto in una cartella a piacere (ad esempio, creando una nuova directory `CoderDojo` sul Desktop e copiandoci al suo interno la cartella `platformer` che trovi nello StarterPack)

Ora sei pronto per iniziare a programmare il tuo videogioco con **Arcade**! Se qualcosa non ha funzionato, non ti preoccupare: chiedi pure ai mentor del CoderDojo, sono qui per aiutarti. 🚀

## Carichiamo la nostra prima Mappa

Iniziamo ora con il **primo passo** del nostro viaggio nel mondo dei platformer con **Arcade**.

In questo esempio impareremo come caricare la nostra prima **Mappa**, gettando le fondamenta della creazione di un Platformer.

### Spiegazione passo per passo

Per iniziare, apri un nuovo file di IDLE e scrivi questo codice:

1. 
   ```python
   from platformer.platformer_base import PlatformerBase
   ```
   - Prima di tutto importiamo **PlatformerBase**, il pacchetto che contiene e che ci mette immediatamente a disposizone tutte le meccaniche base del nostro gioco. Per ora non preoccuparti di lui, (molto) più avanti lo apriremo per scoprire come scendere nei dettagli implementativi più complicati.

2. 
   ```python
   class Platformer(PlatformerBase):
	 def setup_hook(self):
       image_source = ":resources:images/animated_characters/female_adventurer/femaleAdventurer_idle.png"
       self.set_player(image_source)

       map_name = ":resources:tiled_maps/map.json"
       self.load_map(map_name)
   ```
   - Qui spieghiamo al computer tutto quello che deve sapere per avviare il nostro gioco; più nello specifico:
     - Definiamo una `class`, un insieme di funzioni, di nome `Platformer` (il nome del nostro gioco, che potremo modificare come più ci aggrada) che si basa su `PlatformerBase`;
	 - Al suo interno `def`iniamo la funzione `setup_hook`, ovvero colei che si aggancia alla fase di `setup` del nostro gioco per configurarne gli aspetti più fondamentali;
	 - Questa riceve un riferimento a `self`, ovvero lo spazio nella memoria del computer che contiene tutte le informazioni sul gioco
	 - Al suo interno proseguiamo a:
	   - Salvare nella variabile `image_source` il percorso al PNG con lo Sprite del nostro protagonista, memorizzandolo successivamente nel gioco (`self`) specificandolo come parametro del comando `set_player`
	   - Salvare nella variabile `map_name` il percorso al file che descrive nella sua interezza la mappa del nostro primo livello, istruendo poi il gioco (sempre `self`) a caricarla attraverso il suo comando `load_map`

3. 
   ```python
   def main():
     Platformer.startup()
   ```
   - Qui `def`iniamo la funzione principale (`main`) del nostro programma, ovvero la primissima cosa che il computer deve fare a fronte di una Run
   - All'interno di questa funzione ci limitiamo a far partire (comando `startup`) il gioco che abbiamo appena finito di descrivere (`Platformer`)

4. 
   ```python
   if __name__ == "__main__":
     main()
   ```
   - Tediosa burocrazia pythonista, questa coppia di righe dicono semplicemente al computer di avvire la funzione `main` all'avvio del programma

### Review

Se tutto è andato bene, questo è il codice che dovresti avere ora:

```python
from platformer.platformer_base import PlatformerBase


class Platformer(PlatformerBase):
    def setup_hook(self):
        image_source = ":resources:images/animated_characters/female_adventurer/femaleAdventurer_idle.png"
        self.set_player(image_source)

        map_name = ":resources:tiled_maps/map.json"
        self.load_map(map_name)


def main():
    Platformer.startup()


if __name__ == "__main__":
    main()
```

Per eseguirlo, recati nel menu `Run` di IDLE e seleziona `Run module`; accetta di salvare il tuo lavoro e posiziona il file nella stessa directory in cui avevi estratto la cartella `platformer` dello starterpack.

Se tutto è andato a buon fine, dovrebbe aprirsi questa finestra (puoi interagire con il gioco attraverso i tasti WASD o con le freccette direzionali):

{{ resize_image(path="/images/coderdojo/arcade/step_01.png", width=600, height=0, op="fit_width") }}

## Challenge!

Se sei riuscito ad avviare il tuo primo platformer, complimenti!

Prenditi ora un paio di minuti per rileggere il codice che hai scritto e per assicurarti di aver capito tutto, poi prova a fare queste personalizzazioni:

- Cambiare lo Sprite del giocatore, utilizzando uno di quelli disponibili nella cartella `platformer/assets` dello StarterPack;
- Cambiare la mappa del livello, utilizzando una di quelle disponibili nella cartella `platformer/assets` dello StarterPack.
