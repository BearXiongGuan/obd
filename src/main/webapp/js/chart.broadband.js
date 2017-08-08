var loginUser = JSON.parse($.cookie('loginUser'));
var kdstl_chart_json = {};
kdstl_chart_json.userId = loginUser.id;
kdstl_chart_json.type = 2; // 统计维度 1-市公司 2-分公司 3-营服 4-网格,5-建筑物
kdstl_chart_json.fgsId = 0;

var broadboadRate;
var itvNum;
var telNum;
var broadboadNum;

var kdstl_datagrid_json = {};
kdstl_datagrid_json.objType = 0;
kdstl_datagrid_json.objName = "";
kdstl_datagrid_json.orgId = -1;

$("#kdstl_chart")
		.off()
		.on(
				'click',
				function() {
					var chart_kdstl = echarts.init(document
							.getElementById("echarts-kdstl"));
					var chartsData = loadBroadBandData();
					broadboadRate = chartsData.broadboadRate;
					itvNum = chartsData.itvNum;
					telNum = chartsData.telNum;
					broadboadNum = chartsData.broadboadNum;

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
							left : '3%',
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
							min : 0,
							max : 1,
							axisLabel : {
								show : true,
								interval : 'auto',
							}
						} ],
						series : [ {
							name : '宽带渗透率',
							type : 'line',
							barWidth : '40%',
							// markLine : {
							// itemStyle : {
							// normal : {
							// lineStyle : {
							// type : 'dashed',
							// color : '#000'
							// },
							// label : {
							// show : true,
							// position : 'left'
							// }
							// }
							// },
							// data : [ {
							// name : '标线1起点',
							// value : broadboadRate,
							// xAxis : -1,
							// yAxis : broadboadRate
							// }, {
							// name : '标线1终点',
							// xAxis : 570,
							// yAxis : broadboadRate
							// } ],
							// },
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

					setTitleAndData4Broadband();

					$(".lineType").off().on('click', function() {
						if (kdstl_chart_json.type > 3) {
							return;
						}
						setTitleAndData4Broadband();

						for ( var i in option.series) {
							option.series[i].type = "line";
						}
						option.tooltip.axisPointer.type = "line";

						chart_kdstl.setOption(option);
					});
					$(".pillarType").off().on('click', function() {
						if (kdstl_chart_json.type > 3) {
							return;
						}
						setTitleAndData4Broadband();

						for ( var i in option.series) {
							option.series[i].type = "bar";
						}
						option.tooltip.axisPointer.type = "shadow";

						chart_kdstl.setOption(option);
					});

					$(".mapType")
							.off()
							.on(
									'click',
									function() {
										if (kdstl_chart_json.type > 3) {
											return;
										}
										if (typeof (kdstlResult) == undefined
												|| kdstlResult == null) {
											return;
										}
										var isEmpty = true;
										for ( var key in kdstlResult) {
											isEmpty = false;
											break;
										}
										if (isEmpty) {
											return;
										}

										// 隐藏弹窗口的放大按钮
										var maxdiv = $("div.titleButton.maximize");
										maxdiv.hide();

										var strTitles = kdstlResult.titles;
										var strBroadboadNumValues = kdstlResult.broadboadNum;
										var strTelNumValues = kdstlResult.telNum;
										var strItvNumValues = kdstlResult.itvNum;
										var strBroadboadRateValues = kdstlResult.broadboadRate;

										showThematicMap(strTitles,
												strBroadboadNumValues,
												strTelNumValues,
												strItvNumValues,
												strBroadboadRateValues,
												kdstl_chart_json.type);

										// $("div.outerPointer.left").show() ;
										// $("div.esriPopupWrapper").show();
									});

					function showThematicMap(strtitles, strBroadboadNumValues,
							strTelNumValues, strItvNumValues,
							strBroadboadRateValues, opType) {
						// 1--市公司 2--分公司 3--营销服务中心
						if (opType == 1) {

						} else if (opType == 2) { // 分公司
							var xfbjServiceURL = xfbjLayer.url;
							var queryURL = xfbjServiceURL + "/0/query";

							var keyValues = {};
							var broadboadValuesArr = strBroadboadNumValues
									.split(',');
							var telValuesArr = strTelNumValues.split(',');
							var itvValuesArr = strItvNumValues.split(',');
							var broadboadRateValuesArr = strBroadboadRateValues
									.split(',');
							var tilesArr = strtitles.split(',');
							var strWhere = "";
							for ( var i = 0; i < tilesArr.length; i++) {
								var tileTemp = tilesArr[i];
								// var valueTemp = valuesArr[i] ;
								var valueObj = {
									broadboadnum : broadboadValuesArr[i],
									telnum : telValuesArr[i],
									itvnum : itvValuesArr[i],
									broadboadrate : broadboadRateValuesArr[i]
								};
								keyValues[tileTemp] = valueObj;
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
													var valueObj = keyValues[countyname];
													attribute.broadboadnum = parseInt(valueObj.broadboadnum);
													attribute.telnum = parseInt(valueObj.telnum);
													attribute.itvnum = parseInt(valueObj.itvnum);
													attribute.broadboadrate = parseFloat(valueObj.broadboadrate);
													var rate = (attribute.broadboadrate * 100.0)
															.toFixed(2);
													/*
													 * attribute.label = "渗透率:" +
													 * rate + "%\n" + "宽 带:"
													 * +valueObj.broadboadnum +
													 * "\n" + "固 话:" +
													 * valueObj.telnum + "\n" +
													 * "itv :" + valueObj.itvnum
													 */
													attribute.label = "区&nbsp;&nbsp;&nbsp;域:&nbsp;"
															+ countyname
															+ "</br>"
															+ "渗透率:&nbsp;"
															+ rate
															+ "%</br>"
															+ "宽&nbsp;&nbsp;&nbsp;&nbsp;带:&nbsp;"
															+ valueObj.broadboadnum
															+ "</br>"
															+ "固&nbsp;&nbsp;&nbsp;&nbsp;话:&nbsp;"
															+ valueObj.telnum
															+ "</br>"
															+ "&nbsp;&nbsp;&nbsp;itv&nbsp;&nbsp;&nbsp;:&nbsp;"
															+ valueObj.itvnum;

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
															"name" : "broadboadnum",
															"type" : "esriFieldTypeInteger",
															"alias" : "broadboadnum"
														});
												fieldsArr
														.push({
															"name" : "telnum",
															"type" : "esriFieldTypeInteger",
															"alias" : "telnum"
														});
												fieldsArr
														.push({
															"name" : "itvnum",
															"type" : "esriFieldTypeInteger",
															"alias" : "itvnum"
														});
												fieldsArr
														.push({
															"name" : "broadboadrate",
															"type" : "esriFieldTypeDouble",
															"alias" : "broadboadrate"
														});
												fieldsArr
														.push({
															"name" : "label",
															"type" : "esriFieldTypeString",
															"alias" : "label",
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
														.getLayer("yfzxkdstlLayer");
												if (typeof (featureLayer1) != undefined
														&& featureLayer1 != null) {
													map
															.removeLayer(featureLayer1);
													featureLayer1 = null;
												}

												var graphiclayer1 = map
														.getLayer("yfzxkdstlLabelLayer");
												if (typeof (graphiclayer1) != undefined
														&& graphiclayer1 != null) {
													map
															.removeLayer(graphiclayer1);
													graphiclayer1 = null;
												}

												var featureLayer = map
														.getLayer("fgskdstlLayer");
												if (typeof (featureLayer) != undefined
														&& featureLayer != null) {
													map
															.removeLayer(featureLayer);
													featureLayer = null;
												}

												featureLayer = new esri.layers.FeatureLayer(
														featureCollection,
														{
															id : 'fgskdstlLayer',
															infoTemplate : new esri.InfoTemplate(
																	"宽带渗透率",
																	"${label}")
														});
												map.addLayer(featureLayer);

												/*
												 * var graphiclayer =
												 * map.getLayer("fgskdstlLabelLayer") ;
												 * if(typeof(graphiclayer) !=
												 * undefined && graphiclayer !=
												 * null){
												 * map.removeLayer(graphiclayer) ;
												 * graphiclayer = null ; }
												 * graphiclayer = new
												 * esri.layers.GraphicsLayer({
												 * id:'fgskdstlLabelLayer' }) ;
												 * map.addLayer(graphiclayer);
												 */

												var defaultFillSymbol = new esri.symbol.SimpleFillSymbol();
												var defaultSymbol = defaultFillSymbol
														.setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
												defaultSymbol.outline
														.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);

												var renderer = new esri.renderer.UniqueValueRenderer(
														defaultSymbol,
														"broadboadnum");

												var colorList = [ '#C1232B',
														'#B5C334', '#FCCE10',
														'#E87C25', '#27727B',
														'#FE8463', '#9BCA63',
														'#FAD860', '#F3A43B',
														'#60C0DD', '#D7504B',
														'#C6E579', '#F4E001',
														'#F0805A', '#26C0C0' ];

												var valueNum = broadboadValuesArr.length;
												var rMax = 255;
												var gMax = 255;
												var bMax = 255;
												var rMin = 0;
												var gMin = 0;
												var bMin = 0;
												for ( var i = 0; i < valueNum; i++) {
													var valuecha1 = parseInt(broadboadValuesArr[i]);
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
																	valuecha1,
																	new esri.symbol.SimpleFillSymbol()
																			.setColor(new esri.Color(
																					[
																							r,
																							g,
																							b,
																							1.0 ])));
												}

												featureLayer
														.setRenderer(renderer);

												/*
												 * for(var j = 0 ; j <
												 * newFeautresArr.length ; j++){
												 * var featureTemp =
												 * newFeautresArr[j] ; var label =
												 * featureTemp.attributes.label ;
												 * var geometry =
												 * featureTemp.geometry ; var
												 * labelPoint =
												 * geometry.getExtent().getCenter() ;
												 * var labelSymbol = new
												 * esri.symbol.TextSymbol(label) ;
												 * var statesColor = new
												 * esri.Color([255 , 0 , 0 ,
												 * 1.0]);
												 * labelSymbol.setColor(statesColor);
												 * labelSymbol.font.setSize("10pt");
												 * labelSymbol.font.setFamily("arial");
												 * var labelgraphic = new
												 * esri.Graphic(labelPoint ,
												 * labelSymbol) ;
												 * graphiclayer.add(labelgraphic) ; }
												 */
											}

										},

									});

						} else if (opType == 3) {
							// 营服中心
							var yfbjServiceURL = yfbjLayer.url;
							var queryURL = yfbjServiceURL + "/0/query";

							var keyValues = {};
							var broadboadValuesArr = strBroadboadNumValues
									.split(',');
							var telValuesArr = strTelNumValues.split(',');
							var itvValuesArr = strItvNumValues.split(',');
							var broadboadRateValuesArr = strBroadboadRateValues
									.split(',');
							var tilesArr = strtitles.split(',');

							var strWhere = "";
							for ( var i = 0; i < tilesArr.length; i++) {
								var tileTemp = tilesArr[i];
								// var valueTemp = valuesArr[i] ;
								var valueObj = {
									broadboadnum : broadboadValuesArr[i],
									telnum : telValuesArr[i],
									itvnum : itvValuesArr[i],
									broadboadrate : broadboadRateValuesArr[i]
								};
								keyValues[tileTemp] = valueObj;

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
													var valueObj = keyValues[countyname];
													attribute.broadboadnum = parseInt(valueObj.broadboadnum);
													attribute.telnum = parseInt(valueObj.telnum);
													attribute.itvnum = parseInt(valueObj.itvnum);
													attribute.broadboadrate = parseFloat(valueObj.broadboadrate);
													var rate = (attribute.broadboadrate * 100.0)
															.toFixed(2);
													/*
													 * attribute.label = "渗透率:" +
													 * rate + "%\n" + "宽 带:"
													 * +valueObj.broadboadnum +
													 * "\n" + "固 话:" +
													 * valueObj.telnum + "\n" +
													 * "itv :" + valueObj.itvnum +
													 * "\n";
													 */
													attribute.label = "区&nbsp;&nbsp;&nbsp;域:&nbsp;"
															+ countyname
															+ "</br>"
															+ "渗透率:&nbsp;"
															+ rate
															+ "%</br>"
															+ "宽&nbsp;&nbsp;&nbsp;&nbsp;带:&nbsp;"
															+ valueObj.broadboadnum
															+ "</br>"
															+ "固&nbsp;&nbsp;&nbsp;&nbsp;话:&nbsp;"
															+ valueObj.telnum
															+ "</br>"
															+ "&nbsp;&nbsp;&nbsp;itv&nbsp;&nbsp;&nbsp;:&nbsp;"
															+ valueObj.itvnum;

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
															"name" : "broadboadnum",
															"type" : "esriFieldTypeInteger",
															"alias" : "broadboadnum"
														});
												fieldsArr
														.push({
															"name" : "telnum",
															"type" : "esriFieldTypeInteger",
															"alias" : "telnum"
														});
												fieldsArr
														.push({
															"name" : "itvnum",
															"type" : "esriFieldTypeInteger",
															"alias" : "itvnum"
														});
												fieldsArr
														.push({
															"name" : "broadboadrate",
															"type" : "esriFieldTypeDouble",
															"alias" : "broadboadrate"
														});
												fieldsArr
														.push({
															"name" : "label",
															"type" : "esriFieldTypeString",
															"alias" : "label",
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
														.getLayer("fgskdstlLayer");
												if (typeof (featureLayer1) != undefined
														&& featureLayer1 != null) {
													map
															.removeLayer(featureLayer1);
													featureLayer1 = null;
												}
												var graphicLayer1 = map
														.getLayer("fgskdstlLabelLayer");
												if (typeof (graphicLayer1) != undefined
														&& graphicLayer1 != null) {
													map
															.removeLayer(graphicLayer1);
													graphicLayer1 = null;
												}

												var featureLayer = map
														.getLayer("yfzxkdstlLayer");
												if (typeof (featureLayer) != undefined
														&& featureLayer != null) {
													map
															.removeLayer(featureLayer);
													featureLayer = null;
												}
												featureLayer = new esri.layers.FeatureLayer(
														featureCollection,
														{
															id : 'yfzxkdstlLayer',
															infoTemplate : new esri.InfoTemplate(
																	"宽带渗透率",
																	"${label}")
														});
												map.addLayer(featureLayer);

												/*
												 * var graphicLayer =
												 * map.getLayer("yfzxkdstlLabelLayer") ;
												 * if(typeof(graphicLayer) !=
												 * undefined && graphicLayer !=
												 * null){
												 * map.removeLayer(graphicLayer) ;
												 * graphicLayer = null ; }
												 * graphicLayer = new
												 * esri.layers.GraphicsLayer({
												 * id:'yfzxkdstlLabelLayer' }) ;
												 */

												map.addLayer(graphicLayer);

												var defaultFillSymbol = new esri.symbol.SimpleFillSymbol();
												var defaultSymbol = defaultFillSymbol
														.setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
												defaultSymbol.outline
														.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);

												var renderer = new esri.renderer.UniqueValueRenderer(
														defaultSymbol,
														"broadboadnum");

												var colorList = [ '#C1232B',
														'#B5C334', '#FCCE10',
														'#E87C25', '#27727B',
														'#FE8463', '#9BCA63',
														'#FAD860', '#F3A43B',
														'#60C0DD', '#D7504B',
														'#C6E579', '#F4E001',
														'#F0805A', '#26C0C0' ];

												var valueNum = broadboadValuesArr.length;
												var rMax = 255;
												var gMax = 255;
												var bMax = 255;
												var rMin = 0;
												var gMin = 0;
												var bMin = 0;
												for ( var i = 0; i < valueNum; i++) {
													var valuecha1 = parseInt(broadboadValuesArr[i]);

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
																	valuecha1,
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

												/*
												 * for(var j = 0 ; j <
												 * newFeautresArr.length ; j++){
												 * var featureTemp =
												 * newFeautresArr[j] ; var label =
												 * featureTemp.attributes.label ;
												 * var geometry =
												 * featureTemp.geometry ; var
												 * labelPoint =
												 * geometry.getExtent().getCenter() ;
												 * var labelSymbol = new
												 * esri.symbol.TextSymbol(label) ;
												 * var statesColor = new
												 * esri.Color([255 , 0 , 0 ,
												 * 1.0]);
												 * labelSymbol.setColor(statesColor);
												 * labelSymbol.font.setSize("10pt");
												 * labelSymbol.font.setFamily("arial");
												 * var labelgraphic = new
												 * esri.Graphic(labelPoint ,
												 * labelSymbol) ;
												 * graphicLayer.add(labelgraphic) ; }
												 */

											}

										},

									});

						}
					}

					function loadBroadBandData() {
						kdstlResult = null;
						$.ajax({
							type : "POST",
							url : "restful/chartReport/getChartBroadbandRate",
							contentType : "application/json",
							dataType : "json",
							data : JSON.stringify(kdstl_chart_json),
							async : false,
							success : function(data) {
								if (data.status) {
									var contentStr = data.content;
									kdstlResult = contentStr;
								}
							},
							error : function(err) {
								kdstlResult = {};
							}
						});
						return kdstlResult;
					}
					function setTitleAndData4Broadband() {
						if (kdstl_chart_json.type > 3) {
							return;
						}
						// 获取数据
						var chartData = loadBroadBandData();
						// 设施分类
						option.xAxis[0].data = chartData.titles.split(",");
						// 设置值
						var values = chartData.broadboadRate;
						var datas = values.split(";");
						for ( var i in option.series) {
							option.series[i].data = datas[i].split(",");
						}

						chart_kdstl.setOption(option);
					}

					$(":input[name='kdstl-area']")
							.off()
							.on(
									'click',
									function() {
										kdstl_chart_json.type = $(this).val();
										$("#echarts-kdstl").show();
										$("#div-kdstl").hide();
										$("#conditIcon-kdstl")
												.find('a')
												.each(
														function(i, e) {
															if (i < 3) {
																$(this)
																		.css(
																				{
																					"background" : "#0793eb",
																					"cursor" : "pointer"
																				});
															}
														});
										if (kdstl_chart_json.type == 1) {
											option.title.text = "市公司区域";
											$("#kdstl_li").css("display",
													"none");
											$("#div-kdstl").hide();
											$("#datagrid-kdstl").hide();
											setTitleAndData4Broadband();
											$("#conditIcon-kdstl")
											.find('a')
											.each(
													function(i, e) {
														if (i==2) {
															$(this)
																	.css(
																			{
																				"background" : "#ddd",
																				"cursor" : "default"
																			});
														}
													});
										} else if (kdstl_chart_json.type == 2) {
											option.title.text = "分公司区域";
											$("#kdstl_li").css("display",
													"none");
											$("#div-kdstl").hide();
											$("#datagrid-kdstl").hide();
											setTitleAndData4Broadband();
										} else if (kdstl_chart_json.type == 3) {
											option.title.text = "营销服务中心区域";
											$("#kdstl_li").css("display",
													"block");

											$("#div-kdstl").hide();

											var rootData = loadOrgs("100000");
											$("#kdstl_select1").empty();
											$.each(rootData, function(i, r) {
												var option = "<option value='"
														+ r.id + "'>" + r.text
														+ "</option>";
												$("#kdstl_select1").append(
														option);
											});
											kdstl_chart_json.fgsId = $(
													"#kdstl_select1").val();
											setTitleAndData4Broadband();
										} else if (kdstl_chart_json.type == 4) {
											option.title.text = "网格区域";
											// kdstl_chart_json.type = 1;
											$("#kdstl_li").css("display",
													"none");
											$("#div-kdstl").show();
											$("#echarts-kdstl").hide();
											$("#kdstl-objType").val("4");
											loadKdstlOrgTree();
											resetKdstlForm();
											loadKdstlDatagrid();
											$("#conditIcon-kdstl")
													.find('a')
													.each(
															function(i, e) {
																if (i < 3) {
																	$(this)
																			.css(
																					{
																						"background" : "#ddd",
																						"cursor" : "default"
																					});
																}
															});
										} else if (kdstl_chart_json.type == 5) {
											option.title.text = "建筑物区域";
											// kdstl_chart_json.type = 1;
											$("#kdstl_li").css("display",
													"none");
											$("#div-kdstl").show();
											$("#echarts-kdstl").hide();
											$("#div-kdstl").show();
											$("#kdstl-objType").val("5");
											loadKdstlOrgTree();
											resetKdstlForm();
											loadKdstlDatagrid();
											$("#conditIcon-kdstl")
													.find('a')
													.each(
															function(i, e) {
																if (i < 3) {
																	$(this)
																			.css(
																					{
																						"background" : "#ddd",
																						"cursor" : "default"
																					});
																}
															});
										}
									});
					$("#kdstl_select1").change(function() {
						kdstl_chart_json.fgsId = $(this).val();
						setTitleAndData4Broadband();
					});
				});

