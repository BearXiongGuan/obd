package com.hq.bm.service.impl;

import com.hq.bm.entity.App;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.AppMapper;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.service.IAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2017/4/17.
 */
@Service
public class AppServiceImpl extends BaseServiceImpl<App> implements IAppService{
    @Autowired
    private AppMapper appMapper;

    public BaseMapper<App> getBaseMapper() {
        return appMapper;
    }

    public String insert(App app) throws ServiceException {
        try {
            app.setUpdateDate(new Date());
            appMapper.insert(app);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return "success";
    }

    public Integer isVersionExist(String version) throws ServiceException {

        Integer flag;
        try {
            Map<String, Object> map = new HashMap();
            map.put("version", version);
            flag = appMapper.getCount(map);

        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
        return flag;
    }

    public boolean deleteByUrl(String url) throws ServiceException {
        try {
            appMapper.deleteByUrl(url);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }

        return true;
    }
    
    public App getNew() throws ServiceException {
    	App app = new App();
    	
    	try {
    		app = appMapper.getNew();
    	} catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    	
    	return app;
    }
}
