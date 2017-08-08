package com.hq.bm.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hq.bm.entity.RptBroadbandPermeateData;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;


/**
 * Created by admin on 2017/5/24.
 */
public interface IRptBroadbandPermeateService extends IBaseService<RptBroadbandPermeateData> {
	Page exportRptBroadbandPermeateXls(Page page, Map<String, Object> map, HttpServletRequest request, HttpServletResponse response) throws ServiceException;
}
