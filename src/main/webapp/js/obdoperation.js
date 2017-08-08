/**
 * Created by Administrator on 2017/3/23.
 */
/**********加载更多时候的状态***********/
var OBD_RESOURCE_STATUS = 0;  //OBD资源功能选择组织机构时的状态
var OBD_SEARCH_STATUS = 1;      //OBD资源功能模糊查询时的状态
/**********编辑建筑物时的状态**********/
var CREATEBUILDING_STATUS = 0;    //创建建筑物
var EDITBUILDING_STATUS = 1;      //编辑建筑物
var SELECTBUILDING_STATUS = 2;      //编辑建筑物
var MEASURE_STATUS = 3;      //编辑建筑物
var FREE_STATUS = 4;      //没有编辑建筑物
var mapEditStatus = FREE_STATUS;      //地图正在编辑的状态


var mapServer_Url = "http://192.168.1.47:6080/arcgis/rest/services/zsdx";
var map;
var pageSize = 100;    //每页显示的记录条数
var curPage=0;        //OBD当前页
var lastPage=0;       //OBD总页数
var flag = 0;            //判断当前是否通过输入框搜索查询

var  moveFlag = 0;
var  judgeCount = 0; //判断添加建筑物或网格时是否覆盖的计数
var  intersectionCount = 0; //相交计数

var _x,_y,isDrag,layers={}; //用于计算OTB移动的经纬度

var mouseX,mouseY;
var mapPoint;

var resultArray = new Array();

var yfName;
var wgFacName;
var otbName;
var county;

var scaleLever = [250000,125000,64000,32000,16000,8000,4000,200,1000,500];

var orgId;   //用于保存加载更多时的组织结构ID
var gNode;    //用于保存点击的节点值
var addrid;  //用于保存建筑物的ADDRID
var mapEventGraphic;
var newEditGraphics ;
var oldEditGraphics ;
var editToolbar ;
var curEditGraphic;  //用于面的中心点计算
var bjGraphic;        //用于营服，组织，网格的图形
var buildingMarkIndex = 0;


var lightfacilityLayer ;
var zsdzdtLayer;
var jzwLayer;
var xfbjLayer;
var wgLayer;
var yfbjLayer;
var zsyxLayer;
var fwqLayer;
var dtLayer;


var lightfacilityLayerClickRegister = 0;
var jzwLayerClickRegister = 0;
var xfbjLayerClickRegister = 0;
var wgLayerClickRegister= 0;
var yfbjLayerClickRegister= 0;
var fwqLayerClickRegister= 0;
var dtLayerClickRegister= 0;

var currentEditedFCLayer ;   //当前被编辑的图层
var currentEditedMap;
var wgFeatureLayer ;    //网格图层
var jzwFeatureLayer ;   //建筑物图层
var lightfacilityFeatureLayer ;    //OBD服务区图层
var xfbjFeatureLayer;     //县分边界图层
var yfbjFeatureLayer ;      //营服边界图层
var fwqFeatureLayer ;      //营服边界图层
var dtFeatureLayer;
var draw;    //画笔

var geometryService;
var measuregeometry;

var lightfacility;
var jzw;
var xfbj;
var yfbj;
var wg;
var zsdzdt;
var fwq;
var zsyx;
var dt;


var gridTypeId;   //网格类型的id
var parentIds = new Array();  // 网格id的数组
// 旧值
var buildingOldValue = {};
// 新值
var buildingNewValue = {};

//建筑物是否可编辑
var jzwEditable=true;



/*var oEnd = "";*/
var oTop = "";
var clickNum=0;
var where;
//加载地图
function onLoadMap() {
    map = new esri.Map("map", {logo: false, slider:false, showLabels:true});
    where = setMapViewAuthority();

    //楼层标示
    lightfacility = mapServer_Url + "/lightfacility/MapServer";
    jzw = mapServer_Url + "/jzw/MapServer";
    xfbj = mapServer_Url + "/xfbj/MapServer";
    yfbj = mapServer_Url + "/yfbj/MapServer";
    wg = mapServer_Url + "/wg/MapServer";
    fwq = mapServer_Url + "/fwq/MapServer";
    //背景图
    zsdzdt = mapServer_Url + "/zsdzdt/MapServer";
    zsyx = mapServer_Url + "/zsyx/MapServer";
    dt = mapServer_Url + "/jzw_dt/MapServer";

    lightfacilityLayer = new esri.layers.ArcGISDynamicMapServiceLayer(lightfacility , {
        id:"lightfacilityLayer"
    });

    fwqLayer = new esri.layers.ArcGISDynamicMapServiceLayer(fwq , {
        id:"fwqLayer"
    });

    zsdzdtLayer = new esri.layers.ArcGISTiledMapServiceLayer(zsdzdt , {
        id:"zsdzdtLayer"
    });
    jzwLayer = new esri.layers.ArcGISDynamicMapServiceLayer(jzw , {
        id:"jzwLayer"
    });

    xfbjLayer = new esri.layers.ArcGISDynamicMapServiceLayer(xfbj , {
        id:"xfbjLayer"
    });


    yfbjLayer = new esri.layers.ArcGISDynamicMapServiceLayer(yfbj , {
        id:"yfbjLayer"
    });

    wgLayer = new esri.layers.ArcGISDynamicMapServiceLayer(wg , {
        id:"wgLayer"
    });

    zsyxLayer = new esri.layers.ArcGISTiledMapServiceLayer(zsyx);

    dtLayer = new esri.layers.ArcGISDynamicMapServiceLayer(dt);

    lightfacilityLayer.setLayerDefinitions(where.layerDefsId);
    yfbjLayer.setLayerDefinitions(where.layerDefs);
    jzwLayer.setLayerDefinitions(where.layerDefsAndDelFlag);
    wgLayer.setLayerDefinitions(where.layerDefsAndDelFlag);
    fwqLayer.setLayerDefinitions(where.layerDefsAndDelFlag);

    map.addLayer(zsdzdtLayer);
    map.addLayer(zsyxLayer);
    zsyxLayer.setVisibility(false);
    map.addLayer(yfbjLayer);
    map.addLayer(jzwLayer);
    map.addLayer(xfbjLayer);
    map.addLayer(wgLayer);
    map.addLayer(fwqLayer);
    map.addLayer(lightfacilityLayer);
    map.addLayer(dtLayer);
    dtLayer.setVisibility(false);
    geometryService = new esri.tasks.GeometryService(mapServer_Url.substr(0, mapServer_Url.lastIndexOf("/"))+"/Utilities/Geometry/GeometryServer");



    var wgFeature = mapServer_Url + "/wg/FeatureServer/0";
    wgFeatureLayer = new esri.layers.FeatureLayer(wgFeature,{
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id: "wgFeatureLayer"
    });
    wgFeatureLayer.setDefinitionExpression(where.layerDefsAndDelFlag[0] + " AND " + where.layerDefsAndDelFlag[1]); // 网格要素服务，加上删除标记字段条件
    wgFeatureLayer.setVisibility(false) ;
    map.addLayers([wgFeatureLayer]) ;


    var jzwFeature = mapServer_Url + "/jzw/FeatureServer/0";
    jzwFeatureLayer = new esri.layers.FeatureLayer(jzwFeature, {
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id:"jzwFeatureLayer"
    });
    jzwFeatureLayer.setDefinitionExpression(where.layerDefsAndDelFlag[0] + " AND " + where.layerDefsAndDelFlag[1]);// 建筑物要素服务，加上删除标记字段
    jzwFeatureLayer.setVisibility(false);
    map.addLayers([jzwFeatureLayer]);


    var fwqFeature = mapServer_Url + "/fwq/FeatureServer/0";
    fwqFeatureLayer = new esri.layers.FeatureLayer(fwqFeature, {
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id:"fwqFeatureLayer"
    });
    fwqFeatureLayer.setDefinitionExpression(where.layerDefsAndDelFlag[0] + " AND " + where.layerDefsAndDelFlag[1]);// 建筑物要素服务，加上删除标记字段
    fwqFeatureLayer.setVisibility(false);
    map.addLayers([fwqFeatureLayer]);

    var xfbjFeature = mapServer_Url + "/xfbj/FeatureServer/0";
    xfbjFeatureLayer = new esri.layers.FeatureLayer(xfbjFeature, {
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id:"xfbjFeatureLayer"
    });

    xfbjFeatureLayer.setVisibility(false) ;
    map.addLayers([xfbjFeatureLayer]);

    var yfbjFeature = mapServer_Url + "/yfbj/FeatureServer/0";
    yfbjFeatureLayer = new esri.layers.FeatureLayer(yfbjFeature, {
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id:"yfbjFeatureLayer"

    });
    yfbjFeatureLayer.setDefinitionExpression(where.layerDefs[0]);
    yfbjFeatureLayer.setVisibility(false) ;
    map.addLayers([yfbjFeatureLayer]);

    var lightfacilityFeature = mapServer_Url + "/lightfacility/FeatureServer/0";
    lightfacilityFeatureLayer = new esri.layers.FeatureLayer(lightfacilityFeature, {
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id:"lightfacilityFeatureLayer"
    });
    lightfacilityFeatureLayer.setDefinitionExpression(where.layerDefsId[0]+" AND "+where.layerDefsId[1]);
    lightfacilityFeatureLayer.setVisibility(false) ;
    map.addLayers([lightfacilityFeatureLayer]);


    var dtFeature = mapServer_Url + "/jzw_dt/FeatureServer/0";
    dtFeatureLayer = new esri.layers.FeatureLayer(dtFeature, {
        mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id:"dtFeatureLayer"
    });
    dtFeatureLayer.setVisibility(false);
    map.addLayers([dtFeatureLayer]);

    heatMapInit();

    creatBuildingGrid();
    creatOTBInputTree();
    creatBuildingTree();
    creatOTBTree();
    creatDrawPen();

    editToolbar = new esri.toolbars.Edit(map);


    dojo.connect(map, "onMouseDrag", showCoordinates);
    dojo.connect(map, "onMouseMove", showCoordinates);

    layers.dragIocLayer = new esri.layers.GraphicsLayer();
    map.addLayer(layers.dragIocLayer);

    layers.dragIocLayer.on("mouse-down", function(evt) {
        map.disablePan();
        isDrag = true;
    });
    map.on("mouse-up", function(evt) {
        if(isDrag){
            isDrag = false;
            map.enablePan();
        }
    });
}

function setMapViewAuthority() {
    var where ={};
    where.layerDefs = [];
    where.layerDefsId = [];
    where.layerDefsAndDelFlag = [];  // 带删除标记，网格 和 建筑物使用
    var jsonObj = {};
    var loginUser = JSON.parse($.cookie('loginUser'));
    jsonObj.id = loginUser.id;
    jsonObj.orgLevel = 3;
    $.ajax({
        type: "POST",
        url: "restful/organization/findYfByUser",
        contentType: "application/json",
        dataType: "json",
        async:false,
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                where.layerDefs[0] = "VILLAGE in (";
                where.layerDefsId[0] = "MKCENTERID in (";
                $.each(records, function (i, r) {
                    if(i == records.length-1){
                        where.layerDefs[0] += "'" + r.text + "'";
                        where.layerDefsId[0] += "'" + r.id + "'";
                    }else{
                        where.layerDefs[0] += "'" + r.text + "'" + ",";
                        where.layerDefsId[0] += "'" + r.id + "'" + ",";
                    }

                });

                where.layerDefs[0] =  where.layerDefs[0] + ")";
                where.layerDefsId[0] = where.layerDefsId[0] + ")";
                where.layerDefsId[1] = "OCFTYPE = 2";
                where.layerDefsAndDelFlag[0] = where.layerDefs[0];
                where.layerDefsAndDelFlag[1] = "DEL_FLAG = 0";
            }
        }
    });

    return where;
}

function creatDrawPen() {
    draw = new esri.toolbars.Draw(map, { tooltipOffset: 20, drawTime: 90, showTooltips: true });
    dojo.on(draw, "draw-complete", function (result){
        if(mapEditStatus == CREATEBUILDING_STATUS) {
            if (result.geometry.rings[0].length < 4) {
                $.messager.alert({
                    title: '提示', msg: "画面至少三个点以上,请重新绘制！", icon: 'error'
                });
                clickNum = 0;
                oTop.innerHTML="单击以开始绘制";
                mapEditStatus = CREATEBUILDING_STATUS;
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .mapToggle").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .newAdd").hide();
                $("#mapMenu .backToPre").hide();
                $("#mapMenu .cancelOp").removeClass("hide").show();
                $("#cancelOpLine").hide();
                return;
            }
        }

        curEditGraphic = new esri.Graphic(result.geometry, null,{});
        /*var add = new esri.dijit.editing.Add({
            "featureLayer":currentEditedFCLayer,		//给哪一个要素图层添加要素
            "addedGraphics":[curEditGraphic]			//用于添加的要素
        }) ;*/
        draw.deactivate();

        clickNum = 0;
        oTop.innerHTML="";
        $("#to_top").hide();
        if(mapEditStatus == MEASURE_STATUS){
            mapEditStatus = FREE_STATUS;
            doMeasure(result.geometry);
            return ;
        }
        //identifyQueryForExist(curEditGraphic.geometry,currentEditedMap);
        if(currentEditedMap == jzw){
            identifyQueryForPosition(curEditGraphic.geometry.getExtent().getCenter(),wg);
        }else if( currentEditedMap == wg){
            identifyQueryForPosition(curEditGraphic.geometry.getExtent().getCenter(),yfbj);
        }else if( currentEditedMap == lightfacility){

        }else if( currentEditedMap == xfbj){

        }else if( currentEditedMap == yfbj){

        }else if(currentEditedMap == fwq){
            identifyQueryForPosition(curEditGraphic.geometry.getExtent().getCenter(),wg);
        }


    });
}

function checkLeverExist(lever,id){
	var isExist=false;
	$.each($("#"+id).combobox('getData'),function(i,e){
		//console.log(lever+","+e.ID);
		if($.trim(lever)==$.trim(e.ID)){
			isExist=true;
		}
	});
	if(isExist){
		$("#"+id+"Id").val($("#"+id).combobox('getValue'));
	}else{
		$("#"+id+"Id").val("");
		 var index =  $("#"+id+"Id").parent().parent().index();
		 var rows=$("#buildingPropertyAdd_form .form-table tr:gt("+index+")");
	   	 $.each(rows,function(i,e){
	   		 $(e).find(".easyui-combobox").combobox('clear');
	   		 $(e).find(".easyui-combobox").combobox("loadData",[]);
	   		 $(e).find("input:disabled").val("");
	   	 });
	}
	return;
}

function judgeGeometryTouch(Geometries1,getGeometries2) {
    var relationParams = new esri.tasks.RelationParameters();
    var array1 = new Array();
    var array2 = new Array();
    array1.push(Geometries1);
    array2.push(getGeometries2);
    relationParams.geometries1 = esri.getGeometries(array1);
    relationParams.geometries2 = esri.getGeometries(array2);
    relationParams.relation = esri.tasks.RelationParameters.SPATIAL_REL_INTERIORINTERSECTION;
    geometryService.relation(relationParams).then(addRelateResultsToMap);
}

