package com.hq.bm.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.hq.bm.entity.Lightfacility;

/**
 * Created by Administrator on 2017/3/9.
 */
@Repository
public interface LightfacilityMapper extends BaseMapper<Lightfacility>{

    List<Lightfacility> findByPosition(Map<String, Object> map);

    Lightfacility findPositionById(String id);

    List<Lightfacility> findByOBDName(String keyword);

    List<Lightfacility> findPageByName(Map<String, Object> map);

    Integer getCountForFindPageByName(Map<String, Object> map);

    List<Lightfacility> findObdByBuildingAddrID(String id);

    List<Lightfacility> findObdByBuildingAddrIDForWeb(String id);

    Integer getCountForfindOTBByOrg(Map<String, Object> map);

    List<Lightfacility> findOTBByOrg(Map<String, Object> map);

    List<Lightfacility> findOBDByOTB(Map<String, Object> map);

    Integer getCountForFindOTBByIDAndName(Map<String, Object> map);

    List<Lightfacility> findOTBByIDAndName(Map<String, Object> map);

    Integer getCountForFindObdByWhere(Map<String, Object> map);

    List<Lightfacility> findObdPageByWhere(Map<String, Object> map);
    
    List<Lightfacility> findObdByAddrids(String addrids);
}
