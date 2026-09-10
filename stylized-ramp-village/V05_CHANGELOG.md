# v0.5 Change Log

## Director prompt applied
The attached Open World Game Architect PRO prompt is now the governing development framework for this prototype.

## P0/P1 changes
- Reframed the prototype around player-first traversal validation.
- Kept procedural ramp-LUT rendering and no post-processing.
- Added an original procedural modern fashion player character.
- Added camera-relative/world-relative movement, sprint, crouch, jump, dash, mobile movement controls, and landmark interaction.
- Added basic city-block collision.
- Added a lightweight simulation bubble for NPC fidelity/culling.
- Added moving traffic.
- Added day/night lighting variation.
- Added FPS, draw-call, and triangle telemetry.

## Deliberately deferred
- Full navmesh and behavior trees.
- Persistent save/load.
- Dense NPC schedules and relationship/memory simulation.
- Audio system.
- True world-partition streaming.
- Full interior gameplay.

These are gated behind traversal validation to control scope and avoid architectural rework.
