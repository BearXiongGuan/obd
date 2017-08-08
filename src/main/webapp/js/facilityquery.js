// 让window.location.origin兼容IE
if (window["context"] == undefined) {
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    window["context"] = location.origin+"/V6.0";
}
//查询参数全局变量
var qryJson = {};
// 图片服务器地址
var downloadPhotoPath = window.location.origin
		+ "/BasicManager/restful/facilityphoto/downloadPhoto/";

// 初始化审核对象
var dataReview = {};
// 旧值
var oldValue = {};
// 新值
var newValue = {};
$("#facilityQry")
		.click(
				function() {
					facilityOrgTree();
					resetForm();
					$("#facilityGrid")
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
										nowrap : false,
										height : 500,
										idField : 'ocfId',
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
													title : '设施名称',
													width : 300,
													align : 'left'
												},
												{
													field : 'ocfCode',
													title : '设施编码',
													width : 300,
													align : 'left'
												},
												{
													field : 'address',
													title : '设施地址',
													width : 300,
													align : 'left'
												},
												{
													field : 'mkName',
													title : '营服中心',
													width : 120,
													align : 'left'
												},
												{
													field : 'countyName',
													title : '分公司',
													width : 100,
													align : 'left'
												},
												{
													field : 'longitude',
													title : '经度',
													width : 100,
													align : 'left'
												},
												{
													field : 'latitude',
													title : '纬度',
													width : 100,
													align : 'left'
												},
												{
													field : 'portXlCount',
													title : '端口容量',
													width : 80,
													align : 'left'
												},
												{
													field : 'portXlCountZy',
													title : '占用端口',
													width : 80,
													align : 'left'
												},
												{
													field : 'portXlCountKx',
													title : '空闲端口',
													width : 80,
													align : 'left'
												},
												{
													field : 'recdate',
													title : '录入时间',
													width : 100,
													align : 'left',
													formatter : function(value,
															row, index) {
														return ("" + value)
																.substring(0,
																		10);
													}

												} ] ],
										onLoadSuccess : function(data) {
											var pager = $("#facilityGrid")
													.datagrid('getPager');
											$(pager)
													.pagination(
															{
																onSelectPage : function(
																		pageNumber,
																		pageSize) {
																	loadData(
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
																			"#facilityGrid")
																			.datagrid(
																					"clearSelections");
																	loadData(
																			pageNumber,
																			pageSize,
																			qryJson);
																}
															});
										},
										onSelect : function(index, row) {
											createOrgsCombo(row.countyId);
										},
										onDblClickRow : function(index, row) {
											$(this).datagrid("clearSelections");
											$(this)
													.datagrid("selectRow",
															index);
											var pSymbol = new esri.symbol.PictureMarkerSymbol(
													'./img/label/b.png', 24, 56);
											var geometry = new esri.geometry.Point(
													{
														"x" : row.longitude,
														"y" : row.latitude,
														"spatialReference" : map.spatialReference
													});
											var graphic = new esri.Graphic(
													geometry, pSymbol);

											map.graphics.add(graphic);
											if (map.getScale() > 4000) {
												map.setScale(800);
											}
											map.centerAt(geometry);
											$(".minSize").click();
										},
										onRowContextMenu : function(e, index,
												row) {
											e.preventDefault();
											$("#facilityMenu")
													.menu(
															'show',
															{
																left : e.pageX,
																top : e.pageY,
																onClick : function(
																		item) {
																	var fdf = $("#facility_detail_form");
																	if (item.name == "修改") {
																		$(fdf)
																				.find(
																						'.dis')
																				.attr(
																						"disabled",
																						true);
																		$(
																				"#updateFacilityBtn")
																				.show();
																		$(
																				'#facilityDialog')
																				.dialog(
																						{
																							title : '设施'
																									+ item.name,
																							closed : false,
																							cache : false,
																							modal : true
																						})
																				.show();
																	} else if (item.name == "详情") {
																		$(fdf)
																				.find(
																						'.dis')
																				.attr(
																						"disabled",
																						false);
																		$(
																				"#updateFacilityBtn")
																				.hide();
																		$(
																				'#facilityDialog')
																				.dialog(
																						{
																							title : '设施'
																									+ item.name,
																							closed : false,
																							cache : false,
																							modal : true
																						})
																				.show();
																	} else if (item.name == "图片") {
																		var photos = getPhotos(
																				1,
																				row.ocfId);
																		initPhotoPage(photos);
																		$(
																				'#facilityPhotoDetail')
																				.dialog(
																						{
																							title : '设施'
																									+ item.name,
																							closed : false,
																							cache : false,
																							modal : true
																						})
																				.show();
																	}
																	row.recdate = ("" + row.recdate)
																			.substring(
																					0,
																					10);
																	$(
																			'#facility_detail_form')
																			.form(
																					'load',
																					row);
																	oldValue = $(
																			'#facility_detail_form')
																			.serializeObj();
																}
															});
										}
									});
					$("#facilityGrid").datagrid("clearSelections");
					// 初始加载
					loadData(1, 10, {
						"mkcenterId" : -1
					});
				});

