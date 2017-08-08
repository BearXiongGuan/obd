//查询参数全局变量
var qryJson = {};
var loginUser = JSON.parse($.cookie('loginUser'));
qryJson.creater = loginUser.loginName;
var ReviewDataFlag = 0;
var ReviewDataNewValue;
var resubmitWithNoRender = 0;

$("#mySubmitReviewData")
		.on('click',
				function() {
					submitReviewTabToogle();
					$("#my_dataReviewGrid")
							.datagrid(
									{
										title : "",
										rownumbers : true,
										fitColumns : false,
										pagination : true,
										striped : true,
										pageSize : 10,
										pageNumber : 1,
										width : 988,
										height : 500,
										nowrap : false,
										idField : 'id',
										singleSelect:true,
										columns : [ [
												{
													field : 'ck',
													checkbox : true
												},
												{
													field : 'id',
													title : '',
													hidden : true
												},
												{
													field : 'datakeyId',
													title : '',
													hidden : true
												},
											    {
                                                    title : '操作',
                                                    field : 'opt',
                                                    width : 200,
                                                    align : 'center',
                                                    formatter : function(value,
                                                                         row, index) {
                                                        var str = "";
                                                        var firstBtn = "<span class='icon-mapView1' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>" +
															"<a id='first_"+index+"' style='vertical-align:middle; color: #2a86f3' href='javascript:review_building(2,"+index+","+ row.datakeyId+ ","+ row.oldValue+ ","+ row.newValue + ","
                                                            + row.dataType + "," + row.shapeLen + ","+ row.status + ");'  title='地图查看'>地图查看</a><span style='width:10px;display:inline-block'></span>";

                                                        var firstBtn_grey = "<span class='icon-mapView2' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>" +
                                                            "<a id='first_"+index+"' style='vertical-align:middle; color: #737373; cursor: default;' href='javascript:void(0);'  title='地图查看'>地图查看</a><span style='width:10px;display:inline-block'></span>";

                                                        var viewBtn = "<span class='icon-details1' style='width:16px;height:16px;display:inline-block;vertical-align:middle;margin:0 5px 0 0;'></span><a id='second_"+index+"' style='vertical-align:middle; color: #2a86f3' href='javascript:my_show_review_data("
                                                            + index + "," + row.oldValue + "," + row.newValue + ","+ row.dataType + "," + row.datakeyId+")' title='详情'>详情</a><span style='width:10px;display:inline-block'></span>";
                                                        
                                                        var viewBtn_grey = "<span class='icon-details2' style='width:16px;height:16px;display:inline-block;vertical-align:middle;margin:0 5px 0 0;'></span><a id='second_"+index+"' style='vertical-align:middle;color:#737373;cursor:default;' href='javascript:void(0);' title='详情'>详情</a><span style='width:10px;display:inline-block'></span>";
                                                       
                                                        var resentBtn = "<span class='icon-resubmit1' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span><a id='third_"+index+"' style='vertical-align:middle; color: #2a86f3' href='javascript:my_showDialog_by_type("
                                                            + row.id + "," + row.dataType + "," + row.datakeyId + "," + row.status + "," + row.newValue + ","+ row.shapeLen+","+ row.oldValue+");'  title='重新提交'>重新提交</a><span style='width:10px;display:inline-block'></span>";

                                                        var resentBtn_grey = "<span class='icon-resubmit2' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>" +
                                                            "<a id='third_"+index+"' style='vertical-align:middle; color: #737373; cursor:default' href='javascript:void(0);'  title='重新提交'>重新提交</a><span style='width:10px;display:inline-block'></span>";


                                                        var closeBtn = "<span class='icon-abandoned1' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>" +
                                                            "<a id='four_"+index+"' style='vertical-align:middle; color: #2a86f3' href='javascript:javascript:my_review_data("+ index + ","+ row.id + ",3" + ");'  title='废弃'>废弃</a>";

                                                        var closeBtn_grey = "<span class='icon-abandoned2' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>" +
                                                            "<a id='four_"+index+"' style='vertical-align:middle; color: #737373; cursor:default' href='javascript:void(0);'  title='废弃'>废弃</a>";

                                                        if (row.status != 2) {  // 状态 1-添加，2-修改，3-删除,4-图形修改
                                                        	if(row.status!=1){
                                                        		str = firstBtn+viewBtn_grey;
                                                        	}else{
                                                        		str = firstBtn+viewBtn;
                                                        	}
                                                        }else {
                                                        	str = firstBtn_grey+viewBtn;  //firstBtn 灰掉。
														}

                                                        if (row.reviewStatus == 0) {  //审核状态 0-未审核 1-已审核 2-未通过 3-已关闭
															str +=closeBtn;  //resentBtn灰掉。

                                                        } else if (row.reviewStatus == 1 || row.reviewStatus == 3) {  //已审批1， 已废弃3
															//str +=viewBtn;  //resentBtn+closeBtn灰掉
                                                        } else if (row.reviewStatus == 2 ) {  //已驳回 2
                                                          	if(row.status == 3 || row.status == 4){   //删除与图形修改，重新提交置灰
                                                                str += resentBtn_grey + closeBtn;
                                                            }else if(row.status ==2 || row.status ==1){
                                                                str += resentBtn + closeBtn;
															}
                                                        }
                                                        return str;
                                                    }
												},
												{
													field : 'dataKeyName',
													title : '数据名称',
													width : 300,
													align : 'left'
												},
                                            {
                                                field : 'status',
                                                title : '编辑类型',
                                                width : 100,
                                                align : 'left',
                                                formatter : function(value,
                                                                     row, index) {
                                                    if (value == 1) {
                                                        return "添加";
                                                    } else if (value == 2) {
                                                        return "属性修改";
                                                    } else if (value == 4) {
                                                        return "图形修改";
                                                    } else if (value == 3) {
                                                        return "删除";
                                                    }
                                                }
                                            },
												{
													field : 'creater',
													title : '创建人',
													width : 120,
													align : 'left'
												},
												{
													field : 'createDate',
													title : '创建时间',
													width : 160,
													align : 'left'
												},
												{
													field : 'countyName',
													title : '分公司',
													width : 100,
													align : 'left'
												},
												{
													field : 'mkName',
													title : '营服中心',
													width : 120,
													align : 'left'
												},
												{
													field : 'dataType',
													title : '数据类型',
													width : 80,
													align : 'left',
													formatter : function(value,
															row, index) {
														if (value == 1) {
															return "设施";
														} else if (value == 2) {
															return "建筑物";
														} else if (value == 3) {
															return "网格";
														} else if (value == 4) {
															return "服务区";
														}
													}
												},
												{
													field : 'oldValue',
													title : '旧值',
													width : 80,
													hidden : true,
													align : 'left'
												},
												{
													field : 'newValue',
													title : '新值',
													width : 80,
													hidden : true,
													align : 'left'
												},
												{
												field : 'shapeLen',
												title : '新值',
												width : 80,
												hidden : true,
												align : 'left'
												},
												/*{
													field : 'reviewStatus',
													title : '审批状态',
													width : 100,
													align : 'left',
													formatter : function(value,
															row, index) {
														if (value == 0) {
															return "待审批";
														} else if (value == 1) {
															return "已审批";
														} else if (value == 2) {
															return "已驳回";
														} else if (value == 3) {
															return "已废弃";
														} else if (value == 4) {
															return "重新提交";
														}
													}

												},*/
												{
													field : 'remark',
													title : '审批意见',
													width : 160,
													align : 'left'
												},
												{
													field : 'reviewer',
													title : '审批人',
													width : 80,
													align : 'left'
												},
												{
													field : 'reviewDate',
													title : '审批时间',
													width : 160,
													align : 'left'
												}
											] ],

										onLoadSuccess : function(data) {
											var pager = $("#my_dataReviewGrid")
													.datagrid('getPager');
											qryJson = $.extend(qryJson, $(
													"#mySubmitReviewForm")
													.serializeObj());
											$(pager)
													.pagination(
															{
																onSelectPage : function(
																		pageNumber,
																		pageSize) {
																	my_loadReviewData(
																			pageNumber,
																			pageSize,
																			qryJson);
																},
																onChangePageSize : function(
																		pageSize) {
																	$(pager)
																			.pagination(
																					"options").pageNumber = 1;
																},
																onRefresh : function(
																		pageNumber,
																		pageSize) {
																	$(
																			"#my_dataReviewGrid")
																			.datagrid(
																					"clearSelections");
																	my_loadReviewData(
																			pageNumber,
																			pageSize,
																			qryJson);
																}
															});
										}
									});
					$("#my_dataReviewGrid").datagrid("clearSelections");
					// 初始加载
					my_resetDataReviewForm();
				});





