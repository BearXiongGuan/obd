package com.hq.bm.restful.impl;

import com.hq.bm.entity.GirdCell;
import com.hq.bm.restful.IGirdCellRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IGirdCellService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Administrator on 2017/4/26.
 */
@Component
@Slf4j
public class GirdCellRestServiceImpl extends BaseRestServiceImpl<GirdCell> implements IGirdCellRestService {

    @Autowired
    private IGirdCellService girdCellService;

    public IBaseService getService() {
        return girdCellService;
    }

}