function addRelateResultsToMap(relations) {
    if ( mapEditStatus == CREATEBUILDING_STATUS) {
        --judgeCount;
        if (relations.length != 0) {
            intersectionCount++;
        }
        if(judgeCount == 0){
            if (intersectionCount > 0) {
                if (currentEditedMap == jzw) {
                    var info = "该处已有建筑物存在,请重新添加！";
                } else if (currentEditedMap == wg) {
                    var info = "该处已有网格存在,请重新添加！";
                } else if (currentEditedMap == xfbj) {
                    var info = "该处已有县分存在,请重新添加！";
                } else if (currentEditedMap == yfbj) {
                    var info = "该处已有营服存在,请重新添加！";
                } else if (currentEditedMap == fwq) {
                    var info = "该处已有服务区存在,请重新添加！";
                }
                $.messager.alert({
                    title: '提示', msg: info, icon: 'error'
                });
                intersectionCount = 0;
                mapEditStatus = FREE_STATUS;
                $("#mapMenu .newAdd").removeClass("hide").show();
                $("#mapMenu .backToPre").removeClass("hide").show();
                $("#mapMenu .cancelOp").hide();
                $("#cancelOpLine").hide();
        } else {
                if (currentEditedMap == jzw) {
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    if (ReviewDataFlag == 0) {
                        addJzw();
                        getAddrsByPid(0, "oneLever");
                        $("#oneLever").combobox({
                            onChange: function (n, o) {
                                var onelever = $(this).combobox('getValue');
                                $("#oneLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(onelever, "twoLever");
                            }
                        });
                        $("#twoLever").combobox({
                            onChange: function (n, o) {
                                var twolever = $(this).combobox('getValue');
                                $("#twoLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(twolever, "threeLever");
                            }
                        });
                        $("#threeLever").combobox({
                            onChange: function (n, o) {
                                var threelever = $(this).combobox('getValue');
                                $("#threeLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(threelever, "fourLever");
                            }
                        });
                        $("#fourLever").combobox({
                            onChange: function (n, o) {
                                var fourlever = $(this).combobox('getValue');
                                $("#fourLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "fourLever");
                                getAddrsByPid(fourlever, "fiveLever");
                            }
                        });
                        $("#fiveLever").combobox({
                            onChange: function (n, o) {
                                var fivelever = $(this).combobox('getValue');
                                $("#fiveLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "fiveLever");
                                getAddrsByPid(fivelever, "sixLever");
                            }
                        });
                        $("#sixLever").combobox({
                            onChange: function (n, o) {
                                var sixlever = $(this).combobox('getValue');
                                $("#sixLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "sixLever");
                                getAddrsByPid(sixlever, "sevenLever");
                            }
                        });
                        $("#sevenLever").combobox({
                            onChange: function (n, o) {
                                checkLeverExist($(this).combobox('getValue'), "sevenLever");
                                $("#buildingAddr").val($.trim($("#oneLever").combobox("getText")) + $.trim($("#twoLever").combobox("getText")) + $.trim($("#threeLever").combobox("getText")) + $.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                                $('#buildingAddrId').val($("#sevenLeverId").val());
                                $("#buildingName").val($.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                            }
                        });
                    } else {
                        addJzwReviewData();
                    }
                } else if (currentEditedMap == wg) {
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    addWg();
                } else if (currentEditedMap == xfbj) {

                } else if (currentEditedMap == yfbj) {

                } else if (currentEditedMap == fwq) {
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    if(ReviewDataFlag == 0) {
                        addfwq();
                    }else{
                        addfwqReviewData();
                    }
                }
            }
        }
    }else if(mapEditStatus == EDITBUILDING_STATUS) {
        --judgeCount;
        if (relations.length != 0) {
            intersectionCount++;
        }
        if(judgeCount == 1 || judgeCount == 0){
            judgeCount = 0;
            if (intersectionCount > 0) {
                if (currentEditedMap == jzw) {
                    var info = "该编辑建筑物于已有建筑物重叠,请重新编辑！";
                } else if (currentEditedMap == wg) {
                    var info = "该编辑网格已有网格重叠,请重新编辑！";
                } else if (currentEditedMap == xfbj) {
                    var info = "该编辑县分于已有县分重叠,请重新编辑！";
                } else if (currentEditedMap == yfbj) {
                    var info = "该编辑营服于已有营服重叠,请重新编辑！";
                } else if (currentEditedMap == fwq) {
                    var info = "该编辑服务区于已有服务区重叠,请重新编辑！";
                }
                $.messager.alert({
                    title: '提示', msg: info, icon: 'error'
                });
                intersectionCount = 0;
                $("#mapMenu .cancelOp").removeClass("hide").show();
                $("#mapMenu .submitOp").removeClass("hide").show();
                $("#cancelOpLine").removeClass("hide").show();
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .newAdd").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .backToPre").hide();
                $("#mapMenu .mapToggle").hide();
                mapEditStatus = FREE_STATUS;
            } else {
                currentEditedFCLayer.clearSelection();
                editToolbar.deactivate();
                buildingGeometryEditSubmit(newEditGraphics, oldEditGraphics);
                mapEditStatus = FREE_STATUS;
            }
        }
    }
}

function identifyQueryForExist(geometry,currentEditedMap) {
    //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
    var identifyTask = new esri.tasks.IdentifyTask(currentEditedMap);
    //定义空间查询参数对象
    var params = new esri.tasks.IdentifyParameters();
    //容差
    params.tolerance = 0;
    //是否返回几何信息
    params.returnGeometry = true;
    //空间查询得图层
    params.layerIds = [0];
    //空间查询得条件
    params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    params.width = map.width;
    params.height = map.height;
    //空间查询得几何对象
    params.geometry = geometry;
    params.mapExtent = map.extent;
    //执行空间查询
    identifyTask.execute(params,showQueryResultForExist);
}


//ͨ通过此函数处理查询之后的信息
function showQueryResultForExist(idResults) {
    var DelFlag=0;
    if ( mapEditStatus == CREATEBUILDING_STATUS) {
        if (idResults.length > 0){
            judgeCount = idResults.length;
            for(var i=0;i<idResults.length;i++) {
                if(idResults[i].feature.attributes.DEL_FLAG == 0) {
                    judgeGeometryTouch(curEditGraphic, idResults[i].feature);
                }else {
                    --judgeCount;
                    ++DelFlag;
                }
            }
            if(DelFlag == idResults.length){
                if (currentEditedMap == jzw) {
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    if (ReviewDataFlag == 0) {
                        addJzw();
                        getAddrsByPid(0, "oneLever");
                        $("#oneLever").combobox({
                            onChange: function (n, o) {
                                var onelever = $(this).combobox('getValue');
                                $("#oneLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(onelever, "twoLever");
                            }
                        });
                        $("#twoLever").combobox({
                            onChange: function (n, o) {
                                var twolever = $(this).combobox('getValue');
                                $("#twoLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(twolever, "threeLever");
                            }
                        });
                        $("#threeLever").combobox({
                            onChange: function (n, o) {
                                var threelever = $(this).combobox('getValue');
                                $("#threeLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(threelever, "fourLever");
                            }
                        });
                        $("#fourLever").combobox({
                            onChange: function (n, o) {
                                var fourlever = $(this).combobox('getValue');
                                $("#fourLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "fourLever");
                                getAddrsByPid(fourlever, "fiveLever");
                            }
                        });
                        $("#fiveLever").combobox({
                            onChange: function (n, o) {
                                var fivelever = $(this).combobox('getValue');
                                $("#fiveLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "fiveLever");
                                getAddrsByPid(fivelever, "sixLever");
                            }
                        });
                        $("#sixLever").combobox({
                            onChange: function (n, o) {
                                var sixlever = $(this).combobox('getValue');
                                $("#sixLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "sixLever");
                                getAddrsByPid(sixlever, "sevenLever");
                            }
                        });
                        $("#sevenLever").combobox({
                            onChange: function (n, o) {
                                checkLeverExist($(this).combobox('getValue'), "sevenLever");
                                $("#buildingAddr").val($.trim($("#oneLever").combobox("getText")) + $.trim($("#twoLever").combobox("getText")) + $.trim($("#threeLever").combobox("getText")) + $.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                                $('#buildingAddrId').val($("#sevenLeverId").val());
                                $("#buildingName").val($.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                            }
                        });
                    } else {
                        addJzwReviewData();
                    }
                } else if (currentEditedMap == wg) {
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    addWg();
                } else if (currentEditedMap == xfbj) {

                } else if (currentEditedMap == yfbj) {

                } else if (currentEditedMap == fwq) {
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    if (ReviewDataFlag == 0) {
                        addfwq();
                    }else{
                        addfwqReviewData();
                    }
                }
                mapEditStatus = FREE_STATUS;
            }
        }else {
            if (currentEditedMap == jzw) {
                $("#mapMenu .newAdd").removeClass("hide").show();
                $("#mapMenu .backToPre").removeClass("hide").show();
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .mapToggle").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .cancelOp").hide();
                $("#cancelOpLine").hide();
                $("#mapMenu .submitOp").hide();
                if (ReviewDataFlag == 0) {
                    addJzw();
                    getAddrsByPid(0, "oneLever");
                    $("#oneLever").combobox({
                        onChange: function (n, o) {
                            var onelever = $(this).combobox('getValue');
                            $("#oneLeverId").val($(this).combobox('getValue'));
                            getAddrsByPid(onelever, "twoLever");
                        }
                    });
                    $("#twoLever").combobox({
                        onChange: function (n, o) {
                            var twolever = $(this).combobox('getValue');
                            $("#twoLeverId").val($(this).combobox('getValue'));
                            getAddrsByPid(twolever, "threeLever");
                        }
                    });
                    $("#threeLever").combobox({
                        onChange: function (n, o) {
                            var threelever = $(this).combobox('getValue');
                            $("#threeLeverId").val($(this).combobox('getValue'));
                            getAddrsByPid(threelever, "fourLever");
                        }
                    });
                    $("#fourLever").combobox({
                        onChange: function (n, o) {
                            var fourlever = $(this).combobox('getValue');
                            $("#fourLeverId").val($(this).combobox('getValue'));
                            checkLeverExist($(this).combobox('getValue'), "fourLever");
                            getAddrsByPid(fourlever, "fiveLever");
                        }
                    });
                    $("#fiveLever").combobox({
                        onChange: function (n, o) {
                            var fivelever = $(this).combobox('getValue');
                            $("#fiveLeverId").val($(this).combobox('getValue'));
                            checkLeverExist($(this).combobox('getValue'), "fiveLever");
                            getAddrsByPid(fivelever, "sixLever");
                        }
                    });
                    $("#sixLever").combobox({
                        onChange: function (n, o) {
                            var sixlever = $(this).combobox('getValue');
                            $("#sixLeverId").val($(this).combobox('getValue'));
                            checkLeverExist($(this).combobox('getValue'), "sixLever");
                            getAddrsByPid(sixlever, "sevenLever");
                        }
                    });
                    $("#sevenLever").combobox({
                        onChange: function (n, o) {
                            checkLeverExist($(this).combobox('getValue'), "sevenLever");
                            $("#buildingAddr").val($.trim($("#oneLever").combobox("getText")) + $.trim($("#twoLever").combobox("getText")) + $.trim($("#threeLever").combobox("getText")) + $.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                            $('#buildingAddrId').val($("#sevenLeverId").val());
                            $("#buildingName").val($.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                        }
                    });
                } else {
                    addJzwReviewData();
                }
            } else if (currentEditedMap == wg) {
                $("#mapMenu .newAdd").removeClass("hide").show();
                $("#mapMenu .backToPre").removeClass("hide").show();
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .mapToggle").hide();
                $("#mapMenu .cancelOp").hide();
                $("#cancelOpLine").hide();
                $("#mapMenu .submitOp").hide();
                addWg();
            } else if (currentEditedMap == xfbj) {

            } else if (currentEditedMap == yfbj) {

            } else if (currentEditedMap == fwq) {
                $("#mapMenu .newAdd").removeClass("hide").show();
                $("#mapMenu .backToPre").removeClass("hide").show();
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .mapToggle").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .cancelOp").hide();
                $("#cancelOpLine").hide();
                $("#mapMenu .submitOp").hide();
                if(ReviewDataFlag == 0) {
                    addfwq();
                }else{
                    addfwqReviewData();
                }
            }
            mapEditStatus = FREE_STATUS;
        }
    }else if(mapEditStatus == EDITBUILDING_STATUS) {
            if (idResults.length > 1) {
                judgeCount = idResults.length;
                for(var i=0;i<idResults.length;i++) {
                    if ((newEditGraphics[0].attributes.FACNAME != idResults[i].feature.attributes.FACNAME) &&
                        (idResults[i].feature.attributes.DEL_FLAG == 0)) {
                        judgeGeometryTouch(newEditGraphics[0], idResults[i].feature);
                    } else {
                        --judgeCount;
                        ++DelFlag;
                    }
                }
                if(DelFlag == idResults.length){
                    currentEditedFCLayer.clearSelection();
                    editToolbar.deactivate();
                    buildingGeometryEditSubmit(newEditGraphics, oldEditGraphics);
                    mapEditStatus = FREE_STATUS;
                }
            } else {
                currentEditedFCLayer.clearSelection();
                editToolbar.deactivate();
                buildingGeometryEditSubmit(newEditGraphics, oldEditGraphics);
                mapEditStatus = FREE_STATUS;
            }
        }

}


function identifyQuery(geometry,currentEditedMap) {
    if(currentEditedMap != dt) {
        //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
        var identifyTask = new esri.tasks.IdentifyTask(currentEditedMap);
        //定义空间查询参数对象
        var params = new esri.tasks.IdentifyParameters();
        //容差
        params.tolerance = 3;
        //是否返回几何信息
        params.returnGeometry = true;
        //空间查询得图层
        params.layerIds = [0];
        //空间查询得条件
        params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        params.width = map.width;
        params.height = map.height;
        //空间查询得几何对象
        params.geometry = geometry;
        params.mapExtent = map.extent;
        //执行空间查询
        identifyTask.execute(params, showQueryResult);
    }else{
        //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
        var identifyTask = new esri.tasks.IdentifyTask(jzw);
        //定义空间查询参数对象
        var params = new esri.tasks.IdentifyParameters();
        //容差
        params.tolerance = 3;
        //是否返回几何信息
        params.returnGeometry = true;
        //空间查询得图层
        params.layerIds = [0];
        //空间查询得条件
        params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        params.width = map.width;
        params.height = map.height;
        //空间查询得几何对象
        params.geometry = geometry;
        params.mapExtent = map.extent;
        //执行空间查询
        identifyTask.execute(params, showQueryResultDt);
    }
}


//ͨ通过此函数处理查询之后的信息
function showQueryResult(idResults) {
    map.graphics.clear();
    //创建线符号
    var lineSymbol=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
    //创建面符号
    var fill=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, lineSymbol);
    //创建点符号
    var lineSymbol1=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3);
    var pSymbol=new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,10, lineSymbol1, new dojo.Color([0, 255, 0]));

    if (idResults.length > 0) {

        for(var i=0,j=0;i<idResults.length;i++) {
            if(currentEditedMap == lightfacility) {
                if (idResults[i].feature.attributes.OCFTYPE == 2) {
                    resultArray[j++] = idResults[i].feature.attributes;
                }
            }
            if(currentEditedMap == jzw){
            	if (idResults[i].feature.attributes.REVIEW_FLAG && idResults[i].feature.attributes.REVIEW_FLAG == "0") {
            		jzwEditable=false;
                }else{
                	jzwEditable=true;
                }
            }

            var result = idResults[i];


            //获得图形graphic
            var graphic = result.feature;
            //设置图形的符号
            if (currentEditedMap != lightfacility) {
                graphic.setSymbol(lineSymbol);
                addrid = result.feature.attributes.ADDRID;
            }
        }
        map.graphics.add(graphic);
    }
}

function showQueryResultDt(idResults) {
    if (idResults.length > 0) {
        $("#mapMenu .newAdd").hide();
        $("#mapMenu .backToPre").removeClass("hide").show();
        $("#mapMenu .reviewToggle").hide();
        $("#mapMenu .handleToggle").hide();
        $("#mapMenu .moveToggle").hide();
        $("#mapMenu .mapToggle").hide();
        $("#mapMenu .cancelOp").hide();
        $("#cancelOpLine").hide();
        $("#mapMenu .submitOp").hide();
        $("#mapMenu .pickUp").hide();
        $.messager.alert("提示","此处底图上已存在建筑物！",'info');
    }else{
        //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
        var identifyTask = new esri.tasks.IdentifyTask(dt);
        //定义空间查询参数对象
        var params = new esri.tasks.IdentifyParameters();
        //容差
        params.tolerance = 3;
        //是否返回几何信息
        params.returnGeometry = true;
        //空间查询得图层
        params.layerIds = [0];
        //空间查询得条件
        params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        params.width = map.width;
        params.height = map.height;
        //空间查询得几何对象
        params.geometry = mapPoint;
        params.mapExtent = map.extent;
        //执行空间查询
        identifyTask.execute(params, showQueryResult);
    }
}

function identifyQueryForPosition(geometry,mapServer) {
    //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
    var identifyTask = new esri.tasks.IdentifyTask(mapServer);
    //定义空间查询参数对象
    var params = new esri.tasks.IdentifyParameters();
    //容差
    params.tolerance = 3;
    //是否返回几何信息
    params.returnGeometry = true;
    //空间查询得图层
    params.layerIds = [0];
    //空间查询得条件
    params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    params.width = map.width;
    params.height = map.height;
    //空间查询得几何对象
    params.geometry = geometry;
    params.mapExtent = map.extent;
    //执行空间查询
    identifyTask.execute(params,showQueryResultForPosition);
}


//ͨ通过此函数处理查询之后的信息
function showQueryResultForPosition(idResults) {
    var id;
    if(currentEditedMap == jzw){
        id = "selectOrganization";
    }else if( currentEditedMap == wg){
        id = "wgCounty";
    }else if( currentEditedMap == lightfacility){

    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if(currentEditedMap == fwq){
        id="otbCounty"
    }else if(currentEditedMap == dt){
        id = "selectOrganization";
    }
    if (idResults.length > 0) {

        for (var i = 0; i < idResults.length; i++) {
            var result = idResults[i];

            bjGraphic = result.feature;

            yfName = bjGraphic.attributes.VILLAGE;

            wgFacName = bjGraphic.attributes.FACNAME;
        }
        county = bjGraphic.attributes.COUNTY;

       /* if (county) {
            $("#"+ id).find("option:contains('" + county + "')").attr("selected",true);
        }*/
    }/*else{
        if(currentEditedMap == jzw){
          /!*  $.messager.alert("提示","添加的建筑物不属于任何网格",'info');
            $("#buildingPropertyAdd").dialog("close");
            return ;*!/
        }else if( currentEditedMap == wg){
            $.messager.alert("提示","添加的网格不属于任何营服",'info');
            $('#wgPropertyAdd').dialog('close');
            return;
        }else if( currentEditedMap == lightfacility){

        }else if( currentEditedMap == xfbj){

        }else if( currentEditedMap == yfbj){

        }else if(currentEditedMap == fwq){
            $.messager.alert("提示","添加的服务区不属于任何网格",'info');
            $('#otbPropertyAdd').dialog('close');
            return;
        }
    }*/




    /*switch (bjGraphic.attributes.COUNTY){
        case "城区分公司":
            $("#"+ id).find("option:contains('城区')").attr("selected",true);
            break;
        case "小榄分公司":
            $("#"+ id).find("option:contains('小榄')").attr("selected",true);
            break;
        case "西部分公司":
            $("#"+ id).find("option:contains('西部')").attr("selected",true);
            break;
        case "北部分公司":
            $("#"+ id).find("option:contains('北部')").attr("selected",true);
            break;
        case "东部分公司":
            $("#"+ id).find("option:contains('东部')").attr("selected",true);
            break;
        case "南部分公司":
            $("#"+ id).find("option:contains('南部')").attr("selected",true);
            break;
    }*/

    if(currentEditedMap == jzw){
        if(!RegExp(yfName).test(where.layerDefs)){

            mapEditStatus = FREE_STATUS;
            $("#mapMenu .newAdd").removeClass("hide").show();
            $("#mapMenu .backToPre").removeClass("hide").show();
            $("#mapMenu .cancelOp").hide();
            $("#cancelOpLine").hide();
            $.messager.alert("提示","添加的建筑物的地点不属于您所在的营服",'info');
            //$("#buildingPropertyAdd").dialog("close");
            return ;
        }
    }else if( currentEditedMap == wg){
        if(!RegExp(yfName).test(where.layerDefs)){
            $.messager.alert("提示","添加的网格的地点不属于您所在的营服",'info');
            mapEditStatus = FREE_STATUS;
            $("#mapMenu .newAdd").removeClass("hide").show();
            $("#mapMenu .backToPre").removeClass("hide").show();
            $("#mapMenu .cancelOp").hide();
            $("#cancelOpLine").hide();
            return ;
        }
        //getYingFu($('#wgCounty').val());
    }else if( currentEditedMap == lightfacility){
        if(!RegExp(yfName).test(where.layerDefs)){
            $("#obdPropertyEdit").hide();
            $.messager.alert("提示","添加的服务区的地点不属于您所在的营服",'info');
            moveFlag = 1;
            $("#to_top").removeClass("hide").show();
            map.graphics.clear();
            oTop = document.getElementById("to_top");
            oTop.innerHTML="点击以选择目标";
            $("#to_top").removeClass("hide").show();
            $("#mapMenu .moveToggle").hide();
            mapEditStatus = FREE_STATUS;
            return ;
        }
    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if(currentEditedMap == fwq){
        if(!RegExp(yfName).test(where.layerDefs)){
            $.messager.alert("提示","添加的服务区的地点不属于您所在的营服",'info');
            mapEditStatus = FREE_STATUS;
            $("#mapMenu .newAdd").removeClass("hide").show();
            $("#mapMenu .backToPre").removeClass("hide").show();
            $("#mapMenu .cancelOp").hide();
            $("#cancelOpLine").hide();
            return ;
        }
        /*getYingFu($('#otbCounty').val());
        $("#otbgird").val(wgFacName);
        $("#otbgirdid").val(bjGraphic.attributes.FACID);*/
    }else if(currentEditedMap == dt){
        return  ;
    }
    identifyQueryForExist(curEditGraphic.geometry,currentEditedMap);
}



function markPoints() {

    var centerPoint = curEditGraphic.geometry.getExtent().getCenter();

    var pSymbol = new esri.symbol.PictureMarkerSymbol('./img/label/r'+buildingMarkIndex+'.png', 24, 56);

    var geometry = new esri.geometry.Point({
        "x": centerPoint.x,
        "y": centerPoint.y,
        "spatialReference": map.spatialReference
    });
    var graphic = new esri.Graphic(geometry, pSymbol);

    map.graphics.add(graphic);

    buildingMarkIndex ++ ;
}

function markPoint() {

    var centerPoint = curEditGraphic.geometry.getExtent().getCenter();

    var pSymbol = new esri.symbol.PictureMarkerSymbol('./img/label/b.png', 24, 56);

    var geometry = new esri.geometry.Point({
        "x": centerPoint.x,
        "y": centerPoint.y,
        "spatialReference": map.spatialReference
    });
    var graphic = new esri.Graphic(geometry, pSymbol);

    map.graphics.add(graphic);

    if(curEditGraphic.attributes["SHAPE.LEN"] < 0.0005) {
        map.setScale(400);
    }else if( curEditGraphic.attributes["SHAPE.LEN"] < 0.001 && curEditGraphic.attributes["SHAPE.LEN"] >= 0.0005){
        map.setScale(800);
    }else if(curEditGraphic.attributes["SHAPE.LEN"] < 0.005 && curEditGraphic.attributes["SHAPE.LEN"] >= 0.001){
        map.setScale(1600);
    }else if(curEditGraphic.attributes["SHAPE.LEN"] < 0.01 && curEditGraphic.attributes["SHAPE.LEN"] >= 0.005){
        map.setScale(3200);
    }else if(curEditGraphic.attributes["SHAPE.LEN"] < 0.05 && curEditGraphic.attributes["SHAPE.LEN"] >= 0.01){
        map.setScale(6400);
    }else if(curEditGraphic.attributes["SHAPE.LEN"] < 0.1 && curEditGraphic.attributes["SHAPE.LEN"] >= 0.05){
        map.setScale(12800);
    }else if(curEditGraphic.attributes["SHAPE.LEN"] >= 0.1){
        map.setScale(25600);
    }
    map.centerAt(geometry);
}



//OBD资源
$('#obdResource').on('click', function () {
    $(".loadMore").hide();
    showOrg();
});



function markPolygon(objectId,map) {

    //创建属性查询对象
    var findTask = new esri.tasks.FindTask(map);
    //创建属性查询参数
    var findParams = new esri.tasks.FindParameters();

    //是否返回给我们几何信息
    findParams.returnGeometry = true;
    //对哪一个图层进行属性查询
    findParams.layerIds = [0];
    //查询的字段
    if(map == jzw) {
        findParams.searchFields = ["OBJECTID"];
    }else if (map == wg){
        findParams.searchFields = ["FACID"];
    }

    findParams.searchText = objectId;
    //执行查询对象
    findTask.execute(findParams, ShowPolygon);
}

function ShowPolygon(queryResult){
    //创建线符号
    var lineSymbol=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 5);

    if (queryResult.length == 0) {
        return false;
    }
    if (queryResult.length >= 1) {
        for (var i = 0; i < queryResult.length; i++) {
            //获得图形graphic
            curEditGraphic = queryResult[i].feature;
            //赋予相应的符号
            curEditGraphic.setSymbol(lineSymbol);
            //将graphic添加到地图中，从而实现高亮效果
            map.graphics.add(curEditGraphic);
        }
    }
    if(buildingMarkIndex!=0) {
        markPoints();
    }else{
        markPoint();
    }
    mapEventGraphic = curEditGraphic;

    // 建筑物和网格有GRID_TYPE字段，但只有网格才使用了该字段。此处以后如加入营服，县分等地图对象，可考虑优化该方法，传入参数进行区分
    if(curEditGraphic.attributes.GRID_TYPE == "" || curEditGraphic.attributes.GRID_TYPE == "Null"){
        map.setScale(6000);
        var centerPoint = curEditGraphic.geometry.getExtent().getCenter();

        var geometry = new esri.geometry.Point({
            "x": centerPoint.x,
            "y": centerPoint.y,
            "spatialReference": map.spatialReference
        });
        map.centerAt(geometry);
        rendererJzwForLeftPanel();
        addrid = curEditGraphic.attributes.ADDRID;
    }else{
        rendererWgForLeftPanel();
    }

}


//JZW查询
$('#jzwResource').on('click', function () {
    $(".loadMore").hide();
    showWebGrid();
});

//OBD资源展示
function showOrg() {
    $('#showOrg').combotree({
        onChange: function (n,o) {
            $("#tselect").empty();
            $("#tselect").show();
            $("#tinput").hide();
            curPage = 1;
            orgId = n;
            flag = OBD_RESOURCE_STATUS;
            findOTBByOrg(n);
            $(".loadMore").show();
        },
    });
    $("#tselect").empty();
    var loginUser = JSON.parse($.cookie('loginUser'));
    $.get("restful/organization/findOrgByUser",{userId:loginUser.id}, function (data) {
        if (data.status = 'success') {
            var list = JSON.parse(data.content);
            var tree = listToTree(list, list[0].orgPid);//调用函数，传入要转换的list数组，和树中顶级元素的pid
            $("#showOrg").combotree("loadData",tree);
        }
    });
}

//建筑物资源展示
function showWebGrid() {
    $('#showWebGrid').combotree({
        onChange: function (n,o) {
            removeAllRoots('tBuildingselect');
            GetWebGrid();
        },
    });
    $("#tBuildingselect").empty();
    var loginUser = JSON.parse($.cookie('loginUser'));
    $.get("restful/organization/findOrgByUser",{userId:loginUser.id}, function (data) {
        if (data.status = 'success') {
            var list = JSON.parse(data.content);
            var tree = listToTree(list, list[0].orgPid);//调用函数，传入要转换的list数组，和树中顶级元素的pid
            $("#showWebGrid").combotree("loadData",tree);
        }
    });
}

function listToTree(list, orgPid) {
    var ret = [];//一个存放结果的临时数组
    for (var i in list) {
        if (list[i].orgPid == orgPid) {//如果当前项的父id等于要查找的父id，进行递归
            list[i].children = listToTree(list, list[i].id);
            ret.push(list[i]);//把当前项保存到临时数组中
        }
    }
    return ret;//递归结束后返回结果
}

//创建建筑物树形结构
function creatBuildingTree() {
    $('#tBuildingselect').tree({
        onClick: function(node){
            // if (node.attributes == 'b') {
            //     showBuilding(node);
            // }else if(node.attributes == 'a'){
            //
            // } else {
            //     if(node.attributes != node.id){
            //         node.attributes = node.attributes + 1;
            //         showBuildingByAreaMore(node);
            //     }
            // }
            if (node.attributes == 'a') {
                findWgByGridType(node);
            }else if(node.attributes == 'b'){
                showWg(node);
            }else if(node.attributes == 'c'){
                gNode = 2;
                showBuilding(node);
            }else{
                if(node.attributes != node.id){
                    node.attributes = node.attributes + 1;
                    showBuildingByAreaMore(node);
                }
            }
        },
        onContextMenu : function(e,node){
            e.preventDefault();
            if(node.attributes == 'b'){
                $("#mapMenu1 .handleToggle").show();
                $("#mapMenu1 .reviewToggle").hide();
                $('#mapMenu1 .newAdd').hide();
                $('#newAddLine1').hide();
                $("#deleteLine1").hide();
                showWgMenu(e)
            }else if(node.attributes == 'c'){
                $("#mapMenu1 .reviewToggle").removeClass("hide").show();
                $("#mapMenu1 .handleToggle").show();
                $('#mapMenu1 .newAdd').hide();
                $('#newAddLine1').hide();
                $("#deleteLine1").hide();
                showBuildingMenu(e);
            }
        },
        onExpand:function (node) {
            if (node.attributes == 'a') {
                findWgByGridType(node);
            }else if(node.attributes == 'b'){
                findBuildingByWg(node);
            }
        },
        onBeforeExpand:function (node) {
            var t = $('#showWebGrid').combotree('tree');	// 获取树对象
            var n = t.tree('getSelected');// 获取选择的节点
            if(n==null ){
                $.messager.alert("请选择一个组织机构！");
                return false;
            }
        }
    });
}
function showWgMenu(e) {
    $('#mapMenu1').menu('show',{
        left: e.pageX,
        top: e.pageY,
        onClick: function(item){
        	checkMenuPrivilege(item);
            if(item.name == "属性修改"){
            if( currentEditedMap == wg){
                    wgPropertyEdit();
                }
            }else if(item.name == "删除"){
            	$.messager.confirm('提示', '确认删除？', function(r){
            		if (r){
            			deleteBuilding();
            		}
            	});
            }
        }
    })
}
function showBuildingMenu(e) {
    $('#mapMenu1').menu('show',{
        left: e.pageX,
        top: e.pageY,
        onClick : function(item) {
        	checkMenuPrivilege(item);
            if (item.name == "查看光资源统计") {
                //$(".distanceIpt-box").removeClass("hide").show();
            	$("#gzytj_dialog").dialog({
                    title : item.name,
                    closed : false,
                    cache : false,
                    modal : true
                }).show();
                buildingStatistics(addrid);
            }else if(item.name == "查看建筑物图片"){
                var photos = getPhotos(2, mapEventGraphic.attributes.FACID);
                initPhotoPage(photos);
                $('#facilityPhotoDetail').dialog({
                    title : item.name,
                    closed : false,
                    cache : false,
                    modal : true
                }).show().window('center');
            }else if(item.name == "属性修改"){
                if(currentEditedMap == jzw){
                    jzwPropertyEdit();
                }
            }else if(item.name == "删除"){
                $.messager.confirm('提示', '确认删除？', function(r){
            		if (r){
            			deleteBuilding();
            		}
            	});
            }
        }
    })
}

//创建OTB树形结构
function creatOTBTree() {
    $('#tselect').tree({
        onClick: function(node){
            if (node.attributes == 1) {
                gNode = 1;
                showAllBuildingByOTB(node);
                otbName = node.text;
            }else if(node.attributes == 2){
                gNode = 2;
                showObdAndBuilding(node);
            }else if(node.attributes == 3){
                gNode = 3;
                showBuilding(node);
            }
        },

        onContextMenu : function(e,node){
            e.preventDefault();
            if(node.attributes == 1 ){
                $("#mapMenu1 .newAdd").removeClass("hide").show();
                $("#mapMenu1 .handleToggle").hide();
                $("#mapMenu1 .reviewToggle").hide();
                $("#newAddLine1").hide();
                addOTB(e);
            }else if(node.attributes == 3){
                $("#mapMenu1 .newAdd").hide();
                $("#newAddLine1").hide();
                $("#mapMenu1 .reviewToggle").removeClass("hide").show();
                $("#mapMenu1 .handleToggle").removeClass("hide").show();
                $("#deleteLine1").hide();
                showBuildingMenu(e);
          }
        },
        onExpand:function (node) {
            if (node.attributes == 1) {
                findOBDByOTB(node);
            }else if(node.attributes == 2){
                findBuildingByOBD(node);
            }
        }
    });
}

//创建OTB树形结构--模糊查询
function creatOTBInputTree() {
    $('#tinput').tree({
        onClick: function(node){
            if (node.attributes == 1) {
                gNode = 1;
                showAllBuildingByOTB(node);
                otbName = node;
            }else if(node.attributes == 2){
                gNode = 2;
                showObdAndBuilding(node);
            }else if(node.attributes == 3){
                gNode = 3;
                showBuilding(node);
            }
        },
        onContextMenu : function(e,node){
            e.preventDefault();
            if(node.attributes == 1 ){
                $("#mapMenu1 .newAdd").removeClass("hide").show();
                $("#mapMenu1 .handleToggle").hide();
                $("#mapMenu1 .reviewToggle").hide();
                $("#newAddLine1").hide();
                addOTB(e);
            }else if(node.attributes == 3){
                $("#mapMenu1 .newAdd").hide();
                $("#newAddLine1").hide();
                $("#mapMenu1 .reviewToggle").removeClass("hide").show();
                $("#mapMenu1 .handleToggle").removeClass("hide").show();
                $("#deleteLine1").hide();
                showBuildingMenu(e);
            }
        },

        onExpand:function (node) {
            if (node.attributes == 2) {
                findBuildingByOBDInput(node);
            }
        }
    });
}

function addOTB(e){
    $('#mapMenu1').menu('show',{
        left: e.pageX,
        top: e.pageY,
        onClick : function(item) {
            if(item.name == "添加"){
                //添加OTB
                draw.activate(esri.toolbars.Draw.POLYGON,{
                    showTooltips:true
                });
                $("#to_top").removeClass("hide").show();
                oTop = document.getElementById("to_top");
                oTop.innerHTML="单击以开始绘制";
                mapEditStatus = CREATEBUILDING_STATUS;
                currentEditedMap = fwq;
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .mapToggle").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .newAdd").hide();
                $("#mapMenu .backToPre").hide();
                $("#mapMenu .cancelOp").removeClass("hide").show();
                $("#cancelOpLine").hide();
                $("#mapMenu .pickUp").hide();
            }
        }
    })
}

//根据区域查找OTB资源
function findOTBByOrg(id) {
    var jsonObj={};
    var jsonName = {};
    jsonName.orgId = id;
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = curPage;
    jsonObj.objCondition = jsonName;
    $.ajax({
        type: "POST",
        url: "restful/lightfacility/findOTBByOrg",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                lastPage = records.totalPageNum;
                $.each(records.rows, function (i, r) {
                    $('#tselect').tree('append', {
                        data: {
                            id: r.ocfId,
                            text: r.ocfName,
                            state: 'closed',
                            attributes:'1',
                            iconCls:'icon-OTB',
                            children: [{
                                id: '1'
                            }]

                        }
                    });
                });
            }
        },
        error: function (err) {
        }
    })
}


function findOBDByOTB(node) {
    //添加子节点前先清空子节点，避免数据重复
    var nodeChildren = $('#tselect').tree('getChildren',node.target);
    for(var i=0;i<nodeChildren.length;i++){
        $('#tselect').tree('remove',nodeChildren[i].target);
    }
    var jsonObj={};
    jsonObj.attriOcfid = node.id;
    $.ajax({
        type: "POST",
        url: "restful/lightfacility/findOBDByOTB",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $.each(records, function (i, r) {
                    $('#tselect').tree('append', {
                        parent: node.target,
                        data: [{
                            id: r.ocfId,
                            text: r.ocfName,
                            state: 'closed',
                            attributes:'2',
                            iconCls :'icon-OBD',
                            children: [{
                                id: '2'
                            }]
                        }]
                    });

                });

            }
        },
        error: function (err) {
        }
    })
}


function findBuildingByOBD(node) {
    //添加子节点前先清空子节点，避免数据重复
    var nodeChildren = $('#tselect').tree('getChildren',node.target);
    for(var i=0;i<nodeChildren.length;i++){
        $('#tselect').tree('remove',nodeChildren[i].target);
    }
    $.ajax({
        type: "GET",
        url: "restful/building/getById",
        data: {id: node.id},
        success: function (data) {
            if (data.status = 'success' && data.content !="") {
                var records = JSON.parse(data.content);
                $.each(records, function (i, r) {
                    $('#tselect').tree('append', {
                        parent: node.target,
                        data: [{
                            id: r.objectId,
                            text: r.facName,
                            attributes:'3',
                            iconCls:'icon-building'
                        }]
                    });

                });

            }
        }
    });
}

function findBuildingByOBDInput(node) {
    //添加子节点前先清空子节点，避免数据重复
    var nodeChildren = $('#tinput').tree('getChildren',node.target);
    for(var i=0;i<nodeChildren.length;i++){
        $('#tinput').tree('remove',nodeChildren[i].target);
    }
    $.ajax({
        type: "GET",
        url: "restful/building/getById",
        data: {id: node.id},
        success: function (data) {
            if (data.status = 'success' && data.content !="") {
                var records = JSON.parse(data.content);
                $.each(records, function (i, r) {
                    $('#tinput').tree('append', {
                        parent: node.target,
                        data: [{
                            id: r.objectId,
                            text: r.facName,
                            attributes:'3',
                            iconCls:'icon-building'
                        }]
                    });
                });
            }
        }
    });
}

function showAllBuildingByOTB(node) {
    map.graphics.clear();
    $.ajax({
        type: "GET",
        url: "restful/building/showAllBuildingByOTB",
        data: {ocfid: node.id},
        success: function (data) {
            if (data.status = 'success' && data.content !="") {
                var records = JSON.parse(data.content);
                buildingMarkIndex = 1;
                $.each(records, function (i, r) {
                    markPolygon(r.objectId,jzw);
                });
            }
        }
    });
}

//选中节点定位OBD和JZW
function showObdAndBuilding(node) {
    map.graphics.clear();
    $.ajax({
        type: "GET",
        url: "restful/lightfacility/findPositionById",
        data: {id: node.id},
        success: function (data) {
            if (data.status = 'success' && data.content !="") {
                var records = JSON.parse(data.content);

                var pSymbol = new esri.symbol.PictureMarkerSymbol('./img/label/b.png', 24, 56);

                var geometry = new esri.geometry.Point({
                    "x": records.longitude,
                    "y": records.latitude,
                    "spatialReference": map.spatialReference
                });
                var graphic = new esri.Graphic(geometry, pSymbol);

                map.graphics.add(graphic);
                if(map.getScale()>4000) {
                    map.setScale(800);
                }
                map.centerAt(geometry);

            }
        }
    });
    $.ajax({
        type: "GET",
        url: "restful/building/getById",
        data: {id: node.id},
        success: function (data) {
            if (data.status = 'success' && data.content !="") {
                var records = JSON.parse(data.content);
                buildingMarkIndex = 1;
                $.each(records, function (i, r) {
                    markPolygon(r.objectId,jzw);
                });
            }
        }
    });
}
function showWg(node) {
    map.graphics.clear();
    buildingMarkIndex = 0;
    markPolygon(node.id,wg);
}


function showBuilding(node) {
    map.graphics.clear();
    buildingMarkIndex = 0;
    markPolygon(node.id,jzw);
}

function loadMore() {
    if(curPage != lastPage){
        curPage = curPage + 1;
        if(flag==OBD_SEARCH_STATUS){
            searchOTBMore();
        }else if(flag==OBD_RESOURCE_STATUS){
            findOTBByOrg(orgId);
        }
        if(curPage >= lastPage){
            $(".loadMore").hide();
        }
    }
}


function searchOTBMore(){
    var OTBName = $("#searchOTB").val();
    var jsonObj = {};
    var extent = {};
    var t = $('#showOrg').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');// 获取选择的节点
    if(n==null ){
        $.messager.alert("请选择一个组织机构！");
        return
    }
    extent.id = n.id;
    extent.name = OTBName;
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = curPage;
    jsonObj.objCondition = extent;
    var arrayOcfID = new Array()   //用于存放模糊查询是OTB的node id
    $.ajax({
        type: "POST",
        url: "restful/lightfacility/findOTBByIDAndName",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                lastPage = records.totalPageNum;
                if (lastPage > 1) {
                    $(".loadMore").show();
                }
                $.each(records.rows, function (i, r) {
                    arrayOcfID.push(r.ocfId);
                    $('#tinput').tree('append', {
                        data: {
                            id: r.ocfId,
                            text: r.ocfName,
                            state: 'open',
                            attributes: '1',
                            iconCls:'icon-OTB'
                        }
                    });
                });
            }
        },
        error: function (err) {
        }
    });
    findODBbyOTB(arrayOcfID,OTBName);
}

$("#searchOTB").keydown(function(event){
    event=document.all?window.event:event;
    if((event.keyCode || event.which)==13){
        var OTBName = $("#searchOTB").val();
        if(OTBName == null || OTBName == "") {
            $.messager.alert("提示","请输入OBD名称！","info");
            return;
        }
        $('#tselect').empty();
        $('#input').empty();
        curPage = 1;
        var jsonObj = {};
        var extent = {};
        var t = $('#showOrg').combotree('tree');	// 获取树对象
        var n = t.tree('getSelected');// 获取选择的节点
        if(n==null ){
            $.messager.alert("提示","请选择一个组织机构！","info");
            return
        }
        extent.id = n.id;
        extent.name = OTBName;
        jsonObj.pageSize = pageSize;
        jsonObj.pageNumber = curPage;
        jsonObj.objCondition = extent;

        if (flag == OBD_RESOURCE_STATUS || flag == OBD_SEARCH_STATUS) {
            removeAllRoots('tinput');
        }
        $('#tinput').show();
        $('#tselect').hide();
        var arrayOcfID = new Array()   //用于存放模糊查询时OTB的node id
        $.ajax({
            type: "POST",
            url: "restful/lightfacility/findOTBByIDAndName",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify(jsonObj),
            success: function (data) {
                if (data.status = 'success') {
                    var records = JSON.parse(data.content);
                    if(records.rows.length == 0){
                        $(".loadMore").hide();
                        // var record = '<div class="assets-body" style="overflow-y :auto; overflow-x:auto; height:600px">'+
                        //     '<div class="loadMoreBox"><span class="loadMore" >该地区无建筑物覆盖</span></div>' +
                        //     '</div>'
                        // $("#sourceCover").append(record);
                        $.messager.alert("提示","无此OBD，请重新输入！","info")
                        return ;
                    }
                    lastPage = records.totalPageNum;
                    if (lastPage > 1) {
                        $(".loadMore").show();
                    }else{
                        $(".loadMore").hide();
                    }
                    $.each(records.rows, function (i, r) {
                        arrayOcfID.push(r.ocfId);
                        $('#tinput').tree('append', {
                            data: {
                                id: r.ocfId,
                                text: r.ocfName,
                                state: 'open',
                                attributes: '1',
                                iconCls:'icon-OTB'
                            }
                        });
                    });
                }
            },
            error: function (err) {
            }
        });
        findODBbyOTB(arrayOcfID,OTBName);
    }
});

//查找OBD并将结果以字节点插入到相应的OTB父节点中
function findODBbyOTB(arrayOcfID,OTBName) {
    for(var i=0;i<arrayOcfID.length;i++) {
        var jsonObj={};
        jsonObj.attriOcfid = arrayOcfID[i];
        $.ajax({
            type: "POST",
            url: "restful/lightfacility/findOBDByOTB",
            contentType: "application/json",
            dataType: "json",
            async:false,
            data: JSON.stringify(jsonObj),
            success: function (data) {
                if (data.status = 'success') {
                    if (data.status = 'success' && data.content != "") {
                        var records = JSON.parse(data.content);
                        var node = $('#tinput').tree('find', arrayOcfID[i]);
                        $.each(records, function (j, l) {

                            $('#tinput').tree('append', {
                                parent: node.target,
                                data: [{
                                    id: l.ocfId,
                                    text: l.ocfName,
                                    state: 'closed',
                                    attributes: '2',
                                    iconCls : 'icon-OBD',
                                    children: [{
                                        id: '2'
                                    }]
                                }]
                            });
                            //过滤数据，把符合关键字的数据标红
                            if(l.ocfName.search(OTBName) != -1){
                                $('#'+ node.children[j].domId).css("color","red");
                            }
                        });
                    }
                }
            },
            error: function (err) {
            }
        })
    }
    flag = OBD_SEARCH_STATUS;
}



$('#searchOBDButton').on('click', function () {
    var OTBName = $('#searchOTB').val();
    if(OTBName == null || OTBName == ""){
        $.messager.alert("提示","请输入OBD名称！","info");
        return ;
    }
    $('#tselect').empty();
    $('#input').empty();
    curPage = 1;
    var jsonObj = {};
    var extent = {};
    var t = $('#showOrg').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');// 获取选择的节点
    if(n==null ){
        $.messager.alert("提示","请选择一个组织机构！","info");
        return
    }
    extent.id = n.id;
    extent.name = OTBName;
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = curPage;
    jsonObj.objCondition = extent;
    if (flag == OBD_RESOURCE_STATUS || flag == OBD_SEARCH_STATUS) {
        removeAllRoots('tinput');
    }
    $('#tinput').show();
    $('#tselect').hide();
    var arrayOcfID = new Array()   //用于存放模糊查询是OTB的node id
    $.ajax({
        type: "POST",
        url: "restful/lightfacility/findOTBByIDAndName",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                if(records.rows.length == 0){
                    $(".loadMore").hide();
                    // var record = '<div class="assets-body" style="overflow-y :auto; overflow-x:auto; height:600px">'+
                    //     '<div class="loadMoreBox"><span class="loadMore" >该地区无建筑物覆盖</span></div>' +
                    //     '</div>'
                    // $("#sourceCover").append(record);
                    $.messager.alert("提示","无此OBD，请重新输入！","info")
                    return ;
                }
                lastPage = records.totalPageNum;
                if (lastPage > 1) {
                    $(".loadMore").show();
                }else{
                    $(".loadMore").hide();
                }
                $.each(records.rows, function (i, r) {
                    arrayOcfID.push(r.ocfId);
                    $('#tinput').tree('append', {
                        data: {
                            id: r.ocfId,
                            text: r.ocfName,
                            state: 'open',
                            attributes: '1',
                            iconCls:'icon-OTB'
                        }
                    });
                });
            }
        },
        error: function (err) {
        }
    });
    findODBbyOTB(arrayOcfID,OTBName);
});


//获取网格结构数据
function GetWebGrid() {
    $.ajax({
        type: "GET",
        url: "restful/girdcell/getAll",
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $.each(records, function (i, r) {
                    $('#tBuildingselect').tree('append', {
                        data: {
                            id: r.dictId,
                            text: r.dictName,
                            state: 'closed',
                            attributes: 'a',
                            iconCls: 'icon-gridType',
                             children: [{
                             id: '1'
                             }]
                        }
                    });
                });
            }
        },
        error: function (err) {
        }
    });
}


//点击网格类型节点按查询所属网格
function findWgByGridType(node){
    //添加子节点前先清空子节点，避免数据重复
    var nodeChildren = $('#tBuildingselect').tree('getChildren',node.target);
    for(var i=0;i<nodeChildren.length;i++){
        $('#tBuildingselect').tree('remove',nodeChildren[i].target);
    }
    curPage = 1;
    var jsonObj = {};
    var extent = {};
    var t = $('#showWebGrid').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');// 获取选择的节点
    // gNode = node;
    // orgId = n.id;
    extent.orgId = n.id;
    extent.gridType = node.text;
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = curPage;
    jsonObj.objCondition = extent;
    $.ajax({
        type: "POST",
        url: "restful/wg/findWgGridType",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);

                $.each(records.rows, function (i, r) {
                    $('#tBuildingselect').tree('append', {
                        parent: node.target,
                        data: {
                            id: r.facId,
                            text: r.facName,
                            gridType: r.gridType,
                            state: 'closed',
                            attributes: 'b',
                            iconCls: 'icon-gridCell',
                            children: [{
                                id: '2'
                            }]
                        }
                    });
                });
            }
        },
        error: function (err) {
        }
    });
}

