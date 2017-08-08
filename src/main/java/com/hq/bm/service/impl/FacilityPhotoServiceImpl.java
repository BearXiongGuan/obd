package com.hq.bm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.FacilityPhoto;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.FacilityPhotoMapper;
import com.hq.bm.service.IFacilityPhotoService;
import com.hq.bm.utils.Log;

/**
 * Created by admin on 2017/3/24.
 */
@Service
public class FacilityPhotoServiceImpl extends BaseServiceImpl<FacilityPhoto>
		implements IFacilityPhotoService {

	@Autowired
	private FacilityPhotoMapper facilityPhotoMapper;

	public BaseMapper<FacilityPhoto> getBaseMapper() {
		return facilityPhotoMapper;
	}

	@Override
	@Log(operationType = "设施图片", operationName = "保存图片")
	public String save(FacilityPhoto entity) throws ServiceException {
		return super.save(entity);
	}

	@Override
	@Log(operationType = "设施图片", operationName = "修改图片")
	public boolean update(FacilityPhoto entity) throws ServiceException {
		return super.update(entity);
	}

	@Override
	@Log(operationType = "设施图片", operationName = "删除图片")
	public boolean deleteById(String id) throws ServiceException {
		return super.deleteById(id);
	}

	public void add(FacilityPhoto facility) throws ServiceException {
		facilityPhotoMapper.add(facility);
	}

}
