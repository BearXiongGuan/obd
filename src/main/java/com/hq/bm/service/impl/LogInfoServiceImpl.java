package com.hq.bm.service.impl;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.hq.bm.entity.LogInfo;
import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.LogInfoMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.ILogInfoService;

/**
 * Created by Administrator on 2017/4/26.
 */
@Service
public class LogInfoServiceImpl extends BaseServiceImpl<LogInfo> implements
		ILogInfoService {

	@Autowired
	private LogInfoMapper logInfoMapper;

	public BaseMapper<LogInfo> getBaseMapper() {
		return logInfoMapper;
	}

	public Page findPageByName(Page page, Map<String, Object> map)
			throws ServiceException {
		try {
			page.setTotal(logInfoMapper.getCountForFindPageByName(map));
			map.put("startRowNum", page.getStartRowNum());
			map.put("pageSize", page.getPageSize());
			map.put("endRowNum", page.getEndRowNum());
			page.setRows(logInfoMapper.findPageByName(map));
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
		return page;
	}

	public void add(String modName, String desc) throws ServiceException {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes()).getRequest();
		HttpSession session = request.getSession();
		User loginUser = (User) session.getAttribute("loginUser");
		LogInfo log = new LogInfo();
		log.setUserId(Integer.parseInt(loginUser.getId()));
		log.setOpTime(new Date());
		log.setOpPlatform(loginUser.getOpPlatform());
		log.setModName(modName);
		log.setOpIp(request.getRemoteAddr());
		log.setOpDesc(desc);
		log.setRemark("");
		// 保存数据库
		logInfoMapper.add(log);
	}
}
