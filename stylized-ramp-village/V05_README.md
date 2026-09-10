# Melbourne Open City v0.5 — Director Build

This version applies the Open World Game Architect PRO workflow to the existing Three.js prototype without exploding scope.

## Implemented
- Procedural ramp-LUT rendering remains the visual foundation; no external image textures or post-processing.
- Player-first third-person traversal: WASD/arrow keys, sprint, crouch, jump, dash, camera-relative/world-relative movement, mouse camera, mobile controls.
- Original procedural modern-city fashion character with layered clothing/accessories; no external character model.
- Data-driven landmark/POI definitions.
- Basic building collision to stop walking through generated city blocks.
- Simulation Bubble: nearby NPCs update at higher fidelity; distant NPCs are culled.
- Moving traffic as a lightweight systemic world layer.
- Day/night lighting parameter changes while preserving the stylized neutral-flip palette.
- Runtime telemetry: FPS, draw calls, triangle count.

## Scope note
This is still a prototype/vertical-slice direction, not a full AAA open world. Streaming, navmesh, advanced AI, save/load, audio, and dense NPC schedules should be added only after the traversal loop is validated.

## Entry
`/index.html` redirects to `stylized-ramp-village/v05.html`.