function findBuildingByWg(node) {
    //添加子节点前先清空子节点，避免数据重复
    var nodeChildren = $('#tBuildingselect').tree('getChildren',node.target);
    for(var i=0;i<nodeChildren.length;i++){
        $('#tBuildingselect').tree('remove',nodeChildren[i].target);
    }
    curPage = 1;
    var jsonObj = {};
    var extent = {};
    // var buildingName = $('#searchBuilding').val();
    // if(buildingName!='') {
    //     extent.facName = buildingName;
    // }
    var t = $('#showWebGrid').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');// 获取选择的节点
    extent.orgId = n.id;
    // extent.gridType = node.gridType;
    extent.parentId = node.id;
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = curPage;
    jsonObj.objCondition = extent;
    $.ajax({
        type: "POST",
        url: "restful/building/findBuildingByWgId",
        contentType: "application/json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success' && data.content !="") {
                var records = JSON.parse(data.content);
                $.each(records.rows, function (i, r) {
                    $('#tBuildingselect').tree('append', {
                        parent: node.target,
                        data: [{
                            id: r.objectId,
                            text: r.facName,
                            attributes:'c',
                            iconCls: 'icon-building',
                        }]
                    });

                });
            }

            if (records.totalPageNum > 1) {
                $('#tBuildingselect').tree('append', {
                    parent: node.target,
                    data: {
                        id: records.totalPageNum,
                        text: '加载更多...',
                        state: 'open',
                        attributes: 1,
                        iconCls: 'icon-add',
                    }
                });
            }
        },
        error: function (err) {
        }
    });
}

function showBuildingByAreaMore(node) {
    var parentNode = $('#tBuildingselect').tree('getParent',node.target);
    $('#tBuildingselect').tree('remove',node.target);
    var jsonObj = {};
    var extent = {};
    var t = $('#showWebGrid').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');                 // 获取选择的节点
    extent.orgId = n.id;
    var buildingName = $('#searchBuilding').val();
    if(buildingName!='') {
        extent.facName = buildingName;
    }
    extent.gridType = parentNode.gridType;
    extent.parentId = parentNode.id;
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = node.attributes;
    jsonObj.objCondition = extent;
    $.ajax({
        type: "POST",
        url: "restful/building/findBuildingByWgId",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $.each(records.rows, function (i, r) {
                    $('#tBuildingselect').tree('append', {
                        parent: parentNode.target,
                        data: {
                            id: r.objectId,
                            text: r.facName,
                            state: 'open',
                            attributes: 'c',
                            iconCls: 'icon-building'
                        }
                    });
                    //数据标红
                    if(buildingName.length>0 && r.facName.search(buildingName) != -1){
                        $('#'+ parentNode.children[100+i].domId).css("color","red");
                    }
                });
                if (node.attributes < records.totalPageNum) {
                    $('#tBuildingselect').tree('append', {
                        parent: parentNode.target,
                        data: {
                            id: records.totalPageNum,
                            text: '加载更多...',
                            state: 'open',
                            attributes: node.attributes,
                            iconCls: 'icon-add',
                        }
                    });
                }
            }
        },
        error: function (err) {
        }
    });
}


//清除所有根节点
function removeAllRoots(tt) {
    var arrayRoots = new Array();
    arrayRoots = $('#'+tt).tree('getRoots');
    var length = arrayRoots.length;
    for(var j=0;j<length;j++) {
        $('#'+tt).tree('remove', arrayRoots[length - j - 1].target);
    }
}

function getAllRoots(tt) {
    var arrayRoots = new Array();
    arrayRoots = $('#'+tt).tree('getRoots');
    return arrayRoots;
}

