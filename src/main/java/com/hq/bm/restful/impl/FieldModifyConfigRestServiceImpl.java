package com.hq.bm.restful.impl;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hq.bm.entity.FieldModifyConfig;
import com.hq.bm.restful.IFieldModifyConfigRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IFieldModifyConfigService;

/**
 * Created by Administrator on 2017/4/25.
 */
@Component
@Slf4j
public class FieldModifyConfigRestServiceImpl extends
		BaseRestServiceImpl<FieldModifyConfig> implements
		IFieldModifyConfigRestService {

	@Autowired
	private IFieldModifyConfigService fieldModifyConfigService;

	public IBaseService<FieldModifyConfig> getService() {
		return fieldModifyConfigService;
	}

}
