package com.hq.bm.restful.impl;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hq.bm.entity.DataReview;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.IDataReviewRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IDataReviewService;
import com.hq.bm.service.ILogInfoService;
import com.hq.bm.service.ISequenceService;

/**
 * Created by Administrator on 2017/4/21.
 */
@Component
@Slf4j
@Path("dataReview")
public class DataReviewRestServiceImpl extends BaseRestServiceImpl<DataReview>
		implements IDataReviewRestService {
	@Autowired
	private IDataReviewService dataReviewService;
	@Autowired
	private ISequenceService sequenceService;
	@Autowired
	private ILogInfoService logInfoService;
	@Context
	private HttpServletRequest request;

	public IBaseService<DataReview> getService() {
		return dataReviewService;
	}

	public String reviewData(String jsonStr) {

		@SuppressWarnings("unchecked")
		HashMap<String, String> paramsMap = JSON.parseObject(jsonStr,
				new HashMap<String, String>().getClass());
		String result = "{\"status\":false}";
		String ids = paramsMap.get("ids");
		String flag = paramsMap.get("flag");
		String opPlatform = paramsMap.get("opPlatform");
		String ip = paramsMap.get("ip");
		if ("0".equals(opPlatform)) {
			ip = request.getRemoteAddr();
		}
		String reviewer = paramsMap.get("reviewer");
		String remark = paramsMap.get("remark");
		try {
			result = dataReviewService.reviewData(ids, flag, opPlatform, ip,
					reviewer, remark);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("DataReviewRestServiceImpl reviewData is error,{flag:"
					+ flag + ",ids:" + ids + ",opPlatform:" + opPlatform
					+ ",ip:" + ip + ",\"reviewer\":" + reviewer + "}", e);
		}
		return result;
	}

	public String updateBuildingProperty(String jsonStr) {
		String result;

		try {
			DataReview dataReview = JSON.parseObject(jsonStr,
					this.getEntityClass());

			if (dataReview != null) {
				result = String.valueOf(dataReviewService
						.updateBuildingProperty(dataReview));
				jsonView.successPack(result);
				//logInfoService.add("建筑物模块","修改建筑物：（id："+dataReview.getDatakeyId()+",名称："+dataReview.getDataKeyName()+"）");
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			String message = e.getMessage();

			if (StringUtils.isBlank(message)) {
				message = "更新数据失败！";
			}

			jsonView.failPack("false", message);
			log.error("dataReviewRestServiceImpl updateBuildingProperty is error,{jsonStr:"
					+ jsonStr + "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String updateOTBProperty(String jsonStr) {


		String p_ip = "";
		JSONObject paramsMap = JSON.parseObject(jsonStr);
		String p_ret = "{\"status\":false}";
		String p_ocfids =  paramsMap.get("datakeyId").toString();
		String p_submitperson = paramsMap.get("creater").toString();
		float p_longitude =  Float.parseFloat(paramsMap.get("longitude").toString());
		float p_latitude =  Float.parseFloat(paramsMap.get("latitude").toString());
		String p_platform = paramsMap.get("opPlatform").toString();
		if(paramsMap.get("ip") != null) {
			p_ip = paramsMap.get("ip").toString();
		}
		if ("0".equals(p_platform)) {
			p_ip = request.getRemoteAddr();
		}

		try {
			p_ret = dataReviewService.updateOTBProperty(p_ocfids, p_longitude, p_latitude,p_platform, p_ip,
					p_submitperson);
			//logInfoService.add("光设施模块","设施移动（设施id：" + p_ocfids + ",设施坐标：" + p_longitude + " " + p_latitude +"）");
		} catch (Exception e) {
			e.printStackTrace();
			log.error("DataReviewRestServiceImpl reviewData is error,{p_longitude:"
					+ p_longitude + ",p_latitude:" + p_latitude + ",p_ocfids:" + p_ocfids + ",p_platform:" + p_platform
					+ ",p_ip:" + p_ip + "}", e);
		}
		return p_ret;
	}

	public String saveWg(String jsonStr) {
		String result;
		long facid = 0;

		try {
			DataReview dataReview = JSON.parseObject(jsonStr,
					this.getEntityClass());
			if(dataReview.getDataType() == 3) {
				facid = sequenceService.findSequenceByName("SEQ_WG");
			}else if(dataReview.getDataType() == 4){
				facid = sequenceService.findSequenceByName("SEQ_FWQ");
			}
			dataReview.setDatakeyId(facid);
			if (dataReview != null) {
				dataReviewService.saveWg(dataReview);
				jsonView.successPack("" + facid, "数据采集成功！");

			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			String message = e.getMessage();

			if (StringUtils.isBlank(message)) {
				message = "更新数据失败！";
			}

			jsonView.failPack("false", message);
			log.error("dataReviewRestServiceImpl saveWg is error,{jsonStr:"
					+ jsonStr + "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}
	@Override
	public String save(String jsonStr) {
		DataReview dataReview;
		String result=null;
		try {
			dataReview = JSON.parseObject(jsonStr,
					this.getEntityClass());
			result = dataReviewService.save(dataReview);
            jsonView.successPack(result);
		} catch (Exception e) {
			jsonView.failPack("false", e.getMessage());
		}
		result = JSON.toJSONString(jsonView);

        return result;
	}
	
	public String getCount(String jsonStr) {
		String result;
		try {
			Map<String, Object> params = JSON.parseObject(jsonStr,
					new HashMap<String, Object>().getClass());
			int count = dataReviewService.getCount(params);
			jsonView.successPack("" + count);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (ServiceException e) {
			jsonView.failPack("false", e.getMessage());
			log.error("dataReviewRestServiceImpl getCount is error,{jsonStr:"
					+ jsonStr + "}," + e.getMessage(), e);
		}
		result = JSON.toJSONString(jsonView);
		return result;
	}
}
