package com.hq.bm.service;

import java.util.List;
import java.util.Map;

import com.hq.bm.entity.Addr;
import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/5/5.
 */
public interface IAddrService extends IBaseService<Addr> {

	public List<Addr> findParentLevelAddrsById(long addrId)
			throws ServiceException;

	public List<Map<String, Object>> findAddrsByAddr(String addr)
			throws ServiceException;

	public List<Addr> findLogAddrsByOperType() throws ServiceException;
	
	public List<Map<String,Object>> findAddrsByParentId(Map<String,Object> params) throws ServiceException;

}