function getChildren(id){
    var gchildrenNodes = new Array()
    //gchildrenNodes.splice(0,gchildrenNodes.length);//清空数组
    var mytree = $('#tBuildingselect');
    var node =$('#tBuildingselect').tree('find',id);
    var childrenNodes = $('#tBuildingselect').tree('getChildren',node.target);
    for(var i=0 ,j=0;i<childrenNodes.length;i++){
        if(childrenNodes[i].id != 1) {
            gchildrenNodes[j++] = childrenNodes[i];
        }
    }
    return gchildrenNodes;
}

//关闭窗口时删除所有的节点
function  closeWindow(tt) {
    $("#searchBuilding").val("");
    $("#searchOTB").val("");
    removeAllRoots(tt);
}

//删除所有子节点
function removeAllChildren(tt) {
    var arrayRoots = getAllRoots(tt);
    for(var j=0;j<arrayRoots.length;j++) {
        var nodeChildren = $('#' + tt).tree('getChildren', arrayRoots[j].target);
        for (var i = 0; i < nodeChildren.length; i++) {
            $('#'+tt).tree('remove', nodeChildren[i].target);
        }
    }
}

$('#searchBuildingButton').on('click',function () {
    var buildingName = $('#searchBuilding').val();
    if (buildingName == null || buildingName == "") {
        $.messager.alert("提示","请输入建筑物名称！","info");
        return;
    }
    // curPage = 1;
    var jsonObj = {};
    // var extent = {};
    var t = $('#showWebGrid').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');// 获取选择的节点
    if (n == null) {
        $.messager.alert("提示","请选择一个组织机构！",'info');
        return;
    }
    jsonObj.facName = buildingName;
    jsonObj.orgId = n.id;
    // jsonObj.pageSize = pageSize;
    // jsonObj.pageNumber = curPage;
    // jsonObj.objCondition = extent;
    removeAllChildren('tBuildingselect');
    var arrayRoots = new Array();   //用于存放模糊查询是OTB的node id
    arrayRoots = getAllRoots('tBuildingselect');
    for (var i = 0; i < arrayRoots.length; i++) {
        var gridType = arrayRoots[i].text;
        gridTypeId = arrayRoots[i].id;
        // jsonObj.pageNumber = curPage;
        $.ajax({
            type: "POST",
            url: "restful/wg/findWgByName",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify(jsonObj),
            success: function (data) {
                if (data.status = 'success') {
                    var records = JSON.parse(data.content);
                    if(i ==arrayRoots.length-1 && records.length == 0){
                        $.messager.alert("提示","无此建筑物，请重新输入！","info")
                        return;
                    }
                    $.each(records, function (a, r) {
                        if (r.gridType == gridType){
                            parentIds.push(r.facId);
                            $('#tBuildingselect').tree('append', {
                                parent: arrayRoots[i].target,
                                data: {
                                    id: r.facId,
                                    text: r.facName,
                                    gridType: r.gridType,
                                    state: 'open',
                                    attributes: 'b',
                                    iconCls: 'icon-gridCell'
                                    //children: [{
                                    // id: '1'
                                    //}]
                                },
                            });
                        }
                    });
                }

            },
            error: function (err) {
            }
        });
    }
    findBuildingByWgId(parentIds);
    parentIds.length = 0; //将数组置空
})


$("#searchBuilding").keydown(function(event) {
    event = document.all ? window.event : event;
    if ((event.keyCode || event.which) == 13) {
        var buildingName = $('#searchBuilding').val();
        if (buildingName == null || buildingName == "") {
            $.messager.alert("提示","请输入建筑物名称!","info");
            return;
        }
        // curPage = 1;
        var jsonObj = {};
        // var extent = {};
        var t = $('#showWebGrid').combotree('tree');	// 获取树对象
        var n = t.tree('getSelected');// 获取选择的节点
        if (n == null) {
            $.messager.alert("提示","请选择一个组织机构!","info");
            return;
        }
        jsonObj.facName = buildingName;
        jsonObj.orgId = n.id;
        // jsonObj.pageSize = pageSize;
        // jsonObj.pageNumber = curPage;
        // jsonObj.objCondition = extent;
        removeAllChildren('tBuildingselect');
        var arrayRoots = new Array();   //用于存放模糊查询是OTB的node id
        arrayRoots = getAllRoots('tBuildingselect');
        for (var i = 0; i < arrayRoots.length; i++) {
            var gridType = arrayRoots[i].text;
            gridTypeId = arrayRoots[i].id;
            // jsonObj.pageNumber = curPage;
            $.ajax({
                type: "POST",
                url: "restful/wg/findWgByName",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(jsonObj),
                success: function (data) {
                    if (data.status = 'success') {
                        var records = JSON.parse(data.content);
                        if(i ==arrayRoots.length-1 && records.length == 0){
                            $.messager.alert("提示","无此建筑物，请重新输入！","info")
                            return;
                        }
                        $.each(records, function (a, r) {
                            if (r.gridType == gridType){
                                parentIds.push(r.facId);
                                $('#tBuildingselect').tree('append', {
                                    parent: arrayRoots[i].target,
                                    data: {
                                        id: r.facId,
                                        text: r.facName,
                                        gridType: r.gridType,
                                        state: 'open',
                                        attributes: 'b',
                                        iconCls: 'icon-gridCell'
                                        // children: [{
                                        //     id: '1'
                                        // }]
                                    },
                                });
                            }
                        });
                    }
                },
                error: function (err) {
                }
            });
        }
        findBuildingByWgId(parentIds);
        parentIds.length  = 0 ;   //清空数组
    }
});


function findBuildingByWgId(parentIds){
    var arrayChilds = new Array();   // 用于存放网格类型下的子的数组
    arrayChilds = getChildren(gridTypeId);
    var t = $('#showWebGrid').combotree('tree');	// 获取树对象
    var n = t.tree('getSelected');// 获取选择的节点
    var buildingName = $('#searchBuilding').val();
    for(var i = 0 ;i<parentIds.length;i++){
        var curPage = 1;
        var jsonObj1 = {};
        var extent1 = {};
        extent1.orgId = n.id;
        extent1.parentId = parentIds[i];
        extent1.facName = buildingName;
        jsonObj1.pageSize = pageSize;
        jsonObj1.pageNumber = curPage;
        jsonObj1.objCondition = extent1;
        $.ajax({
            type: "POST",
            url: "restful/building/findBuildingByWgId",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify(jsonObj1),
            success: function (data) {
                if (data.status = 'success' && data.content != "") {
                    var records = JSON.parse(data.content);
                    var node = $('#tBuildingselect').tree('find', parentIds[i]);
                    $.each(records.rows, function (b, r) {
                        $('#tBuildingselect').tree('append', {
                            parent: node.target,
                            data: [{
                                id: r.objectId,
                                state:open,
                                text: r.facName,
                                attributes: 'c',
                                iconCls: 'icon-building',
                            }]
                        });
                        //过滤数据，把符合关键字的数据标红
                        if(r.facName.indexOf(buildingName) != -1){
                            $('#'+ node.children[b].domId).css("color","red");
                        }
                    });
                }
                if (records.totalPageNum > 1) {
                    $('#tBuildingselect').tree('append', {
                        parent: node.target,
                        data: {
                            id: records.totalPageNum,
                            text: '加载更多...',
                            state: 'open',
                            attributes: 1,
                            iconCls: 'icon-add',
                        }
                    });
                }
            },
            error: function (err) {
            }
        });
    }
}

function getData(id) {
    var totalLightfacility = 0;
    var totalPortXlCountZy = 0;
    var totalPortXlCountKx = 0;
    var totalPort = 0;
    $.ajax({
        type: "GET",
        url: "restful/lightfacility/findObdByBuildingAddrIDForWeb",
        data: {addrid: id},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                totalLightfacility = records.length;

                for(var i=0;i<totalLightfacility;i++){
                    totalPortXlCountZy += records[i].portXlCountZy;
                    totalPort += records[i].portXlCount;
                    totalPortXlCountKx += records[i].portXlCountKx;
                }

                var rows = [
                    { "lightfacilityName": "OBD",
                        "totalLightfacility": totalLightfacility,
                        "totalPort": totalPort,
                        "totalPortXlCountZy": totalPortXlCountZy,
                        "totalPortXlCountKx": totalPortXlCountKx
                    }
                ];
                $("#buildingGrid").datagrid("loadData",rows);
                $("#buildingDetailGrid").datagrid("loadData",records);
            }
        }
    });
}

function creatBuildingGrid() {
    $("#buildingGrid").datagrid({
        title : "",
        rownumbers : false,
        fitColumns : false,
        pagination : false,
        striped : true,
        singleSelect : true,
        width : 890,
        nowrap : false,
        height : 500,
        idField : 'ocfId',
        columns : [ [  {
            field : 'lightfacilityName',
            title : '设施名称',
            width : 80,
            align : 'left'
        }, {
            field : 'totalLightfacility',
            title : '设施总量',
            width : 100,
            align : 'left'
        }, {
            field : 'totalPort',
            title : '端口总数',
            width : 120,
            align : 'left'
        }, {
            field : 'totalPortXlCountZy',
            title : '端口占用数',
            width : 100,
            align : 'left'
        }, {
            field : 'totalPortXlCountKx',
            title : '端口空闲数',
            width : 100,
            align : 'left'
        }] ],
        onDblClickRow:function (index,row) {
            $("#building-dialog").dialog({
            	 title: 'OBD设备详情',
                 closed: false,
                 cache: false,
                 modal: false
            });
            buildingStatistics(addrid);
        },
        rowStyler : function (index,row) {
            return "cursor : pointer";
        }
    });
    $("#buildingDetailGrid").datagrid({
    	title : "",
		rownumbers : true,
		fitColumns : false,
		singleSelect:true,
		nowrap : false,
        width : 1000,
        height : 540,
        idField : 'ocfId',
        columns : [ [{
        	 field:'ocfId',
        	 title:'',
        	 hidden:true
         },{
            field : 'ocftypename',
            title : '设备类型',
            width : 60,
            align : 'left'
        }, {
            field : 'ocfCode',
            title : '设备编码',
            width : 200,
            align : 'left'
        }, {
            field : 'ocfName',
            title : '设备名称',
            width : 200,
            align : 'left'
        }, {
            field : 'addr',
            title : '安装地址',
            width : 200,
            align : 'left'
        },{
            field : 'portXlCount',
            title : '端口总数',
            width : 100,
            align : 'left'
        },{
            field : 'portXlCountZy',
            title : '端口占用数',
            width : 100,
            align : 'left'
        },{
            field : 'portXlCountKx',
            title : '端口空闲数',
            width : 100,
            align : 'left'
        }] ]
    });
}


function buildingStatistics(addrid) {

    $("#buildingGrid").datagrid('clearSelections');
    // 初始加载
    getData(addrid);
}

function jzwPropertyEdit() {
    $.ajax({
        type: "GET",
        url: "restful/building/findAddrsbyfacid",
        data: {facid: mapEventGraphic.attributes.FACID},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                propertyShow(records[0]);
                buildingOldValue.addrName = records[0].addr;
            }
        }
    });
}


function obdPropertyEdit() {
    $('#obdPropertyEdit').removeClass('hide').show();
    $('#obdPropertyGrid').datagrid({
        title:'请勾选您需要移动的OTB：',
        rownumbers : true,
        fitColumns : false,
        pagination : false,
        striped : true,
        width : 450,
        height : 300,
        nowrap : false,
        idField : 'ocfId',
        singleSelect:false,
        columns : [ [
            {
                field : 'ck',
                checkbox : true
            },
            {
                field : 'ocfId',
                title : '',
                hidden : true
            },
            {
                field : 'ocfName',
                title : 'OTB名称',
                hidden : false,
                width : 360,
                align : 'left'
            },
            {
            	field : 'moveable',
                hidden : true
            }
          ]],
        onLoadSuccess:function(){
        	$('#obdPropertyGrid').datagrid('clearSelections');
            $('#obdPropertyGrid').datagrid('checkAll');
        },
        rowStyler: function(index,row){
			if (row.moveable==0){
				$(this).datagrid("uncheckRow",index);
				return 'background-color:#fffddd;color:#ff0000;text-decoration:line-through';
			}
		},
		onClickRow:function(index,row){
			if (row.moveable==0){
				$(this).datagrid("uncheckRow",index);
			}
		},
		onCheck:function(index,row){
			if (row.moveable==0){
				$(this).datagrid("uncheckRow",index);
			}
		},
		onCheckAll:function(rows){
			for(var i in rows){
				if(rows[i].moveable==0){
					$("#obdPropertyEdit .datagrid-body table tr td :input[type='checkbox']")[i].disabled = true;
					$(this).datagrid("uncheckRow",$(this).datagrid('getRowIndex',rows[i]));

				}else{
					$("#obdPropertyEdit .datagrid-body table tr td :input[type='checkbox']")[i].disabled = false;
					$(this).datagrid("checkRow",$(this).datagrid('getRowIndex',rows[i]));
				}
			}
			//先找到表头的checkbox
			var checkbox = $('div.datagrid-header-check input[type=checkbox]');
			//将其设置为选中即可
			checkbox.prop("checked","checked");
		}

    });
    $("#obdLatitude").val(_y.toFixed(7));
    $("#obdLongitude").val(_x.toFixed(7));

    var arr = new Array();
    function filterResult(resultArray){
    	var ids="";
    	for(var i in resultArray){
    		ids+=resultArray[i].OCFID+",";
    	}
    	if(ids.length>0){
    		ids = ids.substring(0,ids.lastIndexOf(","));
    	}
    	return ids;
    }
    var ocfids = filterResult(resultArray);
    var moveableArray=new Array();
    $.ajax({
        type: "GET",
        url: "restful/lightfacility/checkOtbMoveable",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data: {"ocfids":ocfids},
        success: function (data) {
            if (data.status = 'success') {
            	moveableArray=data.content.split(",");
            }else{
            	$.messager.alert({title: '提示', msg: '数据加载异常！', error: 'info'});
            }
        }
    });
    for(var i=0;i<moveableArray.length;i++) {
        var jsonObj = {}
        jsonObj.ocfId = resultArray[i].OCFID;
        jsonObj.ocfName = resultArray[i].OCFNAME;
        jsonObj.moveable = moveableArray[i];
        arr.push(jsonObj);
    }
    $("#obdPropertyEdit .close").hide();
    $("#obdPropertyGrid").datagrid("loadData", arr);
}

//显示网格属性修改框
function wgPropertyEdit() {
    $('#wgPropertyEdit').dialog({
        title: '网格属性修改',
        closed: false,
        cache: false,
        modal: true
    });
    $('#wgPropertyEdit').show();
    $(".panel-tool .panel-tool-close").hide();
    $("#wgTypeFacnameEdit").empty();
    var id;
    $.ajax({
        type: "GET",
        url: "restful/girdcell/getAll",
        success: function (data) {
            if (data.status == 'success') {
                var records = JSON.parse(data.content);
                $.each(records, function (j, r) {
                    if(r.dictName == mapEventGraphic.attributes.GRID_TYPE){
                        id = r.dictId;
                    }
                    $("#wgTypeFacnameEdit").append('<option value= ' + r.dictId + '>' + r.dictName + '</option>');

                });
            }
            $("#wgTypeFacnameEdit").val(id);
            buildingOldValue.gridType = $("#wgTypeFacnameEdit").find("option:selected").text();
        },
        error: function (err) {
        }
    });
    $("#wgFacNameEdit").val(mapEventGraphic.attributes.FACNAME);
    $("#wgCountyEdit").val(mapEventGraphic.attributes.COUNTY);
    $("#wgVillageEdit").val(mapEventGraphic.attributes.VILLAGE);
    $("#wgCodeEdit").val(mapEventGraphic.attributes.CODE);

    buildingOldValue.facName = $("#wgFacNameEdit").val();
    buildingOldValue.code = $("#wgCodeEdit").val();
    buildingOldValue.village = $("#wgVillageEdit").val();
    buildingOldValue.villageId = $("#wgVillageEdit").val();
    buildingOldValue.countyId = $("#wgCountyEdit").val();
    buildingOldValue.county = $("#wgCountyEdit").val();
}

//显示服务区属性修改框
function fwqPropertyEdit() {
    $('#otbPropertyEdit').dialog({
        title: '服务区属性修改',
        closed: false,
        cache: false,
        modal: true
    });
    $('#otbPropertyEdit').show();
    $(".panel-tool .panel-tool-close").hide();
    $("#otbFacNameEdit").empty();

    $("#otbFacNameEdit").val(mapEventGraphic.attributes.FACNAME);

    $.ajax({
        type: "GET",
        url: "restful/wg/getById",
        data: {id: mapEventGraphic.attributes.WGID},
        success: function (data) {
            var records = JSON.parse(data);
            if (records.status = 'success') {
                var wgName = (JSON.parse(records.content));
                $("#otbgirdEdit").val(wgName.facName);
            }
        },
        error: function (err) {
        }
    });

    buildingOldValue.facName = $("#otbFacNameEdit").val();
   /* buildingOldValue.village = mapEventGraphic.attributes.VILLAGE;
    buildingOldValue.county = mapEventGraphic.attributes.COUNTY;*/
}


