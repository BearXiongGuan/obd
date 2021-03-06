package com.hq.bm.service;

import com.hq.bm.entity.Lightfacility;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/3/7.
 */
public interface IBaseService<Entity> {

    Page findByPage(Page page, Map<String, Object> map) throws ServiceException;

    String save(Entity entity) throws ServiceException;

    boolean update(Entity entity) throws ServiceException;

    boolean deleteById(String id) throws ServiceException;

    Entity findById(String id) throws ServiceException;

    List<Entity> findAll() throws ServiceException;

    List<Entity> findByMap(Map<String, Object> map) throws ServiceException;

}