// 加载组织机构树
function loadKdstlOrgTree() {
	$('#combotree-kdstl').combotree(
			{
				multiple : false,
				cascadeCheck : false,
				lines : true,
				onSelect : function(item) {
					$("#datagrid-kdstl").datagrid("clearSelections");
					var pager = $("#datagrid-kdstl").datagrid('getPager');
					$(pager).pagination("options").pageNumber = 1;
					kdstl_datagrid_json = $.extend(kdstl_datagrid_json, $(
							"#form-kdstl").serializeObj());
					kdstl_datagrid_json.orgId = item.id;
					var pageNumber = $("#datagrid-kdstl").datagrid('getPager')
							.pagination("options").pageNumber;
					var pageSize = $("#datagrid-kdstl").datagrid('getPager')
							.pagination("options").pageSize;
					loadKdstlData(pageNumber, pageSize, JSON
							.stringify(kdstl_datagrid_json));
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
		$('#combotree-kdstl').combotree("loadData", tree);
	});
}

function loadKdstlDatagrid() {
	$("#datagrid-kdstl").datagrid({
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
			field : 'broadbandNum',
			title : '宽带业务数',
			width : 100,
			align : 'left'
		}, {
			field : 'telNum',
			title : '固话业务数',
			width : 100,
			align : 'left'
		}, {
			field : 'itvNum',
			title : 'ITV业务数',
			width : 100,
			align : 'left'
		}, {
			field : 'roomNum',
			title : '房间数',
			width : 100,
			align : 'left'
		}, {
			field : 'broadbandPermeateData',
			title : '宽带渗透率',
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
			var pager = $("#datagrid-kdstl").datagrid('getPager');
			$(pager).pagination({
				onSelectPage : function(pageNumber, pageSize) {
					loadKdstlData(pageNumber, pageSize, kdstl_datagrid_json);
				},
				onChangePageSize : function(pageSize) {
					$(pager).pagination("options").pageNumber = 1;
				},
				onRefresh : function(pageNumber, pageSize) {
					$("#datagrid-kdstl").datagrid("clearSelections");
					loadKdstlData(pageNumber, pageSize, kdstl_datagrid_json);
				}
			});
		}
	});
	$("#datagrid-kdstl").datagrid("clearSelections");
	// 初始加载
	loadKdstlData(1, 10, {
		objType : 4,
		objName : "",
		orgId : -1
	});
}

