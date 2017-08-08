package com.hq.bm.restful.impl;

import java.util.HashMap;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.LogInfo;
import com.hq.bm.restful.ILogInfoRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.ILogInfoService;
import com.hq.bm.utils.BeanObjectToMap;


/**
 * Created by admin on 2017/3/7.
 */
@Component
@Slf4j
public class LogInfoRestServiceImpl extends BaseRestServiceImpl<LogInfo> implements ILogInfoRestService {

    @Autowired(required=true)
    private ILogInfoService logInfoService;

    public IBaseService getService() {
        return logInfoService;
    }


    public String getPage(String jsonStr) {
        String result = "";
        Page page;

        try {
            Map<String, Object> mapBean = new HashMap<String, Object>();

            if (!StringUtils.isBlank(jsonStr)) {
                page = JSON.parseObject(jsonStr, Page.class);

                if (page != null) {
                    LogInfo logInfo = null;
                    String objCondition = null;

                    if (null != page.getObjCondition()) {
                        objCondition = page.getObjCondition().toString();
                    }

                    if (StringUtils.isNotBlank(objCondition) && !"{}".equalsIgnoreCase(objCondition)) {
                        logInfo = JSON.parseObject(objCondition, this.getEntityClass());
                        mapBean = BeanObjectToMap.convertBean(logInfo);
                    }
                }
            } else {
                page = new Page();
            }

            page = logInfoService.findPageByName(page, mapBean);
            result = JSON.toJSONStringWithDateFormat(page, "yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("LoginfoRestServiceImpl getPage is error,{jsonStr:" + jsonStr + "}", e);
        }

        //result = JSON.toJSONString(jsonView);

        return result;
    }

    public String getPageByName(String jsonStr) {
        String result;
        Page page;

        try {
            Map<String, Object> mapBean = new HashMap<String, Object>();

            if (!StringUtils.isBlank(jsonStr)) {
                page = JSON.parseObject(jsonStr, Page.class);

                if (page != null) {
                    String objCondition = null;

                    if (null != page.getObjCondition()) {
                        objCondition = page.getObjCondition().toString();
                    }

                    if (StringUtils.isNotBlank(objCondition) && !"{}".equalsIgnoreCase(objCondition)) {
                        mapBean = JSON.parseObject(objCondition);
                    }
                }
            } else {
                page = new Page();
            }

            page = logInfoService.findPageByName(page, mapBean);
            result = JSON.toJSONStringWithDateFormat(page, "yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("BaseRestServiceImpl getPage is error,{jsonStr:" + jsonStr + "}", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }


}
