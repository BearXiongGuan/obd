package com.hq.bm.service;

import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;

import java.util.List;
import java.util.Set;

/**
 * Created by admin on 2017/3/7.
 */
public interface IUserService extends IBaseService<User> {

    User findByLoginName(String name) throws ServiceException;

    Set<String> getRoleStringsByUserName(String username) throws ServiceException;

    List <User>getAllRole() throws  ServiceException;

    String insert(User user) throws ServiceException;

    Integer isNameExist(String name) throws ServiceException;

    void editLoginTime(User user) throws ServiceException;

    boolean updatePassword(User user) throws ServiceException;

    boolean updateStatus(User user) throws ServiceException;
    
    boolean deleteUserByIds(String ids,String loginNames) throws ServiceException;

}