// 加载远程数据
function loadKdstlData(pageNumber, pageSize, queryParams) {
	var jsonObj = {};
	jsonObj.pageSize = pageSize;
	jsonObj.pageNumber = pageNumber;
	jsonObj.objCondition = queryParams;
	$.ajax({
		type : "POST",
		url : "restful/rptBroadbandPermeate/getPage",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(jsonObj),
		success : function(data) {
			var contentStr = data.content;
			var dataResult = JSON.parse(contentStr);
			$("#datagrid-kdstl").datagrid("loadData", {
				rows : dataResult.rows,
				total : dataResult.total
			});
		},
		error : function(err) {
		}
	});
}

// 重置查询表单
function resetKdstlForm() {
	// 置空查询参数
	kdstl_datagrid_json = {};
	kdstl_datagrid_json.objType = 4;
	kdstl_datagrid_json.objName = "";
	//kdstl_datagrid_json.orgId = -1;
	$("#kdstl-objName").val("");
}

// 点击查询按钮
$("#kdstl_searchBtn").click(
		function() {
			$("#datagrid-kdstl").datagrid("clearSelections");
			var pager = $("#datagrid-kdstl").datagrid('getPager');
			$(pager).pagination("options").pageNumber = 1;
			kdstl_datagrid_json = $.extend(kdstl_datagrid_json,
					$("#form-kdstl").serializeObj());
			var pageNumber = $("#datagrid-kdstl").datagrid('getPager')
					.pagination("options").pageNumber;
			var pageSize = $("#datagrid-kdstl").datagrid('getPager')
					.pagination("options").pageSize;
			loadKdstlData(pageNumber, pageSize, JSON
					.stringify(kdstl_datagrid_json));
		});

