var wgHeatmapFeatureLayer;
var jzwHeatmapFeatureLayer;
var jzwHeatmapFeatureLayer1;
var yfbjHeatmapFeatureLayer;
var xfbjHeatmapFeatureLayer;
var curHeatmapFeatureLayer;
var rltFlag;
var heatmapRenderer;
var mapZoomChangeHandler ;   //放大缩小事件句柄

function heatMapInit() {
	 wgHeatmapFeatureLayer = new esri.layers.FeatureLayer(
			 mapServer_Url + "/wg_rlt/FeatureServer/0",
		{
			mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"],
			id : 'wgHeatmapFeatureLayer'}
	);

	jzwHeatmapFeatureLayer = new esri.layers.FeatureLayer(
			mapServer_Url + "/jzw_rlt/FeatureServer/0",
		{
			mode:esri.layers.FeatureLayer.MODE_SNAPSHOT,
			outFields: ["KDST_DATA", "PORTZY_DATA"],
			id : 'jzwHeatmapFeatureLayer'
			}
	);

	jzwHeatmapFeatureLayer1 = new esri.layers.FeatureLayer(
			mapServer_Url + "/jzw_rlt/FeatureServer/0",
			{
				mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
				outFields: ["KDST_DATA", "PORTZY_DATA"],
				id : 'jzwHeatmapFeatureLayer1'
			}
	);
	
	yfbjHeatmapFeatureLayer = new esri.layers.FeatureLayer(
			mapServer_Url + "/yfbj_rlt/FeatureServer/0",
		{
			mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"],
			id : 'yfbjHeatmapFeatureLayer'}
	);

	xfbjHeatmapFeatureLayer = new esri.layers.FeatureLayer(
			mapServer_Url + "/xfbj_rlt/FeatureServer/0",
		{
			mode:esri.layers.FeatureLayer.MODE_ONDEMAND,
			outFields: ["*"],
			id : 'xfbjHeatmapFeatureLayer'}
	);

	wgHeatmapFeatureLayer.setDefinitionExpression(where.layerDefs[0]);
	jzwHeatmapFeatureLayer.setDefinitionExpression(where.layerDefs[0]);
	yfbjHeatmapFeatureLayer.setDefinitionExpression(where.layerDefs[0]);

	map.addLayers([wgHeatmapFeatureLayer]);
	wgHeatmapFeatureLayer.setVisibility(false);
	map.addLayers([jzwHeatmapFeatureLayer]);
	map.addLayers([jzwHeatmapFeatureLayer1]);
	jzwHeatmapFeatureLayer.setVisibility(false);
	jzwHeatmapFeatureLayer1.setVisibility(false);
	map.addLayers([yfbjHeatmapFeatureLayer]);
	yfbjHeatmapFeatureLayer.setVisibility(false);
	map.addLayers([xfbjHeatmapFeatureLayer]);
	xfbjHeatmapFeatureLayer.setVisibility(false);

};

$("#kuandaishentoulv-heatmap").click(function(){
	$("#wangge").attr("checked","checked");
	map.graphics.clear();
	var heatmapRenderer = new esri.renderer.HeatmapRenderer({
		field: "KDST_DATA",
		colors: ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"],
		blurRadius: 8,
		maxPixelIntensity: 20.0,
		minPixelIntensity: 0

	});
	wgHeatmapFeatureLayer.setRenderer(heatmapRenderer);
	wgHeatmapFeatureLayer.setVisibility(true);
	wgHeatmapFeatureLayer.refresh();
	curHeatmapFeatureLayer = wgHeatmapFeatureLayer;
	rltFlag = "kuandaishentoulv";
	xfbjHeatmapFeatureLayer.setVisibility(false);
	yfbjHeatmapFeatureLayer.setVisibility(false);
	jzwHeatmapFeatureLayer.setVisibility(false);
});

$("#duankouzhanyonglv-heatmap").click(function(){
	$("#wangge").attr("checked","checked");
	map.graphics.clear();
	 heatmapRenderer = new esri.renderer.HeatmapRenderer({
		field: "PORTZY_DATA",
		colors: ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"],
		blurRadius: 8,
		maxPixelIntensity: 20.0,
		minPixelIntensity: 0
	});
	wgHeatmapFeatureLayer.setRenderer(heatmapRenderer);
	wgHeatmapFeatureLayer.setVisibility(true);
	wgHeatmapFeatureLayer.refresh();
	curHeatmapFeatureLayer = wgHeatmapFeatureLayer;
	rltFlag = "duankouzhanyonglv";
	xfbjHeatmapFeatureLayer.setVisibility(false);
	yfbjHeatmapFeatureLayer.setVisibility(false);
	jzwHeatmapFeatureLayer.setVisibility(false);
});


