var loginUser = JSON.parse($.cookie('loginUser'));
var qyzyfgl_chart_json = {};
qyzyfgl_chart_json.userId = loginUser.id;
qyzyfgl_chart_json.type = 2;
qyzyfgl_chart_json.fgsId = 0;
var qyzyfgl_datagrid_json = {};
qyzyfgl_datagrid_json.objType = 4;
qyzyfgl_datagrid_json.objName = "";
qyzyfgl_datagrid_json.orgId = -1;
$("#qyzyfgl_chart")
		.off()
		.on(
				'click',
				function() {
					var chart_qyzyfgl = echarts.init(document
							.getElementById("echarts-qyzyfgl"));
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
								params
										.forEach(function(item) {
											result += item.seriesName
													+ '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
													+ item.color + '"></span>'
													+ item.name + "："
													+ item.value + "%";
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
							left : '3%',
							right : '4%',
							containLabel : true
						},
						xAxis : [ {
							type : 'category',
							data : [ '城区分公司', '小榄分公司', '西部分公司', '北部分公司',
									'东部分公司', '南部分公司' ],
							axisTick : {
								alignWithLabel : true
							},
							// 设置字体倾斜
							axisLabel : {
								interval : 0,
								rotate : 30,// 倾斜度 -90 至 90 默认为0
								margin : 2,
								textStyle : {
									fontSize : 12,
									fontWeight : "bolder",
									color : "#000000"
								}
							},
						} ],
						yAxis : [ {
							type : 'value',
							axisLabel : {
								show : true,
								interval : 'auto',
								formatter : '{value}%'
							}
						} ],
						series : [ {
							name : '资源覆盖率',
							type : 'line',
							barWidth : '40%',
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
										formatter : '{c}%'
									}
								}
							}
						} ]
					};

					setTitleAndData();
					$(".lineType").off().on('click', function() {
						if (qyzyfgl_chart_json.type > 3) {
							return;
						}
						setTitleAndData();

						for ( var i in option.series) {
							option.series[i].type = "line";
						}
						option.tooltip.axisPointer.type = "line";

						chart_qyzyfgl.setOption(option);
					});
					$(".pillarType").off().on('click', function() {
						if (qyzyfgl_chart_json.type > 3) {
							return;
						}
						setTitleAndData();

						for ( var i in option.series) {
							option.series[i].type = "bar";
						}
						option.tooltip.axisPointer.type = "shadow";

						chart_qyzyfgl.setOption(option);
					});

					$(".mapType").off().on(
							'click',
							function() {
								if (qyzyfgl_chart_json.type > 3) {
									return;
								}
								if (typeof (result) == undefined
										|| result == null) {
									return;
								}
								var isEmpty = true;
								for ( var key in result) {
									isEmpty = false;
									break;
								}
								if (isEmpty) {
									return;
								}

								// 隐藏弹窗口的放大按钮
								var maxdiv = $("div.titleButton.maximize");
								maxdiv.hide();

								var strTitles = result.titles;
								var strValues = result.values;

								showThematicMap(strTitles, strValues,
										qyzyfgl_chart_json.type);

								// $("div.outerPointer.left").show() ;
								// $("div.esriPopupWrapper").show();
							});

					function showThematicMap(strtitles, strvalues, opType) {
						// 1--市公司 2--分公司 3--营销服务中心

						if (opType == 1) {

						} else if (opType == 2) { // 分公司
							var xfbjServiceURL = xfbjLayer.url;
							var queryURL = xfbjServiceURL + "/0/query";

							var keyValues = {};
							var valuesArr = strvalues.split(',');
							var tilesArr = strtitles.split(',');
							var strWhere = "";
							for ( var i = 0; i < tilesArr.length; i++) {
								var tileTemp = tilesArr[i];
								var valueTemp = valuesArr[i];
								keyValues[tileTemp] = valueTemp;
								if (i == 0) {
									strWhere = "COUNTY='" + tileTemp + "'";
								} else {
									strWhere += " OR COUNTY='" + tileTemp + "'";
								}
							}

							var postObj = {
								where : strWhere,
								returnGeometry : true,
								outFields : "*",
								f : "pjson"
							};

							$
									.ajax({
										type : 'POST',
										url : queryURL,
										data : postObj,
										async : true,
										success : function(response) {
											if (response.length >= 0) {
												var resJsonObj = JSON
														.parse(response);
												var features = resJsonObj.features;
												var fieldsArr = resJsonObj.fields;
												var newFeautresArr = new Array();
												for ( var i = 0; i < features.length; i++) {
													var featureTemp = features[i];
													var attribute = featureTemp.attributes;

													var countyname = attribute.COUNTY;
													var value = keyValues[countyname];
													attribute.value = parseFloat(value);
													attribute.valuebai = value
															+ "%";

													var geometry = featureTemp.geometry;
													var featureNew = new esri.Graphic();
													featureNew
															.setGeometry(geometry);
													featureNew
															.setAttributes(attribute);

													newFeautresArr
															.push(featureNew);
												}

												fieldsArr
														.push({
															"name" : "value",
															"type" : "esriFieldTypeDouble",
															"alias" : "value"
														});
												fieldsArr
														.push({
															"name" : "valuebai",
															"type" : "esriFieldTypeString",
															"alias" : "valuebai",
															"length" : 50
														});

												var layerDefinition = {
													"objectIdField" : "OBJECTID",
													"geometryType" : "esriGeometryPolygon",
													"fields" : fieldsArr
												};

												var featureCollection = {
													"layerDefinition" : layerDefinition,
													"featureSet" : {
														"features" : newFeautresArr,
														"geometryType" : "esriGeometryPolygon"
													}
												};

												var featureLayer1 = map
														.getLayer("yfzxzyfglLayer");
												if (typeof (featureLayer1) != undefined
														&& featureLayer1 != null) {
													map
															.removeLayer(featureLayer1);
													featureLayer1 = null;
												}

												var featureLayer = map
														.getLayer("fgszyfglLayer");
												if (typeof (featureLayer) != undefined
														&& featureLayer != null) {
													map
															.removeLayer(featureLayer);
													featureLayer = null;
												}

												var infostr = "区&nbsp;&nbsp;&nbsp;域:&nbsp;${COUNTY}</br>"
														+ "覆盖率:&nbsp;${valuebai}";
												featureLayer = new esri.layers.FeatureLayer(
														featureCollection,
														{
															id : 'fgszyfglLayer',
															infoTemplate : new esri.InfoTemplate(
																	"区域资源覆盖率",
																	infostr),
														});
												map.addLayer(featureLayer);

												var defaultFillSymbol = new esri.symbol.SimpleFillSymbol();
												var defaultSymbol = defaultFillSymbol
														.setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
												defaultSymbol.outline
														.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);

												var renderer = new esri.renderer.UniqueValueRenderer(
														defaultSymbol, "value");

												var colorList = [ '#C1232B',
														'#B5C334', '#FCCE10',
														'#E87C25', '#27727B',
														'#FE8463', '#9BCA63',
														'#FAD860', '#F3A43B',
														'#60C0DD', '#D7504B',
														'#C6E579', '#F4E001',
														'#F0805A', '#26C0C0' ];

												var valueNum = valuesArr.length;
												var rMax = 255;
												var gMax = 255;
												var bMax = 255;
												var rMin = 0;
												var gMin = 0;
												var bMin = 0;
												for ( var i = 0; i < valueNum; i++) {
													var value = parseFloat(valuesArr[i]);

													var color1 = esri.Color
															.fromHex(colorList[i]);

													var r = color1.r;
													var g = color1.g;
													var b = color1.b;
													/*
													 * var r = rMax +
													 * (rMin-rMax)*i/valueNum ;
													 * var g = rMin ; var b =
													 * bMin + (bMax -
													 * bMin)*i/valueNum ;
													 */

													renderer
															.addValue(
																	value,
																	new esri.symbol.SimpleFillSymbol()
																			.setColor(new esri.Color(
																					[
																							r,
																							g,
																							b,
																							0.5 ])));
												}

												featureLayer
														.setRenderer(renderer);

												var statesColor = new esri.Color(
														[ 255, 0, 0, 1.0 ]);
												var labelSymbol = new esri.symbol.TextSymbol()
														.setColor(statesColor);
												labelSymbol.font
														.setSize("14pt");
												labelSymbol.font
														.setFamily("arial");
												var jsonLabel = {
													"labelExpressionInfo" : {
														"value" : "{valuebai}"
													}
												};
												var labelClass = new esri.layers.LabelClass(
														jsonLabel);
												labelClass.symbol = labelSymbol;
												featureLayer
														.setLabelingInfo([ labelClass ]);
											}

										},

									});

						} else if (opType == 3) {
							// 营服中心
							var yfbjServiceURL = yfbjLayer.url;
							var queryURL = yfbjServiceURL + "/0/query";

							var keyValues = {};
							var valuesArr = strvalues.split(',');
							var tilesArr = strtitles.split(',');
							var strWhere = "";
							for ( var i = 0; i < tilesArr.length; i++) {
								var tileTemp = tilesArr[i];
								var valueTemp = valuesArr[i];
								keyValues[tileTemp] = valueTemp;
								if (i == 0) {
									strWhere = "VILLAGE='" + tileTemp + "'";
								} else {
									strWhere += " OR VILLAGE='" + tileTemp
											+ "'";
								}
							}

							var postObj = {
								where : strWhere,
								returnGeometry : true,
								outFields : "*",
								f : "pjson"
							};

							$
									.ajax({
										type : 'POST',
										url : queryURL,
										data : postObj,
										async : true,
										success : function(response) {
											if (response.length >= 0) {
												var resJsonObj = JSON
														.parse(response);
												var fieldsArr = resJsonObj.fields;
												var features = resJsonObj.features;
												var newFeautresArr = new Array();
												for ( var i = 0; i < features.length; i++) {
													var featureTemp = features[i];
													var attribute = featureTemp.attributes;

													var countyname = attribute.VILLAGE;
													var value = keyValues[countyname];
													attribute.value = parseFloat(value);
													attribute.valuebai = value
															+ "%";

													var geometry = featureTemp.geometry;
													var featureNew = new esri.Graphic();
													featureNew
															.setGeometry(geometry);
													featureNew
															.setAttributes(attribute);

													newFeautresArr
															.push(featureNew);
												}

												fieldsArr
														.push({
															"name" : "value",
															"type" : "esriFieldTypeDouble",
															"alias" : "value"
														});
												fieldsArr
														.push({
															"name" : "valuebai",
															"type" : "esriFieldTypeString",
															"alias" : "valuebai",
															"length" : 50
														});

												var layerDefinition = {
													"objectIdField" : "OBJECTID",
													"geometryType" : "esriGeometryPolygon",
													"fields" : fieldsArr
												};

												var featureCollection = {
													"layerDefinition" : layerDefinition,
													"featureSet" : {
														"features" : newFeautresArr,
														"geometryType" : "esriGeometryPolygon"
													}
												};

												var featureLayer1 = map
														.getLayer("fgszyfglLayer");
												if (typeof (featureLayer1) != undefined
														&& featureLayer1 != null) {
													map
															.removeLayer(featureLayer1);
													featureLayer1 = null;
												}

												var featureLayer = map
														.getLayer("yfzxzyfglLayer");
												if (typeof (featureLayer) != undefined
														&& featureLayer != null) {
													map
															.removeLayer(featureLayer);
													featureLayer = null;
												}

												var infostr = "区&nbsp;&nbsp;&nbsp;域:&nbsp;${VILLAGE}</br>"
														+ "覆盖率:&nbsp;${valuebai}";
												featureLayer = new esri.layers.FeatureLayer(
														featureCollection,
														{
															id : 'yfzxzyfglLayer',
															infoTemplate : new esri.InfoTemplate(
																	"区域资源覆盖率",
																	infostr),
														});
												map.addLayer(featureLayer);

												var defaultFillSymbol = new esri.symbol.SimpleFillSymbol();
												var defaultSymbol = defaultFillSymbol
														.setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
												defaultSymbol.outline
														.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);

												var renderer = new esri.renderer.UniqueValueRenderer(
														defaultSymbol, "value");

												var colorList = [ '#C1232B',
														'#B5C334', '#FCCE10',
														'#E87C25', '#27727B',
														'#FE8463', '#9BCA63',
														'#FAD860', '#F3A43B',
														'#60C0DD', '#D7504B',
														'#C6E579', '#F4E001',
														'#F0805A', '#26C0C0' ];

												var valueNum = valuesArr.length;
												var rMax = 255;
												var gMax = 255;
												var bMax = 255;
												var rMin = 0;
												var gMin = 0;
												var bMin = 0;
												for ( var i = 0; i < valueNum; i++) {
													var value = parseFloat(valuesArr[i]);

													var color1 = esri.Color
															.fromHex(colorList[i]);

													var r = color1.r;
													var g = color1.g;
													var b = color1.b;

													/*
													 * var r = rMax +
													 * (rMin-rMax)*i/valueNum ;
													 * var g = rMin ; var b =
													 * bMin + (bMax -
													 * bMin)*i/valueNum ;
													 */

													renderer
															.addValue(
																	value,
																	new esri.symbol.SimpleFillSymbol()
																			.setColor(new esri.Color(
																					[
																							r,
																							g,
																							b,
																							0.5 ])));
												}

												featureLayer
														.setRenderer(renderer);

												var statesColor = new esri.Color(
														[ 255, 0, 0, 1.0 ]);
												var labelSymbol = new esri.symbol.TextSymbol()
														.setColor(statesColor);
												labelSymbol.font
														.setSize("14pt");
												labelSymbol.font
														.setFamily("arial");
												var jsonLabel = {
													"labelExpressionInfo" : {
														"value" : "{valuebai}"
													}
												};
												var labelClass = new esri.layers.LabelClass(
														jsonLabel);
												labelClass.symbol = labelSymbol;
												featureLayer
														.setLabelingInfo([ labelClass ]);

											}

										},

									});

						}
					}

					function loadChartData() {
						// var result;
						result = null;
						$.ajax({
							type : "POST",
							url : "restful/chartReport/getChartReport",
							contentType : "application/json",
							dataType : "json",
							data : JSON.stringify(qyzyfgl_chart_json),
							async : false,
							success : function(data) {
								if (data.status) {
									var contentStr = data.content;
									result = contentStr;
								}
							},
							error : function(err) {
								result = {};
							}
						});
						return result;
					}

					function setTitleAndData() {
						if (qyzyfgl_chart_json.type > 3) {
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
						chart_qyzyfgl.setOption(option);
					}

					$(":input[name='qyzyfgz-area']").off().on(
							'click',
							function() {
								qyzyfgl_chart_json.type = $(this).val();
								$("#echarts-qyzyfgl").show();
								$("#div-qyzyfgl").hide();
								$("#conditIcon-qyzyfgl").find('a').each(
										function(i, e) {
											if (i < 3) {
												$(this).css({
													"background" : "#0793eb",
													"cursor" : "pointer"
												});
											}
										});
								if (qyzyfgl_chart_json.type == 1) {
									option.title.text = "市公司区域";
									$("#yxfwzx_li").css("display", "none");
									$("#div-qyzyfgl").hide();
									$("#datagrid-qyzyfgl").hide();
									setTitleAndData();
									$("#conditIcon-qyzyfgl").find('a').each(
											function(i, e) {
												if (i < 3) {
													$(this).css({
														"background" : "#ddd",
														"cursor" : "default"
													});
												}
											});
								} else if (qyzyfgl_chart_json.type == 2) {
									option.title.text = "分公司区域";
									$("#yxfwzx_li").css("display", "none");
									$("#div-qyzyfgl").hide();
									setTitleAndData();
								} else if (qyzyfgl_chart_json.type == 3) {
									option.title.text = "营销服务中心区域";
									$("#yxfwzx_li").css("display", "block");
									$("#div-qyzyfgl").hide();
									var rootData = loadOrgs("100000");
									$("#yxfwzx_select").empty();
									$.each(rootData, function(i, r) {
										var option = "<option value='" + r.id
												+ "'>" + r.text + "</option>";
										$("#yxfwzx_select").append(option);
									});
									qyzyfgl_chart_json.fgsId = $(
											"#yxfwzx_select").val();
									setTitleAndData();
								} else if (qyzyfgl_chart_json.type == 4) {
									option.title.text = "网格区域";
									$("#yxfwzx_li").css("display", "none");
									$("#div-qyzyfgl").show();
									$("#echarts-qyzyfgl").hide();
									$("#qyzyfgl-objType").val("4");
									loadQyzyfglOrgTree();
									resetQyzyfglForm();
									loadQyzyfglDatagrid();
									$("#conditIcon-qyzyfgl").find('a').each(
											function(i, e) {
												if (i < 3) {
													$(this).css({
														"background" : "#ddd",
														"cursor" : "default"
													});
												}
											});
									$("#div-qyzyfgl").show();
								} else if (qyzyfgl_chart_json.type == 5) {
									option.title.text = "建筑物区域";
									$("#yxfwzx_li").css("display", "none");
									$("#div-qyzyfgl").show();
									$("#echarts-qyzyfgl").hide();
									$("#div-qyzyfgl").show();
									$("#qyzyfgl-objType").val("5");
									loadQyzyfglOrgTree();
									resetQyzyfglForm();
									loadQyzyfglDatagrid();
									$("#conditIcon-qyzyfgl").find('a').each(
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
					$("#yxfwzx_select").change(function() {
						qyzyfgl_chart_json.fgsId = $(this).val();
						setTitleAndData();
					});
				});

// 加载组织机构树
function loadQyzyfglOrgTree() {
	$('#combotree-qyzyfgl')
			.combotree(
					{
						multiple : false,
						cascadeCheck : false,
						lines : true,
						onSelect : function(item) {
							$("#datagrid-qyzyfgl").datagrid("clearSelections");
							var pager = $("#datagrid-qyzyfgl").datagrid(
									'getPager');
							$(pager).pagination("options").pageNumber = 1;
							qyzyfgl_datagrid_json = $.extend(
									qyzyfgl_datagrid_json, $("#form-qyzyfgl")
											.serializeObj());
							qyzyfgl_datagrid_json.orgId = item.id;
							var pageNumber = $("#datagrid-qyzyfgl").datagrid(
									'getPager').pagination("options").pageNumber;
							var pageSize = $("#datagrid-qyzyfgl").datagrid(
									'getPager').pagination("options").pageSize;
							loadQyzyfglData(pageNumber, pageSize, JSON
									.stringify(qyzyfgl_datagrid_json));
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
		$('#combotree-qyzyfgl').combotree("loadData", tree);
	});
}

function loadQyzyfglDatagrid() {
	$("#datagrid-qyzyfgl")
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
							title : '覆盖率',
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
							var pager = $("#datagrid-qyzyfgl").datagrid(
									'getPager');
							$(pager)
									.pagination(
											{
												onSelectPage : function(
														pageNumber, pageSize) {
													loadQyzyfglData(pageNumber,
															pageSize,
															qyzyfgl_datagrid_json);
												},
												onChangePageSize : function(
														pageSize) {
													$(pager).pagination(
															"options").pageNumber = 1;
												},
												onRefresh : function(
														pageNumber, pageSize) {
													$("#datagrid-qyzyfgl")
															.datagrid(
																	"clearSelections");
													loadQyzyfglData(pageNumber,
															pageSize,
															qyzyfgl_datagrid_json);
												}
											});
						}
					});
	$("#datagrid-qyzyfgl").datagrid("clearSelections");
	// 初始加载
	loadQyzyfglData(1, 10, {
		objType : 4,
		objName : "",
		orgId : -1
	});
}

// 加载远程数据
function loadQyzyfglData(pageNumber, pageSize, queryParams) {
	var jsonObj = {};
	jsonObj.pageSize = pageSize;
	jsonObj.pageNumber = pageNumber;
	jsonObj.objCondition = queryParams;
	$.ajax({
		type : "POST",
		url : "restful/rptResCoverage/getPage",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(jsonObj),
		success : function(data) {
			var contentStr = data.content;
			var dataResult = JSON.parse(contentStr);
			$("#datagrid-qyzyfgl").datagrid("loadData", {
				rows : dataResult.rows,
				total : dataResult.total
			});
		},
		error : function(err) {
		}
	});
}

// 重置查询表单
function resetQyzyfglForm() {
	// 置空查询参数
	qyzyfgl_datagrid_json = {};
	qyzyfgl_datagrid_json.objType = 4;
	qyzyfgl_datagrid_json.objName = "";
	//qyzyfgl_datagrid_json.orgId = -1;
	$("#qyzyfgl-objName").val("");
}

// 点击查询按钮
$("#qyzyfgl_searchBtn").click(
		function() {
			$("#datagrid-qyzyfgl").datagrid("clearSelections");
			var pager = $("#datagrid-qyzyfgl").datagrid('getPager');
			$(pager).pagination("options").pageNumber = 1;
			qyzyfgl_datagrid_json = $.extend(qyzyfgl_datagrid_json, $(
					"#form-qyzyfgl").serializeObj());
			var pageNumber = $("#datagrid-qyzyfgl").datagrid('getPager')
					.pagination("options").pageNumber;
			var pageSize = $("#datagrid-qyzyfgl").datagrid('getPager')
					.pagination("options").pageSize;
			loadQyzyfglData(pageNumber, pageSize, JSON
					.stringify(qyzyfgl_datagrid_json));
		});

// 点击重置按钮
$('#qyzyfgl_resetBtn').click(function() {
	resetQyzyfglForm();
});
// 导出
$("#qyzyfgl_btnExport").on(
		'click',
		function() {
			if ($("#datagrid-qyzyfgl").datagrid('getRows').length == 0) {
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
						var url = "restful/rptResCoverage/exportXls";
						if (exportFlag == "1") {
							qyzyfgl_datagrid_json.pageNumber = $(
									"#datagrid-qyzyfgl").datagrid('getPager')
									.pagination("options").pageNumber;
							qyzyfgl_datagrid_json.pageSize = $(
									"#datagrid-qyzyfgl").datagrid('getPager')
									.pagination("options").pageSize;
						}
						if (exportFlag == "2") {
							qyzyfgl_datagrid_json.pageNumber = 1;
							qyzyfgl_datagrid_json.pageSize = $(
									"#datagrid-qyzyfgl").datagrid('getPager')
									.pagination("options").total;
						}
						var data = qyzyfgl_datagrid_json = $.extend(
								qyzyfgl_datagrid_json, $("#form-qyzyfgl")
										.serializeObj());
                        DownLoad({
							url : url,
							data : data,
						});

                    })
		});
