package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.hq.bm.entity.PlatFormLoginData;
import com.hq.bm.restful.IPlatFormLoginRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IPlatFormLoginService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;


/**
 * Created by admin on 2017/3/7.
 */
@Component
@Slf4j
public class PlatFormLoginRestServiceImpl extends BaseRestServiceImpl<PlatFormLoginData> implements IPlatFormLoginRestService {

    @Autowired(required=true)
    private IPlatFormLoginService platFormLoginService;

    public IBaseService getService() {
        return platFormLoginService;
    }


    public String getDayData(int count) {
        String result;

        try {
            List<PlatFormLoginData> list = platFormLoginService.getDayData(count);
            result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("PlatFormLoginRestServiceImpl getDayData is error", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String getMonthData(int count) {
        String result;

        try {
            List<PlatFormLoginData> list =platFormLoginService.getMonthData(count);
            result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("PlatFormLoginRestServiceImpl getMonthData is error", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String getYearData(int count) {
        String result;

        try {
            List<PlatFormLoginData> list = platFormLoginService.getYearData(count);
            result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("PlatFormLoginRestServiceImpl getYearData is error", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }
}
