import config from '../config/config.js';

import {
  util, math, Vector2, Vector3, Vector4, Matrix4,
  nstructjs, ToolOp, IntProperty, FloatProperty,
  Vec3Property, Vec4Property, Vec2Property, FlagProperty, keymap, reverse_keymap
} from '../path.ux/pathux.js';

import {Vertex, MeshTypes, MeshFlags} from './mesh.js';

const VecProperty = (new Vertex()).length === 3 ? Vec3Property : Vec2Property;
const Vector = (new Vertex()).length === 3 ? Vector3 : Vector2;
const VectorSize = (new Vertex()).length;

export class TransformList extends Array {
  constructor(typeName, selmask) {
    super();

    this.typeName = typeName;
    this.selMask = selmask;
  }
}

export const TransformClasses = [];

export class TransformElem {
  constructor() {

  }

  static undoPre(mesh, selMask, list) {
    throw new Error("implement me!");
  }

  static undo(mesh, selMask, data) {
    throw new Error("implement me!");
  }

  static create(mesh, selMask) {
    throw new Error("implement me!");
  }

  static transformDefine() {
    return {
      typeName: "",
      uiName  : "",
      selMask : 0
    }
  }

  static register(cls) {
    TransformClasses.push(cls);
  }

  static getClass(typeName) {
    for (let cls of TransformClasses) {
      if (cls.transformDefine().typeName === typeName) {
        return cls;
      }
    }
  }

  minmax(min, max) {
    throw new Error("implement me!");
  }

  apply(matrix) {
    throw new Error("implement me!");
  }
}

export class TransformVert extends TransformElem {
  constructor(v) {
    super();

    this.v = v;
    this.start = new Vector(v);
  }

  static create(mesh, selMask) {
    let list = new TransformList(this.transformDefine().typeName, selMask);

    let doList = (elist) => {
      for (let v of elist.selected.editable) {
        list.push(new this(v));
      }
    }

    if (selMask & MeshTypes.VERTEX) {
      doList(mesh.verts);
    }

    if (mesh.haveHandles && (selMask & MeshTypes.HANDLE)) {
      doList(mesh.handles);
    }

    return list;
  }

  static undoPre(mesh, selMask, list) {
    let ret = [];

    for (let td of list) {
      let vlen = td.v.length;

      for (let td of list) {
        ret.push(td.v.eid);

        for (let i = 0; i < vlen; i++) {
          ret.push(td.v[i]);
        }
      }
    }

    return ret;
  }

  static undo(mesh, selMask, data) {
    let vlen = VectorSize + 1;

    for (let i = 0; i < data.length; i += vlen) {
      let eid = data[i];

      let elem = mesh.eidMap.get(eid);
      if (!elem) {
        console.error("Missing element " + eid);
        continue;
      }

      for (let j = 0; j < VectorSize; j++) {
        elem[j] = data[i + j + 1];
      }
    }
  }

  static transformDefine() {
    return {
      typeName: "verts",
      uiName  : "verts",
      selMask : MeshTypes.VERTEX | MeshTypes.HANDLE
    }
  }

  minmax(min, max) {
    min.min(this.start);
    max.max(this.start);
  }

  apply(matrix) {
    this.v.load(this.start);
    this.v.multVecMatrix(matrix);
  }
}

TransformElem.register(TransformVert);

export class TransformOp extends ToolOp {
  constructor() {
    super();

    this.inputStr = '';

    this.transData = undefined;

    this.deltaMpos = new Vector2();
    this.startMpos = new Vector2();
    this.lastMpos = new Vector2();
    this._lastMpos = new Vector2();
    this.mpos = new Vector2();

    this.first = true;
  }

  modalEnd(was_cancelled) {
    if (this.modal_ctx) {
      this.modal_ctx.state.mesh.flushUVs();
      this.modal_ctx.state.mesh.structureGen++;
      this.modal_ctx.workspace.setInfoText("");
    }

    super.modalEnd(was_cancelled);
  }

  static tooldef() {
    return {
      inputs: {
        selMask: new FlagProperty(config.SELECTMASK, MeshTypes),
        center : new VecProperty(),
        value  : new VecProperty()
      }
    }
  }

  calcTransCenter(tdata) {
    let min = new Vector();
    let max = new Vector();

    min.addScalar(1e17);
    max.addScalar(-1e17);
    for (let list of tdata) {
      for (let td of list) {
        td.minmax(min, max);
      }
    }

    this.inputs.center.setValue(min.interp(max, 0.5));
  }

