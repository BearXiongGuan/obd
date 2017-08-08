package com.hq.bm.service.impl;


import com.hq.bm.entity.GirdCell;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.GirdCellMapper;
import com.hq.bm.service.IGirdCellService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2017/4/26.
 */
@Service
public class GirdCellServiceImpl extends BaseServiceImpl<GirdCell> implements IGirdCellService {

    @Autowired
    private GirdCellMapper girdCellMapper;

    public BaseMapper<GirdCell> getBaseMapper() {
        return girdCellMapper;
    }
}