// 点击查询按钮
$("#facility_searchBtn")
		.click(
				function() {
					if ($("#facility_combotree").combotree('getValue') == "==请选择组织机构==") {
						$.messager.alert({
							title : '提示',
							msg : '未选择组织机构',
							icon : 'warning'
						});
						return;
					}
					$("#facilityGrid").datagrid("clearSelections");
					var pager = $("#facilityGrid").datagrid('getPager');
					$(pager).pagination("options").pageNumber = 1;
					qryJson = $.extend(qryJson, $("#facilityForm")
							.serializeObj());
					var pageNumber = $("#facilityGrid").datagrid('getPager')
							.pagination("options").pageNumber;
					var pageSize = $("#facilityGrid").datagrid('getPager')
							.pagination("options").pageSize;
					loadData(pageNumber, pageSize, JSON.stringify(qryJson));

				});

// 加载远程数据
function loadData(pageNumber, pageSize, queryParams) {
	var jsonObj = {};
	jsonObj.pageSize = pageSize;
	jsonObj.pageNumber = pageNumber;
	jsonObj.objCondition = queryParams;
	$.ajax({
		type : "POST",
		url : "restful/lightfacility/getPageByName",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(jsonObj),
		success : function(data) {
			var contentStr = data.content;
			var dataResult = JSON.parse(contentStr);
			$("#facilityGrid").datagrid("loadData", {
				rows : dataResult.rows,
				total : dataResult.total
			});
		},
		error : function(err) {
		}
	});
}

// 重置查询表单
function resetForm() {
	// 置空查询参数
	qryJson = {};
	qryJson.userId = loginUser.id;
	$("#facility_qrysel_type").val(0);
	$("#facility_name").val("");
	$("#facility_address").val("");
	$("#facility_ocfCode").val("");
	$("#recdateStart").datebox("setValue", "");
	$("#recdateEnd").datebox("setValue", "");
	$("#facility_name").show();
	$("#facility_address").hide();
	$("#facility_ocfCode").hide();
}

// 点击重置按钮
$("#facility_resetBtn").click(function() {
	resetForm();
});

// 加载县份或营服数据

