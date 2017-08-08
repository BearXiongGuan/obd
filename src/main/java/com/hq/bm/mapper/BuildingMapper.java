package com.hq.bm.mapper;


import com.hq.bm.entity.Building;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/22.
 */
@Repository
public interface BuildingMapper extends BaseMapper<Building>{

    List<Building> findBuildingById(String id);

    List<Building> showAllBuildingByOTB(String id);

    List<Building> getBuildingPropertyById(String id);

    Building findPositionById(String id);

    Integer getCountForJZW(Map<String, Object> map);

    List<Building> findByPageForJZW(Map<String, Object> map);

    Integer getCountForJZWByName(Map<String, Object> map);

    List<Building> findByPageForJZWByName(Map<String, Object> map);

    Integer getCountForfindBuilidngByWg(Map<String, Object> map);

    List<Building> findBuildingByWgId(Map<String, Object> map);

    List<Building> findAddrsByFacid(String id);

    Integer getCountForFindBuildingByVillage(Map<String, Object> map);

    List<Building> findBuildingByVillage(Map<String, Object> map);




}
