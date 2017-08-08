package com.hq.bm.service.impl;

import com.hq.bm.entity.Role;
import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.RoleMapper;
import com.hq.bm.mapper.UserMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IRoleService;
import com.hq.bm.utils.Log;
import org.apache.commons.collections.map.HashedMap;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by Administrator on 2017/3/16.
 */
@Service
public class RoleServiceImpl extends BaseServiceImpl<Role> implements IRoleService {

    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private UserMapper userMapper;

    public BaseMapper<Role> getBaseMapper() {
        return roleMapper;
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
    @RequiresPermissions(value = {"role:add"})
    public String insert(Role role) throws ServiceException {
        try {

            role.setCreatTime(new Date());
            String username = (String) SecurityUtils.getSubject().getPrincipal();
            Map<String, Object> params = new HashedMap();
            params.put("loginName", username);
            //得到creatId
            List<User> userList = userMapper.findByMap(params);
            role.setCreatId(userList.get(0).getCreaterId());

            this.getBaseMapper().save(role);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return "success";
    }

    public Integer isNameExist(String name) throws ServiceException {

        Integer flag;
        try {
            Map<String, Object> map = new HashMap();
            map.put("name", name);
            flag = this.getBaseMapper().getCount(map);

        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return flag;
    }
    @Log(operationType = "角色模块",operationName = "根据角色更新了权限")
    public boolean updatePermi(Role role) throws ServiceException {
        try {
            role.setUpdateDate(new Date());
            roleMapper.updatePermi(role);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return true;
    }

    @Override
    @RequiresPermissions(value = {"role:add"})
    @Log(operationType = "角色模块",operationName = "保存角色")
    public String save(Role entity) throws ServiceException {
        return super.save(entity);
    }

    @Override
    @RequiresPermissions(value = {"role:update"})
    @Log(operationType = "角色模块",operationName = "更新角色")
    public boolean update(Role entity) throws ServiceException {
        return super.update(entity);
    }

    @Override
    @RequiresPermissions(value = {"role:delete"})
    @Log(operationType = "角色模块",operationName = "根据id删除角色")
    public boolean deleteById(String id) throws ServiceException {
        return super.deleteById(id);
    }

}
