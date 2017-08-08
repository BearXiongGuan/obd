package com.hq.bm.service.impl;

import com.hq.bm.entity.BaseEntity;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.utils.IDGenerator;
import org.apache.commons.lang.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/3/7.
 */
public abstract class BaseServiceImpl<Entity extends BaseEntity> implements IBaseService<Entity> {

    public abstract BaseMapper<Entity> getBaseMapper();

    public Page findByPage(Page page, Map<String, Object> map) throws ServiceException {
        try {
            page.setTotal(this.getBaseMapper().getCount(map));
            map.put("startRowNum",page.getStartRowNum());
            map.put("pageSize",page.getPageSize());
            map.put("endRowNum",page.getEndRowNum());
            page.setRows(this.getBaseMapper().findByPage(map));
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return page;
    }

    public String save(Entity entity) throws ServiceException {
        String  id =  IDGenerator.getID();

        try {
            if (StringUtils.isBlank(entity.getId())||entity.getId().equalsIgnoreCase("0")) {
                entity.setId(id);
            }
            entity.setCreateDate(new Date());
            this.getBaseMapper().save(entity);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return id;
    }

    public boolean update(Entity entity) throws ServiceException {
        try {
            entity.setUpdateDate(new Date());
            this.getBaseMapper().update(entity);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return true;
    }

    public boolean deleteById(String id) throws ServiceException {
        try {
            this.getBaseMapper().deleteById(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return true;
    }

    public Entity findById(String id) throws ServiceException {
        Entity entity;

        try {
            entity =  this.getBaseMapper().findById(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return entity;
    }

    public List<Entity> findAll() throws ServiceException {
        List<Entity> list;

        try {
            list = this.getBaseMapper().findAll();
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }

    public List<Entity> findByMap(Map<String, Object> map) throws ServiceException {
        List<Entity> list;

        try {
            list = this.getBaseMapper().findByMap(map);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }
}
