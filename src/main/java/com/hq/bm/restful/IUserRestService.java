package com.hq.bm.restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/7.
 */
public interface IUserRestService extends IBaseRestService {

    /*@GET
    @Path("getByJobNum")
    String getByJobNum(@QueryParam("jobNum") String jobNum);*/

    /*@GET
    @Path("getByJobNumWithPathParam/{jobNum}")
    String getByJobNumWithPathParam(@PathParam("jobNum") String jobNum);*/

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String login(String jsonStr);


    @GET
    @Path("getByLoginPrivi")
    @Produces(MediaType.APPLICATION_JSON)
    String getByLoginPrivi();

    @GET
    @Path("getByLoginRole")
    @Produces(MediaType.APPLICATION_JSON)
    String getByLoginRole();

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

    @POST
    @Path("insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String insert(String jsonStr);

    /**
     * 重置密码
     *
     * @param jsonStr
     * @return
     */
    @POST
    @Path("updatePassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String updatePassword(String jsonStr);

    /**
     * 更新状态
     *
     * @param jsonStr
     * @return
     */
    @POST
    @Path("updateStatus")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String updateStatus(String jsonStr);

    @GET
    @Path("deleteUserByIds")
    @Produces(MediaType.APPLICATION_JSON)
    String deleteUserByIds(@QueryParam("ids") String ids,@QueryParam("loginNames")String loginNames);

    @POST
    @Path("checkOriginalPw")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String checkOriginalPw(String jsonStr);
}