//切换tab
 function submitReviewTabToogle() {
	 $('#my_dataReview_reviewStatus_tabs').find(".tabs li").unbind('click').bind(
			'click',
			function() {

				var index = $(this).index();
				$(".tabs .tabs-first").removeClass("tabs-selected");
				$(this).addClass("tabs-selected").siblings().removeClass(
						"tabs-selected");
				
				var dg = $("#my_dataReviewGrid");
				var col = dg.datagrid('getColumnOption', 'opt');
				
				// 待审批不显示审核时间
				if (index == 0) {
					$("#myReviewLi").hide();
				} else {
					$("#myReviewLi").show();
				}
				// 动态控制显示和隐藏列
				if (index == 0) {
					$('#my_dataReviewGrid').datagrid('hideColumn', 'reviewer');
					$('#my_dataReviewGrid').datagrid('hideColumn', 'reviewDate');
					$('#my_dataReviewGrid').datagrid('hideColumn', 'remark');
					
					col.width = 200;
					dg.datagrid();
				} else if (index == 1) {
					$('#my_dataReviewGrid').datagrid('showColumn', 'reviewer');
					$('#my_dataReviewGrid').datagrid('showColumn', 'reviewDate');
					$('#my_dataReviewGrid').datagrid('hideColumn', 'remark');
					
					col.width = 150;
					dg.datagrid();
				} else if (index == 2) {
					$('#my_dataReviewGrid').datagrid('showColumn', 'reviewer');
					$('#my_dataReviewGrid').datagrid('showColumn', 'reviewDate');
					$('#my_dataReviewGrid').datagrid('showColumn', 'remark');
					
					col.width = 285;
					dg.datagrid();
				} else if (index == 3) {
					$('#my_dataReviewGrid').datagrid('hideColumn', 'reviewer');
					$('#my_dataReviewGrid').datagrid('hideColumn', 'reviewDate');
					$('#my_dataReviewGrid').datagrid('hideColumn', 'remark');
					
					col.width = 150;
					dg.datagrid();
				}

				qryJson = {};
				qryJson.creater = loginUser.loginName;
				qryJson.reviewStatus = index;
				qryJson = $.extend(qryJson, $("#mySubmitReviewForm").serializeObj());
				var pager = $("#my_dataReviewGrid").datagrid('getPager');
				$(pager).pagination("options").pageNumber = 1;
				pageNumber = 1;
				var pageSize = $("#my_dataReviewGrid").datagrid('getPager').pagination(
						"options").pageSize;
				my_loadReviewData(pageNumber, pageSize, JSON.stringify(qryJson));
			});
}

