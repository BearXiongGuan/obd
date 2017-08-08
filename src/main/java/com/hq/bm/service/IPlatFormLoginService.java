package com.hq.bm.service;

import com.hq.bm.entity.PlatFormLoginData;
import com.hq.bm.exception.ServiceException;

import java.util.List;

/**
 * Created by admin on 2017/3/7.
 */
public interface IPlatFormLoginService extends IBaseService<PlatFormLoginData> {


    List<PlatFormLoginData> getDayData(int count) throws ServiceException;

    List<PlatFormLoginData> getMonthData(int count) throws ServiceException;

    List<PlatFormLoginData> getYearData(int count) throws ServiceException;
}
