import config from '../config/config.js';
import {ContextOverlay, Context} from '../path.ux/scripts/pathux.js';

/* Set default undo handlers; they just saves and reload the file
*  minus the screen layout.*/

import {simple, ToolOp} from '../path.ux/scripts/pathux.js';
import {Workspace} from './editor.js';
import {MeshTypes} from './mesh.js';
import {MeshWithUVMesh} from './uvmesh.js';
import * as ui_noteframe from '../path.ux/scripts/widgets/ui_noteframe.js';

ToolOp.prototype.undoPre = function (ctx) {
  this._undo = ctx.state.saveFileSync({
    doScreen: false
  });
}

ToolOp.prototype.undo = function (ctx) {
  ctx.state.loadFileSync(this._undo, {
    resetToolStack: false,
    resetContext  : false,
    doScreen      : false,
    resetOnLoad   : false
  });
}

export class ToolOverlay extends ContextOverlay {
  constructor(state) {
    super(state);
    this.state = state;
  }

  get workspace() {
    return simple.Editor.findEditor(Workspace);
  }

  get selMask() {
    return config.SELECTMASK;
  }

  get mesh() {
    return this.state.mesh;
  }

  get properties() {
    return this.state.properties;
  }

  get api() {
    return this.state.api;
  }

  get toolstack() {
    return this.state.toolstack;
  }

  get screen() {
    return this.state.screen;
  }

  message(msg, timeout = 2500) {
    return ui_noteframe.message(this.screen, msg, timeout);
  }

  error(msg, timeout = 2500) {
    return ui_noteframe.error(this.screen, msg, timeout);
  }

  warning(msg, timeout = 2500) {
    return ui_noteframe.warning(this.screen, msg, timeout);
  }

  progressBar(msg, percent, color, timeout = 1000) {
    return ui_noteframe.progbarNote(this.screen, msg, percent, color, timeout);
  }
}

export class ToolContext extends Context {
  constructor(state) {
    super(state);

    this.pushOverlay(new ToolOverlay(state));
  }

  static defineAPI(api, st) {
    st.dynamicStruct("properties", "properties", "Properties");
    st.struct("workspace", "workspace", "Workspace", api.mapStruct(Workspace));
    st.struct("mesh", "mesh", "Mesh", api.mapStruct(MeshWithUVMesh));
  }

  makeUVContext() {
    class UVContext extends ToolOverlay {
      get mesh() {
        return this.state.mesh.getUVMesh();
      }
    }

    let ctx = new Context(this.state);
    ctx.pushOverlay(new UVContext(this.state));

    return ctx;
  }
}
