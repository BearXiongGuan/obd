package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.Building;
import com.hq.bm.entity.DataReview;
import com.hq.bm.entity.Jzw;
import com.hq.bm.restful.IBuildingRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IBuildingService;
import com.hq.bm.service.IDataReviewService;
import com.hq.bm.service.ISequenceService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by Administrator on 2017/3/22.
 */
@Component
@Slf4j
public class BuildingRestServiceImpl extends BaseRestServiceImpl<Building>
		implements IBuildingRestService {

	@Autowired
	private IBuildingService buildingService;
	@Autowired
	private IDataReviewService dataReviewService;
	@Autowired
	private ISequenceService sequenceService;


	public IBaseService getService() {
		return buildingService;
	}

	public String getBuildingById(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				List<Building> building = buildingService.findBuildingById(id);

				if (building != null) {
					result = JSON.toJSONStringWithDateFormat(building,
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


	public String showAllBuildingByOTB(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				List<Building> building = buildingService.showAllBuildingByOTB(id);

				if (building != null) {
					result = JSON.toJSONStringWithDateFormat(building,
							"yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl showAllBuildingByOTB is error,{id:" + id + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}


	public String findPositionById(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				Building building = buildingService.findPositionById(id);

				if (building != null) {
					result = JSON.toJSONStringWithDateFormat(building,
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

	public String getPageForJZW(String jsonStr) {
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

			page = buildingService.findByPageForJZW(page, mapBean);
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

	public String getPageForJZWByName(String jsonStr) {
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

			page = buildingService.findByPageByName(page, mapBean);
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

	public String getBuildingPropertyById(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				List<Building> building = buildingService
						.getBuildingPropertyById(id);

				if (building != null) {
					result = JSON.toJSONStringWithDateFormat(building,
							"yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"BaseRestServiceImpl getBuildingpropertyById is error,{id:"
							+ id + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findBuildingByWgId(String jsonStr) {
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

			page = buildingService.findBuildingByWgId(page, mapBean);
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

	public String buildingCollection(String jsonStr) {
		String result = "";
		try {

			// 将传过来的参数转化为对象
			Jzw jzw = JSON.parseObject(jsonStr, Jzw.class);
			// 将收集的建筑物数据保存到数据审核表，datatype为2,datakeyid对应facid,datakeyname对应facname,reviewstatus为0表示未审核状态,status为1表示新增
			String oldValue = "";
			String newValue = jsonStr;
			long facid = sequenceService.findSequenceByName("SEQ_JZW");
			DataReview dataReview = new DataReview();
			dataReview.setCountyId(jzw.getCountyId());
			dataReview.setCountyName(jzw.getCounty());
			dataReview.setMkcenterId(jzw.getVillageId());
			dataReview.setMkName(jzw.getVillage());
			dataReview.setCreateDate(new Date());
			dataReview.setCreater(jzw.getCreater());
			dataReview.setDatakeyId(facid);
			dataReview.setDataKeyName(jzw.getFacName());
			dataReview.setDataType(2);
			dataReview.setOldValue(oldValue);
			dataReview.setNewValue(newValue);
			dataReview.setReviewStatus(0);
			dataReview.setStatus(1);
			dataReviewService.save(dataReview);
			
			jsonView.successPack(""+facid,"数据采集成功！");
			result = JSON.toJSONString(jsonView);

		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl save is error,{jsonStr:" + jsonStr
					+ "}", e);
		}
		return result;
	}

	public String findAddrsByFacid(String id) {
		String result = "";

		try {
			if (StringUtils.isNotBlank(id)) {
				List<Building> building = buildingService
						.findAddrsByFacid(id);

				if (building != null) {
					result = JSON.toJSONStringWithDateFormat(building,
							"yyyy-MM-dd HH:mm:ss");
				}

				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"BaseRestServiceImpl findAddrsByFacid is error,{facid:"
							+ id + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findBuildingByVillage(String jsonStr) {
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

			page = buildingService.findBuildingByVillage(page, mapBean);
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

}
