package com.hq.bm.restful;

import com.hq.bm.exception.ServiceException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("chartReport")
public interface IChartReportRestService{

	@POST
	@Path("getChartReport")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	String getChartReport(String jsonStr) throws ServiceException;

	@POST
	@Path("getChartThickThinReport")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	String getChartThickThinReport(String jsonStr) throws ServiceException;
	
	@POST
	@Path("getChartBroadbandRate")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	String getChartBroadbandRate(String jsonStr) throws ServiceException;

}
