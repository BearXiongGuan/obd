package com.hq.bm.mapper;

import com.hq.bm.entity.Lightfacility;
import com.hq.bm.entity.LogInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by 2D-wht-f019 on 2017/3/15.
 */
@Repository
public interface LogInfoMapper extends BaseMapper<LogInfo> {

    Integer getCountForFindPageByName(Map<String, Object> map);

    List<LogInfo> findPageByName(Map<String, Object> map);

    void add(LogInfo logInfo);

}