// 点击查询按钮
$("#my_dataReview_searchBtn").click(
		function() {
			$("#my_dataReviewGrid").datagrid("clearSelections");
			var pager = $("#my_dataReviewGrid").datagrid('getPager');
			$(pager).pagination("options").pageNumber = 1;
			qryJson = $
					.extend(qryJson, $("#mySubmitReviewForm").serializeObj());
			var pageNumber = $("#my_dataReviewGrid").datagrid('getPager')
					.pagination("options").pageNumber;
			var pageSize = $("#my_dataReviewGrid").datagrid('getPager')
					.pagination("options").pageSize;
			my_loadReviewData(pageNumber, pageSize, JSON.stringify(qryJson));

		});

// 加载远程数据
function my_loadReviewData(pageNumber, pageSize, queryParams) {
	if (pageNumber == 0) {
		$("#my_dataReviewGrid").datagrid("loadData", {
			rows : [],
			total : 0
		});
		return;
	}
	var jsonObj = {};
	jsonObj.pageSize = pageSize;
	jsonObj.pageNumber = pageNumber;
	jsonObj.objCondition = queryParams;
	$.ajax({
		type : "POST",
		url : "restful/dataReview/getPage",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(jsonObj),
		success : function(data) {
			var contentStr = data.content;
			var dataResult = JSON.parse(contentStr);
			$("#my_dataReviewGrid").datagrid("loadData", {
				rows : dataResult.rows,
				total : dataResult.total
			});
			var rowNumbers = $('.datagrid-cell-rownumber');
			$(rowNumbers).each(
					function(index) {
						var row = parseInt($(rowNumbers[index]).html() - 1)
								% parseInt(pageSize) + 1;
						$(rowNumbers[index]).html(row);
					});
		},
		error : function(err) {
		}
	});
}

// 重置查询表单
function my_resetDataReviewForm() {
	$('#my_dataReview_reviewStatus_tabs').find(".tabs .tabs-first").addClass("tabs-selected").siblings().removeClass("tabs-selected");
	$('#my_dataReviewGrid').datagrid('hideColumn','reviewer');
	$('#my_dataReviewGrid').datagrid('hideColumn','reviewDate');
	$('#my_dataReviewGrid').datagrid('hideColumn','remark');
	$('#my_dataReview_reviewStatus_tabs').tabs('select', 0);
	$("#myReviewLi").hide();
	// 置空查询参数
	$("#my_dataType").val("2");
	$("#myCreateDateStart").datebox("setValue", "");
	$("#myCreateDateEnd").datebox("setValue", "");
	$("#myReviewDateStart").datebox("setValue", "");
	$("#myReviewDateEnd").datebox("setValue", "");
	$("#my_dataReview_Batch_feedBackBtn").show();
    var dg = $("#my_dataReviewGrid");
    var col = dg.datagrid('getColumnOption', 'opt');
    col.width = 200;
    dg.datagrid();

	qryJson = {};
	qryJson.creater = loginUser.loginName;
	qryJson.reviewStatus = 0;
	qryJson = $.extend(qryJson, $("#mySubmitReviewForm").serializeObj());
	my_loadReviewData(1, 10, JSON.stringify(qryJson));
}

// 点击重置按钮
$("#my_dataReview_resetBtn").click(function() {
	my_resetDataReviewForm();
});

function my_review_data(index, ids, status) {
	var label = "";
	var remark = "";
	if (status == 3) {
		label = "废弃";
	}

	$("#my_dataReviewGrid").datagrid('checkRow', index);
	if (status == 3) {
		$.messager.confirm('确认', '您确认' + label + '吗？', function(r) {
			if (r) {
				my_review(ids, status, remark);
			}
		});

	} else if (status == 4) {

	}

}

