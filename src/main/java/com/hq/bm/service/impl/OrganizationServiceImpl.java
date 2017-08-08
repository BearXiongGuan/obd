package com.hq.bm.service.impl;

import com.hq.bm.entity.Organization;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.OrganizationMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IOrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


/**
 * Created by Administrator on 2017/3/16.
 */
@Service
public class OrganizationServiceImpl extends BaseServiceImpl<Organization> implements IOrganizationService{

    @Autowired
    private OrganizationMapper organizationMapper;
    public BaseMapper<Organization> getBaseMapper() {
        return organizationMapper;
    }
    public Page findPageByName(Page page, Map<String, Object> map) throws ServiceException {
        try {
            page.setTotal(organizationMapper.getCount(map));
            map.put("startRowNum",page.getStartRowNum());
            map.put("pageSize",page.getPageSize());
            map.put("endRowNum",page.getEndRowNum());
            page.setRows(organizationMapper.findByPage(map));
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return page;
    }

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

    public List<Organization> findOrgByUser(String userId) throws ServiceException {
        List<Organization> list;

        try {
            list = organizationMapper.findOrgByUser(userId);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }

    public List<Organization> findYfByUser(Map<String, Object> map) throws ServiceException {
        List<Organization> list;

        try {
            list = organizationMapper.findYfByUser(map);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }


}