$("input[name=ra]").click(function(){
	showRenderer();
});

function showRenderer() {
	switch($("input[name=ra]:checked").attr("id")){
		case "fengongsi":
			map.graphics.clear();
			if(curHeatmapFeatureLayer == wgHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == jzwHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == yfbjHeatmapFeatureLayer || 
				curHeatmapFeatureLayer == jzwHeatmapFeatureLayer1) {
				wgHeatmapFeatureLayer.setVisibility(false);
				yfbjHeatmapFeatureLayer.setVisibility(false);
				jzwHeatmapFeatureLayer.setVisibility(false);
				jzwHeatmapFeatureLayer1.setVisibility(false);
				curHeatmapFeatureLayer = xfbjHeatmapFeatureLayer;
				var field;
				var color = [];
				if(rltFlag == "kuandaishentoulv"){
					field = "KDST_DATA"
				}else{
					field = "PORTZY_DATA"
				}
				if(rltFlag == "kuandaishentoulv"){
					color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
				}else{
					color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
				}
				 heatmapRenderer = new esri.renderer.HeatmapRenderer({
					field: field,
					colors:color,
					blurRadius: 30,
					maxPixelIntensity: 30.0,
					minPixelIntensity: 0
				});
				xfbjHeatmapFeatureLayer.setRenderer(heatmapRenderer);
				xfbjHeatmapFeatureLayer.setVisibility(true);
				xfbjHeatmapFeatureLayer.refresh();
			}
			mapZoomChangeHandler.remove() ;
			break;
		case "yingfu":
			map.graphics.clear();
			if(curHeatmapFeatureLayer == wgHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == jzwHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == xfbjHeatmapFeatureLayer || 
				curHeatmapFeatureLayer == jzwHeatmapFeatureLayer1) {
				wgHeatmapFeatureLayer.setVisibility(false);
				xfbjHeatmapFeatureLayer.setVisibility(false);
				jzwHeatmapFeatureLayer.setVisibility(false);
				jzwHeatmapFeatureLayer1.setVisibility(false);
				curHeatmapFeatureLayer = yfbjHeatmapFeatureLayer;
				var field;
				if(rltFlag == "kuandaishentoulv"){
					field = "KDST_DATA"
				}else{
					field = "PORTZY_DATA"
				}
				if(rltFlag == "kuandaishentoulv"){
					color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
				}else{
					color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
				}
				 heatmapRenderer = new esri.renderer.HeatmapRenderer({
					field: field,
					colors:color,
					blurRadius: 30,
					maxPixelIntensity: 30.0,
					minPixelIntensity: 0
				});
				yfbjHeatmapFeatureLayer.setRenderer(heatmapRenderer);
				yfbjHeatmapFeatureLayer.setVisibility(true);
				yfbjHeatmapFeatureLayer.refresh();
			}
			mapZoomChangeHandler.remove() ;
			break;
		case "wangge":
			map.graphics.clear();
			if(curHeatmapFeatureLayer == yfbjHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == jzwHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == xfbjHeatmapFeatureLayer || 
				curHeatmapFeatureLayer == jzwHeatmapFeatureLayer1) {
				yfbjHeatmapFeatureLayer.setVisibility(false);
				xfbjHeatmapFeatureLayer.setVisibility(false);
				jzwHeatmapFeatureLayer.setVisibility(false);
				jzwHeatmapFeatureLayer1.setVisibility(false);
				curHeatmapFeatureLayer = wgHeatmapFeatureLayer;
				var field;
				if(rltFlag == "kuandaishentoulv"){
					field = "KDST_DATA"
				}else{
					field = "PORTZY_DATA"
				}
				if(rltFlag == "kuandaishentoulv"){
					color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
				}else{
					color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
				}
				 heatmapRenderer = new esri.renderer.HeatmapRenderer({
					field: field,
					colors:color,
					blurRadius: 8,
					maxPixelIntensity: 20.0,
					minPixelIntensity: 0
				});
				wgHeatmapFeatureLayer.setRenderer(heatmapRenderer);
				wgHeatmapFeatureLayer.setVisibility(true);
				wgHeatmapFeatureLayer.refresh();
			}
			mapZoomChangeHandler.remove() ;
			break;
		case "jianzhuwu":
			map.graphics.clear();
			if(curHeatmapFeatureLayer == yfbjHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == wgHeatmapFeatureLayer ||
				curHeatmapFeatureLayer == xfbjHeatmapFeatureLayer) {
				yfbjHeatmapFeatureLayer.setVisibility(false);
				xfbjHeatmapFeatureLayer.setVisibility(false);
				wgHeatmapFeatureLayer.setVisibility(false);
				
				mapZoomChangeHandler = map.on("zoom-end", changeHandler);
				
				var zoomLevel = map.getZoom() ;
				
				if(zoomLevel >= 7){
					curHeatmapFeatureLayer = jzwHeatmapFeatureLayer1;
					var field;
					if(rltFlag == "kuandaishentoulv"){
						field = "KDST_DATA"
					}else{
						field = "PORTZY_DATA"
					}
					if(rltFlag == "kuandaishentoulv"){
						color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
					}else{
						color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
					}
					 heatmapRenderer = new esri.renderer.HeatmapRenderer({
						field: field,
						colors:color,
						blurRadius: 6,
						maxPixelIntensity: 20.0,
						minPixelIntensity: 0
					});
					
					jzwHeatmapFeatureLayer1.setRenderer(heatmapRenderer);
					jzwHeatmapFeatureLayer1.setVisibility(true);
					jzwHeatmapFeatureLayer1.refresh();
					jzwHeatmapFeatureLayer.setVisibility(false);
				}
				else{
					curHeatmapFeatureLayer = jzwHeatmapFeatureLayer;
					var field;
					if(rltFlag == "kuandaishentoulv"){
						field = "KDST_DATA"
					}else{
						field = "PORTZY_DATA"
					}
					if(rltFlag == "kuandaishentoulv"){
						color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
					}else{
						color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
					}
					 heatmapRenderer = new esri.renderer.HeatmapRenderer({
						field: field,
						colors:color,
						blurRadius: 6,
						maxPixelIntensity: 20.0,
						minPixelIntensity: 0
					});
					
					jzwHeatmapFeatureLayer.setRenderer(heatmapRenderer);
					jzwHeatmapFeatureLayer.setVisibility(true);
					jzwHeatmapFeatureLayer.refresh();
					jzwHeatmapFeatureLayer1.setVisibility(false);
				}
			}
			break;
		default:
			mapZoomChangeHandler.remove() ;
			break;
	}
}

