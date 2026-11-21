# Texel Neighbor Access for GPU Texture Painting

Options for getting seam-aware neighbor access when triangles are rasterized
directly into the UV space of a texture on the GPU, as in `webgl-app-framework`.

- Companion to `docs/uvPixelNeighbors.md`, which describes the CPU neighbor-link
  method implemented in this repo (`scripts/core/uvmesh.js`).
- Status: design survey from general knowledge. It has not been checked against
  the `webgl-app-framework` code, and none of the options below are implemented.

---

## 1. Context

- **This repo:** triangles are rasterized on the CPU into a grid. Neighbor links
  across seams are computed from mesh topology (`radial_next` hop plus an edge
  lerp) and stored in `neighborMap`.
- **`webgl-app-framework`:** triangles, found through a spatial tree, are rasterized
  directly into the UV space of a texture for painting. Everything runs on the GPU.
- **The gap:** on the GPU, writing a texel is easy, but reading its surface-adjacent
  neighbors is not. Two texels that touch on the surface can be far apart in the
  texture whenever a seam separates them.
- **Who needs neighbors:** stamping a brush does not. Smudge, blur, diffusion,
  mip/filter passes, and any operator that reads adjacent texels do.

---

## 2. Options

### Option 1: Evaluate the brush on the surface

- Rasterize a position map (ideally also normal and tangent maps) into UV space once,
  and again whenever the mesh changes.
- The stamp shader computes brush falloff from each texel's 3D position, not from its
  UV distance.
- Both sides of a seam evaluate the same function at the same surface point, so they
  agree with no cross-chart lookup.
- Covers: painting, erasing, flat fills.
- Does not cover: anything that reads neighboring texel values.

### Option 2: Gutter dilation after each stroke

- A post-pass copies covered texels into the 1..N texels outside each chart.
- A coverage or mask texture tells the shader which texels are valid sources.
- Pros:
  - Cheap.
  - Needs no adjacency data.
  - Standard in production tools.
- Cons:
  - Approximate at seams.
  - Fails when charts sit closer together than the gutter width.
  - Does not give a filter a true surface neighbor, only a padded copy.

### Option 3: Seam-pair list drawn as points

- Precompute the list of texel pairs (A, B) that are surface-adjacent across a seam.
  `rasterize` in this repo already produces equivalent data.
- Upload the list as a vertex buffer and draw it as `GL_POINTS`. The vertex shader
  reads A, and the point lands on B.
- Run it as a sync pass after each operation: average the pair, or copy from the side
  that was just painted.
- Pros:
  - Sparse, so it only touches border texels.
  - Works in WebGL2.
- Cons:
  - The pair list must be rebuilt whenever the UV layout or resolution changes.
  - Only synchronizes the pair. It does not give a filter its neighbor values inline.

### Option 4: Neighbor-link texture generated in a shader

- This is the algorithm in this repo, moved onto the GPU.
- Draw each triangle into UV space with flat per-triangle attributes. For each of its
  three edges, pass the UVs of that edge's endpoints on the adjacent face. That is the
  `radial_next` data.
- The fragment shader repeats the CPU steps:
  1. Compute barycentrics.
  2. Find the nearest edge.
  3. Lerp along the far-side edge by `lt`.
  4. Snap to a texel.
- It writes the redirected coordinates into an RGBA16F or RGBA32F link texture. For
  example, use two directions per texel, or two textures for all four.
- Consumers do `texelFetch(link, p)` to get the real neighbor. A flag bit or the alpha
  channel marks "no redirect needed, use the plain grid neighbor".
- Cost model: one extra pass per mesh or UV change, not per stroke.
- Pros:
  - Neighbor access in a filter is a single fetch.
  - The CPU implementation in this repo is a reference to validate against.
- Cons:
  - Dense memory unless an indirection texture is added.
  - Needs flat attributes, so the mesh must be unindexed or use provoking vertices.

