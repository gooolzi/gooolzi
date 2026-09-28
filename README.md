# Riviera français 🌊

Eine Website zum Französischlernen für den Alltag: kurze 5‑Minuten‑Lektionen, elegantes Riviera‑Design und sichtbarer Fortschritt.

## Was drin ist

- **4 Themen, 12 Lektionen, 72 Wörter & Ausdrücke**: Erste Schritte, Café & Restaurant, Reisen & Urlaub, Einkaufen & Mode
- **Aussprache**: Jedes Wort und jeder Satz wird vorgelesen (normal und langsam 🐢), dazu eine Lautschrift für Deutschsprachige
- **Abwechslungsreiche Übungen**: Karteikarten, Multiple Choice (in beide Richtungen), Hörverständnis, Paare finden und Sätze bilden
- **Fehler sind okay**: Falsche Antworten kommen am Ende der Lektion noch einmal dran
- **Fortschritt**: Tagesziel (5 Minuten), Serie 🔥, XP und Level (Débutante → Parisienne), Wochendiagramm, 9 Abzeichen
- **Wiederholen**: Wörter, die dir schwerfallen oder länger nicht geübt wurden, kommen gezielt dran
- **Wortschatz**: Alle gelernten Wörter mit Suche, Aussprache und „Sicherheits‑Balken“
- **Kulturtipps** („Wusstest du?“) nach jeder Lektion
- Funktioniert auf dem Handy und am Desktop. Der Fortschritt wird lokal im Browser gespeichert.

## Starten

Es gibt keinen Build-Schritt. Einfach `index.html` im Browser öffnen oder einen lokalen Server starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Zum Veröffentlichen eignet sich z. B. **GitHub Pages** (Settings → Pages → Branch auswählen).

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst & Navigation |
| `css/style.css` | Design (Farben: Meeresblau, Terrakotta, Sand, Gold) |
| `js/data.js` | Alle Lektionen, Vokabeln, Sätze, Tipps, Level & Abzeichen – hier kannst du neue Inhalte ergänzen |
| `js/app.js` | Lernlogik, Übungen, Fortschritt, Aussprache |
| `images/` | Eigene Illustrationen (SVG) |

### Neue Lektion hinzufügen

Ergänze in `js/data.js` in einem Thema unter `lessons` einen Eintrag mit `id`, `title`, `tip`, sechs `items` (`fr`, `de`, `pron`, `emoji`) und zwei `sentences` (`fr`, `de`).