$("#map").bind('contextmenu',function(e){
    e.preventDefault();
    $("#to_top").hide();
    if(mapEditStatus ==MEASURE_STATUS){
        draw.deactivate();
        mapEditStatus =FREE_STATUS;
    }
    $('#mapMenu').menu('show', {
        left: e.pageX,
        top: e.pageY,
        onClick : function(item) {
        	checkMenuPrivilege(item);
            if (item.name == "查看光资源统计") {
            	$("#gzytj_dialog").dialog({
                    title : item.name,
                    closed : false,
                    cache : false,
                    modal : false
                }).show();
                buildingStatistics(addrid);
            } else if (item.name == "属性修改") {

                if(currentEditedMap == jzw){
                	if(!jzwEditable){
                		$.messager.alert({title: '提示', msg: '该建筑物处于待审核状态，不能操作！', icon: 'error'});
                		return;
                	}
                    jzwPropertyEdit();
                }else if( currentEditedMap == wg){
                    wgPropertyEdit();
                }else if( currentEditedMap == lightfacility){

                }else if( currentEditedMap == xfbj){

                }else if( currentEditedMap == yfbj){

                }else if( currentEditedMap == fwq){
                    fwqPropertyEdit();
                }
            } else if (item.name == "修改外形") {
            	if(!jzwEditable){
            		$.messager.alert({title: '提示', msg: '该建筑物处于待审核状态，不能操作！', icon: 'error'});
            		return;
            	}
                map.graphics.clear();

                $("#mapMenu .cancelOp").removeClass("hide").show();
                $("#mapMenu .submitOp").removeClass("hide").show();
                $("#cancelOpLine").removeClass("hide").show();
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .newAdd").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .backToPre").hide();
                $("#mapMenu .mapToggle").hide();


                mapEditStatus =  EDITBUILDING_STATUS;
                var jsonTem = mapEventGraphic.toJson();
                oldEditGraphics = new esri.Graphic(jsonTem);
                /*var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
                 mapEventGraphic.setSymbol(lineSymbol);*/
                editToolbar.activate(esri.toolbars.Edit.EDIT_VERTICES, mapEventGraphic);
                var query = new esri.tasks.Query();
                query.objectIds = [mapEventGraphic.attributes[currentEditedFCLayer.objectIdField]];
                currentEditedFCLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (results) {
                    newEditGraphics = results;
                    currentEditedFCLayer.clearSelection();
                })
            }else if(item.name == "删除"){
            	if(!jzwEditable){
            		$.messager.alert({title: '提示', msg: '该建筑物处于待审核状态，不能操作！', icon: 'error'});
            		return;
            	}
               /* var de = new esri.dijit.editing.Delete({
                    "featureLayer":jzwFeatureLayer,
                    "deletedGraphics":[mapEventGraphic]
                });
                //执行删除结果
                de.performRedo();
                jzwLayer.refresh() ;*/
            	$.messager.confirm('提示', '确认删除？', function(r){
            		if (r){
            			deleteBuilding();
            		}
            	});
            }else if(item.name == "提交"){

                /*var update = new esri.dijit.editing.Update({
                    "featureLayer":jzwFeatureLayer,
                    "postUpdatedGraphics":newEditGraphics,//修改之后的要素
                    "preUpdatedGraphics":[oldEditGraphics]//修改之前的要素
                });
                update.performRedo();
                jzwFeatureLayer.refresh() ;*/
                if(currentEditedMap != lightfacility) {
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    $("#to_top").hide();
                    $("#mapMenu .pickUp").hide();
                    if(currentEditedMap == jzw){
                        $("#mapMenu .pickUp").removeClass("hide").show();
                    }
                    if(currentEditedMap == dt){
                        addJzw();
                        getAddrsByPid(0, "oneLever");
                        $("#oneLever").combobox({
                            onChange: function (n, o) {
                                var onelever = $(this).combobox('getValue');
                                $("#oneLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(onelever, "twoLever");
                            }
                        });
                        $("#twoLever").combobox({
                            onChange: function (n, o) {
                                var twolever = $(this).combobox('getValue');
                                $("#twoLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(twolever, "threeLever");
                            }
                        });
                        $("#threeLever").combobox({
                            onChange: function (n, o) {
                                var threelever = $(this).combobox('getValue');
                                $("#threeLeverId").val($(this).combobox('getValue'));
                                getAddrsByPid(threelever, "fourLever");
                            }
                        });
                        $("#fourLever").combobox({
                            onChange: function (n, o) {
                                var fourlever = $(this).combobox('getValue');
                                $("#fourLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "fourLever");
                                getAddrsByPid(fourlever, "fiveLever");
                            }
                        });
                        $("#fiveLever").combobox({
                            onChange: function (n, o) {
                                var fivelever = $(this).combobox('getValue');
                                $("#fiveLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "fiveLever");
                                getAddrsByPid(fivelever, "sixLever");
                            }
                        });
                        $("#sixLever").combobox({
                            onChange: function (n, o) {
                                var sixlever = $(this).combobox('getValue');
                                $("#sixLeverId").val($(this).combobox('getValue'));
                                checkLeverExist($(this).combobox('getValue'), "sixLever");
                                getAddrsByPid(sixlever, "sevenLever");
                            }
                        });
                        $("#sevenLever").combobox({
                            onChange: function (n, o) {
                                checkLeverExist($(this).combobox('getValue'), "sevenLever");
                                $("#buildingAddr").val($.trim($("#oneLever").combobox("getText")) + $.trim($("#twoLever").combobox("getText")) + $.trim($("#threeLever").combobox("getText")) + $.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                                $('#buildingAddrId').val($("#sevenLeverId").val());
                                $("#buildingName").val($.trim($("#fourLever").combobox("getText")) + $.trim($("#fiveLever").combobox("getText")) + $.trim($("#sixLever").combobox("getText")) + $.trim($("#sevenLever").combobox("getText")));
                            }
                        });
                    }else{
                        $("#mapMenu .newAdd").removeClass("hide").show();
                        identifyQueryForExist(newEditGraphics[0].geometry,currentEditedMap);
                    }
                }else{
                    var geometry  = new esri.geometry.Point(
                        {
                            "x" : _x,
                            "y" : _y,
                            "spatialReference" : map.spatialReference
                        });
                    identifyQueryForPosition(geometry,wg);
                    moveFlag = 0;

                    layers.dragIocLayer.clear();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    $("#to_top").hide();
                    oTop.innerHTML = "点击以选择目标";
                    obdPropertyEdit();
                }


            }else if(item.name == "添加"){
                draw.activate(esri.toolbars.Draw.POLYGON,{
                    showTooltips:true
                });
                $("#to_top").removeClass("hide").show();
                oTop = document.getElementById("to_top");
                oTop.innerHTML="单击以开始绘制";
                mapEditStatus = CREATEBUILDING_STATUS;
                $("#mapMenu .reviewToggle").hide();
                $("#mapMenu .handleToggle").hide();
                $("#mapMenu .mapToggle").hide();
                $("#mapMenu .moveToggle").hide();
                $("#mapMenu .newAdd").hide();
                $("#mapMenu .backToPre").hide();
                $("#mapMenu .cancelOp").removeClass("hide").show();
                $("#cancelOpLine").hide();
                $("#mapMenu .pickUp").hide();

            }else if(item.name == "取消"){
                clickNum = 0;
                oTop.innerHTML="";
                if(currentEditedMap == jzw){
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .pickUp").removeClass("hide").show();
                }else if( currentEditedMap == wg){
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                }else if( currentEditedMap == lightfacility){
                    moveFlag = 0;
                    layers.dragIocLayer.clear();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .moveToggle").removeClass("hide").show();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                }else if( currentEditedMap == xfbj){

                }else if( currentEditedMap == yfbj){

                }else if( currentEditedMap == fwq){
                    $("#mapMenu .newAdd").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                }else if(currentEditedMap == dt){
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .pickUp").hide();
					map.graphics.clear();
                    /*oTop.innerHTML="请点击要选择的建筑物";*/
                }

                editToolbar.deactivate();
                draw.deactivate();
                currentEditedFCLayer.refresh();
                mapEditStatus = FREE_STATUS;
            }else if (item.name == "查看建筑物图片"){
            	var photos = getPhotos(2, mapEventGraphic.attributes.FACID);
				initPhotoPage(photos);
				$('#facilityPhotoDetail').dialog({
					title : item.name,
					closed : false,
					cache : false,
					modal : true
				}).show().window('center');
            }else if(item.name == "建筑物"){
                rendererJzw();
            }else if(item.name == "服务区"){
                rendererFwq();
            } else if(item.name == "网格"){
                rendererWg();
            } else if(item.name == "光资源"){
                rendererObd();
            }else if(item.name == "营服"){
                rendererYfbj();
            }else if(item.name == "县分"){
                rendererXfbj();
            }else if(item.name == "返回"){
                if(currentEditedMap == dt){
                    currentEditedMap = 0;
                    ReviewDataFlag = 0;
                    clickNum = 0;
                    rendererJzw();
                }else {
                    currentEditedMap = 0;
                    ReviewDataFlag = 0;
                    clickNum = 0;
                    $("#mapMenu .reviewToggle").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .mapToggle").removeClass("hide").show();
                    $("#mapMenu .moveToggle").hide();
                    $("#mapMenu .backToPre").hide();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .pickUp").hide();

                    if (typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null) {
                        currentEditedFCLayer.setVisibility(false);
                        map.graphics.clear();
                    }
                    jzwLayer.setVisibility(true);
                    lightfacilityLayer.setVisibility(true);
                    xfbjLayer.setVisibility(true);
                    wgLayer.setVisibility(true);
                    yfbjLayer.setVisibility(true);
                    fwqLayer.setVisibility(true);
                }
            }else if(item.name == "移动"){
                moveFlag = 1;
                $("#to_top").removeClass("hide").show();
                map.graphics.clear();
                oTop = document.getElementById("to_top");
                oTop.innerHTML="点击以选择目标";
                $("#to_top").removeClass("hide").show();
                $("#mapMenu .moveToggle").hide();

            }else if(item.name == "底图拾取"){
                rendererDitu();
            }

        }
    });
});



function creatPropertyPanel() {
    $('#buildingPropertyAdd').dialog({
        title: '建筑物属性添加',
        closed: false,
        cache: false,
        modal: true,
        top:70,
        width:672
    }).show();
    $(".panel-tool .panel-tool-close").hide();
    villageChange();
}

function wgCreatWgPropertyPanel() {
    $('#wgPropertyAdd').dialog({
        title: '网格属性添加',
        closed: false,
        cache: false,
        modal: true
    });
    $('#wgPropertyAdd').show();
    $(".panel-tool .panel-tool-close").hide();
}

function creatOTBPropertyPanel() {
    $('#otbPropertyAdd').dialog({
        title: '新建服务区',
        closed: false,
        cache: false,
        modal: true
    });
    $('#otbPropertyAdd').show();
    $(".panel-tool .panel-tool-close").hide();
}


function creatPropertyData(data) {
    var records = {};
    $("#selectOrganization").empty();
    $("#buildingPropertyAdd input").val("");
    $("#jzwCreatRemark").val("");
    records.creater = loginUser.loginName;
    records.longitude =curEditGraphic.geometry.getExtent().getCenter().x;//经度
    records.latitude = curEditGraphic.geometry.getExtent().getCenter().y;//伟度
    $('#buildingPropertyAdd_form').form('load', records);
    $('#buildingPropertyAdd_form').serializeObj();
    getStructureType("STRUCTURETYPE");

    //identifyQueryForPosition(curEditGraphic.geometry.getExtent().getCenter(),wg);
    if(data.content.length>0){
        var jsonO = eval("("+data.content+")");
        for(var i=0;i<jsonO.length;i++){
            $("#selectOrganization").append('<option value= '+jsonO[i].id+'>'+jsonO[i].text+'</option>');
        }
    }
    if (county) {
        $("#selectOrganization").find("option:contains('" + county + "')").attr("selected",true);
    }
    getYingFu($('#selectOrganization').val());

}

function creatYingFuData(data) {
    var id;
    var id1;
    if(currentEditedMap == jzw){
        id = "selectYingFu";
    }else if( currentEditedMap == wg){
        id = "wgVillage";
    }else if( currentEditedMap == lightfacility){

    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if(currentEditedMap == fwq){
        id = "otbVillage";
    }else if(currentEditedMap == dt){
        id = "selectYingFu";
    }
    if(data.content.length>0){
        var jsonO = eval("("+data.content+")");
        for(var i=0;i<jsonO.length;i++){
            $("#" + id).append('<option value= '+jsonO[i].id+'>'+jsonO[i].text+'</option>');
            if(yfName == jsonO[i].text){
                id1 = jsonO[i].id;
            }
        }
        $("#" + id).val(id1);
    }
}


function propertyShow(data) {
    $('#buildingPropertyGrid').dialog({
        title: '建筑物属性修改',
        closed: false,
        cache: false,
        modal: true
    });
    $('#buildingPropertyGrid').show();
    $(".panel-tool .panel-tool-close").hide();
    getPropertyData(data);
}

function getPropertyData(data) {
    $("#showAddrId").empty();
    $("#JZWREMARK").val("");
    $("#JZW_TYPE").empty();
    $("#STRUCTURE_TYPE").empty();
    $('#buildingPropertyGrid_form').form('load', data);
    $('#buildingPropertyGrid_form').serializeObj();
    if(typeof(data.structureType)=="undefined"){
        $("#STRUCTURE_TYPE").append('<option value= ' + "111" + '>' + " " + '</option>');
    }else{
        $("#STRUCTURE_TYPE").append('<option value= ' + "111" + '>' + data.structureType + '</option>');
    }
    $("#STRUCTURE_TYPE").val(0);
    if(typeof(data.jzwType)=="undefined"){
        $("#JZW_TYPE").append('<option value= ' + "111" + '>' + " " + '</option>');
    }else{
        $("#JZW_TYPE").append('<option value= ' + "111" + '>' + data.jzwType + '</option>');
    }
    $("#JZW_TYPE").val(0);
    $("#JZWREMARK").val(data.remark);
    $("#showAddrId").append('<option value= '+data.addrId+'>'+data.addr+'</option>'); //为Select追加一个Option(下拉项)
    getStructureType("STRUCTURE_TYPE");
}

function getStructureType(id) {
    var jsonObj = {};
    var index;
    jsonObj.dictType = "STRUCTURE_TYPE";
    var dictType = $("#STRUCTURE_TYPE").find("option:selected").text();
    $("#"+id).empty();
    $.ajax({
        type: "POST",
        url: "restful/sysDict/getByWhere",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                if (dictType == " ") {
                    $("#" + id).append('<option value= ' + "" + '>' + "" + '</option>');
                    $.each(records, function (j, r) {
                        $("#"+id).append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>');
                    });
                } else {
                    $.each(records, function (j, r) {
                        if (records[j].dictDesc == dictType) {
                            index = records[j].dictKey;
                        }
                        $("#"+id).append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>'); //为Select追加一个Option(下拉项)
                    });
                    $("#" + id).val(index);
                }
            }
        }
    });
    if(id=="STRUCTURE_TYPE"){
        changeStructureType("JZW_TYPE");
    }else{
        changeStructureType("JZWTYPE");
    }

}

function changeStructureType(id) {
    var jsonObj = {};
    var index;
    var jzwTypeName;
    if(id == "JZWTYPE"){
        jsonObj.dictType = $("#STRUCTURETYPE").find("option:selected").text();
        $("#JZWTYPE").empty();
    }else{
        jsonObj.dictType = $("#STRUCTURE_TYPE").find("option:selected").text();
        jzwTypeName = $("#JZW_TYPE").find("option:selected").text();
        $("#JZW_TYPE").empty();
    }
    $.ajax({
        type: "POST",
        url: "restful/sysDict/getByWhere",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                if(id == "JZWTYPE") {
                    $.each(records, function (j, r) {
                        if (records[j].dictDesc == "村民私宅") {
                            index = records[j].dictKey;
                        }
                        $("#" + id).append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>');
                    });
                    $("#" + id).val(index);
                }else {
                    if (jzwTypeName == " ") {
                        $("#" + id).append('<option value= ' + "" + '>' + "" + '</option>');
                        $.each(records, function (j, r) {
                            $("#" + id).append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>');
                        });
                    } else {
                        $.each(records, function (j, r) {
                            if (records[j].dictDesc == jzwTypeName) {
                                index = records[j].dictKey;
                            }
                            $("#" + id).append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>');
                        });
                        $("#" + id).val(index);
                    }
                }
            }
        }
    })
}


function onChangeStructureType(obj) {
    var jsonObj = {};
    if(obj.id == "STRUCTURETYPE"){
        jsonObj.dictType = $("#STRUCTURETYPE").find("option:selected").text();
        $("#JZWTYPE").empty();
    }else{
        jsonObj.dictType = $("#STRUCTURE_TYPE").find("option:selected").text();
        $("#JZW_TYPE").empty();
    }
    $.ajax({
        type: "POST",
        url: "restful/sysDict/getByWhere",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $.each(records, function (j, r) {
                    if(obj.id == "STRUCTURETYPE"){
                        $("#JZWTYPE").append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>');
                       if(records[j].dictDesc=='村民私宅'){
                           $("#JZWTYPE option").attr("selected",true);
                       }
                    }else{
                        $("#JZW_TYPE").append('<option value= ' + records[j].dictKey + '>' + records[j].dictDesc + '</option>');
                    }
                })
            }
        }
    })
}


//获取组织机构数据
function addJzw() {
    $.ajax({
        type: "GET",
        url: "restful/organization/getByOrgId",
        data:{orgId:100000},
        success: function (data) {
            if (data.status = 'success') {
                creatPropertyPanel();
                var records = JSON.parse(data);
                creatPropertyData(records);
            }
        },
        error: function (err) {
        }
    });
}

function oranizationChange() {
    if(currentEditedMap == jzw){
        $("#selectYingFu").empty();
        var id = $('#selectOrganization option:selected').val();
    }else if( currentEditedMap == wg){
        $("#wgVillage").empty();
        var id = $('#wgCounty option:selected').val();
    }else if( currentEditedMap == lightfacility){

    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if( currentEditedMap == dt){
		$("#selectYingFu").empty();
        var id = $('#selectOrganization option:selected').val();
    }
    getYingFu(id);
}

function villageChange() {
    $("#selectYingGird").empty();
    var data = {};
    data.village = $("#selectYingFu").find("option:selected").text();
    getGird(data);
}


//获取营服
function getYingFu(id) {
    $.ajax({
        type: "GET",
        url: "restful/organization/getByOrgId",
        async: false,
        data:{orgId:id},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data);
                creatYingFuData(records);
            }
        },
        error: function (err) {
        }
    });
    var data = {};
    var id;
    if(currentEditedMap == jzw){
        id = "selectYingFu";
    }else if( currentEditedMap == wg){
        id = "wgVillage";
    }else if( currentEditedMap == lightfacility){

    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if( currentEditedMap == fwq){
        id = "otbVillage";
    }else if( currentEditedMap == dt){
        id = "selectYingFu";
    }
    data.village = $("#" + id).find("option:selected").text();
    getGird(data);
}

function getGird(addr) {
    $.ajax({
        type: "POST",
        url: "restful/wg/getByWhere",
        contentType:"application/json",
        dataType:"json",
        data: JSON.stringify(addr),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                creatGirdData(records);
            }
        },
        error: function (err) {
        }
    });
}

function creatGirdData(data) {
    var id;
    $("#selectYingGird").empty();
    if(data.length>0){
        var arr = new Array();
        for(var i=0;i<data.length;i++){
            var jsonObj ={};
            jsonObj.facId = data[i].facId;
            jsonObj.facName = data[i].facName;
            arr.push(jsonObj);
            if(wgFacName == data[i].facName){
                id=data[i].facId;
            }
        }
        $("#selectYingGird").combobox('loadData',arr);
        $("#selectYingGird").combobox('select',id);
    }
}

function getAddr() {
    var name = $("#buildingName").val();
    
    if (name && name.length > 0) {
    	$.ajax({
    		type: "GET",
    		url: "restful/addr/findAddrsByAddr",
    		data: {addr: name},
    		async: false,
    		success: function (data) {
    			if (data.status = 'success') {
    				var records = JSON.parse(data.content);
    				$("#gov_search_suggest").removeClass('hide').show().empty();
    				$("#gov_search_suggest").append('<span id="sp_obdoper_close" onclick= "hideAddr()" style="font-size:20px;color:red;right:5%;position:absolute;font-weight:bold;cursor:pointer">×</span>');
    				if(records!=null&&records.length!=0){
    					$("#gov_search_suggest").show();
    					$.each(records, function (i, r) {
    						if(i==0){
    							$("#gov_search_suggest").append('<div id='+r.addrId+'  name = '+r.addr+' title= '+r.addr+' ' +
    									'onclick= "selectAddr(this)">'+r.addr+'</div>');
    						}else{
    							$("#gov_search_suggest").append('<div id='+r.addrId+'  name = '+r.addr+' title= '+r.addr+' ' +
    									'onclick= "selectAddr(this)">'+r.addr+'</div>');
    						}
    					})
    				}else{
    					$("#gov_search_suggest").hide();
    				}
    				
    			}
    		}
    	});
    } 
    return false;
}


function selectAddr(obj) {

    var addr = document.getElementById(obj.id).getAttribute("title");
    $("#buildingAddr").val(addr);
    $("#gov_search_suggest").empty().hide();
    getAddrLever(obj.id);
}

function hideAddr(){
	$("#gov_search_suggest").hide();
	return false;
}
function getAddrId() {
    var name = $("#FACNAME").val();
    
    if (name && name.length > 0) {
    	$.ajax({
    		type: "GET",
    		url: "restful/addr/findAddrsByAddr",
    		data: {addr: name},
    		async: false,
    		success: function (data) {
    			if (data.status = 'success') {
    				var records = JSON.parse(data.content);
    				$("#showAddrId").empty();
    				$.each(records, function (i, r) {
    					$("#showAddrId").append('<option value= ' + r.addrId+'>'+r.addr+'</option>'); //为Select追加一个Option(下拉项)
    				})
    			}
    		}
    	});
    }
}
function getAddrsByPid(parentId,id) {
	if(parentId!=""&&isNaN(parentId)){
	     var index =  $("#"+id+"Id").parent().parent().index();
	     var currentE=$("#buildingPropertyAdd_form .form-table tr:eq("+(index-1)+")");
	     $(currentE).find("input:disabled").val("");
	   	 var rows=$("#buildingPropertyAdd_form .form-table tr:gt("+(index-1)+")");
	   	 $.each(rows,function(i,e){
	   		 $(e).find(".easyui-combobox").combobox('clear');
	   		 $(e).find(".easyui-combobox").combobox("loadData",[]);
	   		 $(e).find("input:disabled").val("");
	   	 });
         $("#buildingAddr").val($.trim($("#oneLever").combobox("getText"))+$.trim($("#twoLever").combobox("getText"))+$.trim($("#threeLever").combobox("getText"))+$.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
         $('#buildingAddrId').val($("#sevenLeverId").val());
         $("#buildingName").val($.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
	   	 return;
		}
	$("#buildingAddr").val("");
	$("#buildingAddrId").val("");
    var name = $("#FACNAME").val();
    $.ajax({
        type: "POST",
        url: "restful/addr/findAddrsByParentId",
        async: false,
        contentType: "application/json",
        dataType:'json',
        data: JSON.stringify({addrId:parentId}),
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                //console.log(records);
                $("#"+id).combobox("loadData",records);
                if(records.length>0){
                	$("#"+id).combobox("clear");
                	//$("#"+id+"Id").val(records[0].ID);
                }else{
                	 $("#"+id).combobox("clear");
                	 $("#"+id+"Id").val("");
                	 var index =  $("#"+id+"Id").parent().parent().index();
                	 var rows=$("#buildingPropertyAdd_form .form-table tr:gt("+index+")");
                	 $.each(rows,function(i,e){
                		 $(e).find(".easyui-combobox").combobox('clear');
                		 $(e).find(".easyui-combobox").combobox("loadData",[]);
                		 $(e).find("input:disabled").val("");
                	 });

                }
                $("#buildingAddr").val($.trim($("#oneLever").combobox("getText"))+$.trim($("#twoLever").combobox("getText"))+$.trim($("#threeLever").combobox("getText"))+$.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
                $('#buildingAddrId').val($("#sevenLeverId").val());
                $("#buildingName").val($.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
            }
        }
    });
}

function getAddrLever(addr) {
    $.ajax({
        type: "GET",
        url: "restful/addr/findParentLevelAddrsById",
        data: {addrId: addr},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                if(records.length ==3) {
                    if(records[2].name == null){
                        records[2].name = '';
                    }
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("clear");
                    $('#twoLever').combobox("clear");
                    $('#threeLever').combobox("clear");
                    $('#fourLever').combobox("clear");
                    $('#fiveLever').combobox("select",records[2].addrId);
                    $('#sixLever').combobox("select",records[1].addrId);
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val("");
                    $('#twoLeverId').val("");
                    $('#threeLeverId').val("");
                    $('#fourLeverId').val("");
                    $('#fiveLeverId').val(records[2].addrId);
                    $('#sixLeverId').val(records[1].addrId);
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[2].name + records[1].name + records[0].name);
                }else if(records.length ==2){
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("clear");
                    $('#twoLever').combobox("clear");
                    $('#threeLever').combobox("clear");
                    $('#fourLever').combobox("clear");
                    $('#fiveLever').combobox("clear");
                    $('#sixLever').combobox("select",records[1].addrId);
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val("");
                    $('#twoLeverId').val("");
                    $('#threeLeverId').val("");
                    $('#fourLeverId').val("");
                    $('#fiveLeverId').val("");
                    $('#sixLeverId').val(records[1].addrId);
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[1].name + records[0].name);
                }else if(records.length ==1){
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("clear");
                    $('#twoLever').combobox("clear");
                    $('#threeLever').combobox("clear");
                    $('#fourLever').combobox("clear");
                    $('#fiveLever').combobox("clear");
                    $('#sixLever').combobox("clear");
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val("");
                    $('#twoLeverId').val("");
                    $('#threeLeverId').val("");
                    $('#fourLeverId').val("");
                    $('#fiveLeverId').val("");
                    $('#sixLeverId').val("");
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[0].name);
                }else if(records.length ==4){
                    if(records[3].name == null) {
                        records[3].name = "";
                    }
                    if(records[2].name == null){
                        records[2].name = '';
                    }
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("clear");
                    $('#twoLever').combobox("clear");
                    $('#threeLever').combobox("clear");
                    $('#fourLever').combobox("select",records[3].addrId);
                    $('#fiveLever').combobox("clear");
                    $('#sixLever').combobox("clear");
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val("");
                    $('#twoLeverId').val("");
                    $('#threeLeverId').val("");
                    $('#fourLeverId').val(records[3].addrId);
                    $('#fiveLeverId').val("");
                    $('#sixLeverId').val("");
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[3].name+records[2].name + records[1].name + records[0].name);
                } else if(records.length ==5){
                    if(records[4].name == null) {
                        records[4].name = "";
                    }
                    if(records[3].name == null) {
                        records[3].name = "";
                    }
                    if(records[2].name == null){
                        records[2].name = '';
                    }
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("clear");
                    $('#twoLever').combobox("clear");
                    $('#threeLever').combobox("select",records[4].addrId);
                    $('#fourLever').combobox("select",records[3].addrId);
                    $('#fiveLever').combobox("select",records[2].addrId);
                    $('#sixLever').combobox("select",records[1].addrId);
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val("");
                    $('#twoLeverId').val("");
                    $('#threeLeverId').val(records[4].addrId);
                    $('#fourLeverId').val(records[3].addrId);
                    $('#fiveLeverId').val(records[2].addrId);
                    $('#sixLeverId').val(records[1].addrId);
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[3].name+records[2].name + records[1].name + records[0].name);
                }else if(records.length ==6){
                    if(records[5].name == null) {
                        records[5].name = "";
                    }
                    if(records[4].name == null) {
                        records[4].name = "";
                    }
                    if(records[3].name == null) {
                        records[3].name = "";
                    }
                    if(records[2].name == null){
                        records[2].name = '';
                    }
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("clear");
                    $('#twoLever').combobox("select",records[5].addrId);
                    $('#threeLever').combobox("select",records[4].addrId);
                    $('#fourLever').combobox("select",records[3].addrId);
                    $('#fiveLever').combobox("select",records[2].addrId);
                    $('#sixLever').combobox("select",records[1].addrId);
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val("");
                    $('#twoLeverId').val(records[5].addrId);
                    $('#threeLeverId').val(records[4].addrId);
                    $('#fourLeverId').val(records[3].addrId);
                    $('#fiveLeverId').val(records[2].addrId);
                    $('#sixLeverId').val(records[1].addrId);
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[3].name+records[2].name + records[1].name + records[0].name);
                }else if(records.length ==7){
                    if(records[6].name == null) {
                        records[6].name = "";
                    }
                    if(records[5].name == null) {
                        records[5].name = "";
                    }
                    if(records[4].name == null) {
                        records[4].name = "";
                    }
                    if(records[3].name == null) {
                        records[3].name = "";
                    }
                    if(records[2].name == null){
                        records[2].name = '';
                    }
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#oneLever').combobox("select",records[6].addrId);
                    $('#twoLever').combobox("select",records[5].addrId);
                    $('#threeLever').combobox("select",records[4].addrId);
                    $('#fourLever').combobox("select",records[3].addrId);
                    $('#fiveLever').combobox("select",records[2].addrId);
                    $('#sixLever').combobox("select",records[1].addrId);
                    $('#sevenLever').combobox("select",records[0].addrId);
                    $('#oneLeverId').val(records[6].addrId);
                    $('#twoLeverId').val(records[5].addrId);
                    $('#threeLeverId').val(records[4].addrId);
                    $('#fourLeverId').val(records[3].addrId);
                    $('#fiveLeverId').val(records[2].addrId);
                    $('#sixLeverId').val(records[1].addrId);
                    $('#sevenLeverId').val(records[0].addrId);
                    $('#buildingName').val(records[3].name+records[2].name + records[1].name + records[0].name);
                }
                $('#buildingAddrId').val(addr);
            }
        }
    });
}

