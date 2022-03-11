import {
  simple, util, Vector2, Vector3, Matrix4, math, ToolOp, PropTypes, NumberConstraints, TextBox, TextBoxBase
} from '../path.ux/pathux.js';

import './editor.js';
import {Mesh, MeshTypes} from './mesh.js';
import {Workspace} from './editor.js';
import {FileArgs} from '../path.ux/scripts/simple/file.js';
import {PropertiesBag} from './property_templ.js';
import {Context} from './context.js';
import {MeshWithUVMesh} from './uvmesh.js';
import {DefaultFile} from './default_file.js';

export const STARTUP_FILE_KEY = "_uv_mesh_texel_map";

export const Properties = {
  steps    : {type: "int", value: 1, min: 0, max: 10, slideSpeed: 5},
  pixelSize: {type: "int", value: 50, min: 1, max: 500, slideSpeed: 5, step: 1},
  imageSize: {type: "int", value: 15, min: 2, max: 400, slideSpeed: 5, step: 1},
};

window.addEventListener("contextmenu", (e) => {
  console.log(e);

  if (window._appstate && _appstate.screen) {
    let elem = _appstate.screen.pickElement(e.x, e.y);

    if (elem instanceof TextBoxBase || elem.tagName === "INPUT") {
      return;
    }
  }
  e.preventDefault();
});

export class App extends simple.AppState {
  constructor() {
    super(Context);

    this.mesh = undefined;
    this.properties = undefined;

    this.createNewFile(true);

    this.saveFilesInJSON = true;
    this.defaultEditorClass = Workspace;
  }

  makeScreen() {
    super.makeScreen();

    let screen = this.screen;

    for (let sarea of screen.sareas) {
      if (sarea.area instanceof Workspace) {
        let sarea2 = screen.splitArea(sarea, 0.5, false);

        sarea2.area.editUVs = true;
        break;
      }
    }

    screen.update();
    return screen;
  }

  createNewFile(noReset = false) {
    if (!noReset) {
      this.reset();
      this.makeScreen();
    }

    this.properties = new PropertiesBag(Properties);

    this.mesh = new MeshWithUVMesh();
    let s = 50;
    let d = 200;
    let v1 = this.mesh.makeVertex([s, s, 0]);
    let v2 = this.mesh.makeVertex([s, s + d, 0]);
    let v3 = this.mesh.makeVertex([s + d, s + d, 0]);
    let v4 = this.mesh.makeVertex([s + d, s, 0]);

    let f = this.mesh.makeFace([v1, v2, v3, v4]);
    this.mesh.resizeUVs();

    this.loadFileSync(DefaultFile, {
      useJSON       : true,
      resetToolStack: false,
      resetContext  : false,
      resetOnLoad   : false,
      doScreen      : false,
    })
  }

  saveStartupFile() {
    this.saveFile().then((json) => {
      json = JSON.stringify(json);

      localStorage[STARTUP_FILE_KEY] = json;
      console.log("Saved startup file", (json.length/1024.0).toFixed(2) + "kb");
    });
  }

  loadStartupFile() {
    if (!(STARTUP_FILE_KEY in localStorage)) {
      return;
    }

    try {
      let json = JSON.parse(localStorage[STARTUP_FILE_KEY]);
      this.loadFile(json);
    } catch (error) {
      util.print_stack(error);
      console.warn("Failed to load startup file");
    }
  }

  saveFileSync(objects, args = {}) {
    if (args.useJSON === undefined) {
      args.useJSON = true;
    }

    return super.saveFileSync([
      this.mesh, this.properties
    ], args);
  }

  saveFile(args = {}) {
    return new Promise((accept, reject) => {
      accept(this.saveFileSync([this.mesh, this.properties], args));
    });
  }

  loadFileSync(data, args = {}) {
    if (args.useJSON === undefined) {
      args.useJSON = true;
    }

    let file = super.loadFileSync(data, args);
    console.log(file.objects);

    this.mesh = file.objects[0];
    this.properties = file.objects[1] ?? this.properties;

    this.properties.patchTemplate(Properties);

    window.redraw_all();

    return file;
  }

  loadFile(data, args = {}) {
    return new Promise((accept, reject) => {
      accept(this.loadFileSync(data, args));
    });
  }

  draw() {
    for (let sarea of this.screen.sareas) {
      if (sarea.area && sarea.area.draw) {
        sarea.area.draw();
      }
    }
  }

  start() {
    super.start({
      DEBUG             : {
        modalEvents: true
      },
      useAreaTabSwitcher: true,
    });

    this.loadStartupFile();
  }
}

export function start() {
  console.log("start!");

  document.body.style.margin = "0px";
  document.body.style.padding = "0px";
  document.body.style.overflow = "hidden";

  let animreq = undefined;

  function f() {
    animreq = undefined;

    _appstate.draw();
  }

  window.redraw_all = function () {
    if (animreq) {
      return;
    }

    animreq = requestAnimationFrame(f);
  }

  window._appstate = new App();
  _appstate.start();

  window.redraw_all();
}