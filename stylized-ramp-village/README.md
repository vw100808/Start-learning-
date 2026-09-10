# Stylized Ramp Village

A single-file vanilla Three.js/WebGL stylized 3D scene based on the supplied art-direction contract.

## Constraints implemented

- No external PNG/JPG textures. The only texture is a procedural Canvas LUT generated at runtime.
- One LUT row per material; lighting coordinate is `dot(N, L) * 0.5 + 0.5`.
- Shadow attenuation modifies the lookup coordinate and is clamped so deep shadows remain chromatic rather than black.
- Low-poly geometry with deterministic vertex jitter, multi-volume buildings, roof sag, and deliberately tilted chimney.
- One directional sun with shadow mapping; no bloom, vignette, or depth-of-field.
- Third-person follow camera, WASD movement, Shift sprint, Space jump/interact.
- No asset pipeline or build step is required.

## Run

Open `index.html` through a local HTTP server. The browser needs network access to load the pinned Three.js ES module from unpkg.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.
