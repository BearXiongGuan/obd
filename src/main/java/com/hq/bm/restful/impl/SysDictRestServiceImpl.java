package com.hq.bm.restful.impl;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hq.bm.entity.SysDict;
import com.hq.bm.restful.ISysDictRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.ISysDictService;

@Component
@Slf4j
public class SysDictRestServiceImpl extends BaseRestServiceImpl<SysDict>
		implements ISysDictRestService {

	@Autowired
	private ISysDictService sysDictService;

	@Override
	public IBaseService<SysDict> getService() {
		return sysDictService;
	}

}