function addrChage() {
    var val=$("#showAddrId").val(); //获取Select选择的Value
    $.ajax({
        type: "GET",
        url: "restful/addr/findParentLevelAddrsById",
        data: {addrId: val},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                if(records.length >=3) {
                    if(records[2].name == null){
                        records[2].name = '';
                    }
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#FACNAME').val(records[2].name + records[1].name + records[0].name);
                }else if(records.length ==2){
                    if(records[1].name == null){
                        records[1].name = '';
                    }
                    if(records[0].name == null){
                        records[0].name = '';
                    }
                    $('#FACNAME').val(records[1].name + records[0].name);
                }else if(records.length ==1){
                    $('#FACNAME').val(records[0].name);
                }
            }
        }
    });
}


//光资源修改取消
$("#obdcancleBtn").unbind('click').bind('click', function () {
    $("#obdPropertyEdit").hide();
    /*$("#to_top").removeClass("hide").show();
    oTop.innerHTML = "点击以选择目标";*/
    $("#mapMenu .moveToggle").removeClass("hide").show();
    resultArray.splice(0,resultArray.length);//清空数组
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
});

//光资源属性修改保存
$("#obdupdateBtn").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    var DataReview = {};
    var newValue = {};
    var oldValue = {};
    var array = new Array();
    DataReview.datakeyId = '';

    array  = $('#obdPropertyGrid').datagrid('getSelections');

    if (array.length == 0) {
    	$.messager.alert({title: '提示', msg: '请勾选数据后再进行操作！', icon: 'info'});
    	return;
    }
    for(var i=0;i<array.length;i++){
        DataReview.datakeyId +=  ',' + array[i].ocfId;
    }
    DataReview.datakeyId = DataReview.datakeyId.substring(1);
    resultArray.splice(0,resultArray.length);//清空数组
    DataReview.creater = loginUser.loginName;
    DataReview.longitude = $("#obdLongitude").val();
    DataReview.latitude = $("#obdLatitude").val();
    newValue.longitude = $("#obdLongitude").val();
    newValue.latitude = $("#obdLatitude").val();
    DataReview.dataType = 1;// 数据类型 1：设施 2：建筑物
    DataReview.status = 2;// 1-添加，2-修改，3-删除
    DataReview.opPlatform = 0;
    oldValue.longitude= mapEventGraphic.attributes.LONGITUDE.toFixed(7);
    oldValue.latitude= mapEventGraphic.attributes.LATITUDE.toFixed(7);
    var reg = /^(-?\d+)(\.\d+)?$/;
    if($("#obdLongitude").val() != "") {
        if (!reg.test($("#obdLongitude").val())) {
            $.messager.alert({
                title: '提示', msg: '经度必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#obdLongitude").val() >= 114|| $("#obdLongitude").val()<=113){
        $.messager.alert({
            title: '提示', msg: '经度输入有误!', icon: 'error'
        });
        return false;
    }
    if($("#obdLatitude").val() != "") {
        if (!reg.test($("#obdLatitude").val())) {
            $.messager.alert({
                title: '提示', msg: '纬度必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#obdLatitude").val() >= 23||  $("#obdLatitude").val() <=22){
        $.messager.alert({
            title: '提示', msg: '纬度输入有误!', icon: 'error'
        });
        return false;
    }


    if (JSON.stringify(newValue) == JSON.stringify(oldValue)) {
        $("#obdPropertyEdit").hide();
        return false
    }
    $.ajax({
        type: "POST",
        url: "restful/dataReview/updateOTBProperty",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(DataReview),
        success: function (data) {
            if (data.status == 1) {
                $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
                $('#obdPropertyGrid').datagrid('clearSelections');
                $("#obdPropertyEdit").hide();
            } else if (data.status == -1) {
            	if (DataReview.datakeyId.indexOf(",") != -1) {
            		$.messager.alert({title: '提示', msg: '存在待审核的设施移动数据，请重新选择！数据如下：<br/>' + data.message , icon: 'info'});
            	} else {
            		$.messager.alert({title: '提示', msg: '您移动的设施存在待审核的数据，不能再进行移动操作！', icon: 'info'});
            	}

                //$('#obdPropertyGrid').datagrid('clearChecked');
                //$("#obdPropertyEdit").hide();
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
    $("#mapMenu .moveToggle").removeClass("hide").show();
});



//采集建筑物取消
$("#cancle").unbind('click').bind('click', function () {
    $("#buildingPropertyAdd").dialog("close");
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
});


//采集建筑物保存
$("#saveCreatBuilding").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    var newValue = {};
    newValue.addrId = $("#buildingAddrId").val();
    newValue.addrId1 = $("#oneLeverId").val();
    newValue.addrId2 = $("#twoLeverId").val();
    newValue.addrId3 = $("#threeLeverId").val();
    newValue.addrId4 = $("#fourLeverId").val();
    newValue.addrId5 = $("#fiveLeverId").val();
    newValue.addrId6 = $("#sixLeverId").val();
    newValue.addrId7 = $("#sevenLeverId").val();
    newValue.addrName = $("#buildingAddr").val();
    newValue.addrName8 = $("#eightLever").val();
    newValue.addrName9 = $("#nineLever").val();
    newValue.addrName10 = $("#tenLever").val();
    newValue.countyId = $("#selectOrganization").val();
    newValue.county = $("#selectOrganization").find("option:selected").text();
    newValue.creater =  loginUser.loginName;
    newValue.facName = $("#buildingName").val();
    newValue.longitude = $("#longitude").val();
    newValue.latitude = $("#latitude").val();
    newValue.opPlatform =0;
    newValue.structureType = $("#STRUCTURETYPE").find("option:selected").text();
    newValue.jzwType = $("#JZWTYPE").find("option:selected").text();
    newValue.floorNum = $("#FLOORNUM").val();
    newValue.roomNum = $("#ROOMNUM").val();
    newValue.remark = $("#jzwCreatRemark").val();

    if($("#buildingName").val().replace(/(^\s*)|(\s*$)/g, '') == ""){
        $.messager.alert({
            title: '提示', msg: '建筑物地址不能为空！', icon: 'error'
        });
        return false;
    }
    if($("#buildingName").val().length > 254){
        $.messager.alert({
            title: '提示', msg: '建筑物地址不能超过254个字!', icon: 'error'
        });
        return false;
    }

    if($("#oneLever").combobox('getValue').trim()==""){
    	 $.messager.alert({
             title: '提示', msg: '一级地址不能为空!', icon: 'error'
         });
         return false;
    }
    if($("#twoLever").combobox('getValue').trim()==""){
   	 	$.messager.alert({
            title: '提示', msg: '二级地址不能为空!', icon: 'error'
        });
        return false;
    }
    if($("#threeLever").combobox('getValue').trim()==""){
   	 	$.messager.alert({
            title: '提示', msg: '三级地址不能为空!', icon: 'error'
        });
        return false;
    }
    if($("#fourLever").combobox('getValue').trim()==""){
   	 	$.messager.alert({
            title: '提示', msg: '四级地址不能为空!', icon: 'error'
        });
        return false;
    }
    if($("#fiveLever").combobox('getValue').trim()==""){
   	 	$.messager.alert({
            title: '提示', msg: '五级地址不能为空!', icon: 'error'
        });
        return false;
    }
    if($("#sixLever").combobox('getValue').trim()==""){
      	$.messager.alert({
            title: '提示', msg: '六级地址不能为空!', icon: 'error'
        });
        return false;
    }
    if($("#sevenLever").combobox('getValue').trim()==""){
     	$.messager.alert({
            title: '提示', msg: '七级地址不能为空!', icon: 'error'
        });
        return false;
    }
    newValue.addrName1 = $.trim($("#oneLever").combobox('getText'));
    newValue.addrName2 = $.trim($("#twoLever").combobox('getText'));
    newValue.addrName3 = $.trim($("#threeLever").combobox('getText'));
    newValue.addrName4 = $.trim($("#fourLever").combobox('getText'));
    newValue.addrName5 = $.trim($("#fiveLever").combobox('getText'));
    newValue.addrName6 = $.trim($("#sixLever").combobox('getText'));
    newValue.addrName7 = $.trim($("#sevenLever").combobox('getText'));
    var reg = /^\+?[1-9][0-9]*$/;
    if($("#FLOORNUM").val() != "") {
        if (!reg.test($("#FLOORNUM").val())) {
            $.messager.alert({
                title: '提示', msg: '楼层数必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#FLOORNUM").val().length >5 ){
        $.messager.alert({
            title: '提示', msg: '楼层数不能大于5位!', icon: 'error'
        });
        return false;
    }
    if($("#ROOMNUM").val() != "") {
        if (!reg.test($("#ROOMNUM").val())) {
            $.messager.alert({
                title: '提示', msg: '房间数必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#ROOMNUM").val().length >5 ){
        $.messager.alert({
            title: '提示', msg: '房间数不能大于5位!', icon: 'error'
        });
        return false;
    }

    if($("#jzwCreatRemark").val().length > 200 ){
        $.messager.alert({
            title: '提示', msg: '备注字数不能大于200个字!', icon: 'error'
        });
        return false;
    }


    if(typeof(curEditGraphic) != "undefined" && resubmitWithNoRender == 0) {
        for (var i = 0; i < curEditGraphic.geometry.rings.length; i++) {
            if (i > 0) {
                newValue.shape += "|";
            }
            for (var j = 0; j < curEditGraphic.geometry.rings[i].length; j++) {
                if (newValue.shape == null) {
                    newValue.shape = curEditGraphic.geometry.rings[i][j][0] + " ";
                } else {
                    if (i > 0 && j == 0) {
                        newValue.shape += curEditGraphic.geometry.rings[i][j][0] + " ";
                    } else {
                        newValue.shape += "," + curEditGraphic.geometry.rings[i][j][0] + " ";
                    }
                }
                newValue.shape += curEditGraphic.geometry.rings[i][j][1];
            }
        }
    }else{
        newValue.shape=$("#shapeNew").val();
        resubmitWithNoRender = 0;
    }

    if($("#shapeNew").val()!="") {

        newValue.dataReviewId = $("#jzw_dataReviewId").val();
    }
    newValue.userId = loginUser.id;
    newValue.village = $("#selectYingFu").find("option:selected").text();
    newValue.villageId = $("#selectYingFu").val();
    newValue.wgId = $("#selectYingGird").combobox('getValue');
    newValue.wgName = $("#selectYingGird").combobox('getText');
    $(this).attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "restful/building/buildingCollection ",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(newValue),
        success: function (data) {
        	$("#saveCreatBuilding").attr("disabled",false);
            if ( data.status == "success") {
                $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
                $("#buildingPropertyAdd").dialog("close");
                ReviewDataFlag = 0;
                if(newValue.dataReviewId!=null&&newValue.dataReviewId.length>0){
                	my_resetPageInfo();
                }
            }else if(data.status == "fail") {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }else {
                $.messager.alert({
                    title: '提示', msg: '该条数据处于提交中！', icon: 'error'
                });
            }
        },
        error: function (err) {
        	$("#saveCreatBuilding").attr("disabled",false);
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
});


$("#propertyCancle").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    $("#buildingPropertyGrid").dialog("close");

});


//建筑物属性修改保存
$("#updateBuildingBtn").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
	var DataReview = {};
	DataReview.creater = loginUser.loginName;
	buildingNewValue.dataReviewId=$("#building_dataReviewId").val();
	if(buildingNewValue.dataReviewId!=null&&buildingNewValue.dataReviewId.length>0){
		DataReview.datakeyId = $("#building_dataKeyId").val();
    }else{
    	buildingOldValue.facName = mapEventGraphic.attributes.FACNAME;
    	buildingOldValue.structureType = mapEventGraphic.attributes.STRUCTURE_TYPE;
    	buildingOldValue.jzwType = mapEventGraphic.attributes.JZW_TYPE;
    	buildingOldValue.floorNum = mapEventGraphic.attributes.FLOOR_NUM;
    	buildingOldValue.roomNum = mapEventGraphic.attributes.ROOM_NUM;
    	buildingOldValue.remark = mapEventGraphic.attributes.REMARK;
    	buildingOldValue.addrId = mapEventGraphic.attributes.ADDRID;
    	DataReview.datakeyId = mapEventGraphic.attributes.FACID;
    }
	buildingNewValue.addrName = $("#showAddrId").find("option:selected").text();
	buildingNewValue.facName = $("#FACNAME").val();
	buildingNewValue.addrId = $("#showAddrId").val();
	buildingNewValue.structureType = $("#STRUCTURE_TYPE").find("option:selected").text();
	buildingNewValue.jzwType = $("#JZW_TYPE").find("option:selected").text();
	buildingNewValue.floorNum = $("#FLOOR_NUM").val();
	buildingNewValue.roomNum = $("#ROOM_NUM").val();
	buildingNewValue.remark = $("#JZWREMARK").val();
	DataReview.dataKeyName =buildingNewValue.facName;
	DataReview.dataType = 2;// 数据类型 1：设施 2：建筑物
	DataReview.status = 2;// 1-添加，2-修改，3-删除
	DataReview.newValue = buildingNewValue;
	DataReview.oldValue = buildingOldValue;
    if($("#FACNAME").val().replace(/(^\s*)|(\s*$)/g, '') == ""){
        $.messager.alert({
            title: '提示', msg: '建筑物地址不能为空!', icon: 'error'
        });
        return false;
    }
    if($("#FACNAME").val().length > 254){
        $.messager.alert({
            title: '提示', msg: '建筑物地址不能超过254个字!', icon: 'error'
        });
        return false;
    }
    var reg = /^\+?[1-9][0-9]*$/;
    if($("#FLOOR_NUM").val() != "") {
        if (!reg.test($("#FLOOR_NUM").val())) {
            $.messager.alert({
                title: '提示', msg: '楼层数必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#FLOOR_NUM").val().length >5 ){
        $.messager.alert({
            title: '提示', msg: '楼层数不能大于5位!', icon: 'error'
        });
        return false;
    }
    if($("#ROOM_NUM").val() != "") {
        if (!reg.test($("#ROOM_NUM").val())) {
            $.messager.alert({
                title: '提示', msg: '房间数必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#ROOM_NUM").val().length >5 ){
        $.messager.alert({
            title: '提示', msg: '房间数不能大于5位!', icon: 'error'
        });
        return false;
    }

    if($("#JZWREMARK").val().length > 200 ){
        $.messager.alert({
            title: '提示', msg: '备注字数不能大于200个字!', icon: 'error'
        });
        return false;
    }

    if (JSON.stringify(buildingNewValue) == JSON.stringify(buildingOldValue)) {
        $("#buildingPropertyGrid").dialog("close");
        return false
    }
    $.ajax({
        type: "POST",
        url: "restful/dataReview/updateBuildingProperty",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(DataReview),
        success: function (data) {
            if (data.status == "success") {
            	if(data.content=="exists"){
            		 $.messager.alert({title: '提示', msg: '您操作的数据还处于待审核状态，不能再次操作!', icon: 'error'});
            	}else{
            		 $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
            	}
                $("#buildingPropertyGrid").dialog("close");
                if(buildingNewValue.dataReviewId!=null&&buildingNewValue.dataReviewId.length>0){
                	my_resetPageInfo();
                }
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
});


function buildingGeometryEditSubmit() {
    // 旧值
    var oldValue = {};
    // 新值
    var newValue = {};

    var DataReview = {};
    if(oldEditGraphics == 0 || oldEditGraphics == null){
        return ;
    }
    DataReview.creater = loginUser.loginName;
    for(var i=0;i<oldEditGraphics.geometry.rings.length;i++) {
        if(i > 0) {
            oldValue.shape += "|";
        }
        for(var j=0;j<oldEditGraphics.geometry.rings[i].length;j++) {
            if(oldValue.shape == null) {
                oldValue.shape = oldEditGraphics.geometry.rings[i][j][0] + " ";
            }else{
                if(i>0 && j==0) {
                    oldValue.shape += oldEditGraphics.geometry.rings[i][j][0] + " ";
                }else{
                    oldValue.shape += "," + oldEditGraphics.geometry.rings[i][j][0] + " ";
                }
            }
            oldValue.shape += oldEditGraphics.geometry.rings[i][j][1];
        }

    }

    for(var i=0;i<newEditGraphics[0].geometry.rings.length;i++) {
        if(i > 0) {
            newValue.shape += "|";
        }
        for(var j=0;j<newEditGraphics[0].geometry.rings[i].length;j++) {
            if(newValue.shape == null) {
                newValue.shape = newEditGraphics[0].geometry.rings[i][j][0]+ " ";
            }else{
                if(i>0 && j==0) {
                    newValue.shape += newEditGraphics[0].geometry.rings[i][j][0] + " ";
                }else {
                    newValue.shape += "," + newEditGraphics[0].geometry.rings[i][j][0] + " ";
                }
            }
            newValue.shape += newEditGraphics[0].geometry.rings[i][j][1];
        }
    }
    DataReview.datakeyId = mapEventGraphic.attributes.FACID;
    DataReview.dataKeyName =mapEventGraphic.attributes.FACNAME;
    DataReview.countyName = oldEditGraphics.attributes.COUNTY;
    DataReview.mkName = oldEditGraphics.attributes.VILLAGE;
    DataReview.newValue = newValue;
    DataReview.oldValue = oldValue;
    if(currentEditedMap == jzw){
        DataReview.dataType = 2;// 数据类型 1：设施 2：建筑物
        DataReview.status = 4;// 1-添加，2-修改，3-删除 4-建筑物轮廓修改
    }else if( currentEditedMap == wg){
        DataReview.dataType = 3;// 数据类型 1：设施 2：建筑物 3:网格
        DataReview.status = 4;// 1-添加，2-修改，3-删除 4-建筑物轮廓修改
    }else if( currentEditedMap == lightfacility){

    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if( currentEditedMap == fwq){
        DataReview.dataType = 4;// 数据类型 1：设施 2：建筑物 3:网格
        DataReview.status = 4;// 1-添加，2-修改，3-删除 4-建筑物轮廓修改
    }
    oldEditGraphics = 0;
    newEditGraphics = 0;

    if (JSON.stringify(newValue) == JSON.stringify(oldValue)) {
        return false;
    }
    $.ajax({
        type: "POST",
        url: "restful/dataReview/updateBuildingProperty",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(DataReview),
        success: function (data) {
            if (data.status == "success") {
            	if(data.content=="exists"){
           		 	$.messager.alert({title: '提示', msg: '您操作的数据还处于待审核状态，不能再次操作!', icon: 'error'});
	           	}else{
	           		$.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
	           	}
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
}


function deleteBuilding() {
    var dataReview = {};
    dataReview.creater = loginUser.loginName;
    dataReview.datakeyId = mapEventGraphic.attributes.FACID;
    dataReview.dataKeyName =mapEventGraphic.attributes.FACNAME;
    if(currentEditedMap == jzw){
        dataReview.dataType = 2;// 数据类型 1：设施 2：建筑物
        dataReview.status = 3;// 1-添加，2-修改，3-删除 4-建筑物轮廓修改
    }else if( currentEditedMap == wg){
        dataReview.dataType = 3;// 数据类型 1：设施 2：建筑物 3:网格
        dataReview.status = 3;// 1-添加，2-修改，3-删除 4-建筑物轮廓修改
        dataReview.countyName = mapEventGraphic.attributes.COUNTY;
        dataReview.mkName = mapEventGraphic.attributes.VILLAGE;
    }else if( currentEditedMap == lightfacility){

    }else if( currentEditedMap == xfbj){

    }else if( currentEditedMap == yfbj){

    }else if( currentEditedMap == fwq){
        dataReview.dataType = 4;// 数据类型 1：设施 2：建筑物 3:网格
        dataReview.status = 3;// 1-添加，2-修改，3-删除 4-建筑物轮廓修改
        dataReview.countyName = mapEventGraphic.attributes.COUNTY;
        dataReview.mkName = mapEventGraphic.attributes.VILLAGE;
    }


    $.ajax({
        type: "POST",
        url: "restful/dataReview/updateBuildingProperty",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(dataReview),
        success: function (data) {
            if (data.status == "success") {
            	if(data.content=="exists"){
           		 	$.messager.alert({title: '提示', msg: '您操作的数据还处于待审核状态，不能再次操作!', icon: 'error'});
	           	}else{
	           		$.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
	           	}
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
}

function review_building(type,index,facId, oldValue, newValue, dataType,shapeLen,status) {
    map.graphics.clear();
    if(type==1){
    	$("#dataReviewGrid").datagrid('checkRow', index);
    }else{
    	$("#my_dataReviewGrid").datagrid('checkRow', index);
    }
    var divWidth1 = $("#mySubmit_dataReview").width();
    var divWidth2 = $("#dataReview_dialog").width();
    $("#mySubmit_dataReview").find(".countCom-body").hide().end().css({"position":"fixed","right":"0","left":"auto","top":"96%","margin-left":"0","width":divWidth1/4});
    $("#dataReview_dialog").find(".countCom-body").hide().end().css({"position":"fixed","right":"0","left":"auto","top":"96%","margin-left":"0","width":divWidth2/4});
    //设施地图查看单独处理
    if(dataType==1){
    	var pSymbol = new esri.symbol.PictureMarkerSymbol(
				'./img/label/b.png', 24, 56);
		var geometry = new esri.geometry.Point(
				{
					"x" : newValue.longitude,
					"y" : newValue.latitude,
					"spatialReference" : map.spatialReference
				});
		var graphic = new esri.Graphic(
				geometry, pSymbol);

		map.graphics.add(graphic);
		if (map.getScale() > 4000) {
			map.setScale(800);
		}
		map.centerAt(geometry);
		return;
    }
    if(status == 3){
        markPolygonByFacId(facId,dataType);
        return false;
    }
    var polygonJson = {};
    var xy;
    var a;
    var b = new Array();
    var f = new Array();
    var c = new Array();
    var spatialReference = {};
    spatialReference.wkid = 4326;
    var rings = newValue.shape;
    var row = rings.split("|");
    for(var i=0;i<row.length;i++){
        a = row[i].split(",");
        for(var j=0;j<a.length;j++) {
            if(i==0) {
                b[j] = new Array();
                xy = (a[j].split(" "));
                b[j].push(parseFloat(xy[0]));
                b[j].push(parseFloat(xy[1]));
            }else if(i==1){
                f[j] = new Array();
                xy = (a[j].split(" "));
                f[j].push(parseFloat(xy[0]));
                f[j].push(parseFloat(xy[1]));
            }

        }
        if(i==0) {
            c.push(b);
        }else if(i==1){
            c.push(f);
        }
    }

    polygonJson.rings = c;
    polygonJson.spatialReference = spatialReference;

    var symbol = {
        color:[0,0,0,0],
        outline:{
            color:[255,0,0],
            width:2,
            type:"esriSLS",
            style:"esriSLSSolid"
        },
        type:"esriSFS",
        style:"esriSFSSolid"
    } ;

    var polyObj = {
        geometry:polygonJson,
        symbol:symbol
    } ;

    var gra = new esri.Graphic(polyObj);
    map.graphics.add(gra);


    if(shapeLen < 0.0005) {
        map.setScale(400);
    }else if( shapeLen < 0.001 && shapeLen >= 0.0005){
        map.setScale(800);
    }else if(shapeLen < 0.005 && shapeLen >= 0.001){
        map.setScale(1600);
    }else if(shapeLen < 0.01 && shapeLen >= 0.005){
        map.setScale(3200);
    }else if(shapeLen < 0.05 && shapeLen >= 0.01){
        map.setScale(6400);
    }else if(shapeLen < 0.1 && shapeLen >= 0.05){
        map.setScale(12800);
    }else if(shapeLen >= 0.1){
        map.setScale(25600);
    }
    var point = gra.geometry.getExtent().getCenter();
    map.centerAt(point);

    if(status == 4){
        var d = new Array();
        var e = new Array();
        var h = new Array();
        rings = oldValue.shape;
        row = rings.split("|");
        for(var i=0;i<row.length;i++){
            a = row[i].split(",");
            for(var j=0;j<a.length;j++) {
                if(i==0) {
                    d[j] = new Array();
                    xy = (a[j].split(" "));
                    d[j].push(parseFloat(xy[0]));
                    d[j].push(parseFloat(xy[1]));
                }else if(i==1){
                    h[j] = new Array();
                    xy = (a[j].split(" "));
                    h[j].push(parseFloat(xy[0]));
                    h[j].push(parseFloat(xy[1]));
                }

            }
            if(i==0) {
                e.push(d);
            }else if(i==1){
                e.push(h);
            }
        }

        polygonJson.rings = e;
        polygonJson.spatialReference = spatialReference;

        symbol = {
            color:[0,0,0,0],
            outline:{
                color:[0,255,0],
                width:2,
                type:"esriSLS",
                style:"esriSLSDash"
            },
            type:"esriSFS",
            style:"esriSFSSolid"
        } ;

        polyObj = {
            geometry:polygonJson,
            symbol:symbol
        } ;

        var graOld = new esri.Graphic(polyObj);
        map.graphics.add(graOld);
    }
}

function markPolygonByFacId(facid,dataType) {
    if(dataType == 2) {
        var jzw = mapServer_Url + "/jzw/MapServer";
    }else if(dataType == 3){
        var jzw = mapServer_Url + "/wg/MapServer";
    }else if(dataType == 4){
        var jzw = mapServer_Url + "/fwq/MapServer";
    }

    //创建属性查询对象
    var findTask = new esri.tasks.FindTask(jzw);
    //创建属性查询参数
    var findParams = new esri.tasks.FindParameters();

    //是否返回给我们几何信息
    findParams.returnGeometry = true;
    //对哪一个图层进行属性查询
    findParams.layerIds = [0];
    //查询的字段
    findParams.searchFields = ["FACID"];

    findParams.searchText = facid;
    //执行查询对象
    findTask.execute(findParams, ShowPolygonByFacId);
}

function ShowPolygonByFacId(queryResult){
    //创建线符号
    var lineSymbol=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3);

    if (queryResult.length == 0) {
        return;
    }
    if (queryResult.length >= 1) {
        for (var i = 0; i < queryResult.length; i++) {
            //获得图形graphic
            var graphic = queryResult[i].feature;
            //赋予相应的符号
            graphic.setSymbol(lineSymbol);
            //将graphic添加到地图中，从而实现高亮效果
            map.graphics.add(graphic);

            if(graphic.attributes["SHAPE.LEN"] < 0.0005) {
                map.setScale(400);
            }else if( graphic.attributes["SHAPE.LEN"] < 0.001 && graphic.attributes["SHAPE.LEN"] >= 0.0005){
                map.setScale(800);
            }else if(graphic.attributes["SHAPE.LEN"] < 0.005 && graphic.attributes["SHAPE.LEN"] >= 0.001){
                map.setScale(1600);
            }else if(graphic.attributes["SHAPE.LEN"] < 0.01 && graphic.attributes["SHAPE.LEN"] >= 0.005){
                map.setScale(3200);
            }else if(graphic.attributes["SHAPE.LEN"] < 0.05 && graphic.attributes["SHAPE.LEN"] >= 0.01){
                map.setScale(6400);
            }else if(graphic.attributes["SHAPE.LEN"] < 0.1 && graphic.attributes["SHAPE.LEN"] >= 0.05){
                map.setScale(12800);
            }else if(graphic.attributes["SHAPE.LEN"] >= 0.1){
                map.setScale(25600);
            }
            var point = graphic.geometry.getExtent().getCenter();
            map.centerAt(point);
        }
    }

}


function wgCreatPropertyData(data) {

    //identifyQueryForPosition(curEditGraphic.geometry.getExtent().getCenter(),yfbj);
    if(data.content.length>0){
        var jsonO = eval("("+data.content+")");
        for(var i=0;i<jsonO.length;i++){
            $("#wgCounty").append('<option value= '+jsonO[i].id+'>'+jsonO[i].text+'</option>');
        }
    }
    if (county) {
        $("#wgCounty").find("option:contains('" + county + "')").attr("selected",true);
    }
    getYingFu($('#wgCounty').val());
}


function otbCreatPropertyData(data) {
    $("#otbCounty").empty();
    $("#otbVillage").empty();
    $("#otbgird").empty();
    // identifyQueryForPosition(curEditGraphic.geometry.getExtent().getCenter(),wg);
    if(data.content.length>0){
        var jsonO = eval("("+data.content+")");
        for(var i=0;i<jsonO.length;i++){
            $("#otbCounty").append('<option value= '+jsonO[i].id+'>'+jsonO[i].text+'</option>');
        }
    }
    if (county) {
        $("#otbCounty").find("option:contains('" + county + "')").attr("selected",true);
    }
    getYingFu($('#otbCounty').val());
    $("#otbgird").val(wgFacName);
    $("#otbgirdid").val(bjGraphic.attributes.FACID);
}


function addfwq() {
    creatOTBPropertyPanel();
    $("#otbPropertyAdd input").val("");
    $("#otbFacName").val(otbName);
    $.ajax({
        type: "GET",
        url: "restful/organization/getByOrgId",
        data:{orgId:100000},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data);
                otbCreatPropertyData(records);
            }
        },
        error: function (err) {
        }
    });
}



function addWg() {
    wgCreatWgPropertyPanel();
    $('#wgCounty').empty();
    $('#wgVillage').empty();
    $('#wgTypeFacname').empty();
    if(ReviewDataFlag==0){
    	$("#wgFacName").val("");
    	$("#wgCode").val("");
    }
    $.ajax({
        type: "GET",
        url: "restful/girdcell/getAll",
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $("#wgTypeFacname").empty();
                $.each(records, function (i, r) {
                    $("#wgTypeFacname").append('<option value= '+r.dictId+'>'+r.dictName+'</option>');
                });
            }
        },
        error: function (err) {
        }
    });

    $.ajax({
        type: "GET",
        url: "restful/organization/getByOrgId",
        data:{orgId:100000},
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data);
                wgCreatPropertyData(records);
            }
        },
        error: function (err) {
        }
    });
}

//新建网格取消
$("#cancle1").unbind('click').bind('click', function () {
    $("#wgPropertyAdd").dialog("close");
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
});

//新建网格保存
$("#wgupdateBuildingBtn").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    var newValue = {};
    var wgDataReview = {};
    newValue.countyId = $("#wgCounty").val();
    newValue.county = $("#wgCounty").find("option:selected").text();

    newValue.creater =  loginUser.loginName;
    newValue.facName = $("#wgFacName").val();
    newValue.code = $("#wgCode").val();
    newValue.village = $("#wgVillage").find("option:selected").text();
    newValue.villageId=$("#wgVillage").val();
    newValue.gridType = $("#wgTypeFacname").find("option:selected").text();

    if($("#wgFacName").val().replace(/(^\s*)|(\s*$)/g, '') == ""){
        $.messager.alert({
            title: '提示', msg: '网格名称不能为空！', icon: 'error'
        });
        return false;
    }
    if($("#wgFacName").val().length > 254){
        $.messager.alert({
            title: '提示', msg: '网格名称不能超过254个字！', icon: 'error'
        });
        return false;
    }
    var reg = /^\+?[1-9][0-9]*$/;
    if($("#wgCode").val() != "") {
        if (!reg.test($("#wgCode").val())) {
            $.messager.alert({
                title: '提示', msg: 'CODE码必须输入数字!', icon: 'error'
            });
            return false;
        }
    }
    if($("#wgCode").val().length >100 ){
        $.messager.alert({
            title: '提示', msg: 'CODE码不能大于100位!', icon: 'error'
        });
        return false;
    }
    if($("#wg_shapeNew").val()!=""){
        newValue.shape=$("#wg_shapeNew").val();
        newValue.dataReviewId = $("#wg_add_dataReviewId").val();
    }else{
	    for(var i=0;i<curEditGraphic.geometry.rings.length;i++) {
	        if(i > 0) {
	            newValue.shape += "|";
	        }
	        for(var j=0;j<curEditGraphic.geometry.rings[i].length;j++) {
	            if(newValue.shape == null) {
	                newValue.shape = curEditGraphic.geometry.rings[i][j][0]+ " ";
	            }else{
	                if(i>0 && j==0){
	                    newValue.shape += curEditGraphic.geometry.rings[i][j][0]+ " ";
	                }else {
	                    newValue.shape += "," + curEditGraphic.geometry.rings[i][j][0] + " ";
	                }
	            }
	            newValue.shape += curEditGraphic.geometry.rings[i][j][1];
	        }
	    }
    }
    newValue.dataReviewId = $("#wg_add_dataReviewId").val();
    wgDataReview.countyName= newValue.county;
    wgDataReview.countyId =  newValue.countyId;
    wgDataReview.mkcenterId = newValue.villageId;
    wgDataReview.newValue = newValue;
    wgDataReview.userId = loginUser.id;
    wgDataReview.dataKeyName = newValue.facName;
    wgDataReview.dataType = 3;
    wgDataReview.status = 1;
    wgDataReview.creater = loginUser.loginName;
    $(this).attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "restful/dataReview/saveWg",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(wgDataReview),
        success: function (data) {
        	$("#wgupdateBuildingBtn").attr("disabled",false);
            if (data.status || data.status == "true") {
                $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
                $("#wgPropertyAdd").dialog("close");
                if(newValue.dataReviewId!=null&&newValue.dataReviewId.length>0){
                    my_resetPageInfo();
                }
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
        	$("#wgupdateBuildingBtn").attr("disabled",false);
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
})


//新建OTB取消
$("#otbcancle").unbind('click').bind('click', function () {
    $("#otbPropertyAdd").dialog("close");
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
});


//新建OTB保存
$("#otbupdateBuildingBtn").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    var newValue = {};
    var wgDataReview = {};
    newValue.countyId = $("#otbCounty").val();
    newValue.county = $("#otbCounty").find("option:selected").text();
    newValue.creater =  loginUser.loginName;
    newValue.facName = $("#otbFacName").val();
    newValue.village = $("#otbVillage").find("option:selected").text();
    newValue.villageId = $("#otbVillage").val();
    newValue.wgName = $("#otbgird").val();
    newValue.wgId = $("#otbgirdid").val();

    if($("#otbFacName").val().replace(/(^\s*)|(\s*$)/g, '') == ""){
        $.messager.alert({
            title: '提示', msg: '服务区名称不能为空！', icon: 'error'
        });
        return false;
    }
    if($("#otbFacName").val().length > 254){
        $.messager.alert({
            title: '提示', msg: '服务区不能超过254个字！', icon: 'error'
        });
        return false;
    }

    if(typeof(curEditGraphic) != "undefined" && resubmitWithNoRender == 0) {
        for (var i = 0; i < curEditGraphic.geometry.rings.length; i++) {
            if (i > 0) {
                newValue.shape += "|";
            }
            for (var j = 0; j < curEditGraphic.geometry.rings[i].length; j++) {
                if (newValue.shape == null) {
                    newValue.shape = curEditGraphic.geometry.rings[i][j][0] + " ";
                } else {
                    if (i > 0 && j == 0) {
                        newValue.shape += curEditGraphic.geometry.rings[i][j][0] + " ";
                    } else {
                        newValue.shape += "," + curEditGraphic.geometry.rings[i][j][0] + " ";
                    }
                }
                newValue.shape += curEditGraphic.geometry.rings[i][j][1];
            }
        }
    }else{
        newValue.shape=$("#otb_shapeNew").val();
        resubmitWithNoRender = 0;
    }

    if($("#otb_shapeNew").val()!="") {
        newValue.dataReviewId = $("#otb_add_dataReviewId").val();
    }
    wgDataReview.countyId =  newValue.countyId;
    wgDataReview.mkcenterId = newValue.villageId;
    wgDataReview.newValue = newValue;
    wgDataReview.userId = loginUser.id;
    wgDataReview.dataKeyName = newValue.facName;
    wgDataReview.dataType = 4;
    wgDataReview.status = 1;
    wgDataReview.creater = loginUser.loginName;
	$(this).attr("disabled",true);
    $.ajax({
        type: "POST",
        url: "restful/dataReview/saveWg",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(wgDataReview),
        success: function (data) {
        	$("#otbupdateBuildingBtn").attr("disabled",false);
            if (data.status || data.status == "true") {
                $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
                $("#otbPropertyAdd").dialog("close");
                if(newValue.dataReviewId!=null&&newValue.dataReviewId.length>0){
                    my_resetPageInfo();
                }
                ReviewDataFlag = 0;
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
        	$("#otbupdateBuildingBtn").attr("disabled",false);
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });

})


//服务区属性修改取消
$("#otbcancle2").unbind('click').bind('click', function () {
    $("#otbPropertyEdit").dialog("close");
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
});

//服务区属性修改保存
$("#otbupdateBtn").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    var DataReview = {};
    var newValue = {};
    newValue.dataReviewId=$("#otb_edit_dataReviewId").val();
    if(newValue.dataReviewId!=null && newValue.dataReviewId.length>0){
        DataReview.datakeyId=$("#otb_edit_dataKeyId").val();
    }else{
        DataReview.datakeyId = mapEventGraphic.attributes.FACID;
    }
    newValue.facName = $("#otbFacNameEdit").val();
    newValue.wgName = $("#otbgirdEdit").val();
    DataReview.creater = loginUser.loginName;
    DataReview.dataType = 4;// 数据类型 1：设施 2：建筑物
    DataReview.status = 2;// 1-添加，2-修改，3-删除
    DataReview.dataKeyName =newValue.facName;
    if(newValue.dataReviewId!=null && newValue.dataReviewId.length>0) {
        DataReview.countyName = $("#otb_edit_countyName").val();
        DataReview.mkName =  $("#otb_edit_villageName").val();
    }else{
        DataReview.countyName = mapEventGraphic.attributes.COUNTY;
        DataReview.mkName = mapEventGraphic.attributes.VILLAGE;
        newValue.COUNTY = mapEventGraphic.attributes.COUNTY;
        newValue.VILLAGE = mapEventGraphic.attributes.VILLAGE;
    }

    DataReview.newValue = newValue;
    DataReview.oldValue = buildingOldValue;

    if($("#otbFacNameEdit").val().replace(/(^\s*)|(\s*$)/g, '') == ""){
        $.messager.alert({
            title: '提示', msg: '服务区名称不能为空！', icon: 'error'
        });
        return false;
    }
    if($("#otbFacNameEdit").val().length > 254){
        $.messager.alert({
            title: '提示', msg: '服务区名称不能超过254个字！', icon: 'error'
        });
        return false;
    }

    if (JSON.stringify(newValue) == JSON.stringify(buildingOldValue)) {
        $("#otbPropertyEdit").dialog("close");
        return ;
    }
    $.ajax({
        type: "POST",
        url: "restful/dataReview/updateBuildingProperty",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(DataReview),
        success: function (data) {
            if (data.status == "success") {
                if(data.content=="exists"){
                    $.messager.alert({title: '提示', msg: '您操作的数据还处于待审核状态，不能再次操作!', icon: 'error'});
                }else{
                    $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
                }
                $("#otbPropertyEdit").dialog("close");
                if(newValue.dataReviewId!=null&&newValue.dataReviewId.length>0){
                    my_resetPageInfo();
                }
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
});



//网格属性修改取消
$("#cancle2").unbind('click').bind('click', function () {
    $("#wgPropertyEdit").dialog("close");
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
});

//网格属性修改保存
$("#wgupdateBtn").unbind('click').bind('click', function () {
    $(".panel-tool .panel-tool-close").removeClass("hide").show();
    var DataReview = {};
    var newValue = {};
    newValue.dataReviewId=$("#wg_edit_dataReviewId").val();
    if(newValue.dataReviewId!=null&&newValue.dataReviewId.length>0){
    	DataReview.datakeyId=$("#wg_edit_dataKeyId").val();
    }else{
        DataReview.datakeyId = mapEventGraphic.attributes.FACID;
    }
    newValue.facName = $("#wgFacNameEdit").val();
    newValue.gridType = $("#wgTypeFacnameEdit").find("option:selected").text();
    newValue.code = $("#wgCodeEdit").val();
    newValue.village = $("#wgVillageEdit").val();
    newValue.county = $("#wgCountyEdit").val();
    DataReview.creater = loginUser.loginName;
    DataReview.dataType = 3;// 数据类型 1：设施 2：建筑物
    DataReview.status = 2;// 1-添加，2-修改，3-删除
    DataReview.dataKeyName =newValue.facName;
    DataReview.countyName = newValue.county;
    DataReview.mkName = newValue.village;
    DataReview.newValue = newValue;
    DataReview.oldValue = buildingOldValue;

    if($("#wgFacNameEdit").val().replace(/(^\s*)|(\s*$)/g, '') == ""){
        $.messager.alert({
            title: '提示', msg: '网格名称不能为空！', icon: 'error'
        });
        return false;
    }
    if($("#wgFacNameEdit").val().length > 254){
        $.messager.alert({
            title: '提示', msg: '网格名称不能超过254个字！', icon: 'error'
        });
        return false;
    }

    if (JSON.stringify(newValue) == JSON.stringify(buildingOldValue)) {
        $("#wgPropertyEdit").dialog("close");
        return ;
    }
    $.ajax({
        type: "POST",
        url: "restful/dataReview/updateBuildingProperty",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(DataReview),
        success: function (data) {
            if (data.status == "success") {
            	if(data.content=="exists"){
            		 $.messager.alert({title: '提示', msg: '您操作的数据还处于待审核状态，不能再次操作!', icon: 'error'});
	           	}else{
	           		 $.messager.alert({title: '提示', msg: '数据已提交，等待审核！', icon: 'info'});
	           	}
                $("#wgPropertyEdit").dialog("close");
                if(newValue.dataReviewId!=null&&newValue.dataReviewId.length>0){
                	my_resetPageInfo();
                }
            } else {
                $.messager.alert({
                    title: '提示', msg: '保存失败！', icon: 'error'
                });
            }
        },
        error: function (err) {
            $.messager.alert({
                title: '提示', msg: '保存失败！', icon: 'error'
            });
        }
    });
});


document.onmousemove = function(evt) {
    if(oTop !="") {
        var oEvent = evt || window.event;
        var scrollleft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
        oTop.style.left = oEvent.clientX + scrollleft + 10 + "px";
        oTop.style.top = oEvent.clientY + scrolltop + 10 + "px";
        mouseX = oEvent.clientX + scrollleft - 10 + "px";
        mouseY = oEvent.clientY + scrolltop + 3 +  "px";
    }
}

function mapClick() {
    if(oTop!="" && currentEditedMap != lightfacility) {
        clickNum++;
        if(mapEditStatus == MEASURE_STATUS){
            oTop.innerHTML = "单击确定地点，双击完成绘制";
        }else {
            if (clickNum == 1) {
                oTop.innerHTML = "单击以继续绘制";
                clickNum++;
            } else if (clickNum > 3) {
                oTop.innerHTML = "双击完成绘制";
            }
        }
    }
}

function mouseClickEvt() {

        if (currentEditedFCLayer != null && typeof(currentEditedFCLayer) != undefined) {
            currentEditedFCLayer.on("click", function (evt) {
                dojo._base.event.stop(evt);
                map.graphics.clear();

                if (mapEditStatus == EDITBUILDING_STATUS || mapEditStatus == CREATEBUILDING_STATUS) {
                    return;
                }
                mapEditStatus = SELECTBUILDING_STATUS;
                mapEventGraphic = evt.graphic;
                var geometry = {};
                if (currentEditedMap == jzw) {
                    $("#mapMenu .reviewToggle").removeClass("hide").show();
                    $("#mapMenu .handleToggle").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .pickUp").hide();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .mapToggle").hide();
                    geometry = evt.mapPoint;
                } else if (currentEditedMap == wg) {
                    $("#mapMenu .pickUp").hide();
                    $("#mapMenu .handleToggle").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .reviewToggle").hide();
                    geometry = evt.mapPoint;
                } else if (currentEditedMap == lightfacility) {
                    geometry = mapEventGraphic.geometry;
                    if (moveFlag == 1) {
                        layers.dragIocLayer.clear();
                        $("#mapMenu .cancelOp").removeClass("hide").show();
                        $("#mapMenu .reviewToggle").hide();
                        $("#mapMenu .moveToggle").hide();
                        $("#mapMenu .newAdd").hide();
                        $("#mapMenu .handleToggle").hide();
                        $("#mapMenu .backToPre").hide();
                        $("#mapMenu .mapToggle").hide();
                        $("#mapMenu .submitOp").hide();
                        $("#mapMenu .pickUp").hide();
                        oTop.innerHTML = "选中目标进行拖动，拖动完成点击鼠标右键进行取消或提交修改";

                        var pointSymbol = new esri.symbol.PictureMarkerSymbol('./img/label/r.png', 24, 56);
                        var drawSimpleRender = new esri.renderer.SimpleRenderer(pointSymbol);
                        layers.dragIocLayer.setRenderer(drawSimpleRender);
                        layers.dragIocLayer.add(new esri.Graphic(new esri.geometry.Point(evt.graphic.geometry.x, evt.graphic.geometry.y, map.spatialReference)));

                    }

                } else if (currentEditedMap == xfbj) {
                    $("#mapMenu .handleToggle").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .pickUp").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .reviewToggle").hide();
                    geometry = evt.mapPoint;
                } else if (currentEditedMap == yfbj) {
                    $("#mapMenu .handleToggle").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .pickUp").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .reviewToggle").hide();
                    geometry = evt.mapPoint;

                } else if (currentEditedMap == fwq) {
                    $("#mapMenu .handleToggle").removeClass("hide").show();
                    $("#mapMenu .backToPre").removeClass("hide").show();
                    $("#mapMenu .submitOp").hide();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .cancelOp").hide();
                    $("#cancelOpLine").hide();
                    $("#mapMenu .pickUp").hide();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .reviewToggle").hide();
                    geometry = evt.mapPoint;
                } else if (currentEditedMap == dt) {
                    $("#mapMenu .pickUp").hide();
                    $("#mapMenu .handleToggle").hide();
                    $("#mapMenu .backToPre").hide();
                    $("#mapMenu .submitOp").removeClass("hide").show();
                    $("#mapMenu .newAdd").hide();
                    $("#mapMenu .cancelOp").removeClass("hide").show();
                    $("#cancelOpLine").removeClass("hide").show();
                    $("#mapMenu .mapToggle").hide();
                    $("#mapMenu .reviewToggle").hide();
                    curEditGraphic = evt.graphic;
                    geometry = evt.mapPoint;
                    mapPoint = evt.mapPoint;
                    //由于底图建筑物没有属性，所以要查网格得到更多的属性
                    identifyQueryForPosition(geometry, wg)
                }

                identifyQuery(geometry, currentEditedMap);
            });
        }
}

function zoomIn() {
    var scale;
    scale = map.getScale();
    if(scale<=scaleLever[9]){
        return;
    }else if(scale > scaleLever[9] && scale <= scaleLever[8]){
        map.setScale(scaleLever[9]);
    }else if(scale > scaleLever[8] && scale <= scaleLever[7]){
        map.setScale(scaleLever[8]);
    }else if(scale > scaleLever[7] && scale <= scaleLever[6]){
        map.setScale(scaleLever[7]);
    }else if(scale > scaleLever[6] && scale <= scaleLever[5]){
        map.setScale(scaleLever[6]);
    }else if(scale > scaleLever[5] && scale <= scaleLever[4]){
        map.setScale(scaleLever[5]);
    }else if(scale > scaleLever[4] && scale <= scaleLever[3]){
        map.setScale(scaleLever[4]);
    }else if(scale > scaleLever[3] && scale <= scaleLever[2]){
        map.setScale(scaleLever[3]);
    }else if(scale > scaleLever[2] && scale <= scaleLever[1]){
        map.setScale(scaleLever[2]);
    }else if(scale > scaleLever[1] && scale <= scaleLever[0]){
        map.setScale(scaleLever[1]);
    }else if(scale > scaleLever[0]){
        map.setScale(scaleLever[0]);
    }
}


function zoomOut() {
    var scale;
    scale = map.getScale();
    if(scale>=scaleLever[0]){
        return;
    }else if(scale < scaleLever[0] && scale >= scaleLever[1]){
        map.setScale(scaleLever[0]);
    }else if(scale < scaleLever[1] && scale >= scaleLever[2]){
        map.setScale(scaleLever[1]);
    }else if(scale < scaleLever[2] && scale >= scaleLever[3]){
        map.setScale(scaleLever[2]);
    }else if(scale < scaleLever[3] && scale >= scaleLever[4]){
        map.setScale(scaleLever[3]);
    }else if(scale < scaleLever[4] && scale >= scaleLever[5]){
        map.setScale(scaleLever[4]);
    }else if(scale < scaleLever[5] && scale >= scaleLever[6]){
        map.setScale(scaleLever[5]);
    }else if(scale < scaleLever[6] && scale >= scaleLever[7]){
        map.setScale(scaleLever[6]);
    }else if(scale < scaleLever[7] && scale >= scaleLever[8]){
        map.setScale(scaleLever[7]);
    }else if(scale < scaleLever[8] && scale >= scaleLever[9]){
        map.setScale(scaleLever[8]);
    }else if(scale < scaleLever[9]){
        map.setScale(scaleLever[9]);
    }
}

$("#selectZsyx").on('click',function (e) {
    if($('#selectZsyx').is(':checked')){
        zsyxLayer.setVisibility(true);
    }else{
        zsyxLayer.setVisibility(false);
    }
    e.stopPropagation();
});


$("#selectZsdzdt").on('click',function (e) {
    if($('#selectZsdzdt').is(':checked')){
        zsdzdtLayer.setVisibility(true);
    }else{
        zsdzdtLayer.setVisibility(false);
    }
    e.stopPropagation();
});


 $("#selectYfbj").on('click',function (e) {
     if($(this).is(':checked')){
         yfbjLayer.setVisibility(true);
     }else{
         yfbjLayer.setVisibility(false);
     }
     e.stopPropagation();
 });


$("#selectJzw").on('click',function (e) {
    if($('#selectJzw').is(':checked')){
        jzwLayer.setVisibility(true);
    }else{
        jzwLayer.setVisibility(false);
    }
    e.stopPropagation();
});

$("#selectFwq").on('click',function (e) {
    if($('#selectFwq').is(':checked')){
        fwqLayer.setVisibility(true);
    }else{
        fwqLayer.setVisibility(false);
    }
    e.stopPropagation();
});

$("#selectXfbj").on('click',function (e) {
    if($('#selectXfbj').is(':checked')){
        xfbjLayer.setVisibility(true);
    }else{
        xfbjLayer.setVisibility(false);
    }
    e.stopPropagation();
});

$("#selectWg").on('click',function (e) {
    if($('#selectWg').is(':checked')){
        wgLayer.setVisibility(true);
    }else{
        wgLayer.setVisibility(false);
    }
    e.stopPropagation();
});

$("#selectLightfacility").on('click',function (e) {
    if($('#selectLightfacility').is(':checked')){
        lightfacilityLayer.setVisibility(true);
    }else{
        lightfacilityLayer.setVisibility(false);
    }
    e.stopPropagation();
});

function rendererJzw() {
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);

    currentEditedFCLayer = map.getLayer("jzwFeatureLayer") ;
    currentEditedMap = jzw;
    currentEditedFCLayer.setRenderer(renderer);
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);


    $("#mapMenu .newAdd").removeClass("hide").show();
    $("#mapMenu .pickUp").removeClass("hide").show();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .moveToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();

    if(jzwLayerClickRegister == 0) {
        mouseClickEvt();
    }
    jzwLayerClickRegister = 1;

}

function rendererFwq() {
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);
    currentEditedFCLayer = map.getLayer("fwqFeatureLayer") ;
    currentEditedMap = fwq;
    currentEditedFCLayer.setRenderer(renderer);
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);


    $("#mapMenu .newAdd").removeClass("hide").show();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .moveToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();
    $("#mapMenu .pickUp").hide();

    if(fwqLayerClickRegister == 0) {
        mouseClickEvt();
    }
    fwqLayerClickRegister = 1;
}


function rendererJzwForLeftPanel() {
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);
    if(gNode == 2 || gNode == 3 ) {
        currentEditedFCLayer = map.getLayer("jzwFeatureLayer");
        currentEditedMap = jzw;
        jzwLayer.setVisibility(false);
        fwqLayer.setVisibility(false);
    }else if(gNode == 1){
        currentEditedFCLayer = map.getLayer("fwqFeatureLayer");
        currentEditedMap = fwq;
        fwqLayer.setVisibility(false);
        jzwLayer.setVisibility(false);
    }
    currentEditedFCLayer.setRenderer(renderer);
    currentEditedFCLayer.setVisibility(true) ;

    wgLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);
}


function rendererWg(){

    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);

    currentEditedFCLayer = map.getLayer("wgFeatureLayer") ;
    currentEditedMap = wg;
    currentEditedFCLayer.setRenderer(renderer);
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

    $("#mapMenu .newAdd").removeClass("hide").show();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .moveToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();
    $("#mapMenu .pickUp").hide();

    if(wgLayerClickRegister == 0) {
        mouseClickEvt();
    }
    wgLayerClickRegister = 1;

}


function rendererWgForLeftPanel(){

    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);

    currentEditedFCLayer = map.getLayer("wgFeatureLayer") ;
    currentEditedMap = wg;
    currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

}

function rendererYfbj(){
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);

    currentEditedFCLayer = map.getLayer("yfbjFeatureLayer") ;
    currentEditedMap = yfbj;
    currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true);
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

    $("#mapMenu .newAdd").removeClass("hide").show();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .moveToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();
    $("#mapMenu .pickUp").hide();

    if(yfbjLayerClickRegister == 0) {
        mouseClickEvt();
    }
    yfbjLayerClickRegister = 1;
}


function rendererYfbjForLeftPanel(){
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);

    currentEditedFCLayer = map.getLayer("yfbjFeatureLayer") ;
    currentEditedMap = yfbj;
    currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true);
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

}

function rendererXfbj() {
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);
    currentEditedFCLayer = map.getLayer("xfbjFeatureLayer") ;
    currentEditedMap = xfbj;
    currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

    $("#mapMenu .newAdd").removeClass("hide").show();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .moveToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();
    $("#mapMenu .pickUp").hide();

    if(xfbjLayerClickRegister == 0) {
        mouseClickEvt();
    }
    xfbjLayerClickRegister = 1;
}


function rendererDitu(){
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    /*var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);*/
    currentEditedFCLayer = map.getLayer("dtFeatureLayer") ;
    currentEditedMap = dt;
    //currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    //jzwLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

    $("#mapMenu .newAdd").hide();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .moveToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();
    $("#mapMenu .pickUp").hide();

    if(dtLayerClickRegister == 0) {
        mouseClickEvt();
    }
    dtLayerClickRegister = 1;
}


function rendererXfbjForLeftPanel() {
    if (typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null) {
        currentEditedFCLayer.setVisibility(false);
    }

    var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0, 255, 127, 0.5]));
    var renderer = new esri.renderer.SimpleRenderer(symbol);
    currentEditedFCLayer = map.getLayer("xfbjFeatureLayer");
    currentEditedMap = xfbj;
    currentEditedFCLayer.setRenderer(renderer);
    currentEditedFCLayer.setVisibility(true);
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);
}

function rendererObd() {
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
        map.graphics.clear();
    }

    var symbol = new esri.symbol.PictureMarkerSymbol('./img/label/b.png', 24, 56);
    var renderer = new esri.renderer.SimpleRenderer(symbol);
    currentEditedFCLayer = map.getLayer("lightfacilityFeatureLayer") ;
    currentEditedMap = lightfacility;
    currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    fwqLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(false);

    $("#mapMenu .newAdd").hide();
    $("#mapMenu .backToPre").removeClass("hide").show();
    $("#mapMenu .moveToggle").removeClass("hide").show();
    $("#mapMenu .reviewToggle").hide();
    $("#mapMenu .handleToggle").hide();
    $("#mapMenu .mapToggle").hide();
    $("#mapMenu .cancelOp").hide();
    $("#cancelOpLine").hide();
    $("#mapMenu .submitOp").hide();
    $("#mapMenu .pickUp").hide();

    if(lightfacilityLayerClickRegister == 0) {
        mouseClickEvt();
    }
    lightfacilityLayerClickRegister = 1;
}


