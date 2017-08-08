package com.hq.bm.service;

import com.hq.bm.entity.Role;
import com.hq.bm.exception.ServiceException;

/**
 * Created by admin on 2017/3/7.
 */
public interface IRoleService extends IBaseService<Role> {

    String insert(Role role) throws ServiceException;

    Integer isNameExist(String name) throws ServiceException;

    boolean updatePermi(Role role) throws ServiceException;
}
