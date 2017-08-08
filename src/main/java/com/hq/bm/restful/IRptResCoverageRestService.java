package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/6.
 */
public interface IRptResCoverageRestService extends IBaseRestService {
	@POST
	@Path("exportXls")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	String exportXls(@FormParam("objType") int objType,
			@FormParam("pageSize") int pageSize,
			@FormParam("pageNumber") int pageNumber,
			@FormParam("orgId") long orgId,
			@FormParam("objName") String objName);
}
