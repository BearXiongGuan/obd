package com.hq.bm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.FieldModifyConfig;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.FieldModifyConfigMapper;
import com.hq.bm.service.IFieldModifyConfigService;

@Service
public class FieldModifyConfigServiceImpl extends
		BaseServiceImpl<FieldModifyConfig> implements IFieldModifyConfigService {

	@Autowired
	private FieldModifyConfigMapper fieldModifyConfigMapper;

	public BaseMapper<FieldModifyConfig> getBaseMapper() {
		return fieldModifyConfigMapper;
	}
}
