# UV Pixel Neighbor Assignment

A description of how this app assigns neighbor links between UV texels, including
links that cross chart (seam) boundaries.

All of the interesting code lives in `scripts/core/uvmesh.js`
(`MeshWithUVMesh.rasterize`); the visualization lives in
`scripts/core/mesh_editor.js` (`MeshEditor.draw`).

---

## 1. The problem

A texture atlas cuts a surface into charts. Two texels that are adjacent *on the
surface* can end up far apart *in the texture* whenever the seam between them is
cut. Any operation that works on the texture as a grid — blurring, painting,
diffusion, solving a PDE in texture space, mipmap generation — needs to know, for
a texel on the edge of a chart, which texel in some *other* chart continues the
surface.

The usual production hack is to dilate (pad) chart borders by a few texels and
accept the seam artifacts. The method here instead builds an explicit
**neighbor map**: for every texel that touches a chart border, an explicit list of
its four grid neighbors, where any neighbor that would fall off the chart is
*replaced* by the texel in the adjoining chart that covers the same point on the
surface.

The app is a 2D debugging harness for that idea: a flat mesh, a per-loop UV layout
you can drag around independently of the mesh, and two synchronized views that
draw the resulting links as arrows.

---

## 2. Data model

### Mesh and UVs

`scripts/core/mesh.js` is a half-edge (BMesh-style) mesh: `Vertex`, `Edge`,
`Loop`, `LoopList`, `Face`. The relevant pieces:

- `Loop.uv` (`mesh.js:368`) — a per-face-corner UV. Two faces sharing an edge each
  have their own loops there, so their UVs may agree (continuous) or differ (seam).
- `Loop.radial_next` / `radial_prev` (`mesh.js:371`) — the cyclic list of all loops
  using the same edge. For a 2-manifold interior edge, `l.radial_next` is the loop
  of the *other* face on that edge. For a boundary edge, `l.radial_next === l`.
  This is the only adjacency the algorithm needs to cross a seam.
- `Mesh.calcLoopTris()` (`mesh.js:1236`) — fans every face into triangles as
  `(ls[0], ls[i], ls[i+1])`. All rasterization works on this triangle list.

Vertex positions are 2D (`v[0]`, `v[1]`); the "surface" is just the plane, which
keeps the debugging picture readable while exercising exactly the same topology
code a 3D mesh would.

### The UV mesh (charts)

`MeshWithUVMesh` (`uvmesh.js:7`) keeps a second `Mesh`, `this.uvmesh`, which is the
UV layout re-expressed as its own mesh so it can be selected and dragged with the
same edit operators. `regenUVMesh()` (`uvmesh.js:78`) builds it:

1. For each loop-tri, each loop is turned into a UV vertex via `getvert()`
   (`uvmesh.js:115`).
2. If `snapUVs` is on, UV verts are **welded** through a hash grid with cell size
   `snapLimit = 0.005`: `key = floor(v*200)*200 + floor(u*200)` (`uvmesh.js:131`).
   Loops whose UVs land in the same cell collapse to one UV vertex.
3. `uvLoopMap` (loop → UV vert) and `uvVertMap` (UV vert → loops) record the
   correspondence both ways; `flushUVs()` / `flushToVertUVs()` (`uvmesh.js:191`,
   `198`) push edits back and forth between `Loop.uv` and the UV mesh.

The welding is what actually defines the charts: a mesh edge whose two loops weld
to the same UV verts is chart-interior, and one whose loops stay separate is a
**seam**. The UV mesh therefore has one connected component per chart.

`getvert()` also sets `MeshFlags.MARK` on loops it sees more than once
(`uvmesh.js:117`). Because `calcLoopTris` fans an n-gon around `ls[0]`, a loop is
revisited exactly when it is an endpoint of a fan diagonal, so the marks propagate
to the UV-mesh edges that are triangulation diagonals (`uvmesh.js:160-172`). The
editor draws those dashed (`mesh_editor.js:103-105`) so real chart edges are
visually distinguishable from internal diagonals.

The UV mesh is rebuilt lazily whenever `structureGen` or `snapUVs` changes
(`getUVMesh()`, `uvmesh.js:30`), and `neighborMap` is cleared at the same time.

---

## 3. Rasterization

`rasterize(image)` (`uvmesh.js:209`) walks every loop-tri and scan-converts it into
the texture, and it is *during* that scan that neighbor links are produced. The
target image is created in `Workspace.makeUVImage()` (`editor.js:260`) at
`properties.imageSize` (default 15 — deliberately tiny so individual texels are
visible), zoomed on screen by `properties.pixelSize` (default 50).

