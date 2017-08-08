/**
 * Created by 2D-wht-f019 on 2017/4/1.
 */
//查询用户
//清空输入框
$(".srhClose span").on("click", function () {
    $(".search input").attr("value", "");


});

$(".search a i").on("click", function () {

    var input = $(".search input").val().replace(/\s/g, '');

    if (!isNaN(input)) {
        var params = {loginName: input};
    } else {
        var params = {username: input};
    }


    if (input == "") {
        userRefresh();
    } else {
        $.ajax({
            type: "post",
            url: "restful/user/getByWhere",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (data) {
                var records = data.content;
                var records = eval("(" + records + ")");
                $("#userTableContentUL").empty();
                $.each(records, function (i, r) {
                    var loginEquId = typeof r.loginEquId == 'undefined' ? '&nbsp;&nbsp;' : r.loginEquId;
                    var lastLoginTime = typeof r.lastLoginTime == 'undefined' ? '&nbsp;&nbsp;' : r.lastLoginTime;
                    var record = '<li>' +
                        '<input type="checkbox" />' +
                        '<span class="itemSection">' + r.loginName + '</span><span class="itemSection">' + r.username + '</span>' +
                        '<span class="itemSection">' + loginEquId + '</span><span class="itemSection">' + lastLoginTime + '</span>' +
                        '<span class="itemSection">' + r.orgName + '</span> <span class="itemSection">' + r.name + '</span>' +
                        '<span class="itemSection"><button id=' + [r.loginName, r.username, r.loginEquId, r.orgId, r.roleId] +
                        '  onclick="btn_update(this)">编辑</button>' +
                        '<button id=' + r.id + ' onclick="btn_delete(this)">删除</button>' +
                        '<button id=' + r.id + ' onclick="btn_resetPwd(this)">重置密码</button></span>' +
                        '</li>'
                    $("#userTableContentUL").append(record);
                });
            }
        });
    }
});

function intOnly() {
    var codeNum = event.keyCode;
    if (codeNum == 8 || codeNum == 37 || codeNum == 39 || (codeNum >= 48 && codeNum <= 57)) {
        event.returnValue = codeNum;
    } else {
        event.returnValue = false;
    }
}

//添加用户
function btn_adduser() {
    $(".addUser-box").removeClass("hide").show();
    $(".addUser-form input").attr("value", "");
    $("#tip2").empty();
    $.get("restful/organization/getAll", function (data) {
        var orgjson = $.parseJSON(data.content);
        $("#add_org").html("");
        for (i = 0; i < orgjson.length; i++) {
            var orgitem = orgjson[i];
            $("#add_org").append("<option value='" + orgitem.orgId + "'>" + orgitem.orgName + "</option>");
        }
        $("#add_org").get(0).selectedIndex = 0;
    });

    $.get("restful/role/getAll", function (data) {
        var rolejson = $.parseJSON(data.content);
        $("#add_role").html("");
        for (i = 0; i < rolejson.length; i++) {
            var roleitem = rolejson[i];
            $("#add_role").append("<option value='" + roleitem.id + "'>" + roleitem.name + "</option>");
        }
        $("#add_role").get(0).selectedIndex = 0;
    })

    $("#add_saveUser").off().on("click", function () {
        var loginName = $(".add_loginname input").val().replace(/\s/g, '');
        var loginPwd = $(".login_pwd input").val().replace(/\s/g, '');
        var loginRepwd = $(".login_repwd input").val().replace(/\s/g, '');
        var username = $(".add_username input").val().replace(/\s/g, '');
        var IMEI = $("#add_IMEI").val().replace(/\s/g, '');
        var orgId = $("#add_org").val();
        var roleId = $("#add_role").val();
        if (!loginName.match(/^(((13[0-9]{1})|(18[0-9]{1})|159|153)+\d{8})$/)) {
            $("#tip2").html('用户名格式不正确！').show();
            $(".add_loginname input").focus();
            return false;
        }
        if (loginPwd == '') {
            $("#tip2").html('请输入密码！').show();
            $("#login_pwd").focus();
            return false;
        }
        if (loginRepwd == '') {
            $("#tip2").html('请输入确认密码！').show();
            $("#login_repwd").focus();
            return false;
        }
        if (loginPwd != loginRepwd) {
            $("#tip2").html('两次输入的密码不一致！').show();
            $("#login_pwd").focus();
            return false;
        }
        if (username == '') {
            $("#tip2").html('姓名不能为空！').show();
            $(".add_username input").focus();
            return false;
        }
        if (IMEI.length != 15) {
            $("#tip2").html("IMEI码格式不正确！");
            $("#add_IMEI").focus();
            return false;
        }

        if (loginPwd == loginRepwd) {
            $("#tip2").html('').show();
            $(".addUser-box").hide();
            loginPwd = hex_md5(loginPwd).toUpperCase();
            var params = {
                loginName: loginName,
                password: loginPwd,
                username: username,
                loginEquId: IMEI,
                orgId: orgId,
                roleId: roleId
            }
        }
        $.ajax({
            type: "post",
            url: "restful/user/save",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (data) {
                if (data.status == 'success') {
                    $.messager.alert("提示", "添加成功！", "info");
                    userRefresh();
                }
                else {
                    $.messager.alert("提示", "添加失败！", "error");
                }
            }
        });
    });
}
//编辑用户
function btn_update(el) {
    var user = el.id.split(',');
    $(".updateUser-box").removeClass("hide").show();
    $(".updateUser-form input").attr("value", "");
    $("#update_loginname").attr("value", user[1]);
    $("#update_username").attr("value", user[2]);
    $("#update_IMEI").attr("value", user[5]);
    $("#update_id").attr("value", user[0]);
    $("#tip3").empty();
    $.get("restful/organization/getAll", function (data) {
        var orgjson = $.parseJSON(data.content);
        $("#update_org").html("");
        for (i = 0; i < orgjson.length; i++) {
            var orgitem = orgjson[i];
            $("#update_org").append("<option value='" + orgitem.orgId + "'>" + orgitem.orgName + "</option>");
        }
        //$("#update_org").get(0).selectedIndex = 0;
        $("#update_org option[value=" + user[3] + "]").attr("selected", true);
    });

    $.get("restful/role/getAll", function (data) {
        var rolejson = $.parseJSON(data.content);
        $("#update_role").html("");
        for (i = 0; i < rolejson.length; i++) {
            var roleitem = rolejson[i];
            $("#update_role").append("<option value='" + roleitem.id + "'>" + roleitem.name + "</option>");
        }
        //$("#update_role").get(0).selectedIndex = 0;
        $("#update_role option[value=" + user[4] + "]").attr("selected", true);
    });

    $("#update_saveUser").off().on("click", function () {
        var loginName = $("#update_loginname").val().replace(/\s/g, '');
        var username = $("#update_username").val().replace(/\s/g, '');
        var IMEI = $("#update_IMEI").val().replace(/\s/g, '');
        var orgId = $("#update_org").val();
        var roleId = $("#update_role").val();
        var id = $("#update_id").val();

        if (username == '') {
            $("#tip3").html('姓名不能为空！').show();
            $(".update_username input").focus();
            return false;
        }
        if (IMEI.length != 15) {
            $("#tip3").html("IMEI格式不正确！");
            $("#update_IMEI").focus();
            return false;
        } else {
            $(".updateUser-box").hide();
            var params = {
                id:id,
                loginName: loginName,
                username: username,
                loginEquId: IMEI,
                orgId: orgId,
                roleId: roleId
            }
        }
        $.ajax({
            type: "post",
            url: "restful/user/update",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (data) {
                if (data.status == 'success') {
                    $.messager.alert("提示", "修改成功！", "info");
                    userRefresh();
                }
                else {
                    $.messager.alert("提示", "修改失败！", "error");
                }
            }
        });
    });
}

