package com.hq.bm.mapper;

import com.hq.bm.entity.Wg;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/5/3.
 */
@Repository
public interface WgMapper  extends BaseMapper<Wg> {

    Integer getCountForfindWgByGridType(Map<String, Object> map);

    List<Wg> findWgByGridType(Map<String, Object> map);

    List<Wg> findWgByName(Map<String, Object> map);
    
    List<Wg> findWgByOrgName(Map<String, Object> map);
}