### Barycentric coordinates via a bilinear patch

The barycentric weights `(u, v, w = 1-u-v)` of a point inside a triangle are affine
functions of the point. An affine function is reproduced *exactly* by bilinear
interpolation of its values at the four corners of any axis-aligned rectangle. So
instead of evaluating the barycentric formula per texel, `getEquations(a, b, c)`
(`uvmesh.js:276`) precomputes `u` and `v` at the four corners of the unit UV square
— `pa*` at (0,0), `pb*` at (0,1), `pc*` at (1,1), `pd*` at (1,0) — and the inner
loop just calls `bil()` (`uvmesh.js:304`) twice per texel. The commented REDUCE
script at `uvmesh.js:212-271` is the derivation. (`w1k1`…`w2k2`, the analytic
gradients, are computed but currently unused.)

Texel centers map to UV as `(ix + 0.5)/width` (`unscaleFromDimen`, `uvmesh.js:364`)
and back as `u*width - 0.5` (`scaleToDimen`, `uvmesh.js:378`); `SCALE_METHOD = 0`
switches both to the `ix/(width-1)` convention.

### Coverage

For each triangle, the UV bounding box is converted to texel indices, expanded by
2, and clamped (`uvmesh.js:341-353`). For each texel in the box:

- `u, v` are evaluated at the texel center; `outside()` (`uvmesh.js:391`) is
  `u < 0 || v < 0 || u + v > 1`.
- A texel outside the triangle is normally skipped.
- **Exception, boundary dilation:** if the texel's nearest triangle edge is a mesh
  *boundary* edge (`ledge === ledge.radial_next`), the test is relaxed to
  `fulltest(ix, iy) && outside(ix, iy)` (`uvmesh.js:450`). `fulltest`
  (`uvmesh.js:400`) samples six of the eight surrounding texels and only reports
  "bad" if *all* of them are outside, so a one-texel gutter is grown around
  genuine mesh boundaries. No such dilation is grown along seams — seams are
  handled by links instead, which is the whole point of the method.

Covered texels get their red and green channels blended 35% toward a hash of
`l1.eid ^ l2.eid ^ l3.eid` (`uvmesh.js:584-591`), which is the per-triangle
ownership coloring you see in the UV view.

---

## 4. Neighbor assignment

This is the core of the method (`uvmesh.js:458-579`). It runs per covered texel of
each triangle.

### Step 1 — pick the nearest edge and a parameter along it

```js
let w = 1.0 - u - v;
if (u <= v && u <= w)      { ledge = l2; lt = v; }   // edge opposite l1
else if (v <= u && v <= w) { ledge = l3; lt = w; }   // edge opposite l2
else                       { ledge = l1; lt = u; }   // edge opposite l3
```
(`uvmesh.js:428-438`)

