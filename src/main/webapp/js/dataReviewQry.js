//查询参数全局变量
var qryJson = {};
var loginUser = JSON.parse($.cookie('loginUser'));
qryJson.userId = loginUser.id;

$("#myReviewData")
		.click(
				function() {
					$(".messager-body").window('close');
					reviewTabToogle();
					$("#dataReviewGrid")
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
													title : '操作',
													field : 'opt',
													width : 260,
													align : 'center',
													formatter : function(value,
															row, index) {
														var str = "";
														var firstBtn = "<span class='icon-mapView1' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span><a style='vertical-align:middle; color: #2a86f3' href='javascript:review_building(1,"
																+ index
																+ ","
																+ row.datakeyId
																+ ","
																+ row.oldValue
																+ ","
																+ row.newValue
																+ ","
																+ row.dataType
																+ ","
																+ row.shapeLen
																+ ","
																+ row.status
																+ ");'  title='地图查看'>地图查看</a><span style='width:10px;display:inline-block'></span>";

														var firstBtn_grey = "<span class='icon-mapView2' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span><a style='vertical-align:middle; color: #737373; cursor: default' "
																+ "href='javascript: return false;'  title='地图查看'>地图查看</a><span style='width:10px;display:inline-block'></span>";

														var viewBtn = "<span class='icon-details1' style='width:16px;height:16px;display:inline-block;vertical-align:middle;margin:0 5px 0 0;'></span><a style='vertical-align:middle; color: #2a86f3' href='javascript:show_review_data("
																+ index
																+ ","
																+ row.oldValue
																+ ","
																+ row.newValue
																+ ","
																+ row.dataType
																+ ","
																+ row.datakeyId
																+","
																+ row.id
																+ ","
																+ row.reviewStatus
																+ ")' title='详情'>详情</a><span style='width:10px;display:inline-block'></span>";
														var viewBtn_grey = "<span class='icon-details2' style='width:16px;height:16px;display:inline-block;vertical-align:middle;margin:0 5px 0 0;'></span><a id='second_"
																+ index
																+ "' style='vertical-align:middle;color:#737373;cursor:default;' href='javascript:return false;' title='详情'>详情</a><span style='width:10px;display:inline-block'></span>";
														var prevBtn = "<span class='icon-pass1' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span><a style='vertical-align:middle; color: #2a86f3' href='javascript:review_data("
																+ index
																+ ","
																+ row.id
																+ ",1"
																+ ");'  title='通过'>通过</a><span style='width:10px;display:inline-block'></span>";

														var prevBtn_grey = "<span class='icon-pass2' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>"
																+ "<a style='vertical-align:middle; color: #737373; cursor: default' href='javascript:return false;'  title='通过'>通过</a><span style='width:10px;display:inline-block'></span>";

														var nextBtn = "<span class='icon-reject1' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span><a style='vertical-align:middle; color: #2a86f3' href='javascript:review_data("
																+ index
																+ ","
																+ row.id
																+ ",2"
																+ ");'  title='驳回'>驳回</a>";

														var nextBtn_grey = "<span class='icon-reject2' style='width:16px;height:16px;display:inline-block;margin:0 5px 0 0;vertical-align:middle;'></span>"
																+ "<a style='vertical-align:middle; color: #737373; cursor: default;' href='javascript: return false;' title='驳回'>驳回</a>";
														if (row.status != 2) { // 状态
																				// 1-添加，2-修改，3-删除,4-图形修改
															if (row.status != 1) {
																str = firstBtn
																		+ viewBtn_grey;
															} else {
																str = firstBtn
																		+ viewBtn;
															}
														} else {
															str = firstBtn_grey
																	+ viewBtn; // firstBtn
																				// 灰掉。
														}

														if (row.reviewStatus == 0) { // 待审批
															// dataType
															// :1设施，2
															// 建筑物
															// 3，网格
															str += prevBtn
																	+ nextBtn;
														} else if (row.reviewStatus == 1) { // 已审批
															// +prevBtn_grey
															// +nextBtn_grey
															// str += viewBtn;
														} else if (row.reviewStatus == 2) { // 已驳回
															// +prevBtn_grey
															// +nextBtn_grey
															// str += viewBtn;
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
												}, {
													field : 'oldValue',
													title : '旧值',
													width : 80,
													hidden : true,
													align : 'left'
												}, {
													field : 'newValue',
													title : '新值',
													width : 80,
													hidden : true,
													align : 'left'
												}, {
													field : 'shapeLen',
													title : '新值',
													width : 80,
													hidden : true,
													align : 'left'
												},
												/*
												 * { field : 'reviewStatus',
												 * title : '审批状态', width : 100,
												 * align : 'left', formatter :
												 * function(value, row, index) {
												 * if (value == 0) { return
												 * "待审批"; } else if (value == 1) {
												 * return "已审批"; } else if
												 * (value == 2) { return "已驳回"; } } },
												 */
												{
													field : 'remark',
													title : '审批意见',
													width : 160,
													align : 'left'
												}, {
													field : 'reviewer',
													title : '审批人',
													width : 80,
													align : 'left'
												}, {
													field : 'reviewDate',
													title : '审批时间',
													width : 160,
													align : 'left'
												} ] ],

										onLoadSuccess : function(data) {
											var pager = $("#dataReviewGrid")
													.datagrid('getPager');
											qryJson = $.extend(qryJson, $(
													"#dataReviewForm")
													.serializeObj());
											$(pager)
													.pagination(
															{
																onSelectPage : function(
																		pageNumber,
																		pageSize) {
																	loadReviewData(
																			pageNumber,
																			pageSize,
																			qryJson);
																	$("#dataReviewGrid").datagrid("clearSelections");
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
																			"#dataReviewGrid")
																			.datagrid(
																					"clearSelections");
																	loadReviewData(
																			pageNumber,
																			pageSize,
																			qryJson);
																}
															});
										}
									});
					$("#dataReviewGrid").datagrid("clearSelections");
					// 初始加载
					resetDataReviewForm();
				});