function loadOrgs(orgId) {
	var dataResult;
	$.ajax({
		type : "GET",
		url : "restful/organization/getByOrgId",
		contentType : "application/json",
		async : false,
		dataType : "json",
		data : {
			"orgId" : orgId
		},
		success : function(data) {
			var contentStr = data.content;
			if (contentStr.length > 0) {
				dataResult = JSON.parse(contentStr);
			} else {
				dataResult = [];
			}

		},
		error : function(err) {

		}
	});
	return dataResult;
}
// 装载县份或营服数据到下拉列表
function createOrgsCombo(childOrgId) {
	var rootData = loadOrgs("100000");
	$("#countySel").empty();
	$("#mkcenterSel").empty();
	$.each(rootData, function(i, r) {
		var option = "<option value='" + r.id + "'>" + r.text + "</option>";
		$("#countySel").append(option);
	});
	childOrgId = childOrgId == null || childOrgId == undefined ? rootData[0].orgId
			: childOrgId;
	var mkcenterData = loadOrgs(childOrgId);

	$.each(mkcenterData, function(i, r) {
		var option = "<option value='" + r.id + "'>" + r.text + "</option>";
		$("#mkcenterSel").append(option);
	});
}
// 下拉选择改变事件
$("#countySel").change(function() {
	var sel = $(this).children('option:selected').val();
	var mkcenterData = loadOrgs(sel);
	$("#mkcenterSel").empty();
	$.each(mkcenterData, function(i, r) {
		var option = "<option value='" + r.id + "'>" + r.text + "</option>";
		$("#mkcenterSel").append(option);
	});
});

// 编辑设施
$("#saveUpdateFacilityBtn").unbind('click').bind('click', function () {
	if (checkForm()) {
		dataReview.creater = loginUser.loginName;
		dataReview.countyId = $("#countySel").val();
		dataReview.mkcenterId = $("#mkcenterSel").val();
		dataReview.dataKeyName = $("#ocfName").val();
		dataReview.dataType = 1;// 数据类型 1：设施 2：建筑物
		dataReview.status = 2;// 1-添加，2-修改，3-删除
		dataReview.createDate = getSmpFormatNowDate(true);
		dataReview.datakeyId = $("#facility_detail_form_ocfId")
			.val();
		newValue = $('#facility_detail_form').serializeObj();
		dataReview.newValue = newValue;
		dataReview.oldValue = oldValue;
		if (JSON.stringify(newValue) == JSON
				.stringify(oldValue)) {
			return false;
		}
		$
			.ajax({
				type : "POST",
				url : "restful/dataReview/save",
				contentType : "application/json",
				async : false,
				dataType : "json",
				data : JSON.stringify(dataReview),
				success : function(data) {
					if (data.status=="success") {
						if(data.content=="exists"){
							$.messager.alert({
								title : '消息',
								msg : '您操作的数据还处于待审核状态，不能再次操作!',
								icon : 'error'
							});
						}else{
							$.messager.alert({
								title : '消息',
								msg : '数据已提交，等待审核！',
								icon : 'info'
							});
						}
						var dataReviewId = $(
								"#facility_detail_form_dataReviewId")
								.val()
							+ "";
						if (dataReviewId != null
							&& dataReviewId.length > 0) {
							my_resetPageInfo();
						}
						$("#facilityDialog")
							.dialog("close");
					} else if(data.status=="fail") {
						$.messager.alert({
							title : '消息',
							msg : '保存失败！',
							icon : 'error'
						});
					}
				},
				error : function(err) {
					$.messager.alert({
						title : '消息',
						msg : '保存失败！',
						icon : 'error'
					});
				}
			});

	}
});