function changeHandler(evt){
	  var extent = evt.extent;
	  var zoomed = evt.level;

	  if(zoomed >= 7){
		  curHeatmapFeatureLayer = jzwHeatmapFeatureLayer1;
			var field;
			if(rltFlag == "kuandaishentoulv"){
				field = "KDST_DATA"
			}else{
				field = "PORTZY_DATA"
			}
		  if(rltFlag == "kuandaishentoulv"){
			  color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
		  }else{
			  color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
		  }
			 heatmapRenderer = new esri.renderer.HeatmapRenderer({
				field: field,
				colors:color,
				blurRadius: 6,
				maxPixelIntensity: 1.0,
				minPixelIntensity: 0
			});
			
		  jzwHeatmapFeatureLayer1.setRenderer(heatmapRenderer);
		  jzwHeatmapFeatureLayer1.setVisibility(true);
		  jzwHeatmapFeatureLayer1.refresh();
		  jzwHeatmapFeatureLayer.setVisibility(false);
	  }
	  else{
		  curHeatmapFeatureLayer = jzwHeatmapFeatureLayer;
			var field;
			if(rltFlag == "kuandaishentoulv"){
				field = "KDST_DATA"
			}else{
				field = "PORTZY_DATA"
			}
		  if(rltFlag == "kuandaishentoulv"){
			  color = ["rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255,69,0)","rgb(255,140,0)","rgb(173,255,47)","rgb(0, 255, 0)"];
		  }else{
			  color = ["rgba(255, 0, 0, 0)","rgb(0, 255, 0)","rgb(173,255,47)","rgb(255,140,0)","rgb(255,69,0)","rgb(255, 0, 0)"];
		  }
			 heatmapRenderer = new esri.renderer.HeatmapRenderer({
				field: field,
				colors:color,
				blurRadius: 6,
				maxPixelIntensity: 1.0,
				minPixelIntensity: 0
			});
			
		  jzwHeatmapFeatureLayer.setRenderer(heatmapRenderer);
		  jzwHeatmapFeatureLayer.setVisibility(true);
		  jzwHeatmapFeatureLayer.refresh();
		  jzwHeatmapFeatureLayer1.setVisibility(false);
	  }
}

$("#clearRenderer").on('click',function () {
	curHeatmapFeatureLayer.setVisibility(false) ;
	mapZoomChangeHandler.remove() ;
	map.graphics.clear();
});