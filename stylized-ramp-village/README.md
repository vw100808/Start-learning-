# Melbourne Open City — Prototype

A single-file vanilla Three.js/WebGL open-world foundation. The original stylized ramp-shading contract is retained, but the scene direction has changed from a small village demo to a fictionalized, explorable Melbourne city core.

## Current build

- Large navigable city canvas rather than a single showcase scene.
- Procedural CBD-style street grid, Yarra waterfront corridor, tram tracks and moving tram.
- Stylised landmark anchors inspired by recognisable Melbourne locations: Flinders Street Station, Federation Square, Southbank skyline, MCG and Royal Exhibition Building.
- Procedural multi-volume buildings with low-poly silhouettes; no external PNG/JPG textures.
- Runtime-generated Canvas LUT: one horizontal row per material, with lighting sampled by `dot(N, L) * 0.5 + 0.5`.
- Shadows attenuate the LUT coordinate rather than directly darkening the sampled colour; deep shadows stay chromatic.
- Third-person exploration camera, WASD movement, Shift sprint, Space jump/interact and mouse camera control.
- Simple minimap, district labels, landmark interactions, first exploration objective and moving pedestrian/tram cues.
- No bloom, vignette, depth-of-field or other post-processing.

## Long-term target

The target is an original open-world exploration game with the broad gameplay feeling of a modern action-adventure sandbox: continuous traversal, discoverable locations, NPCs, quests, interiors, activities, fast travel and a growing city simulation. It is **not** intended to copy another game's characters, assets, story, UI or proprietary visual identity.

Planned progression:

1. **World structure:** replace the current fixed prototype with district modules and distance-based streaming.
2. **Traversal:** collision, slopes, stairs, jumping, sprint stamina, vehicles and tram travel.
3. **City simulation:** pedestrians, traffic, weather, day/night, shops, stations and public events.
4. **Exploration:** map markers, collectibles, hidden alleys, viewpoints, environmental storytelling and interiors.
5. **Game systems:** quests, dialogue, inventory, economy, skills and save/load.
6. **Expansion:** Docklands, Carlton/Fitzroy, Southbank, Richmond, parks and additional waterfront areas.

## Run in browser

The repository root now contains a small GitHub Pages entry point that redirects to the game folder. After GitHub Pages is enabled for `main` / root, the intended public URL is:

`https://vw100808.github.io/Start-learning-/`

The page still needs network access to load the pinned Three.js ES module from unpkg.
