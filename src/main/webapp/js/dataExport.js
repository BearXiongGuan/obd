dojo.require("esri.toolbars.draw");
dojo.require("esri.dijit.editing.Add");
dojo.require("esri.dijit.editing.Delete");
dojo.require("esri.dijit.editing.Update");
dojo.require("esri.graphic") ;
dojo.require("dojo.on");
dojo.require("dojo._base.event");

dojo.require("esri.tasks.query");

var currentQueryFCLayer ;

var clickEventHandler;
var requireDraw ;

var drawedGraphic ;

var currentLayerName ;

var requireGeometry ; 

var geomOperationType ;   //几何导出选中radio   1--点选    2--框选    3--多边形选择     4--圆选择
var attrOperationType ;   //属性导出选中radio   1--分公司   2--营服    3--网格     4--建筑物

var tabtitle ;

var queryServiceURL ;   //当前query需使用的服务的url
var mapServiceURL ;     //当前mapservice的服务URL


$("#mapDataExport").click(function(){
	if(typeof(requireDraw) != undefined && requireDraw != null){
        requireDraw.deactivate();
        requireDraw = null ;
    }

	$("#exportDlg-fgsRadio").attr("checked",false);
	$("#exportDlg-yinfuRadio").attr("checked",false);
	$("#exportDlg-wanggeRadio").attr("checked",false);
	$("#exportDlg-jzwRadio").attr("checked",false);

	requireGeometry = null ;
	
	requireDraw = new esri.toolbars.Draw(map, { showTooltips: true });
	dojo.on(requireDraw, "draw-complete", function (result){
		map.graphics.clear() ;
		drawedGraphic = new esri.Graphic(result.geometry, addDrawSymbol ,{}); 
		requireGeometry = result.geometry ;
		map.graphics.add(drawedGraphic);
	});
	geomOperationType = 0 ;
	attrOperationType = 0 ;
	
	tabtitle = "属性查询输出" ;
	
	$('#exportDlg-tabs').tabs({
		
	    border:false,
	    onSelect:function(title){
	    	$("#exportDlg-exportButton").hide();
	    	$("#exportDlg-layerCombobox").combobox("setValue","");
	    	tabtitle = title ;
	    	map.graphics.clear() ;
	    	if(title == '几何查询输出'){
	    		$('#exportDlg-selectDiv').hide() ;
	    		
	    		$("#exportDlg-fgsRadio").attr("checked",false);
				$("#exportDlg-yinfuRadio").attr("checked",false);
				$("#exportDlg-wanggeRadio").attr("checked",false);
				$("#exportDlg-jzwRadio").attr("checked",false);
				
				//$('#exportDlg-dataGridTable').datagrid('loadData', { total: 0, rows: [] });
				
	        	attrOperationType = 0 ;
	        	$('#exportDlg-dataGridTable').datagrid('loadData', { total: 0, rows: [] });
	    	}
	    	else{
	    		$("#exportDlg-pointRadio").attr("checked",false) ;
				$("#exportDlg-rectangleRadio").attr("checked",false) ;
				$("#exportDlg-polygonRadio").attr("checked",false);
				$("#exportDlg-circleRadio").attr("checked",false);
				
				geomOperationType = 0 ;
				
				if(typeof(currentQueryFCLayer) != undefined && currentQueryFCLayer != null){
					currentQueryFCLayer.setVisibility(false) ;
				}
	    	}
	    }
	});
	
	$('#exportDlg-dataGridTable').datagrid('loadData', { total: 0, rows: [] });
	
	$('#exportDlg-selectDiv').hide() ;
	
	loadDataExportOrgTree();
	
	$(".close").click(function(){
         if(typeof(requireDraw) != undefined && requireDraw != null){
             requireDraw.deactivate();
         }
         
         map.graphics.clear() ;
         
         if(typeof(currentQueryFCLayer) != undefined && currentQueryFCLayer != null){
				currentQueryFCLayer.setVisibility(false) ;
			}
	});
	$("#exportDlg-layerCombobox").combobox({
		onChange:function(newValue, oldValue){
			$("#exportDlg-pointRadio").attr("checked",false) ;
			$("#exportDlg-rectangleRadio").attr("checked",false) ;
			$("#exportDlg-polygonRadio").attr("checked",false);
			$("#exportDlg-circleRadio").attr("checked",false);
			
			map.graphics.clear() ;
			
			if(typeof(requireDraw) != undefined && requireDraw != null){
	            requireDraw.deactivate();
	        }
			
			if(typeof(currentQueryFCLayer) != undefined && currentQueryFCLayer != null){
				currentQueryFCLayer.setVisibility(false) ;
			}
			
			if(newValue == "wg"){
				currentQueryFCLayer = map.getLayer("wgFeatureLayer") ;
				var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,255,127,0.5]));
				var renderer = new esri.renderer.SimpleRenderer(symbol);
				currentQueryFCLayer.setRenderer(renderer) ;
				currentQueryFCLayer.setVisibility(true) ;
				
				mapServiceURL = wgLayer.url  ;
				queryServiceURL = wgLayer.url + "/0/query" ;
				
				currentLayerName = "wg" ;
			}
			else if(newValue == "xfbj"){
				currentQueryFCLayer = map.getLayer("xfbjFeatureLayer") ;
				var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,191,255,0.5]));
				var renderer = new esri.renderer.SimpleRenderer(symbol);
				currentQueryFCLayer.setRenderer(renderer) ;
				currentQueryFCLayer.setVisibility(true) ;
				
				mapServiceURL = xfbjLayer.url  ;
				queryServiceURL = xfbjLayer.url + "/0/query" ;
				
				currentLayerName = "xfbj" ;
			}
			else if(newValue == "yfbj"){
				currentQueryFCLayer = map.getLayer("yfbjFeatureLayer") ;
				var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,245,255,0.5]));
				var renderer = new esri.renderer.SimpleRenderer(symbol);
				currentQueryFCLayer.setRenderer(renderer) ;
				currentQueryFCLayer.setVisibility(true) ;
				
				mapServiceURL = yfbjLayer.url  ;
				queryServiceURL = yfbjLayer.url + "/0/query" ;
				
				currentLayerName = "yfbj" ;
			}else if(newValue == "jzw"){
				currentQueryFCLayer = map.getLayer("jzwFeatureLayer") ;
				var symbol = new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([0,245,255,0.5]));
				var renderer = new esri.renderer.SimpleRenderer(symbol);
				currentQueryFCLayer.setRenderer(renderer) ;
				currentQueryFCLayer.setVisibility(true) ;

				mapServiceURL = jzwLayer.url  ;
				queryServiceURL = jzwLayer.url + "/0/query" ;

				currentLayerName = "jzw" ;
			}
		}
	});
	
	$(":radio").click(function(){
		map.graphics.clear() ;
		$("#dataGridJzwTableDiv").hide();
		$("#dataGridTableDiv").show();
		if(typeof(requireDraw) != undefined && requireDraw != null){
            requireDraw.deactivate();
        }
		
		$('#exportDlg-dataGridTable').datagrid('loadData', { total: 0, rows: [] });
		
		var thisRadioValue = $(this).val();
		$.get("restful/permission/findByLoginName", {
			loginName : loginUser.loginName
		}, function(data) {
			var list = $.parseJSON(data.content);
			for(var i=0;i<list.length;i++){
				if(thisRadioValue == "fengongsiRadio"||thisRadioValue == "wanggeRadio"
					||thisRadioValue == "yingfuRadio"||thisRadioValue == "jzwRadio")
				if (list[i].priviCode == 'xfbj:dataExport') {
					if (thisRadioValue == "fengongsiRadio") {
						$("#exportDlg-exportButton").show();
						return;
					}else{
						$("#exportDlg-exportButton").hide();
					}
				}else if(list[i].priviCode == 'grid:dataExport'){
					if (thisRadioValue == "wanggeRadio") {
						$("#exportDlg-exportButton").show();
						return;
					}else{
						$("#exportDlg-exportButton").hide();
					}
				}else if(list[i].priviCode == 'yfbj:dataExport'){
					if (thisRadioValue == "yingfuRadio") {
						$("#exportDlg-exportButton").show();
						return;
					}else{
						$("#exportDlg-exportButton").hide();
					}
				}else if(list[i].priviCode == 'jzw:dataExport'){
					if (thisRadioValue == "jzwRadio") {
						$("#exportDlg-exportButton").show();
						return;
					}else{
						$("#exportDlg-exportButton").hide();
					}
				}
			}
		});
		if(thisRadioValue == "pointRadio"){
			$('#exportDlg-selectDiv').hide() ;
			
			$("#exportDlg-rectangleRadio").attr("checked",false) ;
			$("#exportDlg-polygonRadio").attr("checked",false);
			$("#exportDlg-circleRadio").attr("checked",false);
			
			if(typeof(currentQueryFCLayer) != undefined && currentQueryFCLayer != null){
				clickEventHandler = currentQueryFCLayer.on("click" , function(evt){
					var identifyTask = new esri.tasks.IdentifyTask(mapServiceURL);
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
				    params.geometry = evt.mapPoint;
				    params.mapExtent = map.extent;
				    
				    requireGeometry = evt.mapPoint ;
				    //执行空间查询
				    identifyTask.execute(params,function(fResults){
				    	map.graphics.clear();
				        
				        if (fResults.length > 0) {
				        	drawedGraphic = fResults[0].feature;
				            for (var i = 0; i < fResults.length; i++) {
				                var result = fResults[i];
				                //获得图形graphic
				                var graphic1 = result.feature;
				                //设置图形的符号
				                graphic1.setSymbol(addDrawSymbol);

				                map.graphics.add(graphic1);
				            }
				        }
				    });
				    
				});
			}
			geomOperationType = 1 ;
		}
		else if(thisRadioValue == "rectangleRadio"){
			$('#exportDlg-selectDiv').hide() ;
			//$('#exportDlg-fengongsiSelect').hide() ;
			//$('#exportDlg-yingfuSelect').hide() ;
			
			$("#exportDlg-pointRadio").attr("checked",false) ;
			$("#exportDlg-polygonRadio").attr("checked",false);
			$("#exportDlg-circleRadio").attr("checked",false);
			
			if(typeof(clickEventHandler) != undefined && clickEventHandler != null){
				clickEventHandler.remove();
			}
			
			requireDraw.activate(esri.toolbars.Draw.RECTANGLE);
			
			geomOperationType = 2 ;
		}
		else if(thisRadioValue == "polygonRadio"){
			$('#exportDlg-selectDiv').hide() ;
			
			$("#exportDlg-pointRadio").attr("checked",false) ;
			$("#exportDlg-rectangleRadio").attr("checked",false) ;
			$("#exportDlg-circleRadio").attr("checked",false);
			
			if(typeof(clickEventHandler) != undefined && clickEventHandler != null){
				clickEventHandler.remove();
			}
			
			requireDraw.activate(esri.toolbars.Draw.POLYGON);
			
			geomOperationType = 3 ;
		}
		else if(thisRadioValue == "circleRadio"){
			$('#exportDlg-selectDiv').hide() ;
			
			$("#exportDlg-pointRadio").attr("checked",false) ;
			$("#exportDlg-rectangleRadio").attr("checked",false) ;
			$("#exportDlg-polygonRadio").attr("checked",false);
			
			if(typeof(clickEventHandler) != undefined && clickEventHandler != null){
				clickEventHandler.remove();
			}
			
			requireDraw.activate(esri.toolbars.Draw.CIRCLE);
			
			geomOperationType = 4 ;
		}
		else if(thisRadioValue == "fengongsiRadio"){
			$('#exportDlg-selectDiv').hide() ;
			
			$("#exportDlg-yinfuRadio").attr("checked",false) ;
			$("#exportDlg-wanggeRadio").attr("checked",false) ;
			$("#exportDlg-jzwRadio").attr("checked",false) ;
			
			var xfbjLayerURL = xfbjLayer.url ;
			var layerURL = xfbjLayerURL + "/0/query" ;
			queryServiceURL = layerURL ;
			var sqlWhere = {
				where:"objectid>=0",
				returnGeometry:false,
				outFields:"*",
				f:"pjson"
			} ;
			
			var strJson = JSON.stringify( sqlWhere );
			$.ajax({
				type:'POST',
				url:layerURL,
				data:sqlWhere,
				async:true,
				success:function(response){
					if(response.length > 0){
						var resJsonObj = JSON.parse(response) ;
						var features = resJsonObj.features ;
						
						var strRes = '' ;
						var totalnum = features.length ;
						for(var i = 0 ; i < features.length ; i++){
							var attr = features[i] ;
							var attrname = attr.attributes ;
							var countyname = attrname.COUNTY ;
							var strJson = '{"check":false,"facName":"' + countyname + '"}' ;
							if(i == 0){
								strRes += strJson ;
							}
							else{
								strRes += "," + strJson ;
							}
						}
						var strRes1 = '{"total":' + totalnum +',"rows":[' + strRes + ']}' ;
						var jsonObj = jQuery.parseJSON(strRes1) ;
						$('#exportDlg-dataGridTable').datagrid('loadData', jsonObj);
					}
				}
			}) ;
			
        	attrOperationType = 1 ;
		}
		else if(thisRadioValue == "yingfuRadio"){
			$('#exportDlg-selectDiv').hide() ;
				
			$("#exportDlg-fgsRadio").attr("checked",false) ;
			$("#exportDlg-wanggeRadio").attr("checked",false) ;
			$("#exportDlg-jzwRadio").attr("checked",false) ;
			
			var yfbjLayerURL = yfbjLayer.url ;
			var layerURL = yfbjLayerURL + "/0/query" ;
			queryServiceURL = layerURL ;
			var sqlWhere = {
				where:"objectid>=0",
				returnGeometry:false,
				outFields:"*",
				f:"pjson"
			} ;
			
			var strJson = JSON.stringify( sqlWhere );
			$.ajax({
				type:'POST',
				url:layerURL,
				data:sqlWhere,
				async:true,
				success:function(response){
					if(response.length > 0){
						var resJsonObj = JSON.parse(response) ;
						var features = resJsonObj.features ;
						
						var strRes = '' ;
						var totalnum = features.length ;
						for(var i = 0 ; i < features.length ; i++){
							var attr = features[i] ;
							var attrname = attr.attributes ;
							var countyname = attrname.VILLAGE ;
							var strJson = '{"check":false,"facName":"' + countyname + '"}' ;
							if(i == 0){
								strRes += strJson ;
							}
							else{
								strRes += "," + strJson ;
							}
						}
						var strRes1 = '{"total":' + totalnum +',"rows":[' + strRes + ']}' ;
						var jsonObj = jQuery.parseJSON(strRes1) ;
						$('#exportDlg-dataGridTable').datagrid('loadData', jsonObj);
					}
				}
			}) ;
			
			attrOperationType = 2 ;
		}
		else if(thisRadioValue == "wanggeRadio"){
			$('#exportDlg-selectDiv').show() ;
			$("#exportDlg-fgsRadio").attr("checked",false) ;
			$("#exportDlg-yinfuRadio").attr("checked",false) ;
			$("#exportDlg-jzwRadio").attr("checked",false) ;
			attrOperationType = 3 ;
			var tree=$("#exportDlg-zzjgCombotree").combotree('tree').tree('getSelected');
			if(tree==null){
				return;
			}
			queryServiceURL = wgLayer.url  + "/0/query" ;
			var pid= tree.orgPid;
			var sqlWhere = {} ;
			if(pid==0){
				sqlWhere.city= $("#exportDlg-zzjgCombotree").combotree("getText");
			}else if(pid==100000){
				sqlWhere.county=$("#exportDlg-zzjgCombotree").combotree("getText");
			}else{
				sqlWhere.village=$("#exportDlg-zzjgCombotree").combotree("getText");
			}
			var strJson = JSON.stringify( sqlWhere );
			$.ajax({
				type:'POST',
				url:"restful/wg/findWgByOrgName",
				contentType:"application/json",
				data:strJson,
				dataType:'json',
				async:true,
				success:function(data){
					var content = data.content;
					totalnum=content.length;
					var strRes1 = '{"total":' + totalnum +',"rows":'+content+'}' ;
					var jsonObj = jQuery.parseJSON(strRes1) ;
					$('#exportDlg-dataGridTable').datagrid('loadData', jsonObj);
				}
			});
		}else if(thisRadioValue == "jzwRadio"){
			$("#dataGridJzwTableDiv").show();
			$("#dataGridTableDiv").hide();
			queryServiceURL = jzwLayer.url  + "/0/query" ;
			$("#exportDlg-dataGridJzwTable").datagrid({
				width : 576,
				height : 270,
				rownumbers : true,
				fitColumns : false,
				pagination : true,
				pageSize : 700,
				pageNumber : 1,
				pageList:[700],
				columns : [ [ {
					field : 'ck',
					width:30,
					checkbox : true
				}, {
					field : 'facName',
					title : '名称',
					width:500
				} ] ],
				onLoadSuccess : function(data) {
					var pager = $("#exportDlg-dataGridJzwTable")
							.datagrid('getPager');
					var tree=$("#exportDlg-zzjgCombotree").combotree('tree').tree('getSelected');
					if(tree==null){
						return;
					}
					var pid= tree.orgPid;
					var sqlWhere = {} ;
					if(pid==0){
						sqlWhere.city= $("#exportDlg-zzjgCombotree").combotree("getText");
					}else if(pid==100000){
						sqlWhere.county=$("#exportDlg-zzjgCombotree").combotree("getText");
					}else{
						sqlWhere.village=$("#exportDlg-zzjgCombotree").combotree("getText");
					}
					$(pager).pagination(
									{
										onSelectPage : function(
												pageNumber,
												pageSize) {
											loadJzwDataGridData(
													pageNumber,
													pageSize,
													sqlWhere);
										},
										onChangePageSize : function(
												pageSize) {
											$(pager)
													.pagination(
															"options").pageNumber = 1;
										},
										onRefresh : function(pageNumber,pageSize) {
											$("#exportDlg-dataGridJzwTable").datagrid("clearSelections");
											loadJzwDataGridData(pageNumber,pageSize,sqlWhere);
										}
									});
				}
			});
			$('#exportDlg-selectDiv').show() ;
			$("#exportDlg-fgsRadio").attr("checked",false) ;
			$("#exportDlg-yinfuRadio").attr("checked",false) ;
			$("#exportDlg-wanggeRadio").attr("checked",false) ;
			attrOperationType = 4 ;
			var tree=$("#exportDlg-zzjgCombotree").combotree('tree').tree('getSelected');
			if(tree==null){
				return;
			}
			var pid= tree.orgPid;
			var sqlWhere = {} ;
			if(pid==0){
				sqlWhere.city= $("#exportDlg-zzjgCombotree").combotree("getText");
			}else if(pid==100000){
				sqlWhere.county=$("#exportDlg-zzjgCombotree").combotree("getText");
			}else{
				sqlWhere.village=$("#exportDlg-zzjgCombotree").combotree("getText");
			}
			loadJzwDataGridData(1,700,sqlWhere);
		}
	});
	
	$("#exportDlg-exportButton").off().on('click',function(){
		
		if(tabtitle == "属性查询输出"){
			currentLayerName = null ;
			var rows =[];
			if(attrOperationType==4){
				rows = $('#exportDlg-dataGridJzwTable').datagrid('getChecked')//获取当前页的数据行
			}else{
				rows = $('#exportDlg-dataGridTable').datagrid('getChecked')//获取当前页的数据行
			}
			var rowsNum = rows.length ;
			if(attrOperationType == 0){
				$.messager.alert("提示信息","首先选择维度!",'info');
				return ;
			}
			if(rowsNum <= 0){
				$.messager.alert("提示信息","请选择需输出的数据!",'info');
				return ;
			}
			
			var strPost = "" ;
			var checkedRowsArr = new Array();
		    for (var i = 0; i < rowsNum; i++) {
				if(attrOperationType == 3 || attrOperationType == 4) {
					var j2 = rows[i]['facId'];
				}else{
					var j2 = rows[i]['facName'];
				}
		        if(i == 0){
		        	strPost += j2 ;
		        }
		        else{
		        	strPost += "," + j2 ;
		        }
		    }
		    
		    var dataObj = {
				tabtype:1,
				serviceurl:queryServiceURL,
				optype:attrOperationType,
				featuresdata:strPost
			};
		    
		    DownLoad({
		        url: "restful/expshp/exportAttrShape",
		        data:dataObj
		    });
		    return;
		}
		else{
			if(typeof(requireGeometry) == undefined || requireGeometry == null){
				$.messager.alert("提示信息","首先绘图!",'info');
				return ;
			}

			var identifyTask = new esri.tasks.IdentifyTask(mapServiceURL);
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
			params.geometry = requireGeometry;
			params.mapExtent = map.extent;

			//执行空间查询
			identifyTask.execute(params,function(fResults){
				map.graphics.clear();

				if (fResults.length > 0) {
					if(fResults.length == 1000) {
						$.messager.alert("提示信息", "款选建筑物不能大于1000个!", 'info');
						return;
					}else{
							var jsonObj = requireGeometry.toJson() ;
							var jsonStr = JSON.stringify(jsonObj);

							var replaceStr = jsonStr.replace(/\"/g , '@') ;
							var dataObj = {
								tabtype:2,
								serviceurl:queryServiceURL,
								optype:geomOperationType,
								featuresdata:replaceStr
							};

							DownLoad({
								url: "restful/expshp/exportGeomShape",
								data:dataObj
							});

						map.graphics.clear() ;
						drawedGraphic = null ;
						requireGeometry = null ;

						if(typeof(currentQueryFCLayer) != undefined && currentQueryFCLayer != null){
							currentQueryFCLayer.setVisibility(false) ;
						}
					}
				}else {
				$.messager.alert("提示信息","请最少选中一个建筑物!",'info');
				return ;
				}
			});
		}

	if(typeof(drawedGraphic) == undefined || drawedGraphic == null) {
        $.messager.alert("提示信息","首先绘图!",'info');
        return ;
	}
		

		
	});
	// 加载组织机构树
	function loadDataExportOrgTree() {
		$('#exportDlg-zzjgCombotree').combotree(
				{
					multiple : false,
					cascadeCheck : false,
					lines : true,
					onChange:function(newValue, oldValue){
						var obj  = document.getElementById("exportDlg-wanggeRadio");
						if(obj.checked) {
							queryServiceURL = wgLayer.url  + "/0/query" ;
							var wgLayerURL = wgLayer.url ;
							var layerURL = wgLayerURL + "/0/query" ;
							var tree=$(this).combotree('tree').tree('getSelected');
							var pid= tree.orgPid;
							var sqlWhere = {} ;
							if(pid==0){
								sqlWhere.city= $(this).combotree("getText");
							}else if(pid==100000){
								sqlWhere.county=$(this).combotree("getText");
							}else{
								sqlWhere.village=$(this).combotree("getText");
							}



							var strJson = JSON.stringify( sqlWhere );
							$.ajax({
								type:'POST',
								url:"restful/wg/findWgByOrgName",
								contentType:"application/json",
								data:strJson,
								dataType:'json',
								async:true,
								success:function(data){
									var content = data.content;
									totalnum=content.length;
									var strRes1 = '{"total":' + totalnum +',"rows":'+content+'}' ;
									var jsonObj = jQuery.parseJSON(strRes1) ;
									$('#exportDlg-dataGridTable').datagrid('loadData', jsonObj);
								}
							});
						}else{
							queryServiceURL = jzwLayer.url  + "/0/query" ;
							var jzwLayerURL = jzwLayer.url ;
							var layerURL = jzwLayerURL + "/0/query" ;
							var tree=$(this).combotree('tree').tree('getSelected');
							var pid= tree.orgPid;
							var sqlWhere = {} ;
							if(pid==0){
								sqlWhere.city= $(this).combotree("getText");
							}else if(pid==100000){
								sqlWhere.county=$(this).combotree("getText");
							}else{
								sqlWhere.village=$(this).combotree("getText");
							}
							loadJzwDataGridData(1,700,sqlWhere);
						}
					}
				});

		$.get("restful/organization/findOrgByUser", {
			userId : kdstl_chart_json.userId
		}, function(data) {
			var list = $.parseJSON(data.content);
			// list 转成树形json
			function listToTree(list, orgPid) {
				var ret = [];// 一个存放结果的临时数组
				for ( var i in list) {
					if (list[i].orgPid == orgPid) {// 如果当前项的父id等于要查找的父id，进行递归
						list[i].children = listToTree(list, list[i].id);
						ret.push(list[i]);// 把当前项保存到临时数组中
					}
				}
				return ret;// 递归结束后返回结果
			}
			var tree = listToTree(list, list[0].orgPid);// 调用函数，传入要转换的list数组，和树中顶级元素的pid
			$('#exportDlg-zzjgCombotree').combotree("loadData", tree);
		});
	}
	
	$("#exportDlg-layerCombobox").combobox({
		onSelect : function(item) {
			var loginUser = JSON.parse($.cookie('loginUser'));
			$.get("restful/permission/findByLoginName", {
				loginName : loginUser.loginName
			}, function(data) {
				var list = $.parseJSON(data.content);
				for(var i=0;i<list.length;i++){
					if (list[i].priviCode == 'xfbj:shapeExport') {
						if (item.label == "xfbj") {
							$("#exportDlg-exportButton").show();
							return;
						}else{
							$("#exportDlg-exportButton").hide();
						}
					}else if(list[i].priviCode == 'yfbj:shapeExport'){
						if (item.label == "yfbj") {
							$("#exportDlg-exportButton").show();
							return;
						}else{
							$("#exportDlg-exportButton").hide();
						}
					}else if(list[i].priviCode == 'grid:shapeExport'){
						if (item.label == "wg") {
							$("#exportDlg-exportButton").show();
							return;
						}else{
							$("#exportDlg-exportButton").hide();
						}
					}else if(list[i].priviCode == 'jzw:shapeExport'){
						if (item.label == "jzw") {
							$("#exportDlg-exportButton").show();
							return;
						}else{
							$("#exportDlg-exportButton").hide();
						}
					}
				}
			});
		}
	});
});

//加载远程数据
function loadJzwDataGridData(pageNumber, pageSize, queryParams) {
	var jsonObj = {};
	jsonObj.pageSize = pageSize;
	jsonObj.pageNumber = pageNumber;
	jsonObj.objCondition = queryParams;
	var strJson = JSON.stringify( jsonObj );
	$.ajax({
		type:'POST',
		url:"restful/building/findBuildingByVillage",
		contentType:"application/json",
		data:strJson,
		dataType:'json',
		async:true,
		success:function(data){
			var content = JSON.parse(data.content);
			totalnum=content.total;
			var strRes1 = '{"total":' + totalnum +',"rows":'+JSON.stringify(content.rows)+'}' ;
			var jsonObj = jQuery.parseJSON(strRes1) ;
			$('#exportDlg-dataGridJzwTable').datagrid('loadData', jsonObj);
		}
	});
}
