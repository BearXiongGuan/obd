package com.hq.bm.restful.impl;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import lombok.extern.slf4j.Slf4j;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hq.bm.entity.Organization;
import com.hq.bm.entity.Permission;
import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.IPermissionRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IPermissionService;

import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Administrator on 2017/3/20.
 */
@Component
@Slf4j
public class PermissionRestServiceImpl extends BaseRestServiceImpl<Permission> implements IPermissionRestService {
    @Autowired
    private IPermissionService permissionService;

    public IBaseService getService() {
        return permissionService;
    }

	@POST
	@Path("getAll")
	@Consumes("application/json")
	@Produces("application/json")
	public String getAll() {

		String result = "";
		try {
			List<Permission> list = this.getService().findAll();
			result = JSON.toJSONStringWithDateFormat(list,
					"yyyy-MM-dd HH:mm:ss");

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("PermissionRestServiceImpl selectPermissions is error", e);
		}
		result = JSON.toJSONString(jsonView);
		return result;
	}

	@GET
	@Path("findByLoginName")
	@Produces("application/json")
	public String findByLoginName(String loginName) {
		String result = "";
		try {
			List<Permission> list = permissionService.getPermissionByLoginName(loginName);
			result = JSON.toJSONStringWithDateFormat(list,
					"yyyy-MM-dd HH:mm:ss");

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("PermissionRestServiceImpl selectPermissions is error", e);
		}
		result = JSON.toJSONString(jsonView);
		return result;
	}
}


