package com.hq.bm.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.hq.bm.entity.User;

/**
 * Created by admin on 2017/3/7.
 */
@Repository
public interface UserMapper extends BaseMapper<User> {

    List<User>  findAllRole();
    
    void deleteUserByIds(Map<String, Object> map);
}