### Option 5: Triangle-ID buffer plus adjacency table, resolved at lookup time

- Rasterize triangle IDs into a UV-space texture.
- Store per-triangle, per-edge neighbor UVs in a data texture. WebGPU storage buffers
  would be the cleaner home for this.
- A neighbor fetch checks the ID texture. If the neighbor texel is invalid, the shader
  looks up the adjacent triangle's UVs and runs the Option 4 math inline.
- Pros: less memory than Option 4.
- Cons: more ALU on every neighbor access.

### Option 6: Do the neighbor-dependent operation in screen space

- This is projection painting, as in Blender or Substance.
- Smudge and blur run on the framebuffer view, where neighbors are trivial. The result
  is reprojected into the texture.
- Seams are irrelevant.
- Cons:
  - Occluded and back-facing texels are lost.
  - Resolution depends on the camera.
  - Needs depth testing to avoid bleeding through.

### Option 7: Restructure the layout

- Ptex-style per-face textures, or charts aligned to the texel grid, make adjacency a
  table lookup.
- This changes the asset pipeline, so it is probably out of scope.

---

## 3. Comparison

| Option | Gives filters a true neighbor | Per-stroke cost | Extra data | WebGL2 viable |
| --- | --- | --- | --- | --- |
| 1. Surface-space brush | No | None | Position map | Yes |
| 2. Gutter dilation | Approximately | One full-texture pass | Coverage mask | Yes |
| 3. Seam-pair points | Sync only | Points, border-sized | Pair vertex buffer | Yes |
| 4. Link texture | Yes | None (built per layout change) | Link texture | Yes |
| 5. ID plus adjacency table | Yes | Extra ALU per fetch | ID texture plus table | Yes, with data textures |
| 6. Screen space | Yes, but view-limited | One pass | Depth and view buffers | Yes |
| 7. Restructured layout | Yes | None | New asset format | Depends |

---

## 4. Recommendation

- Use Option 1 for stamping. It removes the need for neighbors in the common case.
- Use Option 2 for the gutter that bilinear sampling needs when rendering.
- For smudge, blur, and similar operators, build the link texture from Option 4.
- Why Option 4:
  - This repo already has a CPU reference implementation to validate it against.
  - The mesh-view arrows in this repo show whether the output is right.
- Fall back to Option 5 if link-texture memory becomes a problem.

---

## 5. Problems shared by every link approach

- **No conservative rasterization in WebGL.**
  - Border texels whose centers fall just outside a triangle never get a fragment.
  - Fix: expand triangles by about a texel in the vertex shader.
  - This is the GPU equivalent of the boundary dilation in `rasterize`.
- **Links are not symmetric.**
  - If A links to B, B may not link back to A, because snapping is one-directional.
  - Filters that need symmetry, such as diffusion, must symmetrize the links or accept
    a small bias.
- **Vertices with valence other than 4 have no single neighbor.**
  - At chart corners and seam endpoints a texel can have more than one valid neighbor
    in a given direction.
  - Both the CPU and GPU versions must pick one.
- **Several triangles can claim one texel.**
  - A texel touched by multiple triangles needs a deterministic winner.
  - This repo currently accumulates every triangle's links into one array.
- **Known CPU-side bugs carry over if the algorithm is ported as-is.** From
  `docs/uvPixelNeighbors.md`:
  - The snapped texel is not checked for coverage by the far triangle.
  - `lt` is not renormalized.
  - Redirects are emitted across interior edges, not only seams.
  - Fix these in the port, not afterwards.

---

## 6. Open questions

- What does `webgl-app-framework` already store per texel (position map, triangle ID,
  coverage)? That determines how much of Option 1 and Option 5 is free.
- Which operators actually need neighbors: smudge only, or also blur and diffusion?
  Diffusion pushes toward Option 4 with symmetric links.
- Is WebGPU an option? Storage buffers and compute shaders would simplify Options 3
  and 5.
