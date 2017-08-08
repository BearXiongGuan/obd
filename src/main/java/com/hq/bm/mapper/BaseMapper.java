package com.hq.bm.mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/3/7.
 */
public interface BaseMapper<Entity> {

    void save(Entity entity);

    void update(Entity entity);

    void deleteById(String id);

    Entity findById(String id);

    List<Entity> findAll();

    List<Entity> findByMap(Map<String, Object> map);

    Integer getCount(Map<String, Object> map);

    List<Entity> findByPage(Map<String, Object> map);
}