  getTransData(ctx, doCenter = true) {
    if (this.transData) {
      if (doCenter) {
        this.calcTransCenter(this.transData);
      }

      return this.transData;
    }

    let ret = [];
    let mesh = ctx.mesh;
    let selMask = this.inputs.selMask.getValue();

    for (let list of TransformClasses) {
      ret.push(list.create(mesh, selMask));
    }

    if (doCenter) {
      this.calcTransCenter(ret);
    }

    this.transData = ret;
    return ret;
  }

  applyUpdate(ctx) {
    ctx.state.mesh.flushUVs();
    window.redraw_all();
  }

  execPost(ctx) {
    this.transData = undefined;
    this.applyUpdate(ctx);
  }

  execPre(ctx) {
    this.getTransData(ctx);
    window.redraw_all();
  }

  modalStart(ctx) {
    super.modalStart(ctx);
    this.getTransData(ctx);
  }

  undoPre(ctx) {
    this._undo = {};
    this._undoSelMask = this.inputs.selMask.getValue();

    let tdata = this.getTransData(ctx)

    let selMask = this.inputs.selMask.getValue();
    let mesh = ctx.mesh;

    for (let list of tdata) {
      let cls = TransformElem.getClass(list.typeName);
      this._undo[list.typeName] = cls.undoPre(ctx.mesh, selMask, list);
    }

    //save all uvs in base mesh too
    let undo = this._undoUv = [];
    for (let l of ctx.state.mesh.loops) {
      undo.push(l.eid);
      undo.push(l.uv[0]);
      undo.push(l.uv[1]);
    }

    window.redraw_all();
  }

  redo(ctx) {
    if (ctx.mesh !== ctx.state.mesh) {
      this._swapUndoUvs(ctx);
    } else {
      super.redo(ctx);
    }
  }

  _swapUndoUvs(ctx) {
    let baseMesh = ctx.state.mesh;
    let ud = this._undoUv;

    for (let i=0; i<ud.length; i += 3) {
      let eid = ud[i], u = ud[i+1], v = ud[i+2];

      let l = baseMesh.eidMap.get(eid);

      if (!l) {
        console.warn("Failed to find loop " + eid);
        continue;
      }

      ud[i+1] = l.uv[0];
      ud[i+2] = l.uv[1];

      l.uv[0] = u;
      l.uv[1] = v;
    }

    baseMesh.flushToVertUVs();
    window.redraw_all();
  }

  undo(ctx) {
    let mesh = ctx.mesh;

    for (let k in this._undo) {
      TransformElem.getClass(k).undo(mesh, this._undoSelMask, this._undo[k]);
    }

    this._swapUndoUvs(ctx);

    mesh.structureGen++;
    window.redraw_all();
  }

  on_pointerup(e) {
    this.modalEnd(false);
  }

  on_pointercancel(e) {
    this.modalEnd(true); //will cancel
  }


  transformInput(val) {
    return val;
  }

  handleInput() {
    let val = parseFloat(this.inputStr);
    if (isNaN(val)) {
      return;
    }

    val = this.transformInput(val);

    let vec = new Vector();
    for (let i = 0; i < vec.length; i++) {
      vec[i] = val;
    }

    this.inputs.value.setValue(vec);
  }

  setValue(val) {
    this.inputs.value.setValue(val);
    this.handleInput();
  }

  on_keydown(e) {
    super.on_keydown(e);
    let char = reverse_keymap[e.keyCode];
    let ctx = this.modal_ctx;

    let istr = this.inputStr;

    switch (e.keyCode) {
      case keymap["Backspace"]:
        if (this.inputStr.length > 0) {
          this.inputStr = this.inputStr.slice(0, this.inputStr.length - 1);
        }
        break;
      case keymap["Enter"]:
      case keymap["Space"]:
        this.modalEnd(false);
        break;
      case keymap["Escape"]:
        this.modalEnd(true);
        break;
      default:
        if (char) {
          this.inputStr += char;
        }
        break;
    }

    if (ctx) {
      if (this.inputStr.trim()) {
        this.handleInput();
        this.exec(ctx);
        window.redraw_all();
      }

      ctx.workspace.setInfoText(this.inputStr);
    }

    console.log(this.inputStr);
  }

  on_pointermove(e) {
    let ctx = this.modal_ctx;

    let workspace = ctx.workspace;

    let mpos = workspace.getLocalMouse(e.x, e.y);

    if (this.first) {
      this.startMpos.load(mpos);
      this.lastMpos.load(mpos);
      this.deltaMpos.zero();
      this.mpos.load(mpos);
      this._lastMpos.load(mpos);

      this.first = false;
      return;
    }

    this.lastMpos.load(this._lastMpos);
    this.deltaMpos.load(mpos).sub(this.lastMpos);

    this.mpos.load(mpos);
    this._lastMpos.load(mpos);
  }
}

export class TranslateOp extends TransformOp {
  constructor() {
    super();
  }

