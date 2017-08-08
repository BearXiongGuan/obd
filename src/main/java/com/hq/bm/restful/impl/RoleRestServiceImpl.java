package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.Role;
import com.hq.bm.restful.IRoleRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.ILogInfoService;
import com.hq.bm.service.IRoleService;
import com.hq.bm.utils.BeanObjectToMap;
import com.hq.bm.utils.Log;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/16.
 */
@Component
@Slf4j
public class RoleRestServiceImpl extends BaseRestServiceImpl<Role> implements IRoleRestService{

    @Autowired
    private IRoleService roleService;

    @Autowired
    private ILogInfoService logInfoService;

    public IBaseService getService() {
        return roleService;
    }

    @Log(operationType = "角色模块")
    public String insert(String jsonStr)
    {
        String result;
        jsonView.setContent("");
        jsonView.setStatus("");
        try {
            Role role = JSON.parseObject(jsonStr, this.getEntityClass());
            //判断角色名是否被用
            if(roleService.isNameExist(role.getName())!=0){
                jsonView.setMessage("exist");
            }
            else{
                if (role != null) {
                    result = roleService.insert(role);
                    logInfoService.add("角色模块","添加角色：(角色名称："+role.getName()+"，描述："+role.getDescription()+")");
                    jsonView.successPack(result);
                }
            }
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            String message = e.getMessage();

            if (StringUtils.isBlank(message)) {
                message = "保存数据失败！";
            }

            jsonView.failPack("false", message);

            log.error("BaseRestServiceImpl save is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;

    }

    public String getPage(String jsonStr) {
        String result = "";
        Page page;

        try {
            Map<String, Object> mapBean = new HashMap<String, Object>();

            if (!StringUtils.isBlank(jsonStr)) {
                page = JSON.parseObject(jsonStr, Page.class);

                if (page != null) {
                    Role role = null;
                    String objCondition = null;

                    if (null != page.getObjCondition()) {
                        objCondition = page.getObjCondition().toString();
                    }

                    if (StringUtils.isNotBlank(objCondition) && !"{}".equalsIgnoreCase(objCondition)) {
                        role = JSON.parseObject(objCondition, this.getEntityClass());
                        mapBean = BeanObjectToMap.convertBean(role);
                    }
                }
            } else {
                page = new Page();
            }

            page = this.getService().findByPage(page, mapBean);
            result = JSON.toJSONStringWithDateFormat(page, "yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("RoleRestServiceImpl getPage is error,{jsonStr:" + jsonStr + "}", e);
        }

        //result = JSON.toJSONString(jsonView);

        return result;
    }

   @Log(operationType = "角色模块",operationName = "更新权限")
    public String updatePermi(String jsonStr) {
        String result;

        try {
            Role role = JSON.parseObject(jsonStr, this.getEntityClass());

            if (role != null) {
                result = String.valueOf(roleService.updatePermi(role));
                logInfoService.add("角色模块","更新权限：(角色："+role.getName()+"，权限id："+role.getPriviIds()+")");
                jsonView.successPack(result);
            }
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            String message = e.getMessage();

            if (StringUtils.isBlank(message)) {
                message = "更新数据失败！";
            }

            jsonView.failPack("false", message);
            log.error("BaseRestServiceImpl update is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String deleteRoleById(String id, String name) {
        boolean flag = false;
        try {
            flag = roleService.deleteById(id);
            jsonView.successPack(JSON.toJSONString(flag));
            logInfoService.add("角色模块","删除角色：(角色名称："+name+")");
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(JSON.toJSONString(flag));
            log.error("BaseRestServiceImpl deleteById is error,{Id:" + id + "}", e);
        }

        return JSON.toJSONString(jsonView);
    }

    @Override
    public String update(String jsonStr) {
        String result;
        try {
            Role role = JSON.parseObject(jsonStr, this.getEntityClass());

            if (role != null) {
                result = String.valueOf(this.getService().update(role));
                logInfoService.add("角色模块","修改角色："+role.getCode()+"(修改后角色名称："+role.getName()+"，角色描述："+role.getDescription()+")");
                jsonView.successPack(result);
            }
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            String message = e.getMessage();

            if (StringUtils.isBlank(message)) {
                message = "更新数据失败！";
            }

            jsonView.failPack("false", message);
            log.error("RoleRestServiceImpl update is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }
}
