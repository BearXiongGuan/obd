var loginUser = JSON.parse($.cookie('loginUser'));
var fghbfx_chart_json = {};
fghbfx_chart_json.userId = loginUser.id;;
fghbfx_chart_json.type = 2;   //统计维度 1-市公司 2-分公司  3-营服  4-网格 5-建筑物
fghbfx_chart_json.fgsId = 0;
var defParam;

var fghbfx_datagrid_json = {};
fghbfx_datagrid_json.objType = 4;
fghbfx_datagrid_json.objName = "";
fghbfx_datagrid_json.orgId = -1;

$("#qyzyfg4_chart")
		.off()
		.on(
				'click',
				function() {
					var chart_qyzyfg = echarts.init(document
							.getElementById("echarts-fghbfx"));
                    var chartsData = loadChartData();
                    defParam = chartsData.defParam;
					option = {
						title : {
							x : 'left',
    							text : '市公司区域',
						},
						color : [ '#3398DB' ],
						tooltip : {
							trigger : 'axis',
							axisPointer : { // 坐标轴指示器，坐标轴触发有效
								type : 'line' // 默认为直线，可选为：'line' | 'shadow'
							},
							color : function(params) {
								// build a color map as your need.
								var colorList = [ '#C1232B', '#B5C334',
										'#FCCE10', '#E87C25', '#27727B',
										'#FE8463', '#9BCA63', '#FAD860',
										'#F3A43B', '#60C0DD', '#D7504B',
										'#C6E579', '#F4E001', '#F0805A',
										'#26C0C0' ];
								return colorList[params.dataIndex];
							},
							formatter : function(params) {
								var result = '';
								params.forEach(function(item) {
											result += item.seriesName
													+ '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
													+ item.color + '"></span>'
													+ item.name + "："
													+ item.value;
										});
								return result;
							}
						},
						toolbox : {
							show : true,
							feature : {
								restore : {
									show : true
								},
								saveAsImage : {
									show : true
								}
							}
						},
						calculable : true,
						grid : {
							left : '5%',
							right : '4%',
							containLabel : true
						},
						xAxis : [ {
							type : 'category',
							axisTick : {
								alignWithLabel : true
							},
							// 设置字体倾斜
							axisLabel : {
								interval : 0,
								rotate : 40,// 倾斜度 -90 至 90 默认为0
								margin:2,
								textStyle : {
									fontSize:12,
									fontWeight : "bolder",
									color : "#000000"
								}
							},
						} ],
                        yAxis : [ {
                            type : 'value',
                            min: 0,
                            max: 4,
                            axisLabel : {
                                show : true,
                                interval : 'auto',
                            }
                        } ],
                        series : [ {
                            name : 'OBD覆盖厚薄分析',
                            type : 'line',
                            barWidth : '40%',
							// data:[defParam],
                            markLine:{
                                itemStyle:{
                                    normal:{lineStyle:{type:'dashed',color:'#000'},label:{show:true,position:'left'}}
                                },
                                data:[
                                    {name:'标线1起点',value:defParam,xAxis:-1,yAxis:defParam},
                                    {name:'标线1终点',xAxis:570,yAxis:defParam}
                                ],
                            },
                            smooth : true,
                            itemStyle : {
                                normal : {
                                    color : function(params) {
                                        // build a color map as your need.
                                        var colorList = [ '#C1232B', '#B5C334',
                                            '#FCCE10', '#E87C25',
                                            '#27727B', '#FE8463',
                                            '#9BCA63', '#FAD860',
                                            '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579',
                                            '#F4E001', '#F0805A', '#26C0C0' ];
                                        return colorList[params.dataIndex];
                                    },
                                    label : {
                                        show : true,
                                        position : 'top',
                                    },
                                }
                            }
                        } ],
					};

					setTitleAndData1();

					$(".lineType").off().on('click', function() {
                        if (fghbfx_chart_json.type > 3) {
                            return;
                        }
						setTitleAndData1();

						for ( var i in option.series) {
							option.series[i].type = "line";
						}
						option.tooltip.axisPointer.type = "line";

						chart_qyzyfg.setOption(option);
					});
					$(".pillarType").off().on('click', function() {
                        if (fghbfx_chart_json.type > 3) {
                            return;
                        }
						setTitleAndData1();

						for ( var i in option.series) {
							option.series[i].type = "bar";
						}
						option.tooltip.axisPointer.type = "shadow";

						chart_qyzyfg.setOption(option);
					});
					
					$(".mapType").off().on('click' , function(){
                        if (fghbfx_chart_json.type > 3) {
                            return;
                        }
						if(typeof(thickshinrResult) == undefined || thickshinrResult == null){
							return ;
						}
						var isEmpty = true ;
						for(var key in thickshinrResult){
							isEmpty = false ;
							break ;
						}
						if(isEmpty){
							return ;
						}
						
						//隐藏弹窗口的放大按钮
					    var maxdiv = $("div.titleButton.maximize") ;
					    maxdiv.hide() ;
						
						var strTitles = thickshinrResult.titles ;
						var strValues = thickshinrResult.values ;
						var defParam = thickshinrResult.defParam ;
						
						showThematicMap(strTitles , strValues ,  defParam , fghbfx_chart_json.type) ;
						//$("div.outerPointer.left").show() ;
						//$("div.esriPopupWrapper").show();
					});
					
					function showThematicMap(strtitles , strvalues , defParam , opType){
						//1--市公司   2--分公司     3--营销服务中心
						if(opType == 1){
							
						}
						else if(opType == 2){   //分公司
							var xfbjServiceURL = xfbjLayer.url ;
							var queryURL = xfbjServiceURL + "/0/query" ;
							
							var keyValues = { } ;
							var valuesArr = strvalues.split(',') ;
							var tilesArr = strtitles.split(',') ;
							var strWhere = "" ;
							for(var i = 0 ; i < tilesArr.length ; i++){
								var tileTemp = tilesArr[i] ;
								var valueTemp = valuesArr[i] ;
								keyValues[tileTemp] = valueTemp ;
								if(i == 0){
									strWhere = "COUNTY='" + tileTemp + "'" ; 
								}
								else{
									strWhere += " OR COUNTY='" + tileTemp + "'" ; 
								}
							}
							
							var postObj = {
								where:strWhere,
								returnGeometry:true,
								outFields:"*",
								f:"pjson"
							} ;
							
							$.ajax({
								type:'POST',
								url:queryURL,
								data:postObj,
								async:true,
								success:function(response){
									if(response.length >= 0){
										var resJsonObj = JSON.parse(response) ;
										var features = resJsonObj.features ;
										var fieldsArr = resJsonObj.fields ;
										var newFeautresArr = new Array() ;
										for(var i = 0 ; i < features.length ; i++){
											var featureTemp = features[i] ;
											var attribute = featureTemp.attributes ;
											
											var countyname = attribute.COUNTY ;
											var value = keyValues[countyname] ;
											attribute.value = parseFloat(value) ;
											attribute.valuebai = value ;
											attribute.valuecha = attribute.value - defParam;
											
											var geometry = featureTemp.geometry ;
											var featureNew = new esri.Graphic() ;
											featureNew.setGeometry(geometry) ;
											featureNew.setAttributes(attribute) ;
											
											newFeautresArr.push(featureNew) ;
										}
										
										fieldsArr.push({
											"name": "value",
										    "type": "esriFieldTypeDouble",
										    "alias": "value"});
										fieldsArr.push({
											"name": "valuebai",
										    "type": "esriFieldTypeString",
										    "alias": "valuebai",
										    "length": 50});
										fieldsArr.push({
											"name": "valuecha",
										    "type": "esriFieldTypeDouble",
										    "alias": "valuecha"});
										
										var layerDefinition = {
												"objectIdField": "OBJECTID",
												"geometryType": "esriGeometryPolygon",
												"fields":fieldsArr
											} ;
										
										var featureCollection = {
									          "layerDefinition": layerDefinition,
									          "featureSet": {
									            "features": newFeautresArr,
									            "geometryType": "esriGeometryPolygon"
									          }
										 };
										
										var featureLayer1 = map.getLayer("yfzxfghbfxLayer") ;
										if(typeof(featureLayer1) != undefined && featureLayer1 != null){
											map.removeLayer(featureLayer1) ;
											featureLayer1 = null ;
										}
										
										var featureLayer = map.getLayer("fgsfghbfxLayer") ;
										if(typeof(featureLayer) != undefined && featureLayer != null){
											map.removeLayer(featureLayer) ;
											featureLayer = null ;
										}
										
										var infostr = "区&nbsp;&nbsp;&nbsp;域:&nbsp;${COUNTY}</br>" + 
								          			"覆盖率:&nbsp;${valuebai}";
										featureLayer = new esri.layers.FeatureLayer(featureCollection,{
											id:'fgsfghbfxLayer',
											infoTemplate: new esri.InfoTemplate("OBD覆盖厚薄度" ,infostr),
										}) ;
										map.addLayer(featureLayer);
										
										var defaultFillSymbol = new esri.symbol.SimpleFillSymbol() ;
										var defaultSymbol = defaultFillSymbol.setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
										defaultSymbol.outline.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);
										
								        var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol,"valuecha");
								        
								        var colorList = [ '#C1232B', '#B5C334',
															'#FCCE10', '#E87C25', '#27727B',
															'#FE8463', '#9BCA63', '#FAD860',
															'#F3A43B', '#60C0DD', '#D7504B',
															'#C6E579', '#F4E001', '#F0805A',
															'#26C0C0' ];
								        
								        var valueNum = valuesArr.length ;
								        var rMax = 255 ;
								        var gMax = 255 ;
								        var bMax = 255 ;
								        var rMin = 0 ;
								        var gMin = 0 ;
								        var bMin = 0 ;
								        for(var i = 0 ; i < valueNum ; i++){
								        	var valuecha1 = parseFloat(valuesArr[i]) - defParam ;
								        	
								        	var color1 = esri.Color.fromHex(colorList[i]) ;
								        	
								        	var r = color1.r ;
								        	var g = color1.g ;
								        	var b = color1.b ;
								        	/*var r = rMax + (rMin-rMax)*i/valueNum ;
								        	var g = rMin ;
								        	var b = bMin + (bMax - bMin)*i/valueNum ;*/
								        	
								        	renderer.addValue(valuecha1 , new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([r, g, b, 0.5])));
								        }
								        
							            featureLayer.setRenderer(renderer);
							            
							            var statesColor = new esri.Color([255 , 0 , 0 , 1.0]);
							            var labelSymbol = new esri.symbol.TextSymbol().setColor(statesColor);
							            labelSymbol.font.setSize("14pt");
							            labelSymbol.font.setFamily("arial");
							            var jsonLabel = {
						                    "labelExpressionInfo": {"value": "{valuebai}"}
						                  };
							            var labelClass = new esri.layers.LabelClass(jsonLabel);
							            labelClass.symbol = labelSymbol;
							            featureLayer.setLabelingInfo([ labelClass ]);
									}
									
								},
								
							}) ;
							
						}
						else if(opType == 3){
							   //营服中心
							var yfbjServiceURL = yfbjLayer.url ;
							var queryURL = yfbjServiceURL + "/0/query" ;
							
							var keyValues = { } ;
							var valuesArr = strvalues.split(',') ;
							var tilesArr = strtitles.split(',') ;
							var strWhere = "" ;
							for(var i = 0 ; i < tilesArr.length ; i++){
								var tileTemp = tilesArr[i] ;
								var valueTemp = valuesArr[i] ;
								keyValues[tileTemp] = valueTemp ;
								if(i == 0){
									strWhere = "VILLAGE='" + tileTemp + "'" ; 
								}
								else{
									strWhere += " OR VILLAGE='" + tileTemp + "'" ; 
								}
							}
							
							var postObj = {
								where:strWhere,
								returnGeometry:true,
								outFields:"*",
								f:"pjson"
							} ;
							
							$.ajax({
								type:'POST',
								url:queryURL,
								data:postObj,
								async:true,
								success:function(response){
									if(response.length >= 0){
										var resJsonObj = JSON.parse(response) ;
										var fieldsArr = resJsonObj.fields ;
										var features = resJsonObj.features ;
										var newFeautresArr = new Array() ;
										for(var i = 0 ; i < features.length ; i++){
											var featureTemp = features[i] ;
											var attribute = featureTemp.attributes ;
											
											var countyname = attribute.VILLAGE ;
											var value = keyValues[countyname] ;
											attribute.value = parseFloat(value) ;
											attribute.valuebai = value ;
											attribute.valuecha = attribute.value - defParam ;
											
											var geometry = featureTemp.geometry ;
											var featureNew = new esri.Graphic() ;
											featureNew.setGeometry(geometry) ;
											featureNew.setAttributes(attribute) ;
											
											newFeautresArr.push(featureNew) ;
										}
										
										fieldsArr.push({
										    "name": "value",
										    "type": "esriFieldTypeDouble",
										    "alias": "value"
										  }) ;
										fieldsArr.push(
										  {
										    "name": "valuebai",
										    "type": "esriFieldTypeString",
										    "alias": "valuebai",
										    "length": 50
										  }) ;
										fieldsArr.push({
											"name": "valuecha",
										    "type": "esriFieldTypeDouble",
										    "alias": "valuecha"});
										
										var layerDefinition = {
												"objectIdField": "OBJECTID",
												"geometryType": "esriGeometryPolygon",
												"fields": fieldsArr
										} ;
										
										var featureCollection = {
									          "layerDefinition": layerDefinition,
									          "featureSet": {
									            "features": newFeautresArr,
									            "geometryType": "esriGeometryPolygon"
									          }
										 };
										
										var featureLayer1 = map.getLayer("fgsfghbfxLayer") ;
										if(typeof(featureLayer1) != undefined && featureLayer1 != null){
											map.removeLayer(featureLayer1) ;
											featureLayer1 = null ;
										}
										
										var featureLayer = map.getLayer("yfzxfghbfxLayer") ;
										if(typeof(featureLayer) != undefined && featureLayer != null){
											map.removeLayer(featureLayer) ;
											featureLayer = null ;
										}
										
										var infostr = "区&nbsp;&nbsp;&nbsp;域:&nbsp;${VILLAGE}</br>" + 
					          			  				"覆盖率:&nbsp;${valuebai}";
										featureLayer = new esri.layers.FeatureLayer(featureCollection,{
											id:'yfzxfghbfxLayer',
											infoTemplate: new esri.InfoTemplate("OBD覆盖厚薄度" ,infostr),
										}) ;
										map.addLayer(featureLayer);
										
										var defaultFillSymbol = new esri.symbol.SimpleFillSymbol() ;
										var defaultSymbol = defaultFillSymbol.setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
										defaultSymbol.outline.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);
										
								        var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol,"valuecha");
								        
								        var colorList = [ '#C1232B', '#B5C334',
															'#FCCE10', '#E87C25', '#27727B',
															'#FE8463', '#9BCA63', '#FAD860',
															'#F3A43B', '#60C0DD', '#D7504B',
															'#C6E579', '#F4E001', '#F0805A',
															'#26C0C0' ];
								        
								        var valueNum = valuesArr.length ;
								        var rMax = 255 ;
								        var gMax = 255 ;
								        var bMax = 255 ;
								        var rMin = 0 ;
								        var gMin = 0 ;
								        var bMin = 0 ;
								        for(var i = 0 ; i < valueNum ; i++){
								        	var valuecha1 = parseFloat(valuesArr[i]) - defParam ;
								        	
								        	var color1 = esri.Color.fromHex(colorList[i]) ;
								        	
								        	var r = color1.r ;
								        	var g = color1.g ;
								        	var b = color1.b ;
								        	/*var r = rMax + (rMin-rMax)*i/valueNum ;
								        	var g = rMin ;
								        	var b = bMin + (bMax - bMin)*i/valueNum ;*/
								        	
								        	renderer.addValue(valuecha1 , new esri.symbol.SimpleFillSymbol().setColor(new esri.Color([r, g, b, 0.5])));
								        }
								        
							            featureLayer.setRenderer(renderer);
							            
							            var statesColor = new esri.Color([255 , 0 , 0 , 1.0]);
							            var labelSymbol = new esri.symbol.TextSymbol().setColor(statesColor);
							            labelSymbol.font.setSize("14pt");
							            labelSymbol.font.setFamily("arial");
							            var jsonLabel = {
						                    "labelExpressionInfo": {"value": "{valuebai}"}
						                  };
							            var labelClass = new esri.layers.LabelClass(jsonLabel);
							            labelClass.symbol = labelSymbol;
							            featureLayer.setLabelingInfo([ labelClass ]);

									}
									
								},
								
							}) ;
							
						}
					}

                    function loadChartData() {
                        thickshinrResult = null ;
                        $.ajax({
                            type : "POST",
                            url : "restful/chartReport/getChartThickThinReport",
                            contentType : "application/json",
                            dataType : "json",
                            data : JSON.stringify(fghbfx_chart_json),
                            async : false,
                            success : function(data) {
                                if (data.status) {
                                    var contentStr = data.content;
                                    thickshinrResult = contentStr;
                                }
                            },
                            error : function(err) {
                            	thickshinrResult = {};
                            }
                        });
                        return thickshinrResult;
                    }

					function setTitleAndData1() {
                        if (fghbfx_chart_json.type > 3) {
                            return;
                        }
						// 获取数据
						var chartData = loadChartData();
						// 设施分类
						option.xAxis[0].data = chartData.titles.split(",");
						// 设置值
						var values = chartData.values;
						var datas = values.split(";");
						for ( var i in option.series) {
							option.series[i].data = datas[i].split(",");
						}

						chart_qyzyfg.setOption(option);
					}

					$(":input[name='fghbfx-area']").off().on(
							'click',
							function() {
								fghbfx_chart_json.type = $(this).val();
                                $("#echarts-fghbfx").show();
                                $("#div-fghbfx").hide();
                                $("#conditIcon-fghbfx").find('a').each(
                                    function(i, e) {
                                        if (i < 3) {
                                            $(this).css({
                                                "background" : "#0793eb",
                                                "cursor" : "pointer"
                                            });
                                        }
                                    });

								if(fghbfx_chart_json.type ==1 ){
                                    option.title.text = "市公司区域";
                                    $("#yxfwzx_li1").css("display", "none");
                                    $("#div-fghbfx").hide();
                                    $("#datagrid-fghbfx").hide();
                                    setTitleAndData1();
                                    $("#conditIcon-fghbfx").find('a').each(
                                            function(i, e) {
                                                if (i < 3) {
                                                    $(this).css({
                                                        "background" : "#ddd",
                                                        "cursor" : "default"
                                                    });
                                                }
                                            });
								}else if(fghbfx_chart_json.type ==2){
									option.title.text = "分公司区域";
                                    $("#yxfwzx_li1").css("display", "none");
                                    $("#div-fghbfx").hide();
                                    setTitleAndData1();
								}else if (fghbfx_chart_json.type == 3) {
                                    option.title.text = "营销服务中心区域";
                                    $("#yxfwzx_li1").css("display", "block");
                                    $("#div-fghbfx").hide();
									var rootData = loadOrgs("100000");
									$("#yxfwzx_select1").empty();
									$.each(rootData, function(i, r) {
										var option = "<option value='" + r.id
												+ "'>" + r.text + "</option>";
										$("#yxfwzx_select1").append(option);
									});
									fghbfx_chart_json.fgsId = $("#yxfwzx_select1").val();
									setTitleAndData1();
								} else if (fghbfx_chart_json.type == 4) {
                                    option.title.text = "网格区域";
									$("#yxfwzx_li1").css("display","none");
                                    $("#div-fghbfx").show();
                                    $("#echarts-fghbfx").hide();
                                    $("#fghbfx-objType").val("4");
                                    loadFghbfxOrgTree();
                                    resetFghbfxForm();
                                    loadFghbfxDatagrid();
                                    $("#conditIcon-fghbfx").find('a').each(
                                        function(i, e) {
                                            if (i < 3) {
                                                $(this).css({
                                                    "background" : "#ddd",
                                                    "cursor" : "default"
                                                });
                                            }
                                        });
                                    $("#div-fghbfx").show();

								}else if(fghbfx_chart_json.type == 5){
                                    option.title.text = "建筑物区域";
                                    $("#yxfwzx_li1").css("display", "none");
                                    $("#div-fghbfx").show();
                                    $("#echarts-fghbfx").hide();
                                    $("#div-fghbfx").show();
                                    $("#fghbfx-objType").val("5");
                                    loadFghbfxOrgTree();
                                    resetFghbfxForm();
                                    loadFghbfxDatagrid();
                                    $("#conditIcon-fghbfx").find('a').each(
                                        function(i, e) {
                                            if (i < 3) {
                                                $(this).css({
                                                    "background" : "#ddd",
                                                    "cursor" : "default"
                                                });
                                            }
                                        });
								}
							});
					$("#yxfwzx_select1").change(function() {
						fghbfx_chart_json.fgsId = $(this).val();
						setTitleAndData1();
					});
				});

