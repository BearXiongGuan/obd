package com.hq.bm.restful;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.hq.bm.entity.Permission;

/**
 * Created by Administrator on 2017/3/20.
 */
@Path("permission")
public interface IPermissionRestService extends IBaseRestService{
	    @GET
	    @Path("getAll")
	    @Produces(MediaType.APPLICATION_JSON)
	    String getAll();
	    
	    @GET
	    @Path("findByLoginName")
	    @Produces(MediaType.APPLICATION_JSON)
	    String findByLoginName(@QueryParam("loginName") String loginName);
}
