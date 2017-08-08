package com.hq.bm.mapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.hq.bm.entity.Addr;

/**
 * Created by Administrator on 2017/5/5.
 */
@Repository
public interface AddrMapper extends BaseMapper<Addr> {
	public List<Addr> findParentLevelAddrsById(long addrId);

	public List<Addr> findLogAddrsByOperType();
	
	public List<Map<String,Object>> findAddrsByParentId(Map<String,Object> params);
}