// 数据审批
function my_review(ids, status, remark) {
	var jsonObj = {};
	jsonObj.ids = "" + ids;
	jsonObj.flag = "" + status;
	jsonObj.reviewer = loginUser.loginName;
	jsonObj.remark = remark;
	jsonObj.opPlatform = "0";
	$.ajax({
		type : "POST",
		url : "restful/dataReview/reviewData",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(jsonObj),
		success : function(data) {
			var status = data.status;
			if (status) {
				$.messager.alert({
					title : '消息',
					msg : '操作成功！',
					icon : 'info'
				});
				my_resetPageInfo();
			} else {
				$.messager.alert({
					title : '消息',
					msg : '操作失败！',
					icon : 'error'
				});
			}
		},
		error : function(err) {
			$.messager.alert({
				title : '消息',
				msg : '操作失败！',
				icon : 'error'
			});
		}
	});
}

// 需要修改的数据缓存
var fieldModifyData = [];
// 查看详情
function my_show_review_data(index, oldValue, newValue, dataType,dataKeyId) {
	$("#dataView_modify_config_passBtn").hide();
	$("#dataView_modify_config_fadebackBtn").hide();
	$("#dataView_modify_config_dataType").val(dataType);
	$("#dataView_modify_config_facid").val(dataKeyId);
	//只有设施和建筑物可以预览图片
	if(dataType==1||dataType==2){
		$("#dataView_modify_config_viewPicBtn").show();
	}else{
		$("#dataView_modify_config_viewPicBtn").hide();
	}
	$("#my_dataReviewGrid").datagrid('checkRow', index);
	var jsonObj = {};
	jsonObj.dataType = dataType;
	var data = [];
	// 缓存为空，则查询数据库
	if (fieldModifyData == null || fieldModifyData.length == 0
			|| fieldModifyData == undefined) {
		// 查询系统配置中的能够修改的字段的中英文对应关系
		$.ajax({
			type : "POST",
			url : "restful/fieldModifyConfig/getByWhere",
			dataType : "json",
			async : false,
			contentType : "application/json",
			data : JSON.stringify(jsonObj),
			success : function(data) {
				var content = data.content;
				fieldModifyData = content;
			},
			error : function(err) {

			}
		});
	}
	// 处理返回的数据，构造datagrid数据
	var filterData = my_constructFieldModifyDatagrid(fieldModifyData, oldValue,
			newValue);
	fieldModifyData = [];
	$("#dataView_modify_config_table").datagrid({
		title : "",
		rownumbers : true,
		fitColumns : false,
		striped : true,
		singleSelect : true,
		nowrap : false,
		width : 470,
		height : 464,
		idField : 'id',
		columns : [ [ {
			field : 'id',
			title : '',
			hidden : true
		}, {
			field : 'fieldCnName',
			title : '名称',
			width : 110
		}, {
			field : 'oldFieldValue',
			title : '旧值',
			width : 150
		}, {
			field : 'newFieldValue',
			title : '新值',
			width : 150
		} ] ]
	});
	
	$("#dataView_modify_config_dialog").dialog({
		title : '数据详情',
		width : 472,
		height : 550,
		closed : false,
		cache : false,
		modal : true
	}).show();
	$("#dataView_modify_config_table").datagrid("loadData", filterData);
}

function my_constructFieldModifyDatagrid(fieldModifyData, oldValue, newValue) {
	var fieldModifyObj = JSON.parse(fieldModifyData);
	var resultData = [];
	for ( var i in fieldModifyObj) {
		var enName = fieldModifyObj[i].fieldEnName;
		var cnName = fieldModifyObj[i].fieldCnName;
		var id = fieldModifyObj[i].id;
		for ( var key in newValue) {
			var fieldModifyItem = {};
			if (key == enName) {
				fieldModifyItem.id = id;
				fieldModifyItem.oldFieldValue = (oldValue == "" || oldValue == null) ? ""
						: oldValue[enName];
				fieldModifyItem.newFieldValue = newValue[enName];
				fieldModifyItem.fieldCnName = cnName;
				resultData.push(fieldModifyItem);
			}
		}
	}
	return resultData;
}

// 重新设置分页数据
function my_resetPageInfo() {
	var pager = $("#my_dataReviewGrid").datagrid("getPager");
	// 初始加载
	var options = $(pager).pagination("options");
	var pageNumber = options.pageNumber;
	var selCount = $("#my_dataReviewGrid").datagrid("getSelections").length;
	var total = $(pager).pagination("options").total - parseInt(selCount);
	var pageSize = $(pager).pagination("options").pageSize;
	var totalpagenumber = total % pageSize == 0 ? Math.floor(total / pageSize)
			: Math.floor(total / pageSize) + 1;
	options.pageNumber = pageNumber <= totalpagenumber ? pageNumber
			: totalpagenumber;
	var tab = $('#my_dataReview_reviewStatus_tabs').tabs('getSelected');
	var index = $('#my_dataReview_reviewStatus_tabs').tabs('getTabIndex', tab);
	my_loadReviewData(options.pageNumber, 10, {
		"creater" : loginUser.loginName,
		"dataType" : $("#my_dataType").val(),
		"createDateStart":$("#myCreateDateStart").datebox('getValue'),
		"createDateEnd":$("#myCreateDateEnd").datebox('getValue'),
		"reviewDateStart":$("#myReviewDateStart").datebox('getValue'),
		"reviewDateEnd":$("#myReviewDateEnd").datebox('getValue'),
		"reviewStatus" : index
	});
	$("#my_dataReviewGrid").datagrid('clearSelections');
}