// 切换tab
function reviewTabToogle() {
	$('#dataReview_reviewStatus_tabs').find(".tabs li").unbind('click').bind(
			'click',
			function() {
				$("#dataReviewGrid").datagrid("clearSelections");
				var index = $(this).index();
				$(".tabs .tabs-first").removeClass("tabs-selected");
				$(this).addClass("tabs-selected").siblings().removeClass(
						"tabs-selected");

				var dg = $("#dataReviewGrid");
				var col = dg.datagrid('getColumnOption', 'opt');

				if (index == 0) {
					$("#reviewLi").hide();
					$("#dataReview_Batch_reviewBtn").show();
					$("#dataReview_Batch_feedBackBtn").show();

					col.width = 260;
					dg.datagrid();
				} else {
					$("#reviewLi").show();
					$("#dataReview_Batch_reviewBtn").hide();
					$("#dataReview_Batch_feedBackBtn").hide();

					col.width = 150;
					dg.datagrid();
				}
				qryJson = {};
				qryJson.userId = loginUser.id;
				qryJson.reviewStatus = index;
				qryJson = $
						.extend(qryJson, $("#dataReviewForm").serializeObj());
				var pager = $("#dataReviewGrid").datagrid('getPager');
				$(pager).pagination("options").pageNumber = 1;
				pageNumber = 1;
				var pageSize = $("#dataReviewGrid").datagrid('getPager')
						.pagination("options").pageSize;
				loadReviewData(pageNumber, pageSize, JSON.stringify(qryJson));
			});
}
// 点击查询按钮
$("#dataReview_searchBtn").click(
		function() {
			$("#dataReviewGrid").datagrid("clearSelections");
			var pager = $("#dataReviewGrid").datagrid('getPager');
			$(pager).pagination("options").pageNumber = 1;
			qryJson = $.extend(qryJson, $("#dataReviewForm").serializeObj());
			var pageNumber = $("#dataReviewGrid").datagrid('getPager')
					.pagination("options").pageNumber;
			var pageSize = $("#dataReviewGrid").datagrid('getPager')
					.pagination("options").pageSize;
			loadReviewData(pageNumber, pageSize, JSON.stringify(qryJson));

		});

