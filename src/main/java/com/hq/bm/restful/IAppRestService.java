package com.hq.bm.restful;


import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;


/**
 * Created by Administrator on 2017/4/17.
 */

public interface IAppRestService extends IBaseRestService {

    @GET
    @Path("getNewApp")
    @Produces(MediaType.APPLICATION_JSON)
    String getNewApp();

    @GET
    @Path("getAllApp")
    @Produces(MediaType.APPLICATION_JSON)
    String getAllApp();

    @POST
    @Path("check")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String check(String jsonStr);

    @GET
    @Path("deleteAppByUrl")
    @Produces(MediaType.APPLICATION_JSON)
    String deleteAppByUrl(@QueryParam("url") String url);

    @POST
    @Path("uploadApp/{id}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    String uploadApp(@PathParam("id") String id);

    @GET
    @Path("downloadApp/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    void downloadApp(@PathParam("fileName") String fileName);
}