function rendererObdForLeftPanel() {
    if(typeof(currentEditedFCLayer) != undefined && currentEditedFCLayer != null){
        currentEditedFCLayer.setVisibility(false) ;
    }

    var symbol = new esri.symbol.PictureMarkerSymbol('./img/label/b.png', 24, 56);
    var renderer = new esri.renderer.SimpleRenderer(symbol);
    currentEditedFCLayer = map.getLayer("lightfacilityFeatureLayer") ;
    currentEditedMap = lightfacility;
    currentEditedFCLayer.setRenderer(renderer) ;
    currentEditedFCLayer.setVisibility(true) ;
    wgLayer.setVisibility(false);
    jzwLayer.setVisibility(false);
    xfbjLayer.setVisibility(false);
    yfbjLayer.setVisibility(false);
    lightfacilityLayer.setVisibility(true);
}


$(".building").click(function () {
    rendererJzw();
    var item={};
    item.name="建筑物";
    checkMenuPrivilege(item);
});

$(".gridCell").click(function () {
    rendererWg();
    var item={};
    item.name="网格";
    checkMenuPrivilege(item);
});

$(".gridType").click(function () {
    rendererYfbj();
    var item={};
    item.name="营服";
    checkMenuPrivilege(item);
});

$(".fwq").click(function () {
    rendererFwq();
    var item={};
    item.name="服务区";
    checkMenuPrivilege(item);
});

