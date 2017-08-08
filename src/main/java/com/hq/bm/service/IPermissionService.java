package com.hq.bm.service;

import com.hq.bm.entity.Permission;
import com.hq.bm.exception.ServiceException;

import java.util.List;
import java.util.Set;

/**
 * Created by admin on 2017/3/7.
 */
public interface IPermissionService extends IBaseService<Permission> {

    Set<String> getPermissionStringsByLoginName(String loginName) throws ServiceException;

    List<Permission> getPermissionByLoginName(String loginName) throws ServiceException;

}
