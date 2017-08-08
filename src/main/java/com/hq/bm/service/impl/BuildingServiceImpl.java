package com.hq.bm.service.impl;

import com.hq.bm.entity.Building;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.BuildingMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBuildingService;
import com.hq.bm.utils.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/22.
 */
@Service
public class BuildingServiceImpl extends BaseServiceImpl<Building> implements IBuildingService {

    @Autowired
    private BuildingMapper buildingMapper;

    public BaseMapper<Building> getBaseMapper() {
        return buildingMapper;
    }

    public List<Building> findBuildingById(String id) throws ServiceException {
        List<Building> list;

        try {
            list = buildingMapper.findBuildingById(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }

    public List<Building> showAllBuildingByOTB(String id) throws ServiceException {
        List<Building> list;

        try {
            list = buildingMapper.showAllBuildingByOTB(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }


    public List<Building> getBuildingPropertyById(String id) throws ServiceException {
        List<Building> list;

        try {
            list = buildingMapper.getBuildingPropertyById(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }

    public Building findPositionById(String id) throws ServiceException {
        Building building;

        try {
            building =  buildingMapper.findPositionById(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return building;
    }

    public Page findByPageForJZW(Page page, Map<String, Object> map) throws ServiceException {
        try {
            page.setTotal(buildingMapper.getCountForJZW(map));
            map.put("startRowNum",page.getStartRowNum());
            map.put("pageSize",page.getPageSize());
            map.put("endRowNum",page.getEndRowNum());
            page.setRows(buildingMapper.findByPageForJZW(map));
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return page;
    }

    public Page findByPageByName(Page page, Map<String, Object> map) throws ServiceException {
        try {
            page.setTotal(buildingMapper.getCountForJZWByName(map));
            map.put("startRowNum",page.getStartRowNum());
            map.put("pageSize",page.getPageSize());
            map.put("endRowNum",page.getEndRowNum());
            page.setRows(buildingMapper.findByPageForJZWByName(map));
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return page;
    }


    public Page findBuildingByWgId(Page page, Map<String, Object> map) throws ServiceException {
        try {
            page.setTotal(buildingMapper.getCountForfindBuilidngByWg(map));
            map.put("startRowNum",page.getStartRowNum());
            map.put("pageSize",page.getPageSize());
            map.put("endRowNum",page.getEndRowNum());
            page.setRows(buildingMapper.findBuildingByWgId(map));
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return page;
    }


    public List<Building> findAddrsByFacid(String id) throws ServiceException {
        List<Building> list;

        try {
            list = buildingMapper.findAddrsByFacid(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return list;
    }

    public Page findBuildingByVillage(Page page, Map<String, Object> map) throws ServiceException {
        try {
            page.setTotal(buildingMapper.getCountForFindBuildingByVillage(map));
            map.put("startRowNum",page.getStartRowNum());
            map.put("pageSize",page.getPageSize());
            map.put("endRowNum",page.getEndRowNum());
            page.setRows(buildingMapper.findBuildingByVillage(map));
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return page;
    }

    @Override
    @Log(operationType = "建筑物模块",operationName = "保存数据")
    public String save(Building entity) throws ServiceException {
        return super.save(entity);
    }

    @Override
    @Log(operationType = "建筑物模块",operationName = "更新一条数据")
    public boolean update(Building entity) throws ServiceException {
        return super.update(entity);
    }

    @Override
    @Log(operationType = "建筑物模块",operationName = "根据id删除一条数据")
    public boolean deleteById(String id) throws ServiceException {
        return super.deleteById(id);
    }
}
