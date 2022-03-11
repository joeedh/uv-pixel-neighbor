import {
  Vector2, Vector3, Vector4, Matrix4, Quat,
  util, nstructjs, math, simple
} from '../path.ux/pathux.js';
import {Mesh, MeshFeatures, MeshFlags} from './mesh.js';

export class MeshWithUVMesh extends Mesh {
  constructor() {
    super();

    this.uvmesh = new Mesh();
    this.uvLoopMap = new Map(); //loops -> uv verts
    this.uvVertMap = new Map(); //uv verts -> loops
    this.uvmesh.features |= MeshFeatures.UVMESH;
    this._last_structure_gen = 0;
    this._last_snap_uvs = true;

    this.neighborMap = new Map();

    this.snapUVs = true;
    this.pixelSize = 50;

    this.loopTris = undefined;
  }

  static defineAPI(api, st) {
    st.bool("snapUVs", "snapUVs", "Snap UVs");
  }

  getUVMesh() {
    if (this._last_structure_gen !== this.structureGen || this._last_snap_uvs !== this.snapUVs) {
      this._last_snap_uvs = this.snapUVs;
      this._last_structure_gen = this.structureGen;
      this.neighborMap = new Map();
      this.regenUVMesh();
    }

    return this.uvmesh;
  }

  resizeUVs() {
    this.flushUVs();

    let min = new Vector2();
    let max = new Vector2();

    min.addScalar(1e17);
    max.addScalar(-1e17);

    for (let f of this.faces) {
      for (let l of f.loops) {
        min.min(l.uv);
        max.max(l.uv);
      }
    }

    let scale = new Vector2(max)//.sub(min);
    scale[0] = Math.max(scale[0], 0.000001);
    scale[1] = Math.max(scale[1], 0.000001);

    scale = new Vector2(scale).loadXY(1, 1).div(scale);

    for (let f of this.faces) {
      for (let l of f.loops) {
        l.uv.mul(scale);

        let v = this.uvLoopMap.get(l);
        if (v) {
          v[0] = l.uv[0];
          v[1] = l.uv[1];
        }

        console.log(l.uv);
      }
    }
  }

  regenUVMesh() {
    console.warn("Regenerating UV mesh!", this.snapUVs);

    for (let [l, v] of this.uvLoopMap) {
      l.uvFlag = v.flag;
      l.uv.load(v);
    }

    let lmap = this.uvLoopMap = new Map();
    let vmap = this.uvVertMap = new Map();
    let uvmesh = this.uvmesh = new Mesh();

    uvmesh.features |= MeshFeatures.UVMESH;

    let snapLimit = 0.005;
    let snapMul = 1.0/snapLimit;
    let snapMap = new Map();

    const co3d = new Vector3();
    const snapUVs = this.snapUVs;

    function makevert(l) {
      let co = l.uv;
      co3d.loadXY(co[0], co[1]);

      let v = uvmesh.makeVertex(co3d);

      if (l.uvFlag & MeshFlags.SELECT) {
        uvmesh.verts.setSelect(v, true);
      }

      v.flag = l.uvFlag;
      vmap.set(v, []);

      return v;
    }

    function getvert(l) {
      if (lmap.has(l)) {
        l.flag |= MeshFlags.MARK;
        return lmap.get(l);
      } else {
        l.flag &= ~MeshFlags.MARK;
      }

      if (!snapUVs) {
        let v = makevert(l);
        lmap.set(l, v);

        return v;
      }

      let co = l.uv;
      let key = ~~(co[1]*snapMul)*snapMul + ~~(co[0]*snapMul);

      let v = snapMap.get(key);
      if (!v) {
        v = makevert(l);
        snapMap.set(key, v);
      }

      lmap.set(l, v);
      return v;
    }

    let ltris = this.loopTris = this.calcLoopTris();

    for (let i = 0; i < ltris.length; i += 3) {
      let l1 = ltris[i], l2 = ltris[i + 1], l3 = ltris[i + 2];

      let v1 = getvert(l1);
      let v2 = getvert(l2);
      let v3 = getvert(l3);

      let f = uvmesh.makeFace([v1, v2, v3]);

      vmap.get(v1).push(l1);
      vmap.get(v2).push(l2);
      vmap.get(v3).push(l3);

      let l = f.lists[0].l;

      let m1 = l1.flag & MeshFlags.MARK;
      let m2 = l2.flag & MeshFlags.MARK;
      let m3 = l3.flag & MeshFlags.MARK;

      if (m1 && m2) {
        l.e.flag |= MeshFlags.MARK;
      }
      if (m2 && m3) {
        l.next.e.flag |= MeshFlags.MARK;
      }
      if (m3 && m1) {
        l.prev.e.flag |= MeshFlags.MARK;
      }
    }

    for (let f of this.faces) {
      for (let l of f.loops) {
        if (!lmap.has(l)) {
          lmap.set(l, getvert(l));
        }
      }
    }
  }

