package com.hq.bm.service.impl;

import com.hq.bm.entity.SysParam;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.SysParamMapper;
import com.hq.bm.service.ISysParamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2017/5/16.
 */
@Service
public class SysParamServiceImpl extends BaseServiceImpl<SysParam> implements ISysParamService {
    @Autowired
    private SysParamMapper sysParamMapper;

    public BaseMapper<SysParam> getBaseMapper() {
        return sysParamMapper;
    }

    public String insert(SysParam sysParam) throws ServiceException {

        try {
            sysParamMapper.save(sysParam);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return "success";
    }

    public boolean edit(SysParam sysParam) throws ServiceException {
        try {
            sysParamMapper.update(sysParam);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return true;
    }

    public SysParam findOne(String paramName){
        return sysParamMapper.findOne(paramName);
    }

    public SysParam findName(){
        return sysParamMapper.findName();
    }
}
