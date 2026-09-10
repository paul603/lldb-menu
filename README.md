# lldb-menu — Menus TV Le Lab du Bonheur

Site statique déployé sur Vercel (projet `lldb-menu`, équipe « baba's projects »).
URL de production : https://lldb-menu.vercel.app

## Fichiers
- `index.html` — pages vidéo actuelles des TV : `/republique`, `/odeon`, `/asnieres`, `/nantes`.
  Lit les .mp4 du bucket Supabase Storage `menu-tv` : `menu-<boutique>.mp4`. Vérifie les mises à jour toutes les 3 min.
  Options d'URL : `?fit=contain`, `?rot=90` / `?rot=270` (TV en portrait), plein écran sur OK/Entrée.
- `videos/` — templates vidéo (local, à uploader sur Supabase - voir `UPLOAD_VIDEOS.md`) :
  - `menu-republique.mp4` (portrait) - "MENU 2026 (1).mp4"
  - `menu-asnieres.mp4`, `menu-odeon.mp4`, `menu-nantes.mp4` (paysage) - "Copie de MENU 2026 (2).mp4"
- `v2.html` — menu connecté (HTML) : `/v2/republique`, etc.
  Lit `menu_items` + `menu_stock` du projet Supabase « Planning » (ljcixbsebbwvbkkohfxq, base ZYPTAC)
  avec la clé anon (lecture publique via RLS). Rafraîchit toutes les 60 s.
- `vercel.json` — routage : `/v2/*` → v2.html, tout le reste → index.html.

## Redéployer
Aucun build : déposer ces fichiers tels quels (drag & drop sur vercel.com, `vercel deploy`,
ou lier un repo GitHub au projet). Claude peut aussi redéployer via son connecteur Vercel.

## Orientations des TV
- **République** : Portrait (vidéo MENU 2026 (1).mp4)
- **Asnières, Odéon, Nantes** : Paysage (vidéo Copie de MENU 2026 (2).mp4)
