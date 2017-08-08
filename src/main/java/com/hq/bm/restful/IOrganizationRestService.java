package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/7.
 */
@Path("organization")
public interface IOrganizationRestService extends IBaseRestService {
    /**
     * 获取所有数据
     *
     * @return
     */
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    String getAll();

    @GET
    @Path("findOrgByUser")
    @Produces(MediaType.APPLICATION_JSON)
    String findOrgByUser(@QueryParam("userId") String userId);

    @GET
    @Path("getByOrgId")
	String getByOrgId(@QueryParam("orgId") String orgId);


    @POST
    @Path("getPage")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPage(String jsonStr);

    @POST
    @Path("findYfByUser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findYfByUser(String jsonStr);


}
