package com.hq.bm.service;

import com.hq.bm.entity.App;
import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/4/17.
 */
public interface IAppService extends IBaseService<App>{

    String insert(App app) throws ServiceException;

    Integer isVersionExist(String version) throws ServiceException;

    boolean deleteByUrl(String url) throws ServiceException;
    
    App getNew() throws ServiceException;
}
