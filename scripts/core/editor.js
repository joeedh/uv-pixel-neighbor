import {
  simple, nstructjs, util, math, Vector2, Matrix4, UIBase, Icons, KeyMap, haveModal, ToolOp, HotKey, ToolClasses,
  createMenu, startMenu
} from '../path.ux/pathux.js';
import {getElemColor} from './mesh.js';
import {MeshEditor} from './mesh_editor.js';
import {init_webgl, Texture} from '../webgl/webgl.js';
import {loadShaders, Shaders} from '../webgl/shaders.js';
import {GPUMesh} from '../webgl/gpumesh.js';

export class LoadDefaultsOp extends ToolOp {
  static tooldef() {
    return {
      uiname  : "Load Defaults",
      toolpath: "app.load_defaults",
      inputs  : {},
      outputs : {}
    }
  }

  exec(ctx) {
    ctx.state.createNewFile(true);
    window.redraw_all();
  }
}

ToolOp.register(LoadDefaultsOp);

function initGL() {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  canvas.style["position"] = "absolute";
  canvas.style["left"] = "0px";
  canvas.style["top"] = "0px";
  canvas.style["z-index"] = -2;

  window._gl = init_webgl(canvas, {}, true);
  loadShaders(_gl);

  return _gl;
}

export class Workspace extends simple.Editor {
  constructor() {
    super();

    this.drawFaces = true;

    this.glPos = new Vector2();
    this.glSize = new Vector2([512, 512]);

    this.uvImage = undefined;

    this.canvas = document.createElement("canvas");
    this.g = this.canvas.getContext("2d");

    this.matrix = new Matrix4();
    this.imatrix = new Matrix4();

    this.mpos = new Vector2();

    this.editUVs = false;

    this.toolmode = new MeshEditor();
    this.shadow.appendChild(this.canvas);

    this.keymap = new KeyMap();

    this.keymap.add(new HotKey("Space", [], () => {
      let menu = [];

      for (let cls of ToolClasses) {
        let def = cls.tooldef();

        menu.push(def.toolpath);
      }

      menu = createMenu(this.ctx, "Find Tool", menu);

      let mpos = this.ctx.screen.mpos;
      startMenu(menu, mpos[0], mpos[1], true);

      console.log(menu);
    }));

    let eventBad = (e) => {
      if (haveModal()) {
        return true;
      }

      let elem = this.ctx.screen.pickElement(e.x, e.y);
      return elem && elem !== this && elem !== this.canvas;
    }

    this.addEventListener("pointerover", (e) => {
      let mpos = this.getLocalMouse(e.x, e.y);
      this.mpos.load(mpos);
    });

    this.addEventListener("pointerdown", (e) => {
      let mpos = this.getLocalMouse(e.x, e.y);
      this.mpos.load(mpos);

      if (eventBad(e)) {
        return;
      }

      this.push_ctx_active();
      this.toolmode.on_mousedown(mpos[0], mpos[1], e);
      this.pop_ctx_active();
    });

    this.addEventListener("pointermove", (e) => {
      let mpos = this.getLocalMouse(e.x, e.y);
      this.mpos.load(mpos);

      if (eventBad(e)) {
        return;
      }

      this.push_ctx_active();
      this.toolmode.on_mousemove(mpos[0], mpos[1], e);
      this.pop_ctx_active();
    });

    this.addEventListener("pointerup", (e) => {
      let mpos = this.getLocalMouse(e.x, e.y);
      this.mpos.load(mpos);

      if (eventBad(e)) {
        return;
      }

      this.push_ctx_active();
      this.toolmode.on_mouseup(mpos[0], mpos[1], e);
      this.pop_ctx_active();
    });
  }

  get ctx() {
    return this._ctx;
  }

  set ctx(v) {
    //console.warn("set ctx");
    this._ctx = v;
  }

  static defineAPI(api, st) {
    function onchange() {
      this.dataref.update();
      window.redraw_all();
    }

    st.bool("editUVs", "editUVs", "Edit UVs").on('change', onchange);
    st.bool("drawFaces", "drawFaces", "Draw Faces").on('change', onchange);
  }

  static define() {
    return {
      tagname : "workspace-editor-x",
      areaname: "workspace-editor-x",
      uiname  : "Workspace",
    }
  }

  getGlobalMouse(x, y) {
    let mpos = new Vector2();
    let r = this.canvas.getBoundingClientRect();

    let dpi = UIBase.getDPI();

    mpos[0] = x;
    mpos[1] = y;

    mpos.multVecMatrix(this.matrix);

    mpos[0] = mpos[0]/dpi + r.x;
    mpos[1] = mpos[1]/dpi + r.y;

    return mpos;
  }

