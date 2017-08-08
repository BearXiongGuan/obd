package com.hq.bm.mapper;

import com.hq.bm.entity.Permission;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by admin on 2017/3/7.
 */
@Repository
public interface PermissionMapper extends BaseMapper<Permission> {

    List<Permission> findByLoginName(String loginName);

}
