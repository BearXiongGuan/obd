package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.RptResCoverageData;
import com.hq.bm.restful.IRptObdThickThinRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IRptObdThickThinService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/23.
 */
@Path("RptObdThickThinCoverage")
@Component
@Slf4j
public class RptObdThickThinRestServiceImpl extends
		BaseRestServiceImpl<RptResCoverageData> implements
		IRptObdThickThinRestService {

	@Autowired
	private IRptObdThickThinService iRptObdThickThinService;
	@Context
	private HttpServletRequest request;
	@Context
	private HttpServletResponse response;

	public IBaseService getService() {
		return iRptObdThickThinService;
	}

	public String exportXls(int objType, int pageSize, int pageNumber,
			long orgId, String objName) {
		String result;
		Page page = new Page();
		page.setPageSize(pageSize);
		page.setPageNumber(pageNumber);
		Map<String, Object> mapBean = new HashMap<String, Object>();
		mapBean.put("objType", objType);
		mapBean.put("orgId", orgId);
		mapBean.put("objName", objName);
		page.setObjCondition(mapBean);

		try {

			page = iRptObdThickThinService.exportRptResCoverageXls(page,
					mapBean, request, response);
			result = JSON.toJSONStringWithDateFormat(page,
					"yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"BaseRestServiceImpl getPage is error,{jsonStr:"
							+ JSON.toJSONString(page) + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return null;
	}

}
