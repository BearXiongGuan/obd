package com.hq.bm.restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by Administrator on 2017/3/22.
 */
@Path("building")
public interface IBuildingRestService extends IBaseRestService{

    @GET
    @Path("getById")
    @Produces(MediaType.APPLICATION_JSON)
    String getBuildingById(@QueryParam("id") String id);

    @GET
    @Path("showAllBuildingByOTB")
    @Produces(MediaType.APPLICATION_JSON)
    String showAllBuildingByOTB(@QueryParam("ocfid") String id);

    @GET
    @Path("getBuildingPropertyById")
    @Produces(MediaType.APPLICATION_JSON)
    String getBuildingPropertyById(@QueryParam("id") String id);

    @GET
    @Path("findPositionById")
    @Produces(MediaType.APPLICATION_JSON)
    String findPositionById(@QueryParam("id") String id);

    @POST
    @Path("getPageForJZW")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPageForJZW(String jsonStr);

    @POST
    @Path("getPageForJZWByName")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPageForJZWByName(String jsonStr);


    //通过网格id来查询建筑物
    @POST
    @Path("findBuildingByWgId")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findBuildingByWgId(String jsonStr);
    
    //建筑物采集
    @POST
    @Path("buildingCollection")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String buildingCollection(String jsonStr);

    //通过建筑物ID查地址和所属网格
    @GET
    @Path("findAddrsbyfacid")
    @Produces(MediaType.APPLICATION_JSON)
    String findAddrsByFacid(@QueryParam("facid") String id);

    @POST
    @Path("findBuildingByVillage")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findBuildingByVillage(String jsonStr);

}
