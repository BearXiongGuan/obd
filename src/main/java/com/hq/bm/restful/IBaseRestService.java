package com.hq.bm.restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by admin on 2017/3/7.
 */
public interface IBaseRestService {

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
     * 获取所有数据
     *
     * @return
     */
    @GET
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    String getAll();

    /**
     * 根据条件查询
     * 将条件实体bean转化成jsonStr
     *
     * @param jsonStr
     * @return
     */
    @POST
    @Path("getByWhere")
    @Consumes(MediaType.APPLICATION_JSON)
    String getByWhere(String jsonStr);

    /**
     * 根据id查询
     *
     * @param id
     * @return
     */
    @GET
    @Path("getById")
    String getById(@QueryParam("id") String id);

    /**
     * 根据名称查询
     *
     * @param name
     * @return
     */
    @GET
    @Path("getByName")
    String getByName(@QueryParam("name") String name);

    /**
     * 根据id删除
     *
     * @param id
     * @return
     */
    @GET
    @Path("deleteById")
    @Produces(MediaType.APPLICATION_JSON)
    String deleteById(@QueryParam("id") String id);

    /**
     * 保存
     * 将实体bean转化成jsonStr
     *
     * @param jsonStr
     * @return
     */
    @POST
    @Path("save")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String save(String jsonStr);

    /**
     * 编辑   将实体bean转化成jsonStr
     *
     * @param jsonStr
     * @return
     */
    @POST
    @Path("update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String update(String jsonStr);
}