// 加载组织机构树
function loadFghbfxOrgTree() {
    $('#combotree-fghbfx')
        .combotree(
            {
                multiple : false,
                cascadeCheck : false,
                lines : true,
                onSelect : function(item) {
                    $("#datagrid-fghbfx").datagrid("clearSelections");
                    var pager = $("#datagrid-fghbfx").datagrid(
                        'getPager');
                    $(pager).pagination("options").pageNumber = 1;
                    fghbfx_datagrid_json = $.extend(
                        fghbfx_datagrid_json, $("#form-fghbfx")
                            .serializeObj());
                    fghbfx_datagrid_json.orgId = item.id;
                    var pageNumber = $("#datagrid-fghbfx").datagrid(
                        'getPager').pagination("options").pageNumber;
                    var pageSize = $("#datagrid-fghbfx").datagrid(
                        'getPager').pagination("options").pageSize;
                    loadFghbfxData(pageNumber, pageSize, JSON
                        .stringify(fghbfx_datagrid_json));
                }
            });

    $.get("restful/organization/findOrgByUser", {
        userId : qyzyfgl_chart_json.userId
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
        $('#combotree-fghbfx').combotree("loadData", tree);
    });
}

function loadFghbfxDatagrid() {
    $("#datagrid-fghbfx")
        .datagrid(
            {
                title : "",
                rownumbers : true,
                fitColumns : false,
                pagination : true,
                striped : true,
                singleSelect : true,
                pageSize : 10,
                pageNumber : 1,
                width : 600,
                nowrap : false,
                height : 400,

                columns : [ [ {
                    field : 'objName',
                    title : '名称',
                    width : 150,
                    align : 'left'
                }, {
                    field : 'finalData',
                    title : '厚薄率',
                    width : 100,
                    align : 'left'
                }, {
                    field : 'county',
                    title : '分公司',
                    width : 150,
                    align : 'left'
                }, {
                    field : 'village',
                    title : '营服中心',
                    width : 150,
                    align : 'left'
                } ] ],
                onLoadSuccess : function(data) {
                    var pager = $("#datagrid-fghbfx").datagrid(
                        'getPager');
                    $(pager)
                        .pagination(
                            {
                                onSelectPage : function(
                                    pageNumber, pageSize) {
                                    loadFghbfxData(pageNumber,
                                        pageSize,
                                        fghbfx_datagrid_json);
                                },
                                onChangePageSize : function(
                                    pageSize) {
                                    $(pager).pagination(
                                        "options").pageNumber = 1;
                                },
                                onRefresh : function(
                                    pageNumber, pageSize) {
                                    $("#datagrid-fghbfx")
                                        .datagrid(
                                            "clearSelections");
                                    loadFghbfxData(pageNumber,
                                        pageSize,
                                        fghbfx_datagrid_json);
                                }
                            });
                }
            });
    $("#datagrid-fghbfx").datagrid("clearSelections");
    // 初始加载
    loadFghbfxData(1, 10, {
        objType : 4,
        objName : "",
        orgId : -1
    });
}

