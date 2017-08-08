package com.hq.bm.restful;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

/**
 * Created by Administrator on 2017/5/5.
 */

@Path("addr")
public interface IAddrRestService extends IBaseRestService {

	@GET
	@Path("findParentLevelAddrsById")
	@Produces(MediaType.APPLICATION_JSON)
	String findParentLevelAddrsById(@QueryParam("addrId") long addrId);

	@GET
	@Path("findAddrsByAddr")
	@Produces(MediaType.APPLICATION_JSON)
	String findAddrsByAddr(@QueryParam("addr") String addr);
	
	@POST
	@Path("findAddrsByParentId")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	String findAddrsByParentId(String jsonStr);
}
