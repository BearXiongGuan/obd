package com.hq.bm.service;

import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/4/28.
 */
public interface IChartReportService<ChartReport> {

	public String getChartReport(String jsonStr) throws ServiceException;

	public String getChartThickThinReport(String jsonStr) throws ServiceException;
	
	//宽带渗透率
	public String getChartBrandBoadRate(String jsonString) throws ServiceException ;
}