// 加载远程数据
function loadFghbfxData(pageNumber, pageSize, queryParams) {
    var jsonObj = {};
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = pageNumber;
    jsonObj.objCondition = queryParams;
    $.ajax({
        type : "POST",
        url : "restful/RptObdThickThinCoverage/getPage",
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(jsonObj),
        success : function(data) {
            var contentStr = data.content;
            var dataResult = JSON.parse(contentStr);
            $("#datagrid-fghbfx").datagrid("loadData", {
                rows : dataResult.rows,
                total : dataResult.total
            });
        },
        error : function(err) {
        }
    });
}

// 重置查询表单
function resetFghbfxForm() {
    // 置空查询参数
    fghbfx_datagrid_json = {};
    fghbfx_datagrid_json.objType = 4;
    fghbfx_datagrid_json.objName = "";
    //fghbfx_datagrid_json.orgId = -1;
    $("#fghbfx-objName").val("");
}

// 点击查询按钮
$("#fghbfx_searchBtn").click(
    function() {
        $("#datagrid-fghbfx").datagrid("clearSelections");
        var pager = $("#datagrid-fghbfx").datagrid('getPager');
        $(pager).pagination("options").pageNumber = 1;
        fghbfx_datagrid_json = $.extend(fghbfx_datagrid_json, $(
            "#form-fghbfx").serializeObj());
        var pageNumber = $("#datagrid-fghbfx").datagrid('getPager')
            .pagination("options").pageNumber;
        var pageSize = $("#datagrid-fghbfx").datagrid('getPager')
            .pagination("options").pageSize;
        loadFghbfxData(pageNumber, pageSize, JSON
            .stringify(fghbfx_datagrid_json));
    });

