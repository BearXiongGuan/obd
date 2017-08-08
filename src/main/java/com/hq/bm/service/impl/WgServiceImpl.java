package com.hq.bm.service.impl;

import com.hq.bm.entity.Wg;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.WgMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IWgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/5/3.
 */
@Service
public class WgServiceImpl extends BaseServiceImpl<Wg> implements IWgService{

	   @Autowired
	    private WgMapper wgMapper;

	    public BaseMapper<Wg> getBaseMapper() {
	        return wgMapper;
	    }

	public Page findWgGridType(Page page, Map<String, Object> map) throws ServiceException {
		try {
			page.setTotal(wgMapper.getCountForfindWgByGridType(map));
			map.put("startRowNum",page.getStartRowNum());
			map.put("pageSize",page.getPageSize());
			map.put("endRowNum",page.getEndRowNum());
			page.setRows(wgMapper.findWgByGridType(map));
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return page;
	}

	public List<Wg> findWgByName(Map<String, Object> map) throws ServiceException {
		List<Wg> list;

		try {
			list = wgMapper.findWgByName(map);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public List<Wg> findWgByOrgName(Map<String, Object> map)
			throws ServiceException {
		List<Wg> list;

		try {
			list = wgMapper.findWgByOrgName(map);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}
}
