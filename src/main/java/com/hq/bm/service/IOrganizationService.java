package com.hq.bm.service;

import com.hq.bm.entity.Organization;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by admin on 2017/3/7.
 */
public interface IOrganizationService extends IBaseService<Organization> {
    Page findPageByName(Page page, Map<String, Object> map) throws ServiceException;

    Page findByPage(Page page, Map<String, Object> map) throws ServiceException;

    List<Organization> findOrgByUser(String id) throws ServiceException;

    List<Organization> findYfByUser( Map<String, Object> map) throws ServiceException;

}
