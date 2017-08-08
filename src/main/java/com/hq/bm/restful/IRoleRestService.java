package com.hq.bm.restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/6.
 */
@Path("role")
public interface IRoleRestService extends IBaseRestService {
    @POST
    @Path("insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String insert(String jsonStr);

    @POST
    @Path("getPage")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPage(String jsonStr);

    @POST
    @Path("updatePermi")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String updatePermi(String jsonStr);

    @GET
    @Path("deleteRoleById")
    @Produces(MediaType.APPLICATION_JSON)
    String deleteRoleById(@QueryParam("id") String id,@QueryParam("name")String name);
}