The smallest barycentric weight identifies the closest edge: weight `u` belongs to
vertex `l1`, and the edge opposite `l1` is the one owned by loop `l2` (in a
half-edge mesh a triangle's loop `l2` owns the edge `l2.v → l3.v`). `lt` is set to
the barycentric weight of `ledge`'s *own* vertex, so `lt = 1` at `ledge.v` and
`lt = 0` at `ledge.next.v` — an (approximate, unnormalized) parameter along that
edge. This is the texel's "address" relative to the seam.

### Step 2 — test the four grid neighbors

`offs = [[0,-1], [-1,0], [0,1], [1,0]]` (`uvmesh.js:315`). For each direction:

- If `ledge.radial_next === ledge` the edge is a mesh boundary — there is nothing
  on the other side, so the loop `break`s and this texel gets no links at all
  (`uvmesh.js:467`).
- Otherwise the neighbor texel center is tested with `outside(ix2, iy2)`. If it is
  *inside* this triangle, nothing special happens (it is handled in step 5). If it
  is *outside*, the neighbor has fallen off the triangle and must be redirected;
  bit `maski` is set in `mask` and the redirect is computed.

### Step 3 — reflect the point through the shared edge

The redirect is the interesting part. The neighbor texel is off the edge, so the
algorithm asks: *what is this position, expressed on the other side's copy of the
same edge?*

```js
let ledge2 = ledge.radial_next;              // the loop on the other face

if (ledge.v !== ledge2.v) { uv1 = ledge2.uv;      uv2 = ledge2.next.uv; }
else                      { uv2 = ledge2.uv;      uv1 = ledge2.next.uv; }

u3 = uv1[0] + (uv2[0] - uv1[0])*lt;
v3 = uv1[1] + (uv2[1] - uv1[1])*lt;
```
(`uvmesh.js:493-510`)

The branch exists so `uv2` is always the far side's UV at the *same physical
vertex* as `ledge.v`. With consistent winding, the neighbor loop runs the opposite
direction (`ledge2.v === ledge.next.v`), so the far-side UV of `ledge.v` is
`ledge2.next.uv`; with a flipped neighbor face the roles swap. With that fixed,
`lt` — measured in this chart — indexes the same physical point on the far chart's
copy of the edge, and `(u3, v3)` is that point's UV in the other chart. Crossing
the seam therefore costs one radial hop and one lerp; no spatial search, no
UV-space proximity test, no acceleration structure.

### Step 4 — snap the reflected UV to a texel

`(u3, v3)` lies exactly *on* the seam in the far chart, so rounding it naively
would be a coin flip between the texel inside the far chart and the one outside it.
Instead the rounding is steered by the far edge's direction `(du, dv)`
(`uvmesh.js:512-537`):

```js
if (|dv| == 0 || |du/dv| < 0.25)  iy3 = floor(iy3 + 0.5);   // near-vertical edge
else if (du >= 0)                 iy3 = floor(iy3);
else                              iy3 = ceil(iy3);

if (|du| == 0 || |dv/du| < 0.25)  ix3 = floor(ix3 + 0.5);   // near-horizontal edge
else if (dv < 0)                  ix3 = floor(ix3);
else                              ix3 = ceil(ix3);
```

The rule is: for the axis that runs *along* the edge, round to nearest (that axis
is just position along the seam and both choices are equally valid); for the axis
that runs *across* the edge, always round the same way relative to the edge's
direction of travel, so the chosen texel consistently lands on the far face's
interior side rather than back out into empty texture. The `0.25` slope threshold
decides which axis is which, and the `ENABLE` flag / `fu`, `fv` terms (hard-wired
to `0.0`) are leftover tuning knobs from the experiment.

### Step 5 — record the link

Per redirected direction, six numbers are appended to `nmap[key]`, where
`key = iy*width + ix` is the flat index of the *source* texel (`uvmesh.js:459`):

| offset | meaning |
| --- | --- |
| `+0`, `+1` | `ix3`, `iy3` — the redirected texel in the other chart |
| `+2`, `+3` | surface position of *this* texel, `u*l1.v + v*l2.v + w*l3.v` |
| `+4`, `+5` | surface position of the *redirected* texel |

The last pair is computed by re-deriving barycentric coordinates for `(ix3, iy3)`
inside the neighbor triangle: the neighbor loop triple `l1b, l2b, l3b` is recovered
from `ledge.radial_next` with the same winding branch as before, and
`math.barycentric_v2` gives the weights (`uvmesh.js:544-561`). These two positions
are what makes the visualization convincing — if the mapping is right, the arrow
between them is short and lands where the seam actually is on the surface.

Finally, for the directions that were *not* redirected (bit clear in `mask`), the
plain in-chart neighbor `(ix2, iy2)` is appended (`uvmesh.js:565-579`), so the
entry is meant to describe all four neighbors of a border texel, with the
off-chart ones substituted.

Note that `key` deliberately ignores which triangle produced the entry — the
commented `+ ((l1.eid ^ l2.eid ^ l3.eid) << 16)` at `uvmesh.js:459` was an
experiment in keying per triangle. As written, a texel straddling several
triangles accumulates every triangle's links in one array.

---

## 5. Visualization

`MeshEditor.draw` (`mesh_editor.js:198-270`) reads `neighborMap` in two modes, and
the app is normally used with two `Workspace` editors side by side (one with
`editUVs` on, one off) so both are visible at once.

- **UV view** (`editUVs` on, `mesh_editor.js:198`): the texture is drawn
  nearest-neighbor at `pixelSize` zoom, and each entry draws an arrow from the
  linked texel `(ns[i], ns[i+1])` to the source texel — i.e. "this distant texel
  feeds this one". Chart-crossing links appear as long arrows jumping between
  islands.
- **Mesh view** (`editUVs` off, `mesh_editor.js:244`): the same entries are drawn
  as arrows from the source texel's surface position `(ns[i+2], ns[i+3])` to the
  linked texel's surface position `(ns[i+4], ns[i+5])`, transformed by the
  workspace matrix. Correct links show up here as short hops straight across the
  seam; a wrong one shows up as an arrow flying across the mesh.

Arrowheads are drawn by `line(..., arrow)` at `mesh_editor.js:167`.

The rest of the app is the supporting harness: `mesh.reset_uvs`
(`mesh_ops.js:325`) initializes UVs from vertex positions normalized by the
bounding max, `mesh.resize_uvs` (`uvmesh.js:41`) rescales them into 0..1,
`mesh.triangulate` fans the faces, and `ToolContext.makeUVContext()`
(`context.js:92`) swaps `ctx.mesh` for the UV mesh so the standard select/transform
operators edit UVs; transform flushes back through `flushUVs` /
`flushToVertUVs` (`transform_ops.js:176`, `235`, `308`).

---

## 6. Properties of the method

**Strengths**

- Crossing a seam is `O(1)`: one `radial_next` hop plus a lerp. No UV-space search
  or spatial index is ever needed, and correctness does not depend on the two
  charts having compatible orientation, scale, or rotation.
- The link is derived from *mesh* topology, so it stays correct however badly the
  charts are laid out — including mirrored, rotated, or non-uniformly scaled
  islands.
- Chart borders need no gutter. Dilation is applied only at true mesh boundaries
  (`uvmesh.js:450`), where there is genuinely nothing to link to.
- Both endpoints of every link carry their surface positions, which makes the
  result directly verifiable rather than only plausible-looking.

**Approximations and limitations, as implemented**

- `lt` is the raw barycentric weight, not renormalized by `(v + w)`. Near the edge
  the discarded weight is small, so the error is second-order, but it is nonzero.
- The reflected point is snapped by a slope-threshold heuristic (§4 step 4) rather
  than by testing coverage. Nothing verifies that `(ix3, iy3)` is actually covered
  by the far triangle, so a link can point at an uncovered texel — most likely at
  acute corners, at texel-scale triangles, or where the far chart is much smaller
  in texture space than the near one.
- `isSeam` is computed (`uvmesh.js:442-448`) but is commented out of the condition
  at `uvmesh.js:450`, so redirects are emitted across *every* interior edge whose
  neighbor texel falls outside the current triangle — including triangle-internal
  edges inside a single chart, where the plain grid neighbor would have been
  correct. Harmless for continuous UVs (the reflected point lands back on
  essentially the same spot) but it makes the map larger than it needs to be and
  routes in-chart neighbors through the rounding heuristic unnecessarily.
- **Record-size inconsistency:** redirected neighbors append 6 values, but the
  non-redirected neighbors appended afterwards at `uvmesh.js:565-579` append only
  2. Both consumers iterate with `i += 6` (`mesh_editor.js:218`, `256`), so the
  trailing plain neighbors are misread as 6-tuples and yield `undefined`/`NaN`
  coordinates. Padding those to 6 (or writing them to a separate list) is the fix.
- UV welding is a plain hash-grid bucket (`uvmesh.js:131`), not a proper tolerance
  join: two UVs that are within `0.005` of each other but on opposite sides of a
  cell boundary will not weld, and will be treated as a seam that is not there.
  The key also assumes UVs stay in roughly `[0, 1)`.
- `Loop.radial_next` is a cyclic list, but only the immediate `radial_next` is
  consulted. On a non-manifold edge (three or more faces) one arbitrary neighbor
  wins.
- Dead code worth knowing about when reading: `w1k1`…`w2k2` (`uvmesh.js:281-284`),
  the `u2`/`v2` computed at `uvmesh.js:475-476` and then shadowed at
  `uvmesh.js:555`, `dx`/`dy` at `uvmesh.js:413-414`, and the `+ 0.5` applied to
  mesh-space coordinates at `mesh_editor.js:257-258` (a texel-center convention
  leaking into surface space).

---

## 7. Code index

| What | Where |
| --- | --- |
| UV mesh build, welding, seam definition | `scripts/core/uvmesh.js:78-182` |
| Barycentric-as-bilinear setup | `scripts/core/uvmesh.js:212-308` |
| Rasterizer, coverage, boundary dilation | `scripts/core/uvmesh.js:326-456` |
| **Neighbor assignment** | `scripts/core/uvmesh.js:458-579` |
| Seam crossing (radial hop + edge lerp) | `scripts/core/uvmesh.js:493-510` |
| Texel snapping heuristic | `scripts/core/uvmesh.js:512-537` |
| Link record layout | `scripts/core/uvmesh.js:541-561` |
| Arrow rendering, both views | `scripts/core/mesh_editor.js:167-270` |
| Texture allocation / zoom properties | `scripts/core/editor.js:260-300`, `scripts/core/app.js:18-19` |
| UV editing context swap | `scripts/core/context.js:92-103` |
