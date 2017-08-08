/**
 * Created by Administrator on 2017/5/8.
 */

var loginUser = JSON.parse($.cookie('loginUser'));

$("#obd_dkzy").on('click', function () {
    $("#number1").attr("value", "");
    $("#number2").attr("value", "");
    $("#number3").attr("value", "");
    $("#number4").attr("value", "");
    $("#obdPortDate").datagrid({
        pagination: true
    });
    $("#obdPortDate").datagrid('loadData',{total:0,rows:[]});
    $('#showOrgs').combotree({
        multiple: false,
        cascadeCheck: false,
        lines: true,
        onChange:function(o,n){
            var t = $("#showOrgs").combotree('tree');
            var n = t.tree('getSelected');// 获取选择的节点
            var obd_datagrid_json={};
            obd_datagrid_json.mkcenterId=n.id;
            obd_datagrid_json.number1=$('#number1').val();
            obd_datagrid_json.number2=$('#number2').val();
            obd_datagrid_json.number3=$('#number3').val();
            obd_datagrid_json.number4=$('#number4').val();
            loadObdData(1, 10, obd_datagrid_json);
        }
    });

    $.get("restful/organization/findOrgByUser", {userId: loginUser.id}, function (data) {
        var list = $.parseJSON(data.content);
        //list 转成树形json

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

        var tree = listToTree(list, list[0].orgPid);//调用函数，传入要转换的list数组，和树中顶级元素的pid
        $('#showOrgs').combotree("loadData", tree);
        //    $('#showOrgs').combotree("setValue", 100000);
    });
    $("#obdPortDate").datagrid({
        title: "",
        rownumbers: true,
        fitColumns: false,
        pagination: true,
        striped: true,
        singleSelect: true,
        pageSize: 10,
        pageNumber: 1,
        nowrap: false,
        idField: 'ocfId',
        columns: [[
            {
                field: 'ocfId',
                title: '',
                hidden: true
            },
            {
                field: 'ocfName',
                title: '设施名称',
                width: 367,
                align: 'left'
            }, {
                field: 'portXlCount',
                title: '端口容量',
                width: 100,
                align: 'left'
            }, {
                field: 'portXlCountZy',
                title: '占用端口',
                width: 100,
                align: 'left'
            }, {
                field: 'portXlCountKx',
                title: '空闲端口',
                width: 100,
                align: 'left'
            }
        ]],
        onLoadSuccess: function (data) {
            var pager = $("#obdPortDate").datagrid('getPager');
            $(pager).pagination({
                onSelectPage: function (pageNumber, pageSize) {
                    var t = $("#showOrgs").combotree('tree');
                    var n = t.tree('getSelected');// 获取选择的节点
                    var obd_datagrid_json={};
                    obd_datagrid_json.mkcenterId=n.id;
                    obd_datagrid_json.number1=$('#number1').val();
                    obd_datagrid_json.number2=$('#number2').val();
                    obd_datagrid_json.number3=$('#number3').val();
                    obd_datagrid_json.number4=$('#number4').val();
                    loadObdData(pageNumber, pageSize, obd_datagrid_json);
                },
                onChangePageSize: function (pageSize) {
                    $(pager).pagination("options").pageNumber = 1;
                }
            })
        }

    })

    loadObdData(1,10,{mkcenterId:-1,number1:"",number2:"",number3:"",number4:""});

});

$("#obdPortQry").on('click', function () {

    var t = $("#showOrgs").combotree('tree');
    var n = t.tree('getSelected');// 获取选择的节点
    if (n == null) {
        $.messager.alert("提示", "请选择一个组织", "info");
        return false;
    }
    var obd_datagrid_json={};
    obd_datagrid_json.mkcenterId=n.id;
    obd_datagrid_json.number1=$('#number1').val();
    obd_datagrid_json.number2=$('#number2').val();
    obd_datagrid_json.number3=$('#number3').val();
    obd_datagrid_json.number4=$('#number4').val();
    $("#obdPortDate").datagrid("clearSelections");

    var pager = $("#obdPortDate").datagrid('getPager');
    $(pager).pagination("options").pageNumber = 1;

    var pageNumber = $("#obdPortDate")
        .datagrid('getPager').pagination("options").pageNumber;

    var pageSize = $("#obdPortDate").datagrid('getPager')
        .pagination("options").pageSize;

    loadObdData(pageNumber, pageSize, JSON
        .stringify(obd_datagrid_json));
});

function loadObdData(pageNumber, pageSize, qryjson) {
    var jsonObj = {};
    jsonObj.pageSize = pageSize;
    jsonObj.pageNumber = pageNumber;
    jsonObj.objCondition=qryjson;
    
    $.ajax({
        type: "POST",
        url: "restful/lightfacility/findObdByWhere",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(jsonObj),
        success: function (data) {
            var contentStr = data.content;
            var dataResult = JSON.parse(contentStr);
            $("#obdPortDate").datagrid("loadData", {
                rows: dataResult.rows,
                total: dataResult.total
            })
        }
    })
}
