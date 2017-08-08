package com.hq.bm.service;

import com.hq.bm.entity.Building;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/22.
 */
public interface IBuildingService extends IBaseService<Building>{

    List<Building> findBuildingById(String id) throws ServiceException;

    List<Building> showAllBuildingByOTB(String id) throws ServiceException;

    List<Building> getBuildingPropertyById(String id) throws ServiceException;

    Building findPositionById(String id) throws ServiceException;

    Page findByPageForJZW(Page page, Map<String, Object> map) throws ServiceException;

    Page findByPageByName(Page page, Map<String, Object> map) throws ServiceException;

    Page findBuildingByWgId(Page page, Map<String, Object> map) throws ServiceException;

    List<Building> findAddrsByFacid(String id) throws ServiceException;

    Page findBuildingByVillage(Page page, Map<String, Object> map) throws ServiceException;

}