$(".org").click(function () {
    rendererXfbj();
    var item={};
    item.name="县分";
    checkMenuPrivilege(item);
});

$(".obd").click(function () {
    rendererObd();
    var item={};
    item.name="光资源";
    checkMenuPrivilege(item);
});

function showCoordinates(evt) {
    if(mapEditStatus == SELECTBUILDING_STATUS && currentEditedMap == lightfacility && moveFlag == 1){
        $("#mapMenu .submitOp").removeClass("hide").show();
        $("#cancelOpLine").removeClass("hide").show();
    }
    var mp = evt.mapPoint;
    _x = mp.x;
    _y = mp.y;
    if(isDrag){
        layers.dragIocLayer.clear();
        layers.dragIocLayer.add(new esri.Graphic(new esri.geometry.Point(_x,_y, map.spatialReference)));
    }
}


$("#measurePolyline").click(function () {
    draw.activate(esri.toolbars.Draw.POLYLINE, {
        showTooltips:true
    });
    mapEditStatus =MEASURE_STATUS;
    oTop = document.getElementById("to_top");
    $("#to_top").removeClass("hide").show();
    oTop.innerHTML="单击以开始绘制";
   /* oEnd = document.getElementById("to_end");*/
});

$("#measurePolygon").click(function () {
    draw.activate(esri.toolbars.Draw.POLYGON, {
        showTooltips:true
    });
    mapEditStatus =MEASURE_STATUS;
    oTop = document.getElementById("to_top");
    $("#to_top").removeClass("hide").show();
    oTop.innerHTML="单击以开始绘制";
   /* oEnd = document.getElementById("to_end");*/
});



function doMeasure(geometry)
{
    measuregeometry = geometry;
    switch (geometry.type) {
        case "polyline":
            var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3);
            break;
        case "polygon":
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3),new dojo.Color([255,255,0,0]));
            break;
    }
    //设置样式
    var graphic = new esri.Graphic(geometry,symbol);
    //清除上一次的画图内容
    map.graphics.clear();
    map.graphics.add(graphic);
    //进行投影转换，完成后调用projectComplete
    MeasureGeometry(geometry);
}


//投影转换完成后调用方法
function MeasureGeometry(geometry) {
    //如果为线类型就进行lengths距离测算
    if (geometry.type == "polyline") {
        var lengthParams = new esri.tasks.LengthsParameters();
        lengthParams.polylines = [geometry];
        lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
        lengthParams.geodesic = true;
        lengthParams.polylines[0].spatialReference = new esri.SpatialReference(4326);
        geometryService.lengths(lengthParams);
        dojo.connect(geometryService, "onLengthsComplete", outputDistance);
    }
    //如果为面类型需要先进行simplify操作在进行面积测算
    else if (geometry.type == "polygon") {
        var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
        this.outSR = new esri.SpatialReference({ wkid: 102113 });
        geometryService.project([geometry], this.outSR, function (geometry) {
            geometryService.simplify(geometry, function (simplifiedGeometries) {
                areasAndLengthParams.polygons = simplifiedGeometries;
                areasAndLengthParams.polygons[0].spatialReference = new esri.SpatialReference(102113);
                geometryService.areasAndLengths(areasAndLengthParams);
            });
        });
        dojo.connect(geometryService, "onAreasAndLengthsComplete", outputAreaAndLength);
    }
}

//显示测量距离
function outputDistance(result) {
    var CurX = measuregeometry.paths[0][measuregeometry.paths[0].length - 1][0];
    var CurY = measuregeometry.paths[0][measuregeometry.paths[0].length - 1][1];
    var  CurPos  =  new  esri.geometry.Point(CurX,  CurY, map.spatialReference);
    map.infoWindow.setTitle("距离测量" + "<img src='./img/xx.png' style='position: absolute; right: 3px;top: 4px;' onclick='closeInfoWindow()'/>");
    map.infoWindow.setContent(" 测 量 长 度 ： <strong>" + parseInt(String(result.lengths[0])) + "米</strong>");
    map.infoWindow.show(CurPos);
    map.infoWindow.resize(200,38);
    $(".esriPopupWrapper .maximize").hide();
    $(".esriPopupWrapper .close").hide();
}

//显示测量面积
function outputAreaAndLength(result) {
    var CurX = (measuregeometry.cache._extent.xmax + measuregeometry.cache._extent.xmin) / 2;
    var CurY = (measuregeometry.cache._extent.ymax + measuregeometry.cache._extent.ymin) / 2;
    var CurPos = new esri.geometry.Point(CurX, CurY, map.spatialReference);
    map.infoWindow.setTitle("面积测量" + "<img src='./img/xx.png' style='position: absolute; right: 3px;top: 4px;' onclick='closeInfoWindow()'/>");
    map.infoWindow.setContent(" 面积 ： <strong>" + parseInt(String(result.areas[0])) + "平方米</strong>");
    map.infoWindow.show(CurPos);
    map.infoWindow.resize(200,38);
    $(".esriPopupWrapper .maximize").hide();
    $(".esriPopupWrapper .close").hide();

}

function closeInfoWindow() {
    map.graphics.clear();
    map.infoWindow.hide();
}

//设置地图右键菜单的权限
function checkMenuPrivilege(item){
	if(item.name=="查看光资源统计"||item.name=="查看建筑物图片"||item.name=="属性修改"||item.name=="修改外形"||item.name=="删除"||item.name=="返回"||item.name=="提交"||item.name=="取消"||item.name=="添加"||item.name=="移动"||item.name=="底图拾取"){
		
	}else{
		$.get("restful/permission/findByLoginName", {loginName: loginUser.loginName},function (data) {
			var list = $.parseJSON(data.content);
	    	//数据导出
	    	$("#btnExport").hide();
	    	//图形导出
	    	//obd移动
	    	//2、建筑物，网格,服务区，营服边界、县分边界
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "添加").target);
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "属性修改").target);
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "外形修改").target);
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "删除").target);
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "移动").target);
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "查看光资源统计").target);
	    	$("#mapMenu").menu("disableItem",$("#mapMenu").menu("findItem", "查看建筑物图片").target);
			for(var i in list){
			if (item.name == "建筑物") {
			 	if(list[i].priviCode =='jzw:add'){
			 		$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "添加").target);
	            }
	            if(list[i].priviCode =='jzw:dataUpdate'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "属性修改").target);
	            }
	            if(list[i].priviCode =='jzw:shapeUpdate'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "外形修改").target);
	            }
				if(list[i].priviCode =='jzw:queryLightFacility'){
					$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "查看光资源统计").target);
	            }
	            if(list[i].priviCode =='jzw:delete'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "删除").target);
	            }
	            if(list[i].priviCode =='jzw:dataExport'){
	                
	            }
				if(list[i].priviCode =='jzw:shapeExport'){
	                
	            }
	            if(list[i].priviCode =='jzw:photoView'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "查看建筑物图片").target);
	            }
	            if(list[i].priviCode =='jzw:dtsq'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "底图拾取").target);
	            }
	    	}else if(item.name == "网格"){
	    		if(list[i].priviCode =='grid:add'){
			 		$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "添加").target);
	            }
	            if(list[i].priviCode =='grid:dataUpdate'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "属性修改").target);
	            }
	            if(list[i].priviCode =='grid:shapeUpdate'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "外形修改").target);
	            }
	            if(list[i].priviCode =='grid:delete'){
	            	$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "删除").target);
	            }
	            if(list[i].priviCode =='grid:dataExport'){
	                
	            }
				if(list[i].priviCode =='grid:shapeExport'){
	                
	            }
	    	}else if(item.name == "光资源"){
	    		if(list[i].priviCode =='obd:move'){
	    			$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "移动").target);
	            }
	    	}else if(item.name == "营服"){
	    		if(list[i].priviCode =='yfbj:add'){
	    			$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "添加").target);
	            }
	          
	    	}else if(item.name == "县分"){
	    		if(list[i].priviCode =='xfbj:add'){
	    			$("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "添加").target);
	            }
	    	}else if(item.name == "服务区"){
	    		if(list[i].priviCode =='fwq:add'){
	                $("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "添加").target);
	            }
	    		if(list[i].priviCode =='fwq:dataUpdate'){
	                $("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "属性修改").target);
	            }
	    		if(list[i].priviCode =='fwq:shapeUpdate'){
	                $("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "外形修改").target);
	            }
	    		if(list[i].priviCode =='fwq:delete'){
	                $("#mapMenu").menu("enableItem",$("#mapMenu").menu("findItem", "删除").target);
	            }
	    	}
			}
		});
	}
}
