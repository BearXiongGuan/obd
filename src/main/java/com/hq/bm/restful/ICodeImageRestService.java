package com.hq.bm.restful;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

/**
 * Created by Administrator on 2017/5/5.
 */

public interface ICodeImageRestService extends IBaseRestService {
	
    @GET
    @Path("getCode")
    @Consumes(MediaType.APPLICATION_OCTET_STREAM)
    void getCode() throws IOException;
}
