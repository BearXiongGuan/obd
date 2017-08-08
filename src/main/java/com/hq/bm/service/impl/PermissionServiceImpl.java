package com.hq.bm.service.impl;

import com.hq.bm.entity.Permission;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.PermissionMapper;
import com.hq.bm.service.IPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by admin on 2017/3/7.
 */
@Service
public class PermissionServiceImpl extends BaseServiceImpl<Permission> implements IPermissionService {

    @Autowired
    private PermissionMapper permissionMapper;

    public BaseMapper<Permission> getBaseMapper() {
        return permissionMapper;
    }

    public Set<String> getPermissionStringsByLoginName(String loginName) throws ServiceException {
        List<Permission> permissionList = permissionMapper.findByLoginName(loginName);
        Set<String> permissionStrings = new HashSet<String>();

        for (Permission permission : permissionList) {
        	if(permission.getPriviType()==1){
        		permissionStrings.add(permission.getPriviCode());
        	}
        }

        return permissionStrings;
    }

    public List<Permission> getPermissionByLoginName(String name) throws ServiceException{

        List<Permission> permissionList;

        try {
            permissionList = permissionMapper.findByLoginName(name);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return permissionList;

    }
}