  getLocalMouse(x, y) {
    let mpos = new Vector2();
    let r = this.canvas.getBoundingClientRect();

    let dpi = UIBase.getDPI();

    mpos[0] = (x - r.x)*dpi;
    mpos[1] = (y - r.y)*dpi;

    mpos.multVecMatrix(this.imatrix);

    return mpos;
  }

  getKeyMaps() {
    return [this.keymap, this.toolmode.keymap];
  }

  init() {
    super.init();

    if (!window._gl) {
      initGL();
    }

    this.gl = window._gl;

    this.toolmode.ctx = this.ctx;

    let sidebar = this.makeSideBar();

    let header = this.header;
    let row;

    row = header.row();
    row.iconbutton(Icons.UNDO, "Undo", () => {
      this.ctx.toolstack.undo();
    });
    row.iconbutton(Icons.REDO, "Redo", () => {
      this.ctx.toolstack.redo();
    });

    row.prop("workspace.editUVs");
    row.prop("mesh.snapUVs");
    row.prop("workspace.drawFaces");

    row.button("Save Defaults", () => {
      _appstate.saveStartupFile();
    })

    row.tool("app.load_defaults()");

    let tab;
    tab = sidebar.tab("Options");

    let props = UIBase.createElement("props-bag-editor-x");
    props.setAttribute("datapath", "properties");

    tab.add(props);

    let col = tab.col();
    col.useIcons(false);

    col.tool("mesh.triangulate");
    col.tool("mesh.resize_uvs");
    col.tool("mesh.reset_uvs");

    this.infoHeader = this.container.row();
    this.infoLabel = this.infoHeader.label("");
  }

  setInfoText(text) {
    this.infoLabel.text = "" + text;
  }

