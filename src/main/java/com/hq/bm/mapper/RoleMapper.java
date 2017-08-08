package com.hq.bm.mapper;

import com.hq.bm.entity.Role;
import org.springframework.stereotype.Repository;


/**
 * Created by Administrator on 2017/3/16.
 */
@Repository
public interface RoleMapper extends BaseMapper<Role> {

    void updatePermi(Role role);
}
