package com.hq.bm.restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/24.
 */
public interface IFacilityPhotoRestService extends IBaseRestService {

	@POST
	@Path("uploadPhoto")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	String uploadPhoto(String jsonStr);
	
	@GET
    @Path("downloadPhoto/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    void downloadPhoto(@PathParam("fileName") String fileName);
	
	@POST
	@Path("getPhotosByTypeAndFacid")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	String getPhotosByTypeAndFacid(String jsonStr);
}
