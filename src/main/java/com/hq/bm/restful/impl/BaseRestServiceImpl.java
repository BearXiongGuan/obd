package com.hq.bm.restful.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.BaseEntity;
import com.hq.bm.restful.IBaseRestService;
import com.hq.bm.restful.view.JsonViewObject;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.utils.BeanObjectToMap;
import com.hq.bm.utils.Log;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;

import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/3/7.
 */
@Slf4j
public abstract class BaseRestServiceImpl<Entity extends BaseEntity> implements IBaseRestService {

    protected JsonViewObject jsonView = new JsonViewObject();

    public abstract IBaseService<Entity> getService();

    public String getPage(String jsonStr) {
        String result;
        Page page;

        try {
            Map<String, Object> mapBean = new HashMap<String, Object>();

            if (!StringUtils.isBlank(jsonStr)) {
                page = JSON.parseObject(jsonStr, Page.class);

                if (page != null) {
                    Entity entity = null;
                    String objCondition = null;

                    if (null != page.getObjCondition()) {
                        objCondition = page.getObjCondition().toString();
                    }

                    if (StringUtils.isNotBlank(objCondition) && !"{}".equalsIgnoreCase(objCondition)) {
                        entity = JSON.parseObject(objCondition, this.getEntityClass());
                        mapBean = BeanObjectToMap.convertBean(entity);
                    }
                }
            } else {
                page = new Page();
            }

            page = this.getService().findByPage(page, mapBean);
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

    public String getAll() {
        String result;

        try {
            List<Entity> list = this.getService().findAll();
            result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("BaseRestServiceImpl getAll is error", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String getByWhere(String jsonStr) {
        String result = "";

        try {
            Entity entity = JSON.parseObject(jsonStr, this.getEntityClass());
            Map<String, Object> mapBean = BeanObjectToMap.convertBean(entity);
            List<Entity> list = this.getService().findByMap(mapBean);

            if (list != null) {
                result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
            }

            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("BaseRestServiceImpl getByWhere is error，{jsonStr:" + jsonStr + "}", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String getById(String id) {
        String result = "";

        try {
            if (StringUtils.isNotBlank(id)) {
                Entity entity = this.getService().findById(id);

                if (entity != null) {
                    result = JSON.toJSONStringWithDateFormat(entity, "yyyy-MM-dd HH:mm:ss");
                }

                jsonView.successPack(result);
            }
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("BaseRestServiceImpl getById is error,{id:" + id + "}", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String getByName(String name) {
        String result = "";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("name", name);

        try {
            List<Entity> list = this.getService().findByMap(map);

            if (list != null && !list.isEmpty()) {
                result = JSON.toJSONStringWithDateFormat(list, "yyyy-MM-dd HH:mm:ss");
            }

            jsonView.successPack(result);
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(e);
            log.error("BaseRestServiceImpl getByName is error,{Name:" + name + "}", e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    public String deleteById(String id) {
        boolean flag = false;

        try {
            flag = this.getService().deleteById(id);
            jsonView.successPack(JSON.toJSONString(flag));
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            jsonView.failPack(JSON.toJSONString(flag));
            log.error("BaseRestServiceImpl deleteById is error,{Id:" + id + "}", e);
        }

        return JSON.toJSONString(jsonView);
    }

    public String save(String jsonStr) {
        String result;

        try {
            Entity entity = JSON.parseObject(jsonStr, this.getEntityClass());

            if (entity != null) {
                result = this.getService().save(entity);

                if ("exists".equals(result)) {
                    jsonView.setMessage("exists");
                } else {
                    jsonView.successPack(result);
                }
            }
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            String message = e.getMessage();

            if (StringUtils.isBlank(message)) {
                message = "保存数据失败！";
            }

            jsonView.failPack("false", message);
            log.error("BaseRestServiceImpl save is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    @Log(operationType = "",operationName = "")
    public String update(String jsonStr) {
        String result;

        try {
            Entity entity = JSON.parseObject(jsonStr, this.getEntityClass());

            if (entity != null) {
                result = String.valueOf(this.getService().update(entity));
                jsonView.successPack(result);
            }
        } catch (UnauthorizedException unauthorizedException) {
            jsonView.unauthorizedPack();
        } catch (Exception e) {
            String message = e.getMessage();

            if (StringUtils.isBlank(message)) {
                message = "更新数据失败！";
            }

            jsonView.failPack("false", message);
            log.error("BaseRestServiceImpl update is error,{jsonStr:" + jsonStr + "}," + e.getMessage(), e);
        }

        result = JSON.toJSONString(jsonView);

        return result;
    }

    /**
     * 得到当前的对象class
     *
     * @return
     */
    public Class<Entity> getEntityClass() {
        return (Class<Entity>) ((ParameterizedType) getClass()
                .getGenericSuperclass()).getActualTypeArguments()[0];
    }
}
