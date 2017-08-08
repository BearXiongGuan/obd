package com.hq.bm.service;


import java.util.Map;

import com.hq.bm.entity.DataReview;
import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/4/21.
 */
public interface IDataReviewService extends IBaseService<DataReview> {
	// 审核数据，flag=1表示通过审核，flag=2表示驳回
	public String reviewData(String ids, String flag,String opPlatform, String ip, String reviewer,String remark)
			throws ServiceException;

	String  updateBuildingProperty(DataReview dataReview) throws ServiceException;

	String  updateOTBProperty(String p_ocfids, float p_longitude,float p_latitude, String p_platform,String p_ip,String p_submitperson) throws ServiceException;

	String  saveWg(DataReview dataReview) throws ServiceException;
	
	Integer getCount(Map<String, Object> map) throws ServiceException;
}
