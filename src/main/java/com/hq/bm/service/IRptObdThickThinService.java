package com.hq.bm.service;

import com.hq.bm.entity.RptObdThickThinData;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;


/**
 * Created by admin on 2017/5/23.
 */
public interface IRptObdThickThinService extends IBaseService<RptObdThickThinData> {
	Page exportRptResCoverageXls(Page page, Map<String, Object> map, HttpServletRequest request, HttpServletResponse response) throws ServiceException;
}