  static tooldef() {
    return {
      uiname  : "Move",
      toolpath: "transform.translate",
      inputs  : ToolOp.inherit({}),
      is_modal: true,
    }
  }

  on_pointermove(e) {
    super.on_pointermove(e);

    let delta = new Vector2(this.mpos).sub(this.startMpos);
    delta = new Vector().loadXY(delta[0], delta[1]);

    this.setValue(delta);
    this.exec(this.modal_ctx);
  }

  exec(ctx) {
    let delta = this.inputs.value.getValue();

    let matrix = new Matrix4();
    matrix.translate(delta[0], delta[1], delta[2] ?? 0.0);

    let tdata = this.getTransData(ctx);

    for (let tlist of tdata) {
      for (let td of tlist) {
        td.apply(matrix);
      }
    }

    this.applyUpdate(ctx);
  }
}

ToolOp.register(TranslateOp);


export class ScaleOp extends TransformOp {
  constructor() {
    super();
  }

  static tooldef() {
    return {
      uiname  : "Move",
      toolpath: "transform.scale",
      inputs  : ToolOp.inherit({}),
      is_modal: true,
    }
  }

  on_pointermove(e) {
    let ctx = this.modal_ctx;
    let workspace = ctx.workspace;

    super.on_pointermove(e);

    this.resetTempGeom();

    let delta = new Vector2(this.mpos).sub(this.startMpos);
    delta = new Vector().loadXY(delta[0], delta[1]);

    let center = this.inputs.center.getValue();

    let l1 = this.startMpos.vectorDistance(center);
    let l2 = this.mpos.vectorDistance(center);

    if (l1 === 0.0 || l2 === 0.0) {
      return;
    }

    let scenter = workspace.getGlobalMouse(center[0], center[1]);

    this.makeTempLine([e.x, e.y], scenter);

    let ratio = l2/l1;
    let scale = new Vector().addScalar(1.0);

    scale.loadXY(ratio, ratio);

    this.setValue(scale);
    this.exec(this.modal_ctx);
  }

  exec(ctx) {
    let scale = this.inputs.value.getValue();
    let center = this.inputs.center.getValue();

    let tmat1 = new Matrix4();
    let tmat2 = new Matrix4();

    tmat1.translate(-center[0], -center[1], -(center[2] ?? 0.0));
    tmat2.translate(center[0], center[1], (center[2] ?? 0.0));

    let matrix = new Matrix4();

    matrix.multiply(tmat2);
    matrix.scale(scale[0], scale[1], scale[2] ?? 1.0);
    matrix.multiply(tmat1);

    let tdata = this.getTransData(ctx);

    for (let tlist of tdata) {
      for (let td of tlist) {
        td.apply(matrix);
      }
    }

    this.applyUpdate(ctx);
  }
}

ToolOp.register(ScaleOp);


export class RotateOp extends TransformOp {
  constructor() {
    super();
  }

  static tooldef() {
    return {
      uiname  : "Move",
      toolpath: "transform.rotate",
      inputs  : ToolOp.inherit({}),
      is_modal: true,
    }
  }

  on_pointermove(e) {
    let ctx = this.modal_ctx;
    let workspace = ctx.workspace;

    super.on_pointermove(e);

    this.resetTempGeom();

    let {center, value} = this.getInputs();
    let th = value[0];

    let scenter = workspace.getGlobalMouse(center[0], center[1]);
    this.makeTempLine([e.x, e.y], scenter);

    let d1 = new Vector2(this.lastMpos);
    let d2 = new Vector2(this.mpos);

    d1.sub(center).normalize();
    d2.sub(center).normalize();

    let dth = Math.asin((d1[0]*d2[1] - d1[1]*d2[0])*0.99999);

    th += dth;

    value[0] = th;

    this.setValue(value);
    this.exec(this.modal_ctx);
    this.lastMpos.load(this.mpos);
  }

  exec(ctx) {
    let {center, value} = this.getInputs();

    let th = value[0];

    let tmat1 = new Matrix4();
    let tmat2 = new Matrix4();

    tmat1.translate(center[0], center[1], (center[2] ?? 0.0));
    tmat2.translate(-center[0], -center[1], -(center[2] ?? 0.0));

    let matrix = new Matrix4();
    let rotmat = new Matrix4();
    rotmat.euler_rotate(0.0, 0.0, th);

    matrix.multiply(tmat1);
    matrix.multiply(rotmat);
    matrix.multiply(tmat2);

    let tdata = this.getTransData(ctx);

    for (let tlist of tdata) {
      for (let td of tlist) {
        td.apply(matrix);
      }
    }

    this.applyUpdate(ctx);
  }
}

ToolOp.register(RotateOp);
