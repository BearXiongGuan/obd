package com.hq.bm.restful.impl;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.IChartReportRestService;
import com.hq.bm.service.IChartReportService;

/**
 * Created by Administrator on 2017/4/28.
 */
@Component
@Slf4j
public class ChartReportRestServiceImpl<ChartReport> implements
		IChartReportRestService {

	@Autowired
	private IChartReportService chartReportService;

	public String getChartReport(String jsonStr)  throws ServiceException {
		String result = "{\"status\":false}";
		try {
			result = chartReportService.getChartReport(jsonStr);
		} catch (ServiceException e) {
			e.printStackTrace();
			log.error(
					"ChartReportRestServiceImpl getChartReport is error,{jsonStr:"
							+ jsonStr + "}", e);
		}
		return result;
	}

	public String getChartThickThinReport(String jsonStr) throws ServiceException {
		String result = "{\"status\":false}";
		try {
			result = chartReportService.getChartThickThinReport(jsonStr);
		} catch (ServiceException e) {
			e.printStackTrace();
			log.error(
					"ChartReportRestServiceImpl getChartReport is error,{jsonStr:"
							+ jsonStr + "}", e);
		}
		return result;
	}

	public String getChartBroadbandRate(String jsonStr) throws ServiceException {
		String result = "{\"status\":false}";
		try {
			result = chartReportService.getChartBrandBoadRate(jsonStr);
		} catch (ServiceException e) {
			e.printStackTrace();
			log.error(
					"ChartReportRestServiceImpl getChartReport is error,{jsonStr:"
							+ jsonStr + "}", e);
		}
		return result;
	}
	
}
