package com.hq.bm.service;

import com.hq.bm.entity.BaseEntity;

/**
 * Created by admin on 2017/5/3.
 */
public interface ISequenceService extends IBaseService<BaseEntity> {
	public long findSequenceByName(String sequenceName);
}
