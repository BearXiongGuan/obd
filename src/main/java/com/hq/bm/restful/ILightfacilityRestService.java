package com.hq.bm.restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/3/9.
 */

public interface ILightfacilityRestService extends IBaseRestService{
    @GET
    @Path("getByocfType")
    String getByocfType(@QueryParam("ocfType") int ocfType);

    @POST
    @Path("getByPosition")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getByPosition(String jsonStr);

    @GET
    @Path("getByOBDName")
    @Produces(MediaType.APPLICATION_JSON)
    String getByOBDName(@QueryParam("keyword") String keyword);


    @GET
    @Path("findPositionById")
    @Produces(MediaType.APPLICATION_JSON)
    String findPositionById(@QueryParam("id") String id);

    @POST
    @Path("getPageByName")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String getPageByName(String jsonStr);

    //根据建筑物ADDRID查找被OBD覆盖的OBD资源-手机用
    @GET
    @Path("findObdByBuildingAddrID")
    @Produces(MediaType.APPLICATION_JSON)
    String findObdByBuildingAddrID(@QueryParam("addrid") String id);


    //根据建筑物ADDRID查找被OBD覆盖的OBD资源-web用
    @GET
    @Path("findObdByBuildingAddrIDForWeb")
    @Produces(MediaType.APPLICATION_JSON)
    String findObdByBuildingAddrIDForWeb(@QueryParam("addrid") String id);

    //按组织机构查询OTB
    @POST
    @Path("findOTBByOrg")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findOTBByOrg(String jsonStr);

    //按OTB查询OBD
    @POST
    @Path("findOBDByOTB")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findOBDByOTB(String jsonStr);


    //按组织机构和名称模糊查询OTB
    @POST
    @Path("findOTBByIDAndName")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findOTBByIDAndName(String jsonStr);

    @POST
    @Path("exportXls")
    //@Consumes(MediaType.APPLICATION_JSON)
    //@Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    String exportXls(@FormParam("mkcenterId") long mkcenterId, @FormParam("pageSize")int pageSize, @FormParam("pageNumber") int pageNumber, @FormParam("name") String name, @FormParam("address") String address, @FormParam("recdateStart") String recdateStart, @FormParam("recdateEnd") String recdateEnd);
    @POST
    @Path("exportXlsFromSelRows")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    String exportXlsFromSelRows(@FormParam("jsonStr") String jsonStr);
    //按所属组织机构和端口查询obd
    @POST
    @Path("findObdByWhere")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String findObdByWhere(String jsonStr);
    //根据7级地址去找关联的设施
    @POST
    @Path("findObdByAddrids")
    @Produces(MediaType.APPLICATION_JSON)
    String findObdByAddrids(@QueryParam("addrids") String addrids);
    
    //光设施查询otb是否可移动
    @GET
    @Path("checkOtbMoveable")
    @Produces(MediaType.APPLICATION_JSON)
    String checkOtbMoveable(@QueryParam("ocfids") String ocfids) throws ServiceException ;
}