//删除用户
function btn_delete(el) {
    var id = el.id;
    confirm_ = confirm("确定删除该用户？");
    if (confirm_) {
        $.ajax({
            type: "get",
            url: "restful/user/deleteById",
            //contentType: "application/json",
            //dataType: "json",
            data: {id: id},
            success: function (data) {
                if (data.status == 'success') {
                    $.messager.alert("提示", "删除成功！", "info");
                    userRefresh();
                }
                else {
                    $.messager.alert("提示", "删除失败！", "error");
                }
            }
        });

    }
}

//重置密码
function btn_resetPwd(el) {
    var id = el.id;
    $(".resetPwd-box").removeClass("hide").show();
    $(".resetPwd-form input").attr("value", "");
    $("#tip1").empty();
    $("#btn_savePwd").off().on("click", function () {

        var pwd1 = $("#pwd1").val().replace(/\s/g, '');
        var pwd2 = $("#pwd2").val().replace(/\s/g, '');

        if (pwd1 == '') {
            $("#tip1").html('请输入密码').show();
            $("#pwd1").focus();
            return false;
        }
        if (pwd2 == '') {
            $("#tip1").html('请输入确认密码').show();
            $("#pwd2").focus();
            return false;
        }
        if (pwd1 != pwd2) {
            $("#tip1").html('新密码与确认密码不一致').show();
            $("#pwd1").focus();
            return false;
        }
        if (pwd1 == pwd2) {
            $("#tip1").html('').show();
            $(".resetPwd-box").hide();
            pwd1 = hex_md5(pwd1).toUpperCase();
            var params = {id: id, password: pwd1}
        }
        $.ajax({
            type: "post",
            url: "restful/user/update",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (data) {
                if (data.status == 'success') {
                    $.messager.alert("提示", "修改成功！", "info");
                    userRefresh();
                }
                else {
                    $.messager.alert("提示", "修改失败！", "error");
                }
            }

        });
    })
}

//重新加载用户信息页面
function userRefresh() {
    $.get("restful/user/getAll", function (data) {
        var records = $.parseJSON(data.content);

        $("#userTableContentUL").empty();

        $.each(records, function (i, r) {
            var loginEquId = typeof r.loginEquId == 'undefined' ? '&nbsp;&nbsp;' : r.loginEquId;
            var lastLoginTime = typeof r.lastLoginTime == 'undefined' ? '&nbsp;&nbsp;' : r.lastLoginTime;
            var record = '<li>' +
                '<input type="checkbox" />' +
                '<span class="itemSection">' + r.loginName + '</span><span class="itemSection">' + r.username + '</span>' +
                '<span class="itemSection">' + loginEquId + '</span><span class="itemSection">' + lastLoginTime + '</span>' +
                '<span class="itemSection">' + r.orgName + '</span> <span class="itemSection">' + r.name + '</span>' +
                '<span class="itemSection"><button id=' + [r.id,r.loginName, r.username, r.orgId, r.roleId,loginEquId ] + '       onclick="btn_update(this)">编辑</button>' +
                '<button id=' + r.id + ' onclick="btn_delete(this)">删除</button>' +
                '<button id=' + r.id + ' onclick="btn_resetPwd(this)">重置密码</button></span>' +
                '</li>'
            $("#userTableContentUL").append(record);

        });
    });
}