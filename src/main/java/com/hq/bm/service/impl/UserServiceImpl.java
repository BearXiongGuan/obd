package com.hq.bm.service.impl;

import com.hq.bm.entity.Role;
import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.UserMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IUserService;
import org.apache.commons.collections.map.HashedMap;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by admin on 2017/3/7.
 */
@Service
public class UserServiceImpl extends BaseServiceImpl<User> implements IUserService {

    @Autowired
    private UserMapper userMapper;

    public BaseMapper<User> getBaseMapper() {
        return userMapper;
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

    @RequiresPermissions(value={"user:add"})
    public String insert(User user) throws ServiceException {
        try {

            user.setCreatTime(new Date());
            String username = (String) SecurityUtils.getSubject().getPrincipal();
            Map<String, Object> params = new HashedMap();
            params.put("loginName", username);
            //得到creatId
            List<User> userList = userMapper.findByMap(params);
            user.setCreaterId(userList.get(0).getCreaterId());

            this.getBaseMapper().save(user);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return "success";
    }

    public Integer isNameExist(String loginName) throws ServiceException {

        Integer flag;
        try {
            Map<String, Object> map = new HashMap();
            map.put("loginName", loginName);
            flag = this.getBaseMapper().getCount(map);

        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return flag;
    }

    public void editLoginTime(User user) throws ServiceException {
        try {
            if(user != null){
                userMapper.update(user);
            }
        } catch (Exception e) {
           throw new ServiceException(e.getMessage(), e);
        }
    }


    @RequiresPermissions(value = {"user:resetpsw"})
    public boolean updatePassword(User user) throws ServiceException {
        try {
            if(user != null){
                userMapper.update(user);
            }
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return true;
    }


    @RequiresPermissions(value = {"user:status"})
    public boolean updateStatus(User user) throws ServiceException {
        try {
            if(user != null){
                userMapper.update(user);
            }
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return true;
    }

    public User findByLoginName(String loginName) throws ServiceException {
        try {
            Map<String, Object> params = new HashedMap();
            params.put("loginName", loginName);
            List<User> userList = userMapper.findByMap(params);

            if (userList != null && userList.size() > 0) {
                // 由于登陆名不允许重名，返回的列表只会有一个，所以直接取第一个
                return userList.get(0);
            } else {
                throw new ServiceException("用户名不存在！");
            }
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    }

    public Set<String> getRoleStringsByUserName(String username) throws ServiceException {
        try {
            Map<String, Object> params = new HashedMap();
            params.put("loginName", username);
            List<User> userList = userMapper.findByMap(params);

            if (userList != null && userList.size() > 0) {
                // 由于登陆名不允许重名，返回的列表只会有一个，所以直接取第一个
                List<Role> roleList = userList.get(0).getRoleList();
                Set<String> roleNameList = new HashSet<String>();

                for (Role role: roleList) {
                    roleNameList.add(role.getCode());
                }

                return roleNameList;
            } else {
                throw new ServiceException("用户名不存在！");
            }
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    }

    public List<User> getAllRole() throws  ServiceException {

        List<User> userList;

        try {
            userList = userMapper.findAllRole();
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return userList;

    }

    @Override
    @RequiresPermissions(value={"login:web"})
    public List<User> findAll() throws ServiceException {
        return super.findAll();
    }

    @Override
    @RequiresPermissions(value = {"user:add"})
    public String save(User entity) throws ServiceException {
        return super.save(entity);
    }

    @Override
    @RequiresPermissions(value = {"user:update"})
    public boolean update(User entity) throws ServiceException {
        return super.update(entity);
    }

    @RequiresPermissions(value = {"user:delete"})
    public boolean deleteUserByIds(String ids,String loginNames) throws ServiceException{
    	boolean flag=false;
    	Map<String, Object> map = new HashMap<String,Object>();
        try {
        	map.put("ids", ids);
        	map.put("loginNames", loginNames);
        	userMapper.deleteUserByIds(map);
        	flag=true;
		} catch (Exception e) {
			 throw new ServiceException(e.getMessage(), e);
		}
        return flag;
    }

}
