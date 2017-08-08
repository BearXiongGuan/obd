package com.hq.bm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.BaseEntity;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.SequenceMapper;
import com.hq.bm.service.ISequenceService;

/**
 * Created by Administrator on 2017/5/3.
 */
@Service
public class SequenceServiceImpl extends BaseServiceImpl<BaseEntity> implements
		ISequenceService {

	@Autowired
	private SequenceMapper sequenceMapper;

	@Override
	public BaseMapper<BaseEntity> getBaseMapper() {
		return sequenceMapper;
	}

	public long findSequenceByName(String sequenceName) {
		return sequenceMapper.findSequenceByName(sequenceName);
	}

}
