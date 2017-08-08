package com.hq.bm.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.lucene.search.IndexSearcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.Addr;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.AddrMapper;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.service.IAddrService;
import com.hq.bm.utils.IncrementIndex;
import com.hq.bm.utils.PropertiesUtil;

/**
 * Created by Administrator on 2017/5/5.
 */
@Service
public class AddrServiceImpl extends BaseServiceImpl<Addr> implements
		IAddrService {
	@Autowired
	private AddrMapper addrMapper;

	@Autowired
	ApplicationContext context;

	public BaseMapper<Addr> getBaseMapper() {
		return addrMapper;
	}

	public List<Addr> findParentLevelAddrsById(long addrId)
			throws ServiceException {
		List<Addr> list;
		try {
			list = addrMapper.findParentLevelAddrsById(addrId);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public List<Map<String, Object>> findAddrsByAddr(String addr)
			throws ServiceException {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {

			String path = PropertiesUtil.newInstance("/config.properties")
					.getValueByName("lucene.index_path");// 索引文件的存放路径

			IncrementIndex increIndex = (IncrementIndex) context
					.getBean("incrementIndex");
			IndexSearcher searcher;
			searcher = increIndex.getIndexSearcher();
			list = increIndex.findAddrsByAddr(searcher, "addr", addr);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return list;
	}

	public List<Addr> findLogAddrsByOperType() throws ServiceException {
		List<Addr> list;
		try {
			list = addrMapper.findLogAddrsByOperType();
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return list;
	}

	public List<Map<String,Object>> findAddrsByParentId(Map<String, Object> params)
			throws ServiceException {
		List<Map<String,Object>> list;
		try {
			list = addrMapper.findAddrsByParentId(params);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return list;
	}
}