// 加载远程数据
function loadReviewData(pageNumber, pageSize, queryParams) {
	if (pageNumber == 0) {
		$("#dataReviewGrid").datagrid("loadData", {
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
			$("#dataReviewGrid").datagrid("loadData", {
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
function resetDataReviewForm() {
	$('#dataReview_reviewStatus_tabs').find(".tabs .tabs-first").addClass(
			"tabs-selected").siblings().removeClass("tabs-selected");
	$('#dataReview_reviewStatus_tabs').tabs('select', 0);
	// var tab = $('#dataReview_reviewStatus_tabs').tabs('getSelected');
	// var index = $('#dataReview_reviewStatus_tabs').tabs('getTabIndex', tab);
	$("#reviewLi").hide();
	// 置空查询参数
	$("#createDateStart").datebox("setValue", "");
	$("#createDateEnd").datebox("setValue", "");
	$("#reviewDateStart").datebox("setValue", "");
	$("#reviewDateEnd").datebox("setValue", "");
	$("#dataType").val("2");
	$("#dataReview_Batch_reviewBtn").show();
	$("#dataReview_Batch_feedBackBtn").show();
	var dg = $("#dataReviewGrid");
	var col = dg.datagrid('getColumnOption', 'opt');
	col.width = 260;
	dg.datagrid();
	qryJson = {};
	qryJson.userId = loginUser.id;
	qryJson = $.extend(qryJson, $("#dataReviewForm").serializeObj());
	loadReviewData(1, 10, JSON.stringify(qryJson));

}

// 点击重置按钮
$("#dataReview_resetBtn").click(function() {
	resetDataReviewForm();
});

function review_data(index, ids, status) {
	var label = "";
	var remark = "";
	if (status == 1) {
		label = "通过审批";
	} else {
		label = "驳回";
	}
	if (index != -1) {
		$("#dataReviewGrid").datagrid('checkRow', index);
		if (status == 1) {
			$.messager.confirm('确认', '您确认' + label + '吗？', function(r) {
				if (r) {
					review(ids, status, remark);
				}
			});

		} else if (status == 2) {
			getAdvice();
			$("#review_remark_dialog").dialog({
				title : '审批意见',
				width : 400,
				height : 300,
				closed : false,
				cache : false,
				modal : true,
				onClose : function() {
					$("#review_remark").val("");
				}
			}).show();
			$("#review_remark_submit").off().on('click', function() {
				remark = $("#review_remark").val();
				if (remark == "") {
					$.messager.alert("提示", "请输入审批意见！", "info");
					return;
				}
				review(ids, status, remark);
				$("#review_remark_dialog").dialog('close');
			});
			return;
		}

	} else {
		if (status == 1) {
			$.messager.confirm('确认', '您确认批量' + label + '吗？', function(r) {
				if (r) {
					review(ids, status, remark);
				}
			});
		} else if (status == 2) {
			getAdvice();
			$("#review_remark_dialog").dialog({
				title : '审批意见',
				width : 400,
				height : 300,
				closed : false,
				cache : false,
				modal : true,
				onClose : function() {
					$("#review_remark").val("");
				}
			}).show();
			$("#review_remark_submit").off().on('click', function() {
				remark = $("#review_remark").val();
				if (remark == "") {
					$.messager.alert("提示", "请输入审批意见！", "info");
					return;
				}
				review(ids, status, remark);
				$("#review_remark_dialog").dialog('close');
			});
		}
	}
}

$('#review_remark_add').click(function() {
	var advice = $('#review_remark').val().trim();
	
	if (advice == "") {
		$.messager.alert("提示", "请您输入意见后再加为常用意见!", 'info');
		return;
	}
	
	for ( var i = 0; i < adviceData.length; i++) {
		if (adviceData[i].advice == advice) {
			$.messager.alert("提示", "您输入的意见已存在!", 'info');
			return;
		}
	}
	var jsonObject = {};
	jsonObject.advice = advice;
	jsonObject.adviceType = 1; // 1： 表示不通过。
	$.ajax({
		type : "POST",
		url : "restful/reviewCommonAdvice/save",
		contentType : "application/json",
		async : false,
		dataType : "json",
		data : JSON.stringify(jsonObject),
		success : function(data) {
			if (data.status == 'success') {
				getAdvice();
				$('#review_remark').val("");
				$.messager.alert("提示", "添加成功", 'info');
			}
		},
		error : function(err) {
			$.messager.alert({
				title : '消息',
				msg : '添加失败！',
				icon : 'error'
			});
		}
	})
})

var adviceData = {};
function getAdvice() {
	// $('#review_remark').val("");
	$('#review_common_advice').combobox({
		onChange : function(n, o) {
			var text = $('#review_common_advice').combobox('getText');
			$('#review_remark').val(text);
		}
	});
	$.ajax({
		type : "GET",
		url : "restful/reviewCommonAdvice/getAll",
		success : function(data) {
			if (data.status = 'success') {
				var records = JSON.parse(data.content);
				
				if (records.length > 0) {
					$('#review_common_advice').combobox('loadData', records);
					$('#review_common_advice').combobox('select', records[0].id);
					adviceData = records;
				}
			}
		},
		error : function(err) {
		}
	})
}

$('#review_remark_reset').click(function() {
	$('#review_remark').val("");
})

// 数据审批
function review(ids, status, remark) {
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
				/*var del=1;
				if((ids+"").indexOf(",")!=-1){
					del=ids.split(",").length;
				}
				var cookieUser=JSON.parse($.cookie('loginUser'));
				cookieUser.toDoCount=cookieUser.toDoCount-del;
				$.cookie('loginUser', cookieUser);*/
				$.messager.alert({
					title : '消息',
					msg : '操作成功！',
					icon : 'info'
				});
				resetPageInfo();
				if($("#dataView_modify_config_facid")){
					$("#dataView_modify_config_dialog").dialog('close');
				}
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

// 批量审批
$("#dataReview_Batch_reviewBtn").off().on('click', function() {
	var ids = "";
	var idsArray = new Array();
	var selRows = $("#dataReviewGrid").datagrid('getSelections');
	if (selRows.length == 0) {
		$.messager.alert({
			title : '提示',
			msg : '未选择记录！',
			icon : 'info'
		});
	} else {
		for ( var i in selRows) {
			idsArray[i] = selRows[selRows.length - i - 1].id;
		}
		ids = idsArray.join(",");
		review_data(-1, ids, "1");
	}
});
// 批量驳回
$("#dataReview_Batch_feedBackBtn").off().on('click', function() {

	var ids = "";
	var idsArray = new Array();
	var selRows = $("#dataReviewGrid").datagrid('getSelections');
	if (selRows.length == 0) {
		$.messager.alert({
			title : '提示',
			msg : '未选择记录！',
			icon : 'info'
		});
	} else {
		for ( var i in selRows) {
			idsArray[i] = selRows[i].id;
		}
		ids = idsArray.join(",");
		review_data(-1, ids, "2");
	}

});
// 需要修改的数据缓存
var fieldModifyData = [];
// 查看详情
function show_review_data(index, oldValue, newValue, dataType,datakeyId,id,reviewStatus) {
	if(reviewStatus==0){
		$("#dataView_modify_config_passBtn").show();
		$("#dataView_modify_config_fadebackBtn").show();
	}else{
		$("#dataView_modify_config_passBtn").hide();
		$("#dataView_modify_config_fadebackBtn").hide();
	}
	$("#dataView_modify_config_dataType").val(dataType);
	$("#dataView_modify_config_facid").val(datakeyId);
	$("#dataView_modify_config_index").val(index);
	$("#dataView_modify_config_id").val(id);
	//只有设施和建筑物可以预览图片
	if(dataType==1||dataType==2){
		$("#dataView_modify_config_cancelBtn").show();
	}else{
		$("#dataView_modify_config_viewPicBtn").hide();
	}
	$("#dataReviewGrid").datagrid('checkRow', index);
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
	var filterData = constructFieldModifyDatagrid(fieldModifyData, oldValue,
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

function constructFieldModifyDatagrid(fieldModifyData, oldValue, newValue) {
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
function resetPageInfo() {
	var pager = $("#dataReviewGrid").datagrid("getPager");
	// 初始加载
	var options = $(pager).pagination("options");
	var pageNumber = options.pageNumber;
	var selCount = $("#dataReviewGrid").datagrid("getSelections").length;
	var total = $(pager).pagination("options").total - parseInt(selCount);
	var pageSize = $(pager).pagination("options").pageSize;
	var totalpagenumber = total % pageSize == 0 ? Math.floor(total / pageSize)
			: Math.floor(total / pageSize) + 1;
	options.pageNumber = pageNumber <= totalpagenumber ? pageNumber
			: totalpagenumber;
	var tab = $('#dataReview_reviewStatus_tabs').tabs('getSelected');
	var index = $('#dataReview_reviewStatus_tabs').tabs('getTabIndex', tab);
	loadReviewData(options.pageNumber, 10, {
		"userId" : loginUser.id,
		"dataType" : $("#dataType").val(),
		"createDateStart" : $("#createDateStart").datebox('getValue'),
		"createDateEnd" : $("#createDateEnd").datebox('getValue'),
		"reviewDateStart" : $("#reviewDateStart").datebox('getValue'),
		"reviewDateEnd" : $("#reviewDateEnd").datebox('getValue'),
		"reviewStatus" : index
	});
	$("#dataReviewGrid").datagrid('clearSelections');
}
// 选择数据类型时，查询数据
$("#dataType").change(function() {
	$("#dataReview_searchBtn").click();
});
//查看图片
$("#dataView_modify_config_viewPicBtn").off().on('click',function(){
	var photos = getPhotos($("#dataView_modify_config_dataType").val(), $("#dataView_modify_config_facid").val());
	initPhotoPage(photos);
	$('#facilityPhotoDetail').dialog({
		title : "图片预览",
		closed : false,
		cache : false,
		modal : true
	}).show().window('center');
});
//通过
$("#dataView_modify_config_passBtn").off().on('click',function(){
	review_data($("#dataView_modify_config_index").val(),$("#dataView_modify_config_id").val(),1);
});
//驳回
$("#dataView_modify_config_fadebackBtn").off().on('click',function(){
	review_data($("#dataView_modify_config_index").val(),$("#dataView_modify_config_id").val(),2);
});
//取消
$("#dataView_modify_config_cancelBtn").off().on('click',function(){
	$("#dataView_modify_config_dialog").dialog('close');
});
