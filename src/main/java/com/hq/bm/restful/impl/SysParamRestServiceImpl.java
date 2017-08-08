package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.hq.bm.entity.SysParam;
import com.hq.bm.restful.ISysParamRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.ISysParamService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Administrator on 2017/5/16.
 */
@Component
@Slf4j
public class SysParamRestServiceImpl extends BaseRestServiceImpl<SysParam> implements ISysParamRestService {

    @Autowired
    private ISysParamService iSysParamService;


    public IBaseService<SysParam> getService() {
        return iSysParamService;
    }

    public String insert(String jsonStr) {
        String result;

        try {
            SysParam sysParam = JSON.parseObject(jsonStr, this.getEntityClass());
            result = iSysParamService.insert(sysParam);
            jsonView.successPack(result);
        } catch (Exception e) {
            String message = e.getMessage();
            jsonView.failPack("false", message);
            log.error("SysParamRestServiceImpl insert is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;

    }

    public String edit(String jsonStr) {
        String result;

        try {
            SysParam sysParam = JSON.parseObject(jsonStr, this.getEntityClass());

            if (sysParam != null) {
                result = String.valueOf(iSysParamService.edit(sysParam));
                jsonView.successPack(result);
            }
        } catch (Exception e) {
            String message = e.getMessage();

            if (StringUtils.isBlank(message)) {
                message = "更新数据失败！";
            }

            jsonView.failPack("false", message);
            log.error("SysParamRestServiceImpl update is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }
}