$("#cancleUpdateFacilityBtn").unbind('click').bind('click', function (){
	$("#facilityDialog").dialog("close");
});
// 初始化
function initPhotoPage(photos) {
	var photoPage = {};

	if (photos.length == 0) {
		$(".photo_page .photo_page_content .photo_page_number").text("");
		$(".photo_page .photo_page_content .photo_content").css({
			"background" : "url('./img/nopic.png') no-repeat",
			"background-size" : "100% 100%",
			"background-position" : "center"
		});
		$("#facilityPhotoDetail").find(".photo_page_table").width(0).hide();
		$("#facilityPhotoDetail").dialog({
			width : 470
		});
		$(
				".photo_page .photo_page_content .next,.photo_page .photo_page_content .prev")
				.unbind('click');
		return;
	}
	$("#facilityPhotoDetail").dialog({
		width : 660
	});
	$("#facilityPhotoDetail").find(".photo_page_table").width(190).show();
	photoPage.curPage = 1;
	photoPage.pageSize = photos.length;
	setPhotoPageData(photoPage, photos);

	$(".photo_page .photo_page_content .prev").click(function() {
		photoPage.curPage = photoPage.curPage - 1;
		photoPage.curPage = photoPage.curPage < 1 ? 1 : photoPage.curPage;
		setPhotoPageData(photoPage, photos);

	});
	$(".photo_page .photo_page_content .next")
			.click(
					function() {
						photoPage.curPage = photoPage.curPage + 1;
						photoPage.curPage = photoPage.curPage > photoPage.pageSize ? photoPage.pageSize
								: photoPage.curPage;
						setPhotoPageData(photoPage, photos);
					});
}
// 根据设施类型和编号查询设施的图片
function getPhotos(facType, facId) {
	var result = [];
	var jsonObj = {};
	jsonObj.facType = facType;
	jsonObj.facId = facId;
	$.ajax({
		type : "POST",
		url : "restful/facilityphoto/getPhotosByTypeAndFacid",
		async : false,
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(jsonObj),
		success : function(data) {
			var contentStr = data.content;
			if (contentStr == null || contentStr == undefined
					|| contentStr == "") {
				return result;
			}
			result = JSON.parse(contentStr);
		},
		error : function(err) {
		}
	});
	return result;
}
function setPhotoPageData(photoPage, photos) {
	photoPage.photoURL = downloadPhotoPath
			+ photos[photoPage.curPage - 1].photo;
	photoPage.creater = photos[photoPage.curPage - 1].creater;
	photoPage.createTime = photos[photoPage.curPage - 1].createTime;
	photoPage.longitude = photos[photoPage.curPage - 1].longitude;
	photoPage.latitude = photos[photoPage.curPage - 1].latitude;
	photoPage.azimuth = photos[photoPage.curPage - 1].azimuth;
	photoPage.remark = photos[photoPage.curPage - 1].remark;
	$(".photo_page .photo_page_content .photo_page_number").text(
			photoPage.curPage + "/" + photoPage.pageSize);
	$(".photo_page .photo_page_content .photo_content").css({
		"background" : "url('" + photoPage.photoURL + "')" + " no-repeat",
		"background-size" : "100% 100%",
		"background-position" : "center"
	});
	$("#photo_creater")
			.text(photoPage.creater == null ? "" : photoPage.creater);
	$("#photo_createTime").text(
			photoPage.createTime == null ? "" : photoPage.createTime);
	$("#photo_longitude").text(
			photoPage.longitude == null ? "" : photoPage.longitude);
	$("#photo_latitude").text(
			photoPage.latitude == null ? "" : photoPage.latitude);
	$("#photo_azimuth")
			.text(photoPage.azimuth == null ? "" : photoPage.azimuth);
	$("#photo_remark").text(photoPage.remark == null ? "" : photoPage.remark);
}

function checkForm() {
	var height = $("#facility_detail_form_height").val();
	var longitude = $("#facility_detail_form_longitude").val();
	var latitude = $("#facility_detail_form_latitude").val();
	var pattern = /^([\d]+|[\d]+[.]?[\d]+)$/;
	if (!pattern.test(height)) {
		$.messager.alert({
			title : '提示',
			msg : '高度必须为非负整数或小数！',
			icon : 'info',
		});
		return false;
	}
	if (!pattern.test(longitude)) {
		$.messager.alert({
			title : '提示',
			msg : '经度必须为非负整数或小数！',
			icon : 'info',
		});
		return false;
	}
	if (!pattern.test(latitude)) {
		$.messager.alert({
			title : '提示',
			msg : '纬度必须为非负整数或小数！',
			icon : 'info',
		});
		return false;
	}
	return true;
}

