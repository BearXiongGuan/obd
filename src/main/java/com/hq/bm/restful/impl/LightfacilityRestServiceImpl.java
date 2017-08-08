package com.hq.bm.restful.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.beanutils.BeanMap;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.Lightfacility;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.ILightfacilityRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.ILightfacilityService;

/**
 * Created by Administrator on 2017/3/9.
 */
@Path("lightfacility")
@Component
@Slf4j
public class LightfacilityRestServiceImpl extends
		BaseRestServiceImpl<Lightfacility> implements ILightfacilityRestService {

	@Autowired
	private ILightfacilityService lightfacilityService;

	public IBaseService getService() {
		return lightfacilityService;
	}

	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;

	public String getByocfType(int ocfType) {
		String result = "";

		try {
			Lightfacility entity = new Lightfacility();
			entity.setOcfType(ocfType);
			Map mapBean = new BeanMap(entity);
			List<Lightfacility> list = this.getService().findByMap(mapBean);

			if (list != null) {
				result = JSON.toJSONStringWithDateFormat(list,
						"yyyy-MM-dd HH:mm:ss");
			}

			jsonView.successPack(result);
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("UserRestServiceImpl getByJobNum is error，{ocfType:"
					+ ocfType + "}", e);
		}

		/* result = JSON.toJSONString(jsonView); */

		return result;
	}

	public String getByPosition(String jsonStr) {

		String result = "";

		try {
			Map<String, Object> position = JSON.parseObject(jsonStr);
			// Map<String, Object> mapBean =
			// BeanObjectToMap.convertBean(position);
			List<Lightfacility> list = lightfacilityService
					.findByPosition(position);

			if (list != null) {
				result = JSON.toJSONStringWithDateFormat(list,
						"yyyy-MM-dd HH:mm:ss");
			}

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getByWhere is error，{jsonStr:"
					+ jsonStr + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String getByOBDName(String keyword) {

		String result = "";

		try {
			// Map <String,Object> position = JSON.parseObject(keyword);
			// Map<String, Object> mapBean =
			// BeanObjectToMap.convertBean(position);
			if (StringUtils.isNotBlank(keyword)) {
				List<Lightfacility> list = lightfacilityService
						.findByOBDName(keyword);

				if (list != null) {
					result = JSON.toJSONStringWithDateFormat(list,
							"yyyy-MM-dd HH:mm:ss");
				}
			}

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getByWhere is error，{jsonStr:"
					+ keyword + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findPositionById(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				Lightfacility lightfacility = lightfacilityService
						.findPositionById(id);

				if (lightfacility != null) {
					result = JSON.toJSONStringWithDateFormat(lightfacility,
							"yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getById is error,{id:" + id + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String getPageByName(String jsonStr) {
		String result;
		Page page;

		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
					Lightfacility lightfacility = null;
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

			page = lightfacilityService.findPageByName(page, mapBean);
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

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findObdByBuildingAddrID(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				List<Lightfacility> lightfacility = lightfacilityService
						.findObdByBuildingAddrID(id);

				if (lightfacility != null) {
					result = JSON.toJSONStringWithDateFormat(lightfacility,
							"yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getById is error,{id:" + id + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findObdByBuildingAddrIDForWeb(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				List<Lightfacility> lightfacility = lightfacilityService
						.findObdByBuildingAddrIDForWeb(id);

				if (lightfacility != null) {
					result = JSON.toJSONStringWithDateFormat(lightfacility,
							"yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getById is error,{id:" + id + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findOTBByOrg(String jsonStr) {
		String result;
		Page page;

		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
					Lightfacility lightfacility = null;
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

			page = lightfacilityService.findOTBByOrg(page, mapBean);
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

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findOBDByOTB(String jsonStr) {
		String result = "";

		try {
			Map<String, Object> map = JSON.parseObject(jsonStr);
			List<Lightfacility> list = lightfacilityService.findOBDByOTB(map);

			if (list != null) {
				result = JSON.toJSONStringWithDateFormat(list,
						"yyyy-MM-dd HH:mm:ss");
			}

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getByWhere is error，{jsonStr:"
					+ jsonStr + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findOTBByIDAndName(String jsonStr) {
		String result;
		Page page;

		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
					Lightfacility lightfacility = null;
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

			page = lightfacilityService.findOTBByIDAndName(page, mapBean);
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

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String exportXls(long mkcenterId, int pageSize, int pageNumber,
			String name, String address, String recdateStart, String recdateEnd) {
		String result;
		Page page = new Page();
		page.setPageSize(pageSize);
		page.setPageNumber(pageNumber);
		Map<String, Object> conditions = new HashMap<String, Object>();
		conditions.put("mkcenterId", mkcenterId);
		conditions.put("name", name);
		conditions.put("address", address);
		conditions.put("recdateStart", recdateStart);
		conditions.put("recdateEnd", recdateEnd);
		page.setObjCondition(conditions);
		String jsonStr = JSON.toJSONString(page);
		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
					Lightfacility lightfacility = null;
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

			page = lightfacilityService.findPageByNameToexportXls(page,
					mapBean, request, response);
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

		result = JSON.toJSONString(jsonView);

		return null;
	}

	public String exportXlsFromSelRows(String jsonStr) {
		String result;
		try {
			List<Lightfacility> facilities = JSON.parseArray(jsonStr,
					Lightfacility.class);
			lightfacilityService.exportXlsFromSelRows(facilities, request,
					response);
			jsonView.successPack("");
		} catch (ServiceException e) {
			jsonView.failPack(e);
			log.error(
					"LightfacilityRestServiceImpl exportXlsFromSelRows is error,{jsonStr:"
							+ jsonStr + "}", e);
		}
		result = JSON.toJSONString(jsonView);
		return result;
	}

	public String findObdByWhere(String jsonStr) {
		String result;
		Page page;

		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
					Lightfacility lightfacility = null;
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

			page = lightfacilityService.findObdPageByWhere(page, mapBean);
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

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findObdByAddrids(String addrids) {
		String result;
		try {
			List<Lightfacility> obds = lightfacilityService
					.findObdByAddrids(addrids);
			result = JSON.toJSONStringWithDateFormat(obds,
					"yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"LightfacilityRestServiceImpl findObdByAddrids is error,{addrids:"
							+ addrids + "}", e);
		}

		result = JSON.toJSONString(jsonView);
		return result;
	}

	public String checkOtbMoveable(String ocfids) {
		String result = "";
		try {
			result = lightfacilityService.checkOtbMoveable(ocfids);
			jsonView.successPack(result);
		} catch (ServiceException e) {
			jsonView.failPack(e);
			log.error(
					"ChartReportRestServiceImpl checkOtbMoveable is error,{ocfids:"
							+ ocfids + "}", e);
		}
		result = JSON.toJSONString(jsonView);
		return result;
	}
}
