package com.hq.bm.service.impl;

import com.hq.bm.entity.PlatFormLoginData;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.PlatFormLoginMapper;
import com.hq.bm.service.IPlatFormLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2017/4/26.
 */
@Service
public class PlatFormLoginServiceImpl extends BaseServiceImpl<PlatFormLoginData> implements
		IPlatFormLoginService {

	@Autowired
	private PlatFormLoginMapper platFormLoginMapper;

	public BaseMapper<PlatFormLoginData> getBaseMapper() {
		return platFormLoginMapper;
	}


	public List<PlatFormLoginData> getDayData(int count) throws ServiceException {
		List<PlatFormLoginData> list;

		try {
			list = platFormLoginMapper.getDayData(count);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return list;
	}

	public List<PlatFormLoginData> getMonthData(int count) throws ServiceException {
		List<PlatFormLoginData> list;

		try {
			list = platFormLoginMapper.getMonthData(count);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return list;
	}

	public List<PlatFormLoginData> getYearData(int count) throws ServiceException {
		List<PlatFormLoginData> list;

		try {
			list = platFormLoginMapper.getYearData(count);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return list;
	}
}