  loadSTRUCT(reader) {
    reader(this);

    super.loadSTRUCT(reader);
    this.regenUVMesh();
  }

  flushToVertUVs() {
    this.structureGen++;

    this.uvLoopMap = new Map();
    this.uvVertMap = new Map();
  }

  flushUVs() {
    //console.log("Flush UVs!");

    for (let [l, v] of this.uvLoopMap) {
      l = this.eidMap.get(l.eid);

      l.uvFlag = v.flag;
      l.uv.load(v);
    }
  }

  rasterize(image) {
    this.getUVMesh();

    /*

    on factor;

    f1 := k1 + (k2 - k1)*u;
    f2 := k4 + (k3 - k4)*u;
    f3 := f1 + (f2 - f1)*v;

    b1 := sub(k1=1, k2=0, k3=0, k4=0, f3);
    b2 := sub(k1=0, k2=1, k3=0, k4=0, f3);
    b3 := sub(k1=0, k2=0, k3=1, k4=0, f3);
    b4 := sub(k1=0, k2=0, k3=0, k4=1, f3);


    x := ax*w1 + bx*w2 + cx*(1.0-w1-w2);
    y := ay*w1 + by*w2 + cy*(1.0-w1-w2);

    f1 := px - x;
    f2 := py - y;

    ff := solve({f1, f2}, {w1, w2});

    fw1 := part(ff, 1, 1, 2);
    fw2 := part(ff, 1, 2, 2);

    fpoly1 := b1*w1k1 + b2*w1k2 + b3*w1k3 + b4*w1k4;
    fpoly2 := b1*w2k1 + b2*w2k2 + b3*w2k3 + b4*w2k4;

    kw1 := sub(px=dx, py=dy, fw1);
    kw2 := sub(px=dx, py=dy, fw2);

    f1 := fpoly1 = fw1;
    f2 := fpoly2 = fw2;
    f3 := df(fpoly1, dx) - df(kw1, dx);
    f4 := df(fpoly2, dx) - df(kw2, dx);
    f5 := df(fpoly1, dy) - df(kw1, dy);
    f6 := df(fpoly2, dy) - df(kw2, dy);

    ff2 := solve({f1, f2, f3, f4}, {w1k1, w1k2, w2k1, w2k2});

    on fort;
    part(ff2, 1, 1);
    part(ff2, 1, 2);
    part(ff2, 1, 3);
    part(ff2, 1, 4);
    off fort;

    pa1 := sub(px=0, py=0, fw1);
    pa2 := sub(px=0, py=0, fw2);

    pb1 := sub(px=0, py=1, fw1);
    pb2 := sub(px=0, py=1, fw2);

    pc1 := sub(px=1, py=1, fw1);
    pc2 := sub(px=1, py=1, fw2);

    pd1 := sub(px=1, py=0, fw1);
    pd2 := sub(px=1, py=0, fw2);

    */

    let w1k1, w1k2, w2k1, w2k2;
    let pa1, pa2, pb1, pb2, pc1, pc2, pd1, pd2;

    function getEquations(a, b, c) {
      let ax = a[0], ay = a[1];
      let bx = b[0], by = b[1];
      let cx = c[0], cy = c[1];

      w1k1 = (by - cy)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*ay);
      w1k2 = (-bx + cx)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*ay);
      w2k1 = (-ay + cy)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*ay);
      w2k2 = (ax - cx)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*ay);


      pa1 = (bx*cy - by*cx)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*ay);
      pa2 = (-(ax*cy - ay*cx))/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*ay);
      pb1 = (-((by - 1.0)*cx - (cy - 1.0)*bx))/(bx*cy - by*cx + (by - cy)*ax - (bx - cx
      )*ay);

      pb2 = ((ay - 1.0)*cx - (cy - 1.0)*ax)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*
        ay);
      pc1 = (-((cx - 1.0)*by - (cy - 1.0)*bx - (cx - cy)))/(bx*cy - by*cx + (by - cy)*
        ax - (bx - cx)*ay);
      pc2 = (-(cx - cy + (cy - 1.0)*ax - (cx - 1.0)*ay))/(bx*cy - by*cx + (by - cy)*ax -
        (bx - cx)*ay);
      pd1 = ((bx - 1.0)*cy - (cx - 1.0)*by)/(bx*cy - by*cx + (by - cy)*ax - (bx - cx)*
        ay);
      pd2 = (-((ax - 1.0)*cy - (cx - 1.0)*ay))/(bx*cy - by*cx + (by - cy)*ax - (bx - cx
      )*ay);
    }

    function bil(a, b, c, d, u, v) {
      let k1 = a + (b - a)*u;
      let k2 = d + (c - d)*u;
      return k1 + (k2 - k1)*v;
    }


    if (!this.loopTris) {
      this.loopTris = this.calcLoopTris();
    }

    const offs = [
      [0, -1],
      [-1, 0],
      [0, 1],
      [1, 0]
    ];

    let lmap = this.uvLoopMap;
    let ltris = this.loopTris;
    let nmap = this.neighborMap = new Map();

    function triangle(l1, l2, l3) {
      let min = new Vector2().addScalar(1e17);
      let max = new Vector2().addScalar(-1e17);

      let a = lmap.get(l1);
      let b = lmap.get(l2);
      let c = lmap.get(l3);

      min.min(a), max.max(a);
      min.min(b), max.max(b);
      min.min(c), max.max(c);

      let idata = image.data;
      let width = image.width, height = image.height;

      min[0] = Math.floor(min[0]*(width - 1));
      min[1] = Math.floor(min[1]*(height - 1));
      max[0] = Math.ceil(max[0]*(width));
      max[1] = Math.ceil(max[1]*(height));

      min.addScalar(-2);
      max.addScalar(2);

      min[0] = Math.min(Math.max(min[0], 0), width - 1);
      min[1] = Math.min(Math.max(min[1], 0), height - 1);

      max[0] = Math.min(Math.max(max[0], 0), width);
      max[1] = Math.min(Math.max(max[1], 0), height);

      getEquations(lmap.get(l1), lmap.get(l2), lmap.get(l3));

      //console.log(min, max);
      //console.error(w1k1, w1k2, w2k1, w2k2);

      let _tmp = [0, 0];

      const SCALE_METHOD = 1;

      function unscaleFromDimen(ix, iy) {
        if (SCALE_METHOD) {
          _tmp[0] = (ix + 0.5)/width;
          _tmp[1] = (iy + 0.5)/height;
        } else {
          _tmp[0] = ix/(width - 1);
          _tmp[1] = iy/(height - 1);
        }

        return _tmp;
      }

      let _tmp2 = [0, 0];

      function scaleToDimen(u, v) {
        if (SCALE_METHOD) {
          _tmp2[0] = u*width - 0.5;
          _tmp2[1] = v*height - 0.5;
        } else {
          _tmp2[0] = u*(width - 1);
          _tmp2[1] = v*(height - 1);
        }

        return _tmp2;
      }


      function outside(ix, iy) {
        let [x, y] = unscaleFromDimen(ix, iy);

        let u = bil(pa1, pb1, pc1, pd1, y, x);
        let v = bil(pa2, pb2, pc2, pd2, y, x);

        return u < 0 || v < 0 || (u + v > 1.0);
      }

      //let [dx, dy] = unscaleFromDimen(1, 1);
      let dx = 0.5001 / (width - 1);
      let dy = 0.5001 / (height - 1);

      for (let iy = min[1]; iy < max[1]; iy++) {
        for (let ix = min[0]; ix < max[0]; ix++) {
          let [x, y] = unscaleFromDimen(ix, iy);

          let idx = (iy*image.width + ix)*4;

          let u = bil(pa1, pb1, pc1, pd1, y, x);
          let v = bil(pa2, pb2, pc2, pd2, y, x);

          let ledge;
          let lt;

          let w = 1.0 - u - v;
          if (u <= v && u <= w) {
            ledge = l2;
            lt = v;
          } else if (v <= u && v <= w) {
            ledge = l3;
            lt = w;
          } else {
            ledge = l1;
            lt = u;
          }

          let bad = u < 0.0 || v < 0.0 || (u + v > 1.0);

          if (ledge === ledge.radial_next) {
            bad = bad && outside(ix, iy+1);
            bad = bad && outside(ix+1, iy+1);
            bad = bad && outside(ix+1, iy);;

            bad = bad && outside(ix, iy-1);
            bad = bad && outside(ix-1, iy-1);
            bad = bad && outside(ix-1, iy);;
          }

          if (bad) {
            continue;
          }

          /*find seam neighbor links*/
          let key = (iy*width + ix);// + ((l1.eid ^ l2.eid ^ l3.eid)<<16);
          let ns = nmap.get(key);

          let mask = 0;
          let maski = -1;
          for (let off of offs) {
            maski++;

            if (ledge.radial_next === ledge) {
              break;
            }

            let ix2 = ix + off[0];
            let iy2 = iy + off[1];
            let [x2, y2] = unscaleFromDimen(ix2, iy2);

            let u2 = bil(pa1, pb1, pc1, pd1, y2, x2);
            let v2 = bil(pa2, pb2, pc2, pd2, y2, x2);

            if (u2 < 0 || v2 < 0 || (u2 + v2 > 1.0)) {
              mask |= 1<<maski;

              if (!ns) {
                ns = nmap.get(key);

                if (!ns) {
                  ns = [];
                  nmap.set(key, ns);
                }
              }

              let u3, v3;
              let uv1, uv2;

              let ledge2 = ledge.radial_next;

              if (ledge.v !== ledge.radial_next.v) {
                uv1 = ledge2.uv;
                uv2 = ledge2.next.uv;
              } else {
                uv2 = ledge2.uv;
                uv1 = ledge2.next.uv;
              }

              //if (math.line_line_cross(uv1, ledge.next.uv, uv2, ledge.uv)) {
              //let tmp = uv1;
              //uv1 = uv2;
              //uv2 = tmp;
              //}

              u3 = uv1[0] + (uv2[0] - uv1[0])*lt;
              v3 = uv1[1] + (uv2[1] - uv1[1])*lt;

              let [ix3, iy3] = scaleToDimen(u3, v3);

              let du = uv2[0] - uv1[0];
              let dv = uv2[1] - uv1[1];

              let fu = 0.0;//Math.abs(Math.fract(ix3)-0.25);
              let fv = 0.0;//Math.abs(Math.fract(iy3)-0.25);

              if (1) {
                const ENABLE = true;
                if (ENABLE && (Math.abs(dv) === 0.0 || Math.abs(du/dv) < 0.25)) {
                  iy3 = Math.floor(iy3 + 0.5);
                } else if (du >= 0) {
                  iy3 = Math.floor(iy3 + fv);
                } else {
                  iy3 = Math.ceil(iy3 + fv);
                }

                if (ENABLE && (Math.abs(du) === 0.0 || Math.abs(dv/du) < 0.25)) {
                  ix3 = Math.floor(ix3 + 0.5);
                } else if (dv < 0.0) {
                  ix3 = Math.floor(ix3 + fu);
                } else {
                  ix3 = Math.ceil(ix3 + fu);
                }
              }
              //ix3 = ~~ix3;
              //iy3 = ~~iy3;

              ns.push(~~ix3);
              ns.push(iy3);

              let l1b = ledge.radial_next, l2b, l3b;
              if (l1b.v === ledge.v) {
                l1b = l1b.next;
                l2b  = l1b.prev;
                l3b = l2b.prev;
              } else {
                l2b = l1b.next;
                l3b = l2b.next;
              }

              let uvp = unscaleFromDimen(~~ix3, iy3);
              let [u2, v2] = math.barycentric_v2(uvp, l1b.uv, l2b.uv, l3b.uv);

              ns.push(u*l1.v[0] + v*l2.v[0] + (1.0 - u - v)*l3.v[0]);
              ns.push(u*l1.v[1] + v*l2.v[1] + (1.0 - u - v)*l3.v[1]);

              ns.push(u2*l1b.v[0] + v2*l2b.v[0] + (1.0 - u2 - v2)*l3b.v[0]);
              ns.push(u2*l1b.v[1] + v2*l2b.v[1] + (1.0 - u2 - v2)*l3b.v[1]);
            }
          }

          if (ns) {
            for (let i = 0; i < offs.length; i++) {
              if (mask & (1<<i)) {
                continue;
              }

              let off = offs[i];

              let ix2 = ix + off[0];
              let iy2 = iy + off[1];

              ns.push(ix2);
              ns.push(iy2);
            }
          }

          let r = idata[idx]/255;
          let g = idata[idx + 1]/255;

          let id1 = Math.fract((l1.eid ^ l2.eid ^ l3.eid)*0.123434);
          let id2 = Math.fract((l1.eid ^ l2.eid ^ l3.eid)*0.423434 + 0.234);

          r += (id1 - r)*0.35;
          g += (id2 - g)*0.35;

          idata[idx] = r*255;
          idata[idx + 1] = g*255;
        }
      }
    }

    for (let i = 0; i < ltris.length; i += 3) {
      triangle(ltris[i], ltris[i + 1], ltris[i + 2]);
    }
  }
}

MeshWithUVMesh.STRUCT = nstructjs.inherit(MeshWithUVMesh, Mesh, "MeshWithUVMesh") + `
  uvmesh      : mesh.Mesh;
  snapUVs     : bool;
}
`;
simple.DataModel.register(MeshWithUVMesh);
