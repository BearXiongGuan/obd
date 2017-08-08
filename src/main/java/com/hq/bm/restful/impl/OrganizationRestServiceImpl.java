package com.hq.bm.restful.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.Organization;
import com.hq.bm.restful.IOrganizationRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IOrganizationService;
import com.hq.bm.utils.IDGenerator;

/**
 * Created by Administrator on 2017/3/16.
 */
@Component
@Slf4j
public class OrganizationRestServiceImpl extends
		BaseRestServiceImpl<Organization> implements IOrganizationRestService {

	@Autowired
	private IOrganizationService organizationService;

	public IBaseService getService() {

		return organizationService;
	}

	public String getAll() {

		String result = "";
		try {
			List<Organization> list = this.getService().findAll();
			int total = list.size();
			result = JSON.toJSONStringWithDateFormat(list,
					"yyyy-MM-dd HH:mm:ss");

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("OrganizationRestServiceImpl getAll is error", e);
		}
		result = JSON.toJSONString(jsonView);

		return result;

	}

	public String findOrgByUser(String userId) {

		String result = "";

		try {
			if (StringUtils.isNotBlank(userId)) {
				List<Organization>list= organizationService.findOrgByUser(userId);

				if (list != null) {
					result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getById is error,{id:" + userId + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String getByOrgId(String orgId) {
		String result = "";
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("id", orgId);

		try {
			List<Organization> list = this.getService().findByMap(map);

			if (list != null && !list.isEmpty()) {
				result = JSON.toJSONStringWithDateFormat(list,
						"yyyy-MM-dd HH:mm:ss");
			}

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"OrganizationRestServiceImpl getByOrgName is error,{orgId:"
							+ orgId + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String insert(String jsonStr) {
		String result = "";
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateNowStr = sdf.format(date);
		String orgId = IDGenerator.num2Str(7);
		JSONObject jsonObj = JSON.parseObject(jsonStr);
		jsonObj.put("orgId", orgId);
		jsonObj.put("createTime", dateNowStr);
		jsonObj.put("createrId", 10000);
		String json = jsonObj.toJSONString();

		try {
			Organization organization = JSON.parseObject(json,
					this.getEntityClass());

			if (organization != null) {
				result = this.getService().save(organization);

				if ("exists".equals(result)) {
					jsonView.setMessage("exists");
				} else {
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
			log.error("BaseRestServiceImpl save is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		// result = JSON.toJSONString(jsonView);

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
					Organization organization = null;
					String objCondition = null;

					if (null != page.getObjCondition()) {
						objCondition = page.getObjCondition().toString();
					}

					if (StringUtils.isNotBlank(objCondition)
							&& !"{}".equalsIgnoreCase(objCondition)) {
						mapBean = JSON.parseObject(objCondition);

					}
				}
			} else {
				page = new Page();
			}

			page = organizationService.findByPage(page, mapBean);
			result = JSON.toJSONStringWithDateFormat(page,
					"yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getPage is error,{jsonStr:"
					+ jsonStr + "}", e);
		}

		// result = JSON.toJSONString(jsonView);
		result = result.replaceAll("orgPid","_parentId");
		return result;
	}

	public String findYfByUser(String jsonStr) {

		String result = "";

		try {
			Map<String, Object> map = JSON.parseObject(jsonStr);
			if (StringUtils.isNotBlank((String) map.get("id"))) {
				List<Organization>list= organizationService.findYfByUser(map);

				if (list != null) {
					result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl findYfByUser is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

}