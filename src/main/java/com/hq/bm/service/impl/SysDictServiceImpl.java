package com.hq.bm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.SysDict;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.SysDictMapper;
import com.hq.bm.service.ISysDictService;

@Service
public class SysDictServiceImpl extends BaseServiceImpl<SysDict> implements ISysDictService{

	@Autowired
	private SysDictMapper sysDictMapper;

	@Override
	public BaseMapper<SysDict> getBaseMapper() {
		return sysDictMapper;
	}

}
