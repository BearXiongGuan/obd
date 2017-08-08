package com.hq.bm.restful.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.hq.bm.entity.Addr;
import com.hq.bm.restful.IAddrRestService;
import com.hq.bm.service.IAddrService;
import com.hq.bm.service.IBaseService;

/**
 * Created by Administrator on 2017/5/5.
 */
@Component
@Slf4j
public class AddrRestServiceImpl extends BaseRestServiceImpl<Addr> implements
		IAddrRestService {

	@Autowired
	private IAddrService addrService;

	@Override
	public IBaseService<Addr> getService() {
		return addrService;
	}

	public String findParentLevelAddrsById(long addrId) {
		String result = "";
		try {
			List<Addr> addrs = addrService.findParentLevelAddrsById(addrId);
			result = JSON.toJSONStringWithDateFormat(addrs,
					"yyyy-MM-dd HH:mm:ss");

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"AddrRestServiceImpl findParentLevelAddrsById is error,{addrId:"
							+ addrId + "}", e);
		}
		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String findAddrsByAddr(String addr) {
		String result = "";
		try {
			List<Map<String, Object>> addrs = addrService.findAddrsByAddr(addr);
			result = JSON.toJSONStringWithDateFormat(addrs,
					"yyyy-MM-dd HH:mm:ss");
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("AddrRestServiceImpl findAddrsByAddr is error,{addr:"
					+ addr + "}", e);
		}
		result = JSON.toJSONString(jsonView);

		return result;
	}


	public String findAddrsByParentId(String jsonStr) {
		Map<String, Object> params = JSON.parseObject(jsonStr,
				new HashMap<String, Object>().getClass());
		String result = "";
		try {
			List<Map<String,Object>> addrs = addrService.findAddrsByParentId(params);
			result = JSON.toJSONStringWithDateFormat(addrs,
					"yyyy-MM-dd HH:mm:ss");
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"AddrRestServiceImpl findAddrsByParentId is error,{jsonStr:"
							+ jsonStr + "}", e);
		}
		result = JSON.toJSONString(jsonView);

		return result;
	}

}
