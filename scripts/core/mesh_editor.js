import config from '../config/config.js';

import {
  KeyMap, color2css, css2color,
  Vector3, Matrix4, Quat, util, nstructjs, math,
  Vector4, UIBase, HotKey, haveModal, Vector2
} from '../path.ux/scripts/pathux.js';

import {getElemColor, MeshTypes, MeshFlags, MeshFeatures} from './mesh.js';
import './mesh_ops.js';
import './transform_ops.js';
import './mesh_selectops.js';

import {SelToolModes} from './mesh_ops.js';

export class ToolModeBase {
  constructor(ctx) {
    this.ctx = ctx;
    this.keymap = new KeyMap()
  }

  getEditMenu() {
    return [];
  }

  on_mousedown(localX, localY, e) {

  }

  on_mousemove(localX, localY, e) {

  }

  on_mouseup(localX, localY, e) {

  }

  draw() {

  }

  getKeymap() {
    return this.keymap;
  }
}

export class PickData {
  constructor(elem, type, dist) {
    this.elem = elem;
    this.type = type;
    this.dist = dist;
  }

  load(elem, type, dist) {
    this.elem = elem;
    this.type = type;
    this.dist = dist;

    return this;
  }
}

let pick_cachering = util.cachering.fromConstructor(PickData, 32);

export class MeshEditor extends ToolModeBase {
  constructor(ctx) {
    super(ctx);

    this.startMpos = new Vector2();
    this.mpos = new Vector2();

    this.keymap = new KeyMap([
      new HotKey("A", ["CTRL"], "mesh.toggle_select_all(mode='ADD')"),
      new HotKey("A", [], "mesh.toggle_select_all(mode='ADD')"),
      new HotKey("A", ["ALT"], "mesh.toggle_select_all(mode='SUB')"),
      new HotKey("A", ["CTRL", "SHIFT"], "mesh.toggle_select_all(mode='SUB')"),
      new HotKey("G", [], "transform.translate()"),
      new HotKey("S", [], "transform.scale()"),
      new HotKey("R", [], "transform.rotate()"),
      new HotKey("E", [], "mesh.split_edge()"),
      new HotKey("D", [], "mesh.dissolve_vertex()"),
      new HotKey("X", [], "mesh.delete()"),
      new HotKey("Delete", [], "mesh.delete()"),
      new HotKey("L", [], "mesh.select_linked(pick=true mode='ADD')"),
      new HotKey("L", ["SHIFT"], "mesh.select_linked(pick=true mode='SUB')"),
      new HotKey("F", [], "mesh.make_face"),
    ])

    this.mdown = false;
  }


  draw(ctx, canvas, g, scale = 1.0) {
    this.ctx = ctx;

    let mesh = this.ctx.mesh;
    let workspace = ctx.workspace;

    let w = 8/scale;

    for (let e of mesh.edges.visible) {
      g.lineWidth = (e.flag & MeshFlags.MARK ? 4 : 1)/scale;

      g.setLineDash(e.flag & MeshFlags.MARK ? [5, 10] : []);

      g.strokeStyle = color2css(getElemColor(mesh.edges, e));
      g.beginPath();
      g.moveTo(e.v1[0], e.v1[1]);
      g.lineTo(e.v2[0], e.v2[1]);
      g.stroke();
    }

    if (mesh.haveHandles) {
      for (let h of mesh.handles.visible) {
        g.strokeStyle = color2css(getElemColor(mesh.handles, h));
        let v = h.owner.vertex(h);

        g.beginPath();
        g.moveTo(v[0], v[1]);
        g.lineTo(h[0], h[1]);
        g.stroke();
      }
    }

    let vlists = [mesh.verts]
    if (mesh.haveHandles) {
      vlists.push(mesh.handles);
    }

    for (let list of vlists) {
      for (let v of list.visible) {
        g.fillStyle = color2css(getElemColor(list, v));
        g.beginPath();
        g.rect(v[0] - w*0.5, v[1] - w*0.5, w, w);
        g.fill();
      }
    }

    if (workspace.drawFaces) {
      for (let f of mesh.faces.visible) {
        g.beginPath();
        let color = new Vector4(getElemColor(mesh.faces, f));
        color[3] = 0.15;

        g.fillStyle = color2css(color);
        for (let list of f.lists) {
          let first = true;
          for (let l of list) {
            if (first) {
              first = false;
              g.moveTo(l.v[0], l.v[1]);
            } else {
              g.lineTo(l.v[0], l.v[1]);
            }
          }

          g.closePath();
        }

        g.fill();
      }
    }

    const editUVs = workspace.editUVs;

    if (editUVs) {
      ctx.state.mesh.getUVMesh();

      for (let [key, ns] of ctx.state.mesh.neighborMap) {
        //key &= (1<<16) - 1; //mask out triangle key
        let width = workspace.uvImage.width;
        let height = workspace.uvImage.height;
        let scale2 = 1.0/(workspace.uvImage.width);

        let iy = ~~(key/width), ix = key - iy*width;
        ix += 0.5;
        iy += 0.5;

        ix *= scale2;
        iy *= scale2;

        g.beginPath();
        g.lineWidth = 1.0/scale;
        g.strokeStyle = "black";

        for (let i = 0; i < ns.length; i += 6) {
          let ix2 = ns[i] + 0.5, iy2 = ns[i + 1] + 0.5;

          ix2 *= scale2;
          iy2 *= scale2;

          g.moveTo(ix2, iy2);
          g.lineTo(ix, iy);
        }

        g.stroke();
      }
    } else {
      ctx.state.mesh.getUVMesh();

      let width = workspace.uvImage.width;
      let height = workspace.uvImage.height;

      let matrix = workspace.matrix;
      let tmp = new Vector2([0, 0]);

      function transform(ix, iy) {
        let p = tmp.loadXY(ix, iy);
        tmp.multVecMatrix(matrix);
        return tmp;
      }

      for (let [key, ns] of ctx.state.mesh.neighborMap) {
        //key &= (1<<16) - 1; //mask out triangle key
        let iy = ~~(key/width), ix = key - iy*width;
        ix += 0.5;
        iy += 0.5;

        [ix, iy] = transform(ix, iy);

        g.beginPath();
        g.lineWidth = 1.0/scale;
        g.strokeStyle = "black";

        for (let i = 0; i < ns.length; i += 6) {
          let ix2 = ns[i + 2] + 0.5, iy2 = ns[i + 3] + 0.5;
          let ix3 = ns[i + 4] + 0.5, iy3 = ns[i + 5] + 0.5;

          [ix2, iy2] = transform(ix2, iy2);
          [ix3, iy3] = transform(ix3, iy3);

          //console.log(ix2, iy2, ix3, iy3);

          g.moveTo(ix2, iy2);
          g.lineTo(ix3, iy3);
        }

        g.stroke();
      }
    }
  }