// 点击重置按钮
$('#fghbfx_resetBtn').click(function() {
    resetFghbfxForm();
});
// 导出
$("#fghbfx_btnExport").on(
    'click',
    function() {
        if ($("#datagrid-fghbfx").datagrid('getRows').length == 0) {
            $.messager.alert({
                title : '提示',
                msg : '数据为空，无法导出',
                icon : 'warning'
            });
            return;
        }
        $("#cover").show();
		$("#export_sel_rows_p").hide();
        $(".doExport-box").removeClass("hide").show();
        $('input:radio[name=export_radio]')[0].checked = true;
        var exportFlag = "1";
        $("#exportCurrentPage").click(function() {
            exportFlag = "1";
        });
        $("#exportAllPage").click(function() {
            exportFlag = "2";
        });
        $("#exportExcel").click(
            function() {
                var oParent = $(this).parent().parent();
                $("#cover").hide();
                oParent.parent().hide();
                var url = "restful/RptObdThickThinCoverage/exportXls";
                if (exportFlag == "1") {
                    fghbfx_datagrid_json.pageNumber = $(
                        "#datagrid-fghbfx").datagrid('getPager')
                        .pagination("options").pageNumber;
                    fghbfx_datagrid_json.pageSize = $(
                        "#datagrid-fghbfx").datagrid('getPager')
                        .pagination("options").pageSize;
                }
                if (exportFlag == "2") {
                    fghbfx_datagrid_json.pageNumber = 1;
                    fghbfx_datagrid_json.pageSize = $(
                        "#datagrid-fghbfx").datagrid('getPager')
                        .pagination("options").total;
                }
                var data = fghbfx_datagrid_json = $.extend(
                    fghbfx_datagrid_json, $("#form-fghbfx")
                        .serializeObj());
                DownLoad({
                    url : url,
                    data : data
                });
            })
    });