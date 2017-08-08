package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/5/3.
 */
@Path("wg")
public interface IWgRestService extends IBaseRestService {

    //通过网格类型查询网格
    @POST
    @Path("findWgGridType")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findWgGridType(String jsonStr);

    //按建筑物名称 和 区域id 查网格
    @POST
    @Path("findWgByName")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findWgByName(String jsonStr);
    
    //按组织机构名称 查网格
    @POST
    @Path("findWgByOrgName")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findWgByOrgName(String jsonStr);

}
