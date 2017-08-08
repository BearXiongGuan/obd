package com.hq.bm.mapper;

import com.hq.bm.entity.App;
import org.springframework.stereotype.Repository;

/**
 * Created by Administrator on 2017/4/17.
 */
@Repository
public interface AppMapper extends BaseMapper<App>{

    void insert(App app);

    void deleteByUrl(String name);
    
    App getNew();
}
