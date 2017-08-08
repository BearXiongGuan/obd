package com.hq.bm.mapper;

import org.springframework.stereotype.Repository;

import com.hq.bm.entity.BaseEntity;

/**
 * Created by admin on 2017/5/3.
 */
@Repository
public interface SequenceMapper extends BaseMapper<BaseEntity> {
	public long findSequenceByName(String sequenceName);
}