function my_showDialog_by_type(id,dataType, datakeyId, status, newValue,shapeLen) {
	if (dataType == 1) {// 设施
		switch (status) {
		case 1:// 添加
			break;
		case 2:// 属性修改
			$.ajax({
				type : "GET",
				url : "restful/lightfacility/getById",
				dataType : "json",
				data : {
					"id" : "" + datakeyId
				},
				success : function(data) {
					var contentStr = data.content;
					var dataResult = JSON.parse(contentStr);
					dataResult = $.extend(dataResult,{"dataReviewId":id});
					createOrgsCombo(dataResult.countyId);
					$("#facility_detail_form").form('load', dataResult);
					
					$('#facilityDialog').dialog({
						title : '设施修改',
						closed : false,
						cache : false,
						modal : true
					}).show();
				},
				error : function(err) {
				}
			});
			break;
		case 3:// 图形修改
			break;
		case 4:// 删除
			break;
		}
	} else if (dataType == 2) {// 建筑物
		switch (status) {
		case 1:// 添加
			$.messager.confirm("操作提示", "确定重新绘制建筑物轮廓吗？", function (data) {
				if (data) {
					$("#mySubmit_dataReview").hide();
					map.graphics.clear();
					rendererJzw();
					var gra = graphics(newValue);
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
					$("#jzw_dataReviewId").val(id);
					newValue.dataReviewId=id;
					ReviewDataFlag = 1;
					ReviewDataNewValue = newValue;
					return;
				} else {
					$("#shapeNew").val(newValue.shape);
					resubmitWithNoRender = 1;
					// createOrgs();
					// $("#selectOrganization").change(
					// 		function() {
					// 			var optionVal = $(this).val();
					// 			var mkcenterData = loadOrgs(optionVal);
					// 			$("#selectYingFu").empty();
					// 			$.each(mkcenterData, function(i, r) {
					// 				var option = "<option value='" + r.id
					// 						+ "'>" + r.text + "</option>";
					// 				$("#selectYingFu").append(option);
					// 				if (i == 0) {
					// 					var data = {};
					// 					data.village = r.text;
					// 					getGird(data);
					// 				}
					// 			});
					// 		});
					// $("selectYingFu").change(function() {
					// 	var data = {};
					// 	data.village = $(this).text();
					// 	getGird(data);
					// });
					// villageChange();
					getStructureType("STRUCTURETYPE");
					// getYingFu($('#selectOrganization').val());
					$('#buildingPropertyAdd').dialog({
						title : '建筑物添加',
						closed : false,
						cache : false,
						modal : true
					}).show();
					getAddrsByPid(0,"oneLever");
                    $("#oneLever").combobox({onChange:function(n,o){
                    	var onelever = $(this).combobox('getValue');
                    	$("#oneLeverId").val($(this).combobox('getValue'));
                    	getAddrsByPid(onelever,"twoLever");
                    }});
                    $("#twoLever").combobox({onChange:function(n,o){
                    	var twolever = $(this).combobox('getValue');
                    	$("#twoLeverId").val($(this).combobox('getValue'));
                    	getAddrsByPid(twolever,"threeLever");
                    }});
                    $("#threeLever").combobox({onChange:function(n,o){
                    	var threelever = $(this).combobox('getValue');
                    	$("#threeLeverId").val($(this).combobox('getValue'));
                    	getAddrsByPid(threelever,"fourLever");
                    }});
                    $("#fourLever").combobox({onChange:function(n,o){
                    	var fourlever = $(this).combobox('getValue');
                    	$("#fourLeverId").val($(this).combobox('getValue'));
                    	checkLeverExist($(this).combobox('getValue'),"fourLever");
                    	getAddrsByPid(fourlever,"fiveLever");
                    }});
                    $("#fiveLever").combobox({onChange:function(n,o){
                    	var fivelever = $(this).combobox('getValue');
                    	$("#fiveLeverId").val($(this).combobox('getValue'));
                    	checkLeverExist($(this).combobox('getValue'),"fiveLever");
                    	getAddrsByPid(fivelever,"sixLever");
                    }});
                    $("#sixLever").combobox({onChange:function(n,o){
                    	var sixlever = $(this).combobox('getValue');
                    	$("#sixLeverId").val($(this).combobox('getValue'));
                      	checkLeverExist($(this).combobox('getValue'),"sixLever");
                    	getAddrsByPid(sixlever,"sevenLever");
                    }});
                    $("#sevenLever").combobox({onChange:function(n,o){
                    	checkLeverExist($(this).combobox('getValue'),"sevenLever");
                    	$("#buildingAddr").val($.trim($("#oneLever").combobox("getText"))+$.trim($("#twoLever").combobox("getText"))+$.trim($("#threeLever").combobox("getText"))+$.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
                        $('#buildingAddrId').val($("#sevenLeverId").val());
                        $("#buildingName").val($.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
                    }});
                    $("#buildingPropertyAdd_form").form('load', newValue);
                    $("#jzw_dataReviewId").val(id);
                    $('#selectOrganization').empty();
                    $('#selectYingFu').empty();
                    $("#selectOrganization").append("<option value='"+newValue.countyId+"'>"+newValue.county+"</option>");
                    $("#selectYingFu").append("<option value='"+newValue.villageId+"'>"+newValue.village+"</option>");
                    $('#selectOrganization').val(newValue.countyId);
					$('#selectYingFu').val(newValue.villageId);
                    $('#oneLever').combobox("select",newValue.addrId1);
                    $('#twoLever').combobox("select",newValue.addrId2);
                    $('#threeLever').combobox("select",newValue.addrId3);
                    $('#fourLever').combobox("select",newValue.addrId4);
                    $('#fiveLever').combobox("select",newValue.addrId5);
                    $('#sixLever').combobox("select",newValue.addrId6);
                    $('#sevenLever').combobox("select",newValue.addrId7);
					$("#shapeNew").val(newValue.shape);
                    loadWg(newValue.village,newValue.wgName);
                }
	        });
			break;
		case 2:// 属性修改
			$.ajax({
		        type: "GET",
		        url: "restful/building/findAddrsbyfacid",
		        data: {facid:datakeyId},
		        success: function (data) {
		            if (data.status = 'success') {
		                var records = JSON.parse(data.content);
		                propertyShow(records[0]);
						var DataReview = {};
		                $("#building_dataReviewId").val(id);
		                $("#building_dataKeyId").val(datakeyId);
		                buildingOldValue=newValue;
		            }
		        }
		    });
			break;
		case 3:// 图形修改
			break;
		case 4:// 删除
			break;
		}
	}else if(dataType == 3){//网格
		if(status==1){
			//添加
		    $.messager.confirm("操作提示", "确定重新绘制网格轮廓吗？", function (data) {
				if (data) {
					$("#mySubmit_dataReview").hide();
					map.graphics.clear();
					rendererWg();
					var gra = graphics(newValue);
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
					ReviewDataFlag = 1;
					$("#wgFacName").val(newValue.facName);
	        		$("#wgCode").val(newValue.code);
	        		$("#wg_add_dataReviewId").val(id);
					return;
				} else {
					addWgResent(newValue);
					$("#wg_shapeNew").val(newValue.shape);
				    $("#wg_add_dataReviewId").val(id);
				}
	        });
		}else if(status==2){
			//修改
			wgPropertyEditResent(newValue);
			$("#wg_edit_dataReviewId").val(id);
			$("#wg_edit_dataKeyId").val(datakeyId);
			buildingOldValue=newValue;
		}
	}else if(dataType == 4){//服务区
		if(status==1){
			//添加
			$.messager.confirm("操作提示", "确定重新绘服务区轮廓吗？", function (data) {
				if (data) {
					$("#mySubmit_dataReview").hide();
					map.graphics.clear();
					rendererFwq();
					var gra = graphics(newValue);
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
					ReviewDataNewValue = newValue;
					ReviewDataFlag = 1;
					$("#otb_add_dataReviewId").val(id);
					$("#otbFacName").val(newValue.facName);
					return;
				} else {
					ReviewDataNewValue = newValue;
					/*$("#otb_shapeNew").val(newValue.shape);*/

					creatOTBPropertyPanel();
					$("#otb_add_dataReviewId").val(id);
					$("#otb_shapeNew").val(newValue.shape);
					$("#otbFacName").val(newValue.facName);
					$("#otbgird").val(newValue.wgName);
					$("#otbgirdid").val(newValue.wgId);
					$.ajax({
						type: "GET",
						url: "restful/organization/getByOrgId",
						data:{orgId:100000},
						success: function (data) {
							if (data.status = 'success') {
								var records = JSON.parse(data);
								otbCreatPropertyDataResubmit(records);
							}
						},
						error: function (err) {
						}
					});

				}
			});
		}else if(status==2){
			//修改
			fwqPropertyEditResubmit(newValue);
			$("#otb_edit_dataReviewId").val(id);
			$("#otb_edit_dataKeyId").val(datakeyId);
			buildingOldValue=newValue;
		}
	}
}

function loadWg(village,wgFacName){
	var data ={};
	var id;
	data.village = village;
    $.ajax({
        type: "POST",
        url: "restful/wg/getByWhere",
        contentType:"application/json",
        dataType:"json",
		// async:false,
        data: JSON.stringify(data),
        success: function (data) {
                if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $("#selectYingGird").empty();
                if(records.length>0){
                    var arr = new Array();
                    for(var i=0;i<records.length;i++){
                        var jsonObj ={};
                        jsonObj.facId = records[i].facId;
                        jsonObj.facName = records[i].facName;
                        arr.push(jsonObj);
                        if(wgFacName == records[i].facName){
                            id=records[i].facId;
                        }
                    }
                    $("#selectYingGird").combobox('select',id);
                    $("#selectYingGird").combobox('loadData',arr);
                }
            }
        },
        error: function (err) {
        }
    });
}

//显示网格属性添加框重新提交
function addWgResent(newValue) {
    wgCreatWgPropertyPanel();
    $("#wgPropertyAdd input").val("");
    $('#wgCounty').empty();
    $('#wgVillage').empty();
    $('#wgTypeFacname').empty();
    $("#wgFacName").val(newValue.facName);
    $("#wgCode").val(newValue.code);
    $.ajax({
        type: "GET",
        url: "restful/girdcell/getAll",
        dataType:"json",
        success: function (data) {
            if (data.status = 'success') {
            	var records=JSON.parse(data.content);
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
        async:false,
        dataType:"json",
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                if(records.length>0){
                    for(var i=0;i<records.length;i++){
                        $("#wgCounty").append('<option value= '+records[i].id+'>'+records[i].text+'</option>');
                    }
                }
            }
        },
        error: function (err) {
        }
    });
    loadWgYF($("#wgCounty").val());
    $("#wgCounty").change(function(){
    	$("#wgVillage").empty();
    	loadWgYF($("#wgCounty").val());
    });
}
function loadWgYF(countyId){
	 $.ajax({
	        type: "GET",
	        url: "restful/organization/getByOrgId",
	        async: true,
	        data:{orgId:countyId},
	        dataType:"json",
	        success: function (data) {
	            if (data.status = 'success') {
	            	 var records = JSON.parse(data.content);
	                if(records.length>0){
	                	var id;
	                    for(var i=0;i<records.length;i++){
	                        $("#wgVillage").append('<option value= '+records[i].id+'>'+records[i].text+'</option>');
	                        if(yfName == records[i].text){
	                            id = records[i].id;
	                        }
	                    }
	                    $("#wgVillage").val(id);
	                }
	            }
	        },
	        error: function (err) {
	        }
	    });
}
//显示网格属性修改框重新提交
function wgPropertyEditResent(newValue) {
    $('#wgPropertyEdit').dialog({
        title: '网格属性修改',
        closed: false,
        cache: false,
        modal: true
    });
    $('#wgPropertyEdit').show();
    $("#wgTypeFacnameEdit").empty();
    var id;
    $.ajax({
        type: "GET",
        url: "restful/girdcell/getAll",
        success: function (data) {
            if (data.status = 'success') {
                var records = JSON.parse(data.content);
                $.each(records, function (j, r) {
                	 if(r.dictName == newValue.gridType){
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
    $("#wgFacNameEdit").val(newValue.facName);
    $("#wgCountyEdit").val(newValue.county);
    $("#wgVillageEdit").val(newValue.village);
    $("#wgCodeEdit").val(newValue.code);
    buildingOldValue.facName = $("#wgFacNameEdit").val();
}
// 装载县份或营服数据到下拉列表
function createOrgs() {
	var rootData = loadOrgs("100000");
	$("#selectOrganization").empty();
	$("#selectYingFu").empty();
	$.each(rootData, function(i, r) {
		var option = "<option value='" + r.id + "'>" + r.text + "</option>";
		$("#selectOrganization").append(option);
		if (i == 0) {
			var mkcenterData = loadOrgs(r.id);
			$.each(mkcenterData, function(i, r) {
				var option = "<option value='" + r.id + "'>" + r.text
						+ "</option>";
				$("#selectYingFu").append(option);
			});
		}
	});

}
//选择数据类型时，查询数据
$("#my_dataType").change(function(){
	$("#my_dataReview_searchBtn").click();
});

function graphics(newValue){
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
	return gra;
}
function addJzwReviewData() {
	$("#shapeNew").val(ReviewDataNewValue.shape);
	// createOrgs();
	getStructureType("STRUCTURETYPE");
	// getYingFu($('#selectOrganization').val());
	$('#buildingPropertyAdd').dialog({
		title : '建筑物添加',
		closed : false,
		cache : false,
		modal : true
	}).show();
	getAddrsByPid(0,"oneLever");
	$("#oneLever").combobox({onChange:function(n,o){
		var onelever = $(this).combobox('getValue');
		$("#oneLeverId").val($(this).combobox('getValue'));
		getAddrsByPid(onelever,"twoLever");
	}});
	$("#twoLever").combobox({onChange:function(n,o){
		var twolever = $(this).combobox('getValue');
		$("#twoLeverId").val($(this).combobox('getValue'));
		getAddrsByPid(twolever,"threeLever");
	}});
	$("#threeLever").combobox({onChange:function(n,o){
		var threelever = $(this).combobox('getValue');
		$("#threeLeverId").val($(this).combobox('getValue'));
		getAddrsByPid(threelever,"fourLever");
	}});
	$("#fourLever").combobox({onChange:function(n,o){
		var fourlever = $(this).combobox('getValue');
		$("#fourLeverId").val($(this).combobox('getValue'));
		checkLeverExist($(this).combobox('getValue'),"fourLever");
		getAddrsByPid(fourlever,"fiveLever");
	}});
	$("#fiveLever").combobox({onChange:function(n,o){
		var fivelever = $(this).combobox('getValue');
		$("#fiveLeverId").val($(this).combobox('getValue'));
		checkLeverExist($(this).combobox('getValue'),"fiveLever");
		getAddrsByPid(fivelever,"sixLever");
	}});
	$("#sixLever").combobox({onChange:function(n,o){
		var sixlever = $(this).combobox('getValue');
		$("#sixLeverId").val($(this).combobox('getValue'));
		checkLeverExist($(this).combobox('getValue'),"sixLever");
		getAddrsByPid(sixlever,"sevenLever");
	}});
	$("#sevenLever").combobox({onChange:function(n,o){
		checkLeverExist($(this).combobox('getValue'),"sevenLever");
		$("#buildingAddr").val($.trim($("#oneLever").combobox("getText"))+$.trim($("#twoLever").combobox("getText"))+$.trim($("#threeLever").combobox("getText"))+$.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
		$('#buildingAddrId').val($("#sevenLeverId").val());
		$("#buildingName").val($.trim($("#fourLever").combobox("getText"))+$.trim($("#fiveLever").combobox("getText"))+$.trim($("#sixLever").combobox("getText"))+$.trim($("#sevenLever").combobox("getText")));
	}});
	$("#buildingPropertyAdd_form").form('load', ReviewDataNewValue);
    $('#selectOrganization').empty();
    $('#selectYingFu').empty();
    $("#selectOrganization").append("<option value='"+ReviewDataNewValue.countyId+"'>"+ReviewDataNewValue.county+"</option>");
    $("#selectYingFu").append("<option value='"+ReviewDataNewValue.villageId+"'>"+ReviewDataNewValue.village+"</option>");
    $('#selectOrganization').val(ReviewDataNewValue.countyId);
    $('#selectYingFu').val(ReviewDataNewValue.villageId);
	$('#oneLever').combobox("select",ReviewDataNewValue.addrId1);
	$('#twoLever').combobox("select",ReviewDataNewValue.addrId2);
	$('#threeLever').combobox("select",ReviewDataNewValue.addrId3);
	$('#fourLever').combobox("select",ReviewDataNewValue.addrId4);
	$('#fiveLever').combobox("select",ReviewDataNewValue.addrId5);
	$('#sixLever').combobox("select",ReviewDataNewValue.addrId6);
	$('#sevenLever').combobox("select",ReviewDataNewValue.addrId7);
	$("#shapeNew").val(ReviewDataNewValue.shape);
	loadWg(ReviewDataNewValue.village,ReviewDataNewValue.wgName);
}

function addfwqReviewData() {
	$("#otb_shapeNew").val(ReviewDataNewValue.shape);
	creatOTBPropertyPanel();
	//$("#otbPropertyAdd input").val("");
	//$("#otbFacName").val(otbName);
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

function otbCreatPropertyDataResubmit(data){
	$("#otbCounty").empty();
	$("#otbVillage").empty();
	currentEditedMap = fwq;
	identifyQueryForResubmit(graphics(ReviewDataNewValue).geometry.getExtent().getCenter(),wg);
	if(data.content.length>0){
		var jsonO = eval("("+data.content+")");
		for(var i=0;i<jsonO.length;i++){
			$("#otbCounty").append('<option value= '+jsonO[i].id+'>'+jsonO[i].text+'</option>');
		}
	}
}


function identifyQueryForResubmit(geometry,mapServer) {
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
	identifyTask.execute(params,showQueryResultForPositionResubmit);
}


//ͨ通过此函数处理查询之后的信息
function showQueryResultForPositionResubmit(idResults) {
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
	}
	if (idResults.length > 0) {

		for (var i = 0; i < idResults.length; i++) {
			var result = idResults[i];

			bjGraphic = result.feature;

			yfName = bjGraphic.attributes.VILLAGE;

			wgFacName = bjGraphic.attributes.FACNAME;
		}
		var county = bjGraphic.attributes.COUNTY;

		if (county) {
			$("#"+ id).find("option:contains('" + county + "')").attr("selected",true);
		}
	}

	if(currentEditedMap == jzw){
		getYingFu($('#selectOrganization').val());
	}else if( currentEditedMap == wg){
		getYingFu($('#wgCounty').val());
	}else if( currentEditedMap == lightfacility){

	}else if( currentEditedMap == xfbj){

	}else if( currentEditedMap == yfbj){

	}else if(currentEditedMap == fwq){
		getYingFu($('#otbCounty').val());
		$("#otbgird").val(wgFacName);
		$("#otbgirdid").val(bjGraphic.attributes.FACID);
	}
}

function fwqPropertyEditResubmit(newValue) {
	$('#otbPropertyEdit').dialog({
		title: '服务区属性修改',
		closed: false,
		cache: false,
		modal: true
	});
	$('#otbPropertyEdit').show();
	$(".panel-tool .panel-tool-close").hide();
	$("#otbFacNameEdit").empty();

	$("#otbFacNameEdit").val(newValue.facName);
	$("#otbgirdEdit").val(newValue.wgName);
	$("#otb_edit_countyName").val(newValue.COUNTY);
	$("#otb_edit_villageName").val(newValue.VILLAGE);
}