  makeUVImage() {
    let dimen = this.ctx.properties.imageSize;

    let image = new ImageData(dimen, dimen);
    let idata = image.data;

    for (let i = 0; i < dimen*dimen; i++) {
      let y = ~~(i/dimen), x = i - (y*dimen);
      let f = (x + (y & 1)) & 1;

      f = f*0.05 + 0.95;

      let idx = i*4;
      idata[idx] = idata[idx + 1] = idata[idx + 2] = f*255;
      idata[idx + 3] = 255;
    }

    let mesh = this.ctx?.state.mesh;
    if (mesh) {
      mesh.flushUVs();
      mesh.rasterize(image);
    }

    let canvas = document.createElement("canvas");
    let g = canvas.getContext("2d");
    canvas.width = dimen;
    canvas.height = dimen;

    g.putImageData(image, 0, 0);

    let gl = this.gl;
    let tex = new Texture(gl.createTexture(), gl);

    tex.load(gl, image.width, image.height, image.data, undefined, false);
    tex.texParameteri(gl, gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    tex.texParameteri(gl, gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    this.glTex = tex;

    this.uvImage = canvas;
    return canvas;
  }

  checkGLSize() {
    let w = window.innerWidth - 25;
    let h = window.innerHeight - 25;

    let dpi = UIBase.getDPI();
    w = ~~(w*dpi);
    h = ~~(h*dpi);

    let canvas = this.gl.canvas;

    if (w !== canvas.width || h !== canvas.height) {
      console.warn("Resizing webgl canvas");

      canvas.width = w;
      canvas.height = h;

      canvas.style["width"] = (w/dpi) + "px";
      canvas.style["height"] = (h/dpi) + "px";
    }
  }

  drawGL() {
    let gl = this.gl = window._gl;
    this.checkGLSize();

    let dpi = UIBase.getDPI();

    let r = this.canvas.getBoundingClientRect();
    if (!r) {
      window.redraw_all();
      return;
    }

    this.glPos.loadXY(r.x, r.y).mulScalar(dpi);
    this.glSize.loadXY(r.width, r.height).mulScalar(dpi);

    this.glPos[1] = gl.canvas.height - (this.glPos[1] + this.glSize[1]);
    this.glPos.floor();
    this.glSize.ceil();

    gl.enable(gl.SCISSOR_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.scissor(this.glPos[0], this.glPos[1], this.glSize[0], this.glSize[1]);
    gl.viewport(this.glPos[0], this.glPos[1], this.glSize[0], this.glSize[1]);

    gl.clearColor(0.7, 0.8, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let mesh = this.ctx.mesh;
    if (!mesh.loopTris) {
      mesh.loopTris = mesh.calcLoopTris();
    }

    let ltris = mesh.loopTris;

    let gpumesh = new GPUMesh(gl, gl.TRIANGLES, ltris.length/3);

    let cos = [];
    let uvs = [];
    let tris = [];

    function push(list) {
      for (let i = 1; i < arguments.length; i++) {
        list.push(arguments[i]);
      }
    }

    for (let i = 0; i < ltris.length; i += 3) {
      let l1 = ltris[i], l2 = ltris[i + 1], l3 = ltris[i + 2];

      push(tris, 0, 0);
      push(tris, 1, 0);
      push(tris, 0, 1);

      push(uvs, l1.uv[0], l1.uv[1]);
      push(uvs, l2.uv[0], l2.uv[1]);
      push(uvs, l3.uv[0], l3.uv[1]);

      push(cos, l1.v[0], l1.v[1]);
      push(cos, l2.v[0], l2.v[1]);
      push(cos, l3.v[0], l3.v[1]);
    }

    gpumesh.addLayer(2, "co", cos);
    gpumesh.addLayer(2, "uv", uvs);
    gpumesh.addLayer(2, "tri", tris);

    let matrix = new Matrix4(this.matrix);
    let smat = new Matrix4();
    smat.scale(2.0/this.glSize[0], -2.0/this.glSize[1], 1.0);

    let tmat = new Matrix4();
    tmat.translate(-1.0, 1.0, 0.0);

    matrix.preMultiply(smat);
    matrix.preMultiply(tmat);

    gpumesh.draw(gl, {
      projectionMatrix: matrix,
      tex             : this.glTex,
    }, {}, Shaders.BasicShader);

    gpumesh.destroy();
  }

  draw() {
    this.gl = window._gl;

    if (!this.ctx) {
      return;
    }

    //if (!this.uvImage) {
    if (this.editUVs) {
      this.makeUVImage();
    } else {
      //try to find other editor's image
      let ok = false;

      for (let sarea of this.ctx.screen.sareas) {
        if (sarea.area && sarea.area instanceof Workspace && sarea.area.editUVs) {
          let ws = sarea.area;

          if (!ws.uvImage) {
            ws.makeUVImage();
          }

          ok = true;
          this.uvImage = ws.uvImage;
          this.glTex = ws.glTex;
        }
      }

      if (!ok || !this.uvImage) {
        this.makeUVImage();
      }
    }
    //}

    this.push_ctx_active(true);

    let canvas = this.canvas;

    let dpi = UIBase.getDPI();
    let w = ~~(this.size[0]*dpi);
    let h = ~~(this.size[1]*dpi) - 50*dpi;

    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w;
      canvas.height = h;

      canvas.style["width"] = "" + (w/dpi) + "px";
      canvas.style["height"] = "" + (h/dpi) + "px";
    }

    this.g.clearRect(0, 0, canvas.width, canvas.height);

    let scale = 1.0;

    this.g.save();

    this.matrix.makeIdentity();

    if (this.editUVs) {
      scale = this.ctx.properties.pixelSize;

      this.g.scale(scale, scale);

      this.g.imageSmoothingEnabled = false;
      this.g.drawImage(this.uvImage, 0, 0);

      let scale2 = this.uvImage.width;

      this.g.scale(scale2, scale2);

      scale *= scale2;
      this.matrix.scale(scale, scale, scale);
    }
    this.imatrix.load(this.matrix).invert();

    this.toolmode.draw(this.ctx, this.canvas, this.g, scale);

    this.g.restore();

    this.drawGL();
    this.pop_ctx_active(true);
  }

  update() {
    super.update();

    this.ctx.mesh.pixelSize = this.ctx.properties.pixelSize;

    if (this.editUVs && this.ctx === this.ctx.state.ctx) {
      this.ctx = this.ctx.makeUVContext();
      this.toolmode.ctx = this.ctx;
      console.log("setting ctx to uvs", this._id);
    } else if (!this.editUVs && this.ctx !== this.ctx.state.ctx) {
      this.ctx = this.ctx.state.ctx;
      this.toolmode.ctx = this.ctx;
      console.log("setting ctx from uvs", this._id);
    }
  }

  setCSS() {
    this.canvas.style["position"] = "absolute";
  }
}

Workspace.STRUCT = nstructjs.inherit(Workspace, simple.Editor, "Workspace") + `
  editUVs           : bool;
  drawFaces         : bool;
}`;
simple.Editor.register(Workspace);