  getEditMenu() {
    let ret = [];

    for (let hk in this.keymap) {
      if (typeof hk === "string") {
        ret.push(hk.action);
      }
    }

    return ret;
  }

  pick(localX, localY, selmask = config.SELECTMASK, limit = 25) {
    let mesh = this.ctx.mesh;
    let workspace = this.ctx.workspace;

    if (!mesh) {
      return;
    }

    let scale = workspace.imatrix.$matrix.m11;

    limit *= scale;

    let mpos = new Vector3();
    mpos[0] = localX;
    mpos[1] = localY;
    mpos[2] = 0.0;

    let dpi = UIBase.getDPI();
    limit *= dpi;

    let mindis, minret;

    let vlist = (list) => {
      for (let v of list) {
        if (v.flag & MeshFlags.HIDE) {
          continue;
        }

        mpos[2] = v.length > 2 ? v[2] : 0.0;

        let dis = v.vectorDistance(mpos);
        if (dis >= limit) {
          continue;
        }

        if (!minret || dis < mindis) {
          mindis = dis;
          minret = pick_cachering.next().load(v, v.type, dis);
        }
      }
    }

    if (selmask & MeshTypes.VERTEX) {
      vlist(mesh.verts);
    }

    if (selmask & MeshTypes.HANDLE) {
      vlist(mesh.handles);
    }

    return minret ? minret.elem : undefined;
  }

  on_mousedown(localX, localY, e) {
    this.mdown = e.button === 0;
    this.startMpos.loadXY(localX, localY);

    this.updateHighlight(localX, localY);

    let mesh = this.ctx.mesh;

    if (mesh.hasHighlight) {
      let type, elem;

      for (let k in mesh.elists) {
        let elist = mesh.elists[k];

        if (elist.highlight) {
          type = elist.type;
          elem = elist.highlight;
        }
      }

      let mode;

      if (e.shiftKey) {
        mode = elem.flag & MeshFlags.SELECT ? SelToolModes.SUB : SelToolModes.ADD;
      } else {
        mode = SelToolModes.ADD;
      }

      this.ctx.api.execTool(this.ctx, "mesh.select_one", {
        mode,
        unique : !e.shiftKey,
        elemEid: elem.eid,
      });
    } else if (e.button === 0) {
      let co = new Vector3([localX, localY, 0]);

      this.ctx.api.execTool(this.ctx, "mesh.extrude_vertex", {
        co
      });

      this.updateHighlight(localX, localY);
    }
  }

  updateHighlight(localX, localY) {
    let elem = this.pick(localX, localY);
    let mesh = this.ctx.mesh;

    let update = false;

    /* Clear all other highlight. */
    mesh.setHighlight(undefined);
    update = mesh.setHighlight(elem);
    //console.log("set highlight", update);

    if (update) {
      window.redraw_all();
    }
    return update;
  }

  on_mousemove(localX, localY, e) {
    this.mpos.loadXY(localX, localY);

    if (haveModal()) {
      this.mdown = false;
      return;
    }

    this.updateHighlight(localX, localY);

    if (this.mdown) {
      let mesh = this.ctx.mesh;

      let act = false;
      let selmask = this.ctx.selMask;

      for (let elist of mesh.getElists()) {
        if (!(elist.type & selmask)) {
          continue;
        }

        act = act || elist.selected.length > 0;
      }

      let scale = this.ctx.workspace.imatrix.$matrix.m11;

      if (act && this.mpos.vectorDistance(this.startMpos) > 10*scale) {
        this.mdown = false;
        this.ctx.api.execTool(this.ctx, "transform.translate()");
      }
    }
  }

  on_mouseup(localX, localY, e) {
    this.mdown = false;
  }
}
