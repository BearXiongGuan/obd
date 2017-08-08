package com.hq.bm.service;

import com.hq.bm.entity.SysParam;
import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/5/16.
 */
public interface ISysParamService extends IBaseService<SysParam> {
    String insert(SysParam sysParam) throws ServiceException;

    boolean edit(SysParam sysParam) throws ServiceException;

    SysParam findOne(String paramName);

    SysParam findName();
}
