package com.hq.bm.service;

import com.hq.bm.entity.Lightfacility;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.view.Page;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.QueryParam;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/9.
 */
public interface ILightfacilityService extends IBaseService<Lightfacility>{

    List<Lightfacility> findByPosition(Map<String, Object> map) throws ServiceException;

    List<Lightfacility> findByOBDName(String keyword) throws ServiceException;

    Lightfacility findPositionById(String id) throws ServiceException;

    Page findPageByName(Page page, Map<String, Object> map) throws ServiceException;

    List<Lightfacility> findObdByBuildingAddrID(String id) throws ServiceException;

    List<Lightfacility> findObdByBuildingAddrIDForWeb(String id) throws ServiceException;

    Page findOTBByOrg(Page page, Map<String, Object> map) throws ServiceException;

    List<Lightfacility> findOBDByOTB(Map<String, Object> map) throws ServiceException;

    Page findOTBByIDAndName(Page page, Map<String, Object> map) throws ServiceException;

    Page findPageByNameToexportXls(Page page, Map<String, Object> map, HttpServletRequest request, HttpServletResponse response) throws ServiceException;

    Page findObdPageByWhere(Page page, Map<String, Object> map) throws ServiceException;
    
    void exportXlsFromSelRows(List<Lightfacility> list, HttpServletRequest request, HttpServletResponse response) throws ServiceException;
    
    List<Lightfacility> findObdByAddrids(String addrids) throws ServiceException;
    
    String checkOtbMoveable(String ocfids) throws ServiceException;
}