// 点击重置按钮
$('#kdstl_resetBtn').click(function() {
	resetKdstlForm();
});
// 导出
$("#kdstl_btnExport")
		.on(
				'click',
				function() {
					if ($("#datagrid-kdstl").datagrid('getRows').length == 0) {
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
					$("#exportExcel")
							.click(
									function() {
										var oParent = $(this).parent().parent();
										$("#cover").hide();
										oParent.parent().hide();
										var url = "restful/rptBroadbandPermeate/exportXls";
										if (exportFlag == "1") {
											kdstl_datagrid_json.pageNumber = $(
													"#datagrid-kdstl")
													.datagrid('getPager')
													.pagination("options").pageNumber;
											kdstl_datagrid_json.pageSize = $(
													"#datagrid-kdstl")
													.datagrid('getPager')
													.pagination("options").pageSize;
										}
										if (exportFlag == "2") {
											kdstl_datagrid_json.pageNumber = 1;
											kdstl_datagrid_json.pageSize = $(
													"#datagrid-kdstl")
													.datagrid('getPager')
													.pagination("options").total;
										}
										var data = kdstl_datagrid_json = $
												.extend(kdstl_datagrid_json, $(
														"#form-kdstl")
														.serializeObj());
										DownLoad({
											url : url,
											data : data
										});
									})
				});