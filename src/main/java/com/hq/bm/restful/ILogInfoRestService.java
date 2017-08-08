package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/7.
 */
@Path("logInfo")
public interface ILogInfoRestService extends IBaseRestService {

    /**
     * 分页查询
     *
     * @param jsonStr
     * @return
     */
    @POST
    @Path("getPage")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPage(String jsonStr);

    /**
     * 查询
     * @param jsonStr
     * @return
     */
    @POST
    @Path("getPageByName")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPageByName(String jsonStr);
}
