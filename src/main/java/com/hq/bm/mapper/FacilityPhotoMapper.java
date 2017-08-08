package com.hq.bm.mapper;

import org.springframework.stereotype.Repository;

import com.hq.bm.entity.FacilityPhoto;
import com.hq.bm.exception.ServiceException;

/**
 * Created by Administrator on 2017/3/9.
 */
@Repository
public interface FacilityPhotoMapper extends BaseMapper<FacilityPhoto> {
	public void add(FacilityPhoto facility) throws ServiceException;
}
