package com.hq.bm.mapper;

import com.hq.bm.entity.SysParam;
import org.springframework.stereotype.Repository;

/**
 * Created by Administrator on 2017/5/16.
 */
@Repository
public interface SysParamMapper extends BaseMapper<SysParam> {

    void insert(SysParam sysParam);

    void update(SysParam sysParam);

    SysParam findOne(String paramName);

    SysParam findName();
}
