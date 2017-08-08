package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.Wg;
import com.hq.bm.restful.IWgRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IWgService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * Created by admin on 2017/5/3.
 */
@Component
@Slf4j
public class WgRestServiceImpl extends BaseRestServiceImpl<Wg> implements
		IWgRestService {
	@Autowired
	private IWgService wgService;

	public IBaseService<Wg> getService() {
		return wgService;
	}

	public String findWgGridType(String jsonStr) {
		String result;
		Page page;

		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
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

			page = wgService.findWgGridType(page, mapBean);
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


	   public String findWgByName(String jsonStr) {
		String result = "";

		try {
			Map<String, Object> map = JSON.parseObject(jsonStr);
			List<Wg> list = wgService.findWgByName(map);

			if (list != null) {
				result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
			}

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getByWhere is error，{jsonStr:" + jsonStr + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findWgByOrgName(String jsonStr) {
		String result = "";

		try {
			Map<String, Object> map = JSON.parseObject(jsonStr);
			List<Wg> list = wgService.findWgByOrgName(map);

			if (list != null) {
				result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
			}

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getByWhere is error，{jsonStr:" + jsonStr + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}
}
