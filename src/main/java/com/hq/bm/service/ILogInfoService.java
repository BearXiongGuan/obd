package com.hq.bm.service;

import java.util.Map;

import com.hq.bm.entity.LogInfo;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

/**
 * Created by admin on 2017/3/7.
 */
public interface ILogInfoService extends IBaseService<LogInfo> {

    Page findPageByName(Page page, Map<String, Object> map) throws ServiceException;

    public void add(String modName, String desc) throws ServiceException;

}
