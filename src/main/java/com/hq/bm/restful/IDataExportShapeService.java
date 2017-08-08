package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.hq.bm.exception.ServiceException;


public interface IDataExportShapeService extends IBaseRestService {
	
	@POST
	@Path("exportGeomShape")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public String exportGeomShape(@FormParam("tabtype") String tabType , @FormParam("serviceurl") String serviceURL ,  @FormParam("optype") String optype , @FormParam("featuresdata") String featuresdata)  throws ServiceException;
	
	@POST
	@Path("exportAttrShape")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public String exportAttrShape(@FormParam("tabtype") String tabType , @FormParam("serviceurl") String serviceURL ,  @FormParam("optype") String optype , @FormParam("featuresdata") String featuresdata) throws ServiceException ;
}
