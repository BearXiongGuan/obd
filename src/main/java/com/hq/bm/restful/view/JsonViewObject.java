package com.hq.bm.restful.view;


import com.hq.bm.utils.Constants;
import lombok.Data;

/**
 * restful对外的JSON 对象封装
 */
@Data
public class JsonViewObject {

    /**
     * 状态值
     */
    private String status;

    /**
     * 返回的编码
     */
    private String code;

    /**
     * 返回的消息描述
     */
    private String message;

    /**
     * 返回的内容
     */
    private String content;

    public JsonViewObject successPack(String result) {
        this.setMessage("");
        this.setContent(result);
        this.setStatus(Constants.jsonView.STATUS_SUCCESS);
        return this;
    }

    public JsonViewObject successPack(String result, String msg) {
        this.setContent(result);
        this.setMessage(msg);
        this.setStatus(Constants.jsonView.STATUS_SUCCESS);
        return this;
    }

    public JsonViewObject failPack(Exception e) {
        String message = e.getMessage();
        int index = message.indexOf(":");
        setMessage(index == -1 ? message : message.substring(index + 1));
        setContent("");
        setStatus(Constants.jsonView.STATUS_FAIL);
        return this;
    }

    public JsonViewObject failPack(String errMsg) {
        setMessage(errMsg);
        setContent("");
        setStatus(Constants.jsonView.STATUS_FAIL);
        return this;
    }

    /**
     * 未认证的响应结果
     * @return
     */
    public JsonViewObject unauthenticatedPack() {
        setMessage("未认证，请先登陆系统！");
        setContent("");
        setStatus(Constants.jsonView.UNAUTHENTICATED);
        return this;
    }

    /**
     * 未授权的响应结果
     * @return
     */
    public JsonViewObject unauthorizedPack() {
        setMessage("您无权进行该操作！");
        setContent("");
        setStatus(Constants.jsonView.UNAUTHORIZED);
        return this;
    }

    public JsonViewObject failPack(String result, String errMsg) {
        setMessage(errMsg);
        setContent(result);
        setStatus(Constants.jsonView.STATUS_FAIL);
        return this;
    }

    public JsonViewObject failPackMessage(String errMsg, String content) {
        setMessage(errMsg);
        setContent(content);
        setStatus(Constants.jsonView.STATUS_FAIL);
        return this;
    }

}
