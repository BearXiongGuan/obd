package com.hq.bm.mapper;

import com.hq.bm.entity.Organization;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by 2D-wht-f019 on 2017/3/15.
 */
@Repository
public interface OrganizationMapper extends BaseMapper<Organization> {


//    Integer getCountForFindPageByName(Map<String, Object> map);
//
//    List<Organization> findPageByName(Map<String, Object> map);

    List<Organization> findOrgByUser(String userId);

    List<Organization> findCountyIDByFaceID(long id);

    Organization findIdByName(String name);

    List<Organization> findYfByUser(Map<String, Object> map);

}
