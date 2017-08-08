package com.hq.bm.restful;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/7.
 */
@Path("platFormLoginData")
public interface IPlatFormLoginRestService extends IBaseRestService {

    /**
     * 获取所有数据
     *
     * @return
     */
    @GET
    @Path("getDayData")
    @Produces(MediaType.APPLICATION_JSON)
    String getDayData(@QueryParam("count") int count);

    /**
     * 获取所有数据
     *
     * @return
     */
    @GET
    @Path("getMonthData")
    @Produces(MediaType.APPLICATION_JSON)
    String getMonthData(@QueryParam("count") int count);

    /**
     * 获取所有数据
     *
     * @return
     */
    @GET
    @Path("getYearData")
    @Produces(MediaType.APPLICATION_JSON)
    String getYearData(@QueryParam("count") int count);


}
