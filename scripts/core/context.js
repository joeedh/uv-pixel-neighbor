import config from '../config/config.js';

/* Set default undo handlers; they just saves and reload the file
*  minus the screen layout.*/

import {simple, ToolOp} from '../path.ux/scripts/pathux.js';
import {Workspace} from './editor.js';
import {MeshTypes} from './mesh.js';
import {MeshWithUVMesh} from './uvmesh.js';

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

export class Context {
  constructor(state) {
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

  static defineAPI(api, st) {
    st.dynamicStruct("properties", "properties", "Properties");
    st.struct("workspace", "workspace", "Workspace", api.mapStruct(Workspace));
    st.struct("mesh", "mesh", "Mesh", api.mapStruct(MeshWithUVMesh));
  }

  makeUVContext() {
    let cls = this.constructor;

    class UVContext extends cls {
      get mesh() {
        return this.state.mesh.getUVMesh();
      }
    }

    return new UVContext(this.state);
  }
}