// 导出
$("#btnExport")
		.off()
		.on(
				'click',
				function() {
					if ($("#facilityGrid").datagrid('getRows').length == 0) {
						$.messager.alert({
							title : '提示',
							msg : '数据为空，无法导出',
							icon : 'warning'
						});
						return;
					}
					$("#cover").show();
					$("#export_sel_rows_p").show();
					$(".doExport-box").removeClass("hide").show();
					$('input:radio[name=export_radio]')[0].checked = true;
					var exportFlag = "1";
					$("#exportCurrentPage").click(function() {
						exportFlag = "1";
					});
					$("#exportAllPage").click(function() {
						exportFlag = "2";
					});
					$("#exportSelRows").click(function() {
						exportFlag = "3";
					});
					$("#exportExcel")
							.off()
							.on(
									'click',
									function() {
										var oParent = $(this).parent().parent();
										$("#cover").hide();
										oParent.parent().hide();
										var url = "restful/lightfacility/exportXls";
										if (exportFlag == "1") {
											var pageNumber = $("#facilityGrid")
													.datagrid('getPager')
													.pagination("options").pageNumber;
											var pageSize = $("#facilityGrid")
													.datagrid('getPager')
													.pagination("options").pageSize;
										}
										if (exportFlag == "2") {
											var pageNumber = 1;
											var pageSize = $("#facilityGrid")
													.datagrid('getPager')
													.pagination("options").total;
										}
										if (exportFlag == "3") {
											var url = "restful/lightfacility/exportXlsFromSelRows";
											var sels = $("#facilityGrid")
													.datagrid("getSelections");
											if (sels.length == 0) {
												$.messager.alert({
													title : '提示',
													msg : '未选择任何光设施',
													icon : 'info'
												});
												return;
											}
											data = {
												jsonStr : (JSON.stringify(sels))
														.replace(/"/g, "'")
											};
											DownLoad({
												url : url,
												data : data
											});
											return;
										}
										var data = {
											pageSize : pageSize,
											pageNumber : pageNumber,
											mkcenterId : $(
													"#facility_combotree")
													.combotree('getValue'),
											name : $("#name").val(),
											address : $("#address").val(),
											recdateStart : $("#recdateStart")
													.datebox("getValue"),
											recdateEnd : $("#recdateEnd")
													.datebox("getValue")
										};
										DownLoad({
											url : url,
											data : data
										});
									});
				});
// 查询类型 0-设施名称，1-设施编码，2-设施地址
$("#facility_qrysel_type").change(function() {
	var opt = parseInt($(this).val());
	switch (opt) {
	case 0:
		$("#facility_name").show();
		$("#facility_address").hide();
		$("#facility_ocfCode").hide();
		break;
	case 1:
		$("#facility_name").hide();
		$("#facility_address").hide();
		$("#facility_ocfCode").show();
		break;
	case 2:
		$("#facility_name").hide();
		$("#facility_address").show();
		$("#facility_ocfCode").hide();
		break;
	default:
		break;
	}
});
function DownLoad(options) {
	var config = $.extend(true, {
		method : 'post'
	}, options);
	var $iframe = $('<iframe id="down-file-iframe" />');
	var $form = $('<form target="down-file-iframe" method="' + config.method
			+ '" />');
	$form.attr('action', config.url);
	for ( var key in config.data) {
		$form.append('<input type="hidden" name="' + key + '" value="'
				+ config.data[key] + '" />');
	}
	$iframe.append($form);
	$(document.body).append($iframe);
	$form[0].submit();
	$iframe.remove();
}

// 加载组织机构树
function facilityOrgTree() {
	$('#facility_combotree').combotree(
			{
				multiple : false,
				cascadeCheck : false,
				lines : true,
				onSelect : function(item) {
					$("#facilityGrid").datagrid("clearSelections");
					var pager = $("#facilityGrid").datagrid('getPager');
					$(pager).pagination("options").pageNumber = 1;
					qryJson = $.extend(qryJson, $("#facilityForm")
							.serializeObj());
					qryJson.mkcenterId = item.id;
					var pageNumber = $("#facilityGrid").datagrid('getPager')
							.pagination("options").pageNumber;
					var pageSize = $("#facilityGrid").datagrid('getPager')
							.pagination("options").pageSize;
					loadData(pageNumber, pageSize, JSON.stringify(qryJson));
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
		$('#facility_combotree').combotree("loadData", tree);
	});
}
