package com.hq.bm.service;

import com.hq.bm.entity.FacilityPhoto;
import com.hq.bm.exception.ServiceException;

/**
 * Created by admin on 2017/3/24.
 */
public interface IFacilityPhotoService extends IBaseService<FacilityPhoto>{
	  void add(FacilityPhoto facility) throws ServiceException;
}
