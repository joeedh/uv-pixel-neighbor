export const DefaultFile = {
  "magic"     : "STRT", "version_major": 0, "version_minor": 0, "version_micro": 1, "flags": 0,
  "schema"    : "Object id=0 {\n}\nIDGen id=1 {\ncur : int;\n}\nvec4 id=2 {\n0 : float;\n1 : float;\n2 : float;\n3 : float;\n}\nvec3 id=3 {\n0 : float;\n1 : float;\n2 : float;\n}\nvec2 id=4 {\n0 : float;\n1 : float;\n}\nquat id=5 {\n0 : float;\n1 : float;\n2 : float;\n3 : float;\n}\nmat4 id=6 {\nmat : array(float);\nisPersp : int;\n}\nCurveTypeData id=7 {\ntype : string;\n}\nCurve1DPoint id=8 {\n0 : float;\n1 : float;\neid : int;\nflag : int;\ntangent : int;\nrco : vec2;\n}\nBSplineCurve id=9 {\ntype : string;\npoints : array(Curve1DPoint);\ndeg : int;\neidgen : IDGen;\ninterpolating : bool;\nrange : array(vec2);\n}\nEquationCurve id=10 {\ntype : string;\nequation : string;\n}\nGuassianCurve id=11 {\ntype : string;\nheight : float;\noffset : float;\ndeviation : float;\n}\nParamKey id=12 {\nkey : string;\nval : float;\n}\nSimpleCurveBase id=13 {\ntype : string;\nparams : array(ParamKey);\n}\nBounceCurve id=14 {\ntype : string;\nparams : array(ParamKey);\n}\nElasticCurve id=15 {\ntype : string;\nparams : array(ParamKey);\n}\nEaseCurve id=16 {\ntype : string;\nparams : array(ParamKey);\n}\nRandCurve id=17 {\ntype : string;\nparams : array(ParamKey);\n}\nCurve1D id=18 {\ngenerators : array(abstract(CurveTypeData));\n_active : string;\nVERSION : float;\nuiZoom : float;\n}\nToolProperty id=19 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\n}\nFloatArrayProperty id=20 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nvalue : array(float);\n}\nStringProperty id=21 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\ndata : string;\n}\n_NumberPropertyBase id=22 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\n}\nIntProperty id=23 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndata : int;\n}\nReportProperty id=24 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\ndata : string;\n}\nBoolProperty id=25 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\ndata : bool;\n}\nFloatProperty id=26 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndecimalPlaces : int;\ndata : float;\n}\nEnumKeyPair id=27 {\nkey : string;\nval : string;\nkey_is_int : bool;\nval_is_int : bool;\n}\nEnumProperty id=28 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\ndata : string;\ndata_is_int : bool;\n_keys : array(EnumKeyPair);\n_values : array(EnumKeyPair);\n_ui_value_names : array(EnumKeyPair);\n_iconmap : array(EnumKeyPair);\n_iconmap2 : array(EnumKeyPair);\n_descriptions : array(EnumKeyPair);\n}\nFlagProperty id=29 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\ndata : string;\ndata_is_int : bool;\n_keys : array(EnumKeyPair);\n_values : array(EnumKeyPair);\n_ui_value_names : array(EnumKeyPair);\n_iconmap : array(EnumKeyPair);\n_iconmap2 : array(EnumKeyPair);\n_descriptions : array(EnumKeyPair);\n}\nVec2Property id=30 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndecimalPlaces : int;\ndata : float;\nhasUniformSlider : bool;\ndata : vec2;\n}\nVec3Property id=31 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndecimalPlaces : int;\ndata : float;\nhasUniformSlider : bool;\ndata : vec3;\n}\nVec4Property id=32 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndecimalPlaces : int;\ndata : float;\nhasUniformSlider : bool;\ndata : vec4;\n}\nQuatProperty id=33 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndecimalPlaces : int;\ndata : float;\nhasUniformSlider : bool;\ndata : vec4;\n}\nMat4Property id=34 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nrange : array(float);\nexpRate : float;\ndata : float;\nstep : float;\nslideSpeed : float;\ndecimalPlaces : int;\ndata : float;\ndata : mat4;\n}\nListProperty id=35 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nprop : abstract(ToolProperty);\nvalue : array(abstract(ToolProperty));\n}\nStringSetProperty id=36 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\nvalue : iter(string);\nvalues : iterkeys(string);\n}\nCurve1DProperty id=37 {\napiname : string;\ntype : int;\nflag : int;\nsubtype : int;\nicon : int;\nicon2 : int;\nbaseUnit : string;\ndisplayUnit : string;\nrange : array(float);\nuiRange : array(float);\ndescription : string;\nstepIsRelative : bool;\nstep : float;\nexpRate : float;\nradix : float;\ndecimalPlaces : int;\nuiname : string;\ndata : Curve1D;\n}\nCSSFont id=38 {\nsize : float;\nfont : string;\nstyle : string;\ncolor : string;\nvariant : string;\nweight : string;\n}\ntoolsys.ToolOp id=39 {\ninputs : array(toolsys.PropKey);\noutputs : array(toolsys.PropKey);\n}\ntoolsys.PropKey id=40 {\nkey : string;\nval : abstract(ToolProperty);\n}\ntoolsys.MacroLink id=41 {\nsource : int;\ndest : int;\nsourcePropKey : string;\ndestPropKey : string;\nsourceProps : string;\ndestProps : string;\n}\ntoolsys.ToolMacro id=42 {\ninputs : array(toolsys.PropKey);\noutputs : array(toolsys.PropKey);\ntools : array(abstract(toolsys.ToolOp));\nconnectLinks : array(toolsys.MacroLink);\n}\ntoolsys.ToolStack id=43 {\ncur : int;\n_stack : array(abstract(toolsys.ToolOp));\n}\npathux.ScreenVert id=44 {\n0 : float;\n1 : float;\n}\npathux.Area id=45 {\nflag : int;\nsaved_uidata : string;\n}\npathux.ScreenArea id=46 {\npos : vec2;\nsize : vec2;\ntype : string;\nhidden : bool;\neditors : array(abstract(pathux.Area));\narea : string;\n}\npathux.Screen id=47 {\nsize : vec2;\npos : vec2;\nsareas : array(pathux.ScreenArea);\nidgen : int;\nuidata : string;\n}\nsimple.FileHeader id=48 {\nmagic : static_string[4];\nversion_major : short;\nversion_minor : short;\nversion_micro : short;\nflags : short;\nschema : string;\n}\nFileFull id=49 {\nmagic : static_string[4];\nversion_major : short;\nversion_minor : short;\nversion_micro : short;\nflags : short;\nschema : string;\nobjects : array(abstract(Object));\nscreen : abstract(Object);\n}\nEmptyStruct id=50 {\n}\nmesh.Element id=51 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\n}\nmesh.Vertex id=52 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\n0 : float;\n1 : float;\n2 : float;\nedges : array(e, int);\n}\nmesh.Handle id=53 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\n0 : float;\n1 : float;\n2 : float;\nowner : int;\n}\nmesh.Edge id=54 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\nv1 : int;\nv2 : int;\nh1 : int;\nh2 : int;\nl : int;\n}\nmesh.Loop id=55 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\nv : int;\ne : int;\nuv : vec2;\nuvFlag : int;\n}\nmesh.LoopList id=56 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\n_loops : iter(int);\n}\nmesh.Face id=57 {\ntype : int;\nflag : int;\nindex : int;\neid : int;\nlists : iter(list, int);\nfillColor : vec4;\nblur : float;\n}\nmesh.ElementArray id=58 {\nthis : iter(abstract(mesh.Element));\nhighlight : int;\nactive : int;\ntype : int;\n}\nmesh.Mesh id=59 {\neidgen : IDGen;\nelists : array(mesh.ElementArray);\n}\nDrawMats id=60 {\ncameramat : mat4;\npersmat : mat4;\nrendermat : mat4;\nnormalmat : mat4;\nicameramat : mat4;\nipersmat : mat4;\nirendermat : mat4;\ninormalmat : mat4;\nisPerspective : int;\n}\nCamera id=61 {\ncameramat : mat4;\npersmat : mat4;\nrendermat : mat4;\nnormalmat : mat4;\nicameramat : mat4;\nipersmat : mat4;\nirendermat : mat4;\ninormalmat : mat4;\nisPerspective : int;\nfovy : float;\naspect : float;\ntarget : vec3;\norbitTarget : vec3;\npos : vec3;\nup : vec3;\nnear : float;\nfar : float;\nisPerspective : bool;\n}\nWorkspace id=62 {\nflag : int;\nsaved_uidata : string;\neditUVs : bool;\ndrawFaces : bool;\n}\nPropertiesBag id=63 {\n_props : array(abstract(ToolProperty));\n}\nMeshWithUVMesh id=64 {\neidgen : IDGen;\nelists : array(mesh.ElementArray);\nuvmesh : mesh.Mesh;\nsnapUVs : bool;\n}\nMenuBarEditor id=65 {\nflag : int;\nsaved_uidata : string;\n}\n",
  "objects"   : [{
    "eidgen"    : {"cur": 108}, "elists": [{
      "0"        : {
        "0"    : 51.370301150072976, "1": 392.9431874312378, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 1,
        "edges": [7, 13, 19, 27, 72], "_structName": "mesh.Vertex"
      }, "1"     : {
        "0"    : 382.7596529967179, "1": 385.5874534345462, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 2,
        "edges": [7, 9, 38, 89], "_structName": "mesh.Vertex"
      }, "2"     : {
        "0"    : 566.24167535643, "1": 124.6956444774176, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 3,
        "edges": [9, 11, 19, 50], "_structName": "mesh.Vertex"
      }, "3"     : {
        "0"    : 172.14475134536343, "1": 32.78534820971322, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 4,
        "edges": [11, 13], "_structName": "mesh.Vertex"
      }, "4"     : {
        "0"    : 150.11418972924793, "1": 565.6930143987993, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 26,
        "edges": [27, 29, 66], "_structName": "mesh.Vertex"
      }, "5"     : {
        "0"    : 247.4312466790941, "1": 749.375955458378, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 28,
        "edges": [29, 31], "_structName": "mesh.Vertex"
      }, "6"     : {
        "0"    : 418.4273864116573, "1": 662.2591082449292, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 30,
        "edges": [31, 38, 41, 66, 72, 83], "_structName": "mesh.Vertex"
      }, "7"     : {
        "0"    : 632.2480030218378, "1": 641.0520385740779, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 40,
        "edges": [41, 43], "_structName": "mesh.Vertex"
      }, "8"     : {
        "0"    : 647.9399671719075, "1": 306.3659742985442, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 42,
        "edges": [43, 50, 83, 89], "_structName": "mesh.Vertex"
      }, "length": 9, "highlight": -1, "active": 2, "type": 1
    }, {
      "0"        : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 7, "v1": 1, "v2": 2, "h1": -1, "h2": -1, "l": 54,
        "_structName": "mesh.Edge"
      }, "1"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 9, "v1": 2, "v2": 3, "h1": -1, "h2": -1, "l": 55,
        "_structName": "mesh.Edge"
      }, "2"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 11, "v1": 3, "v2": 4, "h1": -1, "h2": -1, "l": 60,
        "_structName": "mesh.Edge"
      }, "3"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 13, "v1": 4, "v2": 1, "h1": -1, "h2": -1, "l": 61,
        "_structName": "mesh.Edge"
      }, "4"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 19, "v1": 3, "v2": 1, "h1": -1, "h2": -1, "l": 56,
        "_structName": "mesh.Edge"
      }, "5"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 27, "v1": 26, "v2": 1, "h1": -1, "h2": -1, "l": 73,
        "_structName": "mesh.Edge"
      }, "6"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 29, "v1": 28, "v2": 26, "h1": -1, "h2": -1, "l": 67,
        "_structName": "mesh.Edge"
      }, "7"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 31, "v1": 30, "v2": 28, "h1": -1, "h2": -1, "l": 65,
        "_structName": "mesh.Edge"
      }, "8"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 38, "v1": 2, "v2": 30, "h1": -1, "h2": -1, "l": 76,
        "_structName": "mesh.Edge"
      }, "9"     : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 41, "v1": 40, "v2": 30, "h1": -1, "h2": -1, "l": 84,
        "_structName": "mesh.Edge"
      }, "10"    : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 43, "v1": 42, "v2": 40, "h1": -1, "h2": -1, "l": 82,
        "_structName": "mesh.Edge"
      }, "11"    : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 50, "v1": 3, "v2": 42, "h1": -1, "h2": -1, "l": 93,
        "_structName": "mesh.Edge"
      }, "12"    : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 66, "v1": 26, "v2": 30, "h1": -1, "h2": -1, "l": 64,
        "_structName": "mesh.Edge"
      }, "13"    : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 72, "v1": 1, "v2": 30, "h1": -1, "h2": -1, "l": 70,
        "_structName": "mesh.Edge"
      }, "14"    : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 83, "v1": 30, "v2": 42, "h1": -1, "h2": -1, "l": 81,
        "_structName": "mesh.Edge"
      }, "15"    : {
        "type"       : 2, "flag": 1, "index": 0, "eid": 89, "v1": 2, "v2": 42, "h1": -1, "h2": -1, "l": 87,
        "_structName": "mesh.Edge"
      }, "length": 16, "highlight": -1, "active": 89, "type": 2
    }, {"length": 0, "highlight": -1, "active": -1, "type": 4}, {
      "0"        : {
        "type": 8, "flag": 1, "index": 0, "eid": 54, "v": 1, "e": 7,
        "uv"  : {"0": 0.1694503577882085, "1": 0.7463584989144763}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "1"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 55, "v": 2, "e": 9,
        "uv"  : {"0": 0.3113405318018855, "1": 0.4767488114049661}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "2"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 56, "v": 3, "e": 19,
        "uv"  : {"0": 0.07696219604072668, "1": 0.1563381798433549}, "uvFlag": 1, "_structName": "mesh.Loop"
      }, "3"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 59, "v": 1, "e": 19,
        "uv"  : {"0": 0.1694503577882085, "1": 0.7463584989144763}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "4"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 60, "v": 3, "e": 11,
        "uv"  : {"0": 0.07696219604072668, "1": 0.1563381798433549}, "uvFlag": 1, "_structName": "mesh.Loop"
      }, "5"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 61, "v": 4, "e": 13,
        "uv"  : {"0": -0.007751939314187609, "1": 0.5098764301256509}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "6"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 64, "v": 30, "e": 66,
        "uv"  : {"0": 0.7615266283735519, "1": 0.5431059726475367}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "7"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 65, "v": 28, "e": 31,
        "uv"  : {"0": 0.8513142133338369, "1": 0.8053584160871055}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "8"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 67, "v": 26, "e": 29,
        "uv"  : {"0": 0.4782645025669927, "1": 0.8505392830614213}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "9"     : {
        "type": 8, "flag": 1, "index": 0, "eid": 70, "v": 30, "e": 72,
        "uv"  : {"0": 0.583745549726906, "1": 0.5628594193900305}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "10"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 71, "v": 26, "e": 66,
        "uv"  : {"0": 0.4782645025669927, "1": 0.8505392830614213}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "11"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 73, "v": 1, "e": 27,
        "uv"  : {"0": 0.1694503577882085, "1": 0.7463584989144763}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "12"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 76, "v": 30, "e": 38,
        "uv"  : {"0": 0.5503166666077025, "1": 0.5157550419299146}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "13"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 77, "v": 1, "e": 72,
        "uv"  : {"0": 0.1694503577882085, "1": 0.7463584989144763}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "14"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 78, "v": 2, "e": 7,
        "uv"  : {"0": 0.3113405318018855, "1": 0.4767488114049661}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "15"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 81, "v": 42, "e": 83,
        "uv"  : {"0": 0.3709094088451734, "1": 0.12499675973862921}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "16"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 82, "v": 40, "e": 43,
        "uv"  : {"0": 0.813098405101829, "1": 0.10861844412236782}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "17"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 84, "v": 30, "e": 41,
        "uv"  : {"0": 0.5609530978015203, "1": 0.46561160132270385}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "18"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 87, "v": 42, "e": 89,
        "uv"  : {"0": 0.3709094088451734, "1": 0.12499675973862921}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "19"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 88, "v": 30, "e": 83,
        "uv"  : {"0": 0.5609530978015203, "1": 0.46561160132270385}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "20"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 90, "v": 2, "e": 38,
        "uv"  : {"0": 0.3113405318018855, "1": 0.4767488114049661}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "21"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 93, "v": 42, "e": 50,
        "uv"  : {"0": 0.3709094088451734, "1": 0.12499675973862921}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "22"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 94, "v": 2, "e": 89,
        "uv"  : {"0": 0.3113405318018855, "1": 0.4767488114049661}, "uvFlag": 0, "_structName": "mesh.Loop"
      }, "23"    : {
        "type": 8, "flag": 1, "index": 0, "eid": 95, "v": 3, "e": 9,
        "uv"  : {"0": 0.07696219604072668, "1": 0.1563381798433549}, "uvFlag": 1, "_structName": "mesh.Loop"
      }, "length": 24, "highlight": -1, "active": -1, "type": 8
    }, {
      "0"     : {
        "type": 16, "flag": 1, "index": 0, "eid": 53, "_loops": [54, 55, 56], "_structName": "mesh.LoopList"
      }, "1"  : {"type": 16, "flag": 1, "index": 0, "eid": 58, "_loops": [59, 60, 61], "_structName": "mesh.LoopList"},
      "2"     : {"type": 16, "flag": 1, "index": 0, "eid": 63, "_loops": [64, 67, 65], "_structName": "mesh.LoopList"},
      "3"     : {"type": 16, "flag": 1, "index": 0, "eid": 69, "_loops": [70, 73, 71], "_structName": "mesh.LoopList"},
      "4"     : {"type": 16, "flag": 1, "index": 0, "eid": 75, "_loops": [76, 78, 77], "_structName": "mesh.LoopList"},
      "5"     : {"type": 16, "flag": 1, "index": 0, "eid": 80, "_loops": [81, 84, 82], "_structName": "mesh.LoopList"},
      "6"     : {"type": 16, "flag": 1, "index": 0, "eid": 86, "_loops": [87, 90, 88], "_structName": "mesh.LoopList"},
      "7"     : {"type": 16, "flag": 1, "index": 0, "eid": 92, "_loops": [93, 95, 94], "_structName": "mesh.LoopList"},
      "length": 8, "highlight": -1, "active": -1, "type": 16
    }, {
      "0"        : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 52, "lists": [53],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "1"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 57, "lists": [58],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "2"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 62, "lists": [63],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "3"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 68, "lists": [69],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "4"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 74, "lists": [75],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "5"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 79, "lists": [80],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "6"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 85, "lists": [86],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "7"     : {
        "type"     : 32, "flag": 1, "index": 0, "eid": 91, "lists": [92],
        "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
      }, "length": 8, "highlight": -1, "active": -1, "type": 32
    }], "uvmesh": {
      "eidgen": {"cur": 72}, "elists": [{
        "0"        : {
          "0"    : 0.1694503577882085, "1": 0.7463584989144763, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 1,
          "edges": [6, 10, 18, 34, 36, 46], "_structName": "mesh.Vertex"
        }, "1"     : {
          "0"    : 0.3113405318018855, "1": 0.4767488114049661, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 2,
          "edges": [6, 8, 43, 61, 63], "_structName": "mesh.Vertex"
        }, "2"     : {
          "0"    : 0.07696219604072668, "1": 0.1563381798433549, "2": 0, "type": 1, "flag": 1, "index": 0, "eid": 3,
          "edges": [8, 10, 16, 68], "_structName": "mesh.Vertex"
        }, "3"     : {
          "0"    : -0.007751939314187609, "1": 0.5098764301256509, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 12,
          "edges": [16, 18], "_structName": "mesh.Vertex"
        }, "4"     : {
          "0"    : 0.7615266283735519, "1": 0.5431059726475367, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 20,
          "edges": [25, 29], "_structName": "mesh.Vertex"
        }, "5"     : {
          "0"    : 0.4782645025669927, "1": 0.8505392830614213, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 21,
          "edges": [25, 27, 36, 38], "_structName": "mesh.Vertex"
        }, "6"     : {
          "0"    : 0.8513142133338369, "1": 0.8053584160871055, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 22,
          "edges": [27, 29], "_structName": "mesh.Vertex"
        }, "7"     : {
          "0"    : 0.583745549726906, "1": 0.5628594193900305, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 31,
          "edges": [34, 38], "_structName": "mesh.Vertex"
        }, "8"     : {
          "0"    : 0.5503166666077025, "1": 0.5157550419299146, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 40,
          "edges": [43, 46], "_structName": "mesh.Vertex"
        }, "9"     : {
          "0"    : 0.3709094088451734, "1": 0.12499675973862921, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 48,
          "edges": [53, 57, 61, 68], "_structName": "mesh.Vertex"
        }, "10"    : {
          "0"    : 0.5609530978015203, "1": 0.46561160132270385, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 49,
          "edges": [53, 55, 63], "_structName": "mesh.Vertex"
        }, "11"    : {
          "0"    : 0.813098405101829, "1": 0.10861844412236782, "2": 0, "type": 1, "flag": 0, "index": 0, "eid": 50,
          "edges": [55, 57], "_structName": "mesh.Vertex"
        }, "length": 12, "highlight": -1, "active": -1, "type": 1
      }, {
        "0"        : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 6, "v1": 1, "v2": 2, "h1": -1, "h2": -1, "l": 7,
          "_structName": "mesh.Edge"
        }, "1"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 8, "v1": 2, "v2": 3, "h1": -1, "h2": -1, "l": 9,
          "_structName": "mesh.Edge"
        }, "2"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 10, "v1": 3, "v2": 1, "h1": -1, "h2": -1, "l": 11,
          "_structName": "mesh.Edge"
        }, "3"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 16, "v1": 3, "v2": 12, "h1": -1, "h2": -1, "l": 17,
          "_structName": "mesh.Edge"
        }, "4"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 18, "v1": 12, "v2": 1, "h1": -1, "h2": -1, "l": 19,
          "_structName": "mesh.Edge"
        }, "5"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 25, "v1": 20, "v2": 21, "h1": -1, "h2": -1, "l": 26,
          "_structName": "mesh.Edge"
        }, "6"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 27, "v1": 21, "v2": 22, "h1": -1, "h2": -1, "l": 28,
          "_structName": "mesh.Edge"
        }, "7"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 29, "v1": 22, "v2": 20, "h1": -1, "h2": -1, "l": 30,
          "_structName": "mesh.Edge"
        }, "8"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 34, "v1": 31, "v2": 1, "h1": -1, "h2": -1, "l": 35,
          "_structName": "mesh.Edge"
        }, "9"     : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 36, "v1": 1, "v2": 21, "h1": -1, "h2": -1, "l": 37,
          "_structName": "mesh.Edge"
        }, "10"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 38, "v1": 21, "v2": 31, "h1": -1, "h2": -1, "l": 39,
          "_structName": "mesh.Edge"
        }, "11"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 43, "v1": 40, "v2": 2, "h1": -1, "h2": -1, "l": 44,
          "_structName": "mesh.Edge"
        }, "12"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 46, "v1": 1, "v2": 40, "h1": -1, "h2": -1, "l": 47,
          "_structName": "mesh.Edge"
        }, "13"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 53, "v1": 48, "v2": 49, "h1": -1, "h2": -1, "l": 54,
          "_structName": "mesh.Edge"
        }, "14"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 55, "v1": 49, "v2": 50, "h1": -1, "h2": -1, "l": 56,
          "_structName": "mesh.Edge"
        }, "15"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 57, "v1": 50, "v2": 48, "h1": -1, "h2": -1, "l": 58,
          "_structName": "mesh.Edge"
        }, "16"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 61, "v1": 48, "v2": 2, "h1": -1, "h2": -1, "l": 62,
          "_structName": "mesh.Edge"
        }, "17"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 63, "v1": 2, "v2": 49, "h1": -1, "h2": -1, "l": 64,
          "_structName": "mesh.Edge"
        }, "18"    : {
          "type"       : 2, "flag": 0, "index": 0, "eid": 68, "v1": 48, "v2": 3, "h1": -1, "h2": -1, "l": 69,
          "_structName": "mesh.Edge"
        }, "length": 19, "highlight": -1, "active": -1, "type": 2
      }, {"length": 0, "highlight": -1, "active": -1, "type": 4}, {
        "0"        : {
          "type": 8, "flag": 0, "index": 0, "eid": 7, "v": 1, "e": 6,
          "uv"  : {"0": 0.0003177194208528909, "1": 0.001399422185464643}, "_structName": "mesh.Loop"
        }, "1"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 9, "v": 2, "e": 8,
          "uv"  : {"0": 0.0005837634971285352, "1": 0.0008939040213843115}, "_structName": "mesh.Loop"
        }, "2"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 11, "v": 3, "e": 10,
          "uv"  : {"0": 0.0001443041175763625, "1": 0.00029313408720629044}, "_structName": "mesh.Loop"
        }, "3"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 15, "v": 1, "e": 10,
          "uv"  : {"0": 0.0003177194208528909, "1": 0.001399422185464643}, "_structName": "mesh.Loop"
        }, "4"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 17, "v": 3, "e": 16,
          "uv"  : {"0": 0.0001443041175763625, "1": 0.00029313408720629044}, "_structName": "mesh.Loop"
        }, "5"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 19, "v": 12, "e": 18,
          "uv"  : {"0": -0.000014534886214101767, "1": 0.0009560183064855954}, "_structName": "mesh.Loop"
        }, "6"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 26, "v": 20, "e": 25,
          "uv"  : {"0": 0.0014278624282004098, "1": 0.0010183236987141313}, "_structName": "mesh.Loop"
        }, "7"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 28, "v": 21, "e": 27,
          "uv"  : {"0": 0.0008967459423131113, "1": 0.001594761155740165}, "_structName": "mesh.Loop"
        }, "8"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 30, "v": 22, "e": 29,
          "uv"  : {"0": 0.0015962141500009443, "1": 0.0015100470301633226}, "_structName": "mesh.Loop"
        }, "9"     : {
          "type": 8, "flag": 0, "index": 0, "eid": 35, "v": 31, "e": 34,
          "uv"  : {"0": 0.0010945229057379485, "1": 0.0010553614113563072}, "_structName": "mesh.Loop"
        }, "10"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 37, "v": 1, "e": 36,
          "uv"  : {"0": 0.0003177194208528909, "1": 0.001399422185464643}, "_structName": "mesh.Loop"
        }, "11"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 39, "v": 21, "e": 38,
          "uv"  : {"0": 0.0008967459423131113, "1": 0.001594761155740165}, "_structName": "mesh.Loop"
        }, "12"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 44, "v": 40, "e": 43,
          "uv"  : {"0": 0.0010318437498894422, "1": 0.0009670407036185899}, "_structName": "mesh.Loop"
        }, "13"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 45, "v": 2, "e": 6,
          "uv"  : {"0": 0.0005837634971285352, "1": 0.0008939040213843115}, "_structName": "mesh.Loop"
        }, "14"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 47, "v": 1, "e": 46,
          "uv"  : {"0": 0.0003177194208528909, "1": 0.001399422185464643}, "_structName": "mesh.Loop"
        }, "15"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 54, "v": 48, "e": 53,
          "uv"  : {"0": 0.0006954551415847001, "1": 0.00023436892450992976}, "_structName": "mesh.Loop"
        }, "16"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 56, "v": 49, "e": 55,
          "uv"  : {"0": 0.0010517870583778505, "1": 0.0008730217524800697}, "_structName": "mesh.Loop"
        }, "17"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 58, "v": 50, "e": 57,
          "uv"  : {"0": 0.0015245595095659291, "1": 0.00020365958272943965}, "_structName": "mesh.Loop"
        }, "18"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 62, "v": 48, "e": 61,
          "uv"  : {"0": 0.0006954551415847001, "1": 0.00023436892450992976}, "_structName": "mesh.Loop"
        }, "19"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 64, "v": 2, "e": 63,
          "uv"  : {"0": 0.0005837634971285352, "1": 0.0008939040213843115}, "_structName": "mesh.Loop"
        }, "20"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 65, "v": 49, "e": 53,
          "uv"  : {"0": 0.0010517870583778505, "1": 0.0008730217524800697}, "_structName": "mesh.Loop"
        }, "21"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 69, "v": 48, "e": 68,
          "uv"  : {"0": 0.0006954551415847001, "1": 0.00023436892450992976}, "_structName": "mesh.Loop"
        }, "22"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 70, "v": 3, "e": 8,
          "uv"  : {"0": 0.0001443041175763625, "1": 0.00029313408720629044}, "_structName": "mesh.Loop"
        }, "23"    : {
          "type": 8, "flag": 0, "index": 0, "eid": 71, "v": 2, "e": 61,
          "uv"  : {"0": 0.0005837634971285352, "1": 0.0008939040213843115}, "_structName": "mesh.Loop"
        }, "length": 24, "highlight": -1, "active": -1, "type": 8
      }, {
        "0": {
          "type": 16, "flag": 0, "index": 0, "eid": 5, "_loops": [7, 9, 11], "_structName": "mesh.LoopList"
        }, "1": {
          "type": 16, "flag": 0, "index": 0, "eid": 14, "_loops": [15, 17, 19], "_structName": "mesh.LoopList"
        }, "2": {
          "type": 16, "flag": 0, "index": 0, "eid": 24, "_loops": [26, 28, 30], "_structName": "mesh.LoopList"
        }, "3": {
          "type": 16, "flag": 0, "index": 0, "eid": 33, "_loops": [35, 37, 39], "_structName": "mesh.LoopList"
        }, "4": {
          "type": 16, "flag": 0, "index": 0, "eid": 42, "_loops": [44, 45, 47], "_structName": "mesh.LoopList"
        }, "5": {
          "type": 16, "flag": 0, "index": 0, "eid": 52, "_loops": [54, 56, 58], "_structName": "mesh.LoopList"
        }, "6": {
          "type": 16, "flag": 0, "index": 0, "eid": 60, "_loops": [62, 64, 65], "_structName": "mesh.LoopList"
        }, "7": {
          "type": 16, "flag": 0, "index": 0, "eid": 67, "_loops": [69, 70, 71], "_structName": "mesh.LoopList"
        }, "length": 8, "highlight": -1, "active": -1, "type": 16
      }, {
        "0"        : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 4, "lists": [5],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "1"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 13, "lists": [14],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "2"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 23, "lists": [24],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "3"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 32, "lists": [33],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "4"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 41, "lists": [42],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "5"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 51, "lists": [52],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "6"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 59, "lists": [60],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "7"     : {
          "type"     : 32, "flag": 0, "index": 0, "eid": 66, "lists": [67],
          "fillColor": {"0": 0.5, "1": 0.5, "2": 0.5, "3": 1}, "blur": 0, "_structName": "mesh.Face"
        }, "length": 8, "highlight": -1, "active": -1, "type": 32
      }]
    }, "snapUVs": true, "_structName": "MeshWithUVMesh"
  }, {
    "_props"         : [{
      "apiname"    : "steps", "type": 1, "flag": 0, "subtype": null, "icon": -1, "icon2": -1, "baseUnit": "undefined",
      "displayUnit": "undefined", "range": [-100000000000000000, 100000000000000000],
      "uiRange"    : [-100000000000000000, 100000000000000000], "description": "", "stepIsRelative": false, "step": 0.1,
      "expRate"    : 1.33, "radix": 10, "decimalPlaces": 4, "uiname": "Steps", "data": 1, "slideSpeed": 1,
      "_structName": "IntProperty"
    }, {
      "apiname"    : "pixelSize", "type": 1, "flag": 0, "subtype": null, "icon": -1, "icon2": -1,
      "baseUnit"   : "undefined", "displayUnit": "undefined", "range": [-100000000000000000, 100000000000000000],
      "uiRange"    : [-100000000000000000, 100000000000000000], "description": "", "stepIsRelative": false, "step": 0.1,
      "expRate"    : 1.33, "radix": 10, "decimalPlaces": 4, "uiname": "Pixel Size", "data": 18, "slideSpeed": 1,
      "_structName": "IntProperty"
    }, {
      "apiname"    : "imageSize", "type": 1, "flag": 0, "subtype": null, "icon": -1, "icon2": -1,
      "baseUnit"   : "undefined", "displayUnit": "undefined", "range": [-100000000000000000, 100000000000000000],
      "uiRange"    : [-100000000000000000, 100000000000000000], "description": "", "stepIsRelative": false, "step": 0.1,
      "expRate"    : 1.33, "radix": 10, "decimalPlaces": 4, "uiname": "Image Size", "data": 33, "slideSpeed": 1,
      "_structName": "IntProperty"
    }], "_structName": "PropertiesBag"
  }], "screen": {
    "size"       : {"0": 859.2000122070312, "1": 788}, "pos": {"0": 0, "1": 0}, "sareas": [{
      "pos"     : {"0": 0, "1": 0}, "size": {"0": 471.1096690913989, "1": 788}, "hidden": false, "editors": [{
        "flag"        : 0,
        "saved_uidata": "{\"key\":\"area\",\"paths\":[[0,0,{\"_area_id\":1}],[0,0,2,1,0,1,3,1,3,1,3,1,{\"tabs\":{\"colframe_x359\":{\"key\":\"tab\",\"paths\":[],\"_ui_version\":1}}}],[0,0,2,1,0,1,3,1,3,1,3,1,3,1,0,0,{\"taborder\":[\"Workspace\",\"\"],\"active\":\"Workspace\"}],[0,0,4,1,{\"closed\":true}],[0,0,4,1,4,1,{\"tabs\":{}}],[0,0,4,1,4,1,3,1,0,0,{\"taborder\":[\"Options\"],\"active\":\"Options\"}]],\"_ui_version\":1}",
        "editUVs"     : false, "drawFaces": false, "_structName": "Workspace"
      }], "area": "workspace-editor-x"
    }, {
      "pos"     : {
        "0": 471.1096690913989, "1": 0
      }, "size" : {"0": 388.0903431156322, "1": 788}, "hidden": false, "editors": [{
        "flag"        : 0,
        "saved_uidata": "{\"key\":\"area\",\"paths\":[[0,0,{\"_area_id\":3}],[0,0,2,1,0,1,3,1,3,1,3,1,{\"tabs\":{\"colframe_x276\":{\"key\":\"tab\",\"paths\":[],\"_ui_version\":1}}}],[0,0,2,1,0,1,3,1,3,1,3,1,3,1,0,0,{\"taborder\":[\"Workspace\",\"\"],\"active\":\"Workspace\"}],[0,0,4,1,{\"closed\":true}],[0,0,4,1,4,1,{\"tabs\":{}}],[0,0,4,1,4,1,3,1,0,0,{\"taborder\":[\"Options\"],\"active\":\"Options\"}]],\"_ui_version\":1}",
        "editUVs"     : true, "drawFaces": false, "_structName": "Workspace"
      }], "area": "workspace-editor-x"
    }], "idgen"  : 307,
    "uidata"     : "{\"key\":\"screen\",\"paths\":[[0,0,3,1,2,1,{\"_area_id\":1}],[0,0,3,1,2,1,2,1,0,1,3,1,3,1,3,1,{\"tabs\":{\"colframe_x359\":{\"key\":\"tab\",\"paths\":[],\"_ui_version\":1}}}],[0,0,3,1,2,1,2,1,0,1,3,1,3,1,3,1,3,1,0,0,{\"taborder\":[\"Workspace\",\"\"],\"active\":\"Workspace\"}],[0,0,3,1,2,1,4,1,{\"closed\":true}],[0,0,3,1,2,1,4,1,4,1,{\"tabs\":{}}],[0,0,3,1,2,1,4,1,4,1,3,1,0,0,{\"taborder\":[\"Options\"],\"active\":\"Options\"}],[0,0,4,1,2,1,{\"_area_id\":3}],[0,0,4,1,2,1,2,1,0,1,3,1,3,1,3,1,{\"tabs\":{\"colframe_x276\":{\"key\":\"tab\",\"paths\":[],\"_ui_version\":1}}}],[0,0,4,1,2,1,2,1,0,1,3,1,3,1,3,1,3,1,0,0,{\"taborder\":[\"Workspace\",\"\"],\"active\":\"Workspace\"}],[0,0,4,1,2,1,4,1,{\"closed\":true}],[0,0,4,1,2,1,4,1,4,1,{\"tabs\":{}}],[0,0,4,1,2,1,4,1,4,1,3,1,0,0,{\"taborder\":[\"Options\"],\"active\":\"Options\"}]],\"_ui_version\":1}",
    "_structName": "pathux.Screen"
  }
};