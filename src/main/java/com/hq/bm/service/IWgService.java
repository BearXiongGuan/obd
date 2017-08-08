package com.hq.bm.service;

import com.hq.bm.entity.Wg;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/5/3.
 */
public interface IWgService  extends IBaseService<Wg> {

    Page findWgGridType(Page page, Map<String, Object> map) throws ServiceException;

    List<Wg> findWgByName(Map<String, Object> map) throws ServiceException;
    
    List<Wg> findWgByOrgName(Map<String, Object> map) throws ServiceException;
}
