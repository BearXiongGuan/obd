package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/4/21.
 */
public interface IDataReviewRestService extends IBaseRestService {
	// 审核数据，flag=1表示通过审核，flag=2表示驳回
	@POST
	@Path("reviewData")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String reviewData(String jsonStr);

	@POST
	@Path("updateBuildingProperty")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String updateBuildingProperty(String jsonStr);

	@POST
	@Path("updateOTBProperty")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String updateOTBProperty(String jsonStr);


	@POST
	@Path("saveWg")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String saveWg(String jsonStr);
	
	@POST
	@Path("getCount")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String getCount(String jsonStr);
}
