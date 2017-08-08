package com.hq.bm.restful.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.hq.bm.entity.Permission;
import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.IUserRestService;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.ILogInfoService;
import com.hq.bm.service.IPermissionService;
import com.hq.bm.service.IUserService;
import com.hq.bm.utils.BeanObjectToMap;
import com.hq.bm.utils.MD5Util;
import com.hq.bm.utils.PropertiesUtil;

/**
 * Created by admin on 2017/3/7.
 */
@Component
@Slf4j
@Path("user")
public class UserRestServiceImpl extends BaseRestServiceImpl<User> implements
		IUserRestService {

	@Autowired
	private IUserService userService;
	@Autowired
	private IPermissionService PermissionService;
	@Autowired
	private ILogInfoService logInfoService;
	@Context
	private HttpServletRequest request;

	public IBaseService getService() {
		return userService;
	}

	/*
	 * public String getByJobNum(String jobNum) { String result = "";
	 * 
	 * try { User entity = new User(); entity.setJobNum(jobNum); Map mapBean =
	 * new BeanMap(entity); List<User> list =
	 * this.getService().findByMap(mapBean);
	 * 
	 * if (list != null) { result = JSON.toJSONStringWithDateFormat(list,
	 * "yyyy-MM-dd HH:mm:ss"); }
	 * 
	 * jsonView.successPack(result); } catch (Exception e) {
	 * jsonView.failPack(e);
	 * log.error("UserRestServiceImpl getByJobNum is error，{jobNum:" + jobNum +
	 * "}", e); }
	 * 
	 * result = JSON.toJSONString(jsonView);
	 * 
	 * return result; }
	 */

	/*
	 * public String getByJobNumWithPathParam(String jobNum) { return
	 * getByJobNum(jobNum); }
	 */

	public String insert(String jsonStr) {
		String result;
		jsonView.setContent("");
		jsonView.setStatus("");
		try {
			User user = JSON.parseObject(jsonStr, this.getEntityClass());
			// 判断登录名是否被用
			if (userService.isNameExist(user.getLoginName()) != 0) {
				jsonView.setMessage("exist");
			} else {
				if (user != null) {
					result = userService.insert(user);
					logInfoService.add(
							"用户模块",
							"添加用户：(用户名：" + user.getLoginName() + "，姓名："
									+ user.getUsername() + ")");
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

			log.error("BaseRestServiceImpl save is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;

	}

	public String updatePassword(String jsonStr) {
		String result;

		try {
			User user = JSON.parseObject(jsonStr, this.getEntityClass());

			if (user != null) {
				result = String.valueOf(userService.updatePassword(user));
				logInfoService.add("用户模块", "修改密码：(用户ID：" + user.getId() + ")");
				jsonView.successPack(result);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			String message = e.getMessage();

			if (StringUtils.isBlank(message)) {
				message = "更新密码失败！";
			}

			jsonView.failPack("false", message);
			log.error("UserRestServiceImpl update is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String updateStatus(String jsonStr) {
		String result;
		String state = "";
		try {
			User user = JSON.parseObject(jsonStr, this.getEntityClass());

			if (user != null) {
				result = String.valueOf(userService.updateStatus(user));
				if (user.getUserState().equals("停用")) {
					state = "启用";
				} else {
					state = "停用";
				}
				logInfoService.add("用户模块",
						"用户" + state + "：(用户名：" + user.getLoginName() + ")");
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			String message = e.getMessage();

			if (StringUtils.isBlank(message)) {
				message = "更新状态失败！";
			}

			jsonView.failPack("false", message);
			log.error("UserRestServiceImpl update is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String login(String jsonStr) {
		String result;
		User user;
		try {
			user = JSON.parseObject(jsonStr, User.class);
		} catch (Exception e) {
			jsonView.failPack("解析用户登录json信息异常！");
			result = JSON.toJSONString(jsonView);
			return result;
		}
		
		if(StringUtils.isEmpty(user.getLoginName())){
			jsonView.failPack("用户名不能为空！");
			result = JSON.toJSONString(jsonView);
			return result;
		}
		if(StringUtils.isEmpty(user.getPassword())){
			jsonView.failPack("密码不能为空！");
			result = JSON.toJSONString(jsonView);
			return result;
		}
		if (user.getOpPlatform() != 1 && user.getOpPlatform() != 2) {
			Object objCode = request.getSession().getAttribute("randomCode");

			String idCode = (objCode == null) ? "" : objCode.toString();  // 正常使用登录页不会出现验证码为空的情况，但如果直接调login接口会绕过验证码的产生
			
			if (StringUtils.isEmpty(user.getIdCode()) || !user.getIdCode().trim().equalsIgnoreCase(idCode)) {
				jsonView.failPack("验证码错误！");
				result = JSON.toJSONString(jsonView);
				return result;
			}
		}
		Subject subject = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(
				user.getLoginName(), user.getPassword());
		try {
			subject.login(token);

			User loginUser = userService.findByLoginName(user.getLoginName());
			PropertiesUtil propertiesUtil = PropertiesUtil
					.newInstance("/config.properties");
			String isValidIMEI = propertiesUtil.getValueByName("isValidIMEI");
			if (isValidIMEI.equals("true")) {
				if (user.getOpPlatform() == 1 || user.getOpPlatform() == 2) {
					if (user.getLoginEquId() == null) {
						jsonView.failPack("设备号为空！");
						result = JSON.toJSONString(jsonView);
						return result;
					}
					if (loginUser.getLoginEquId() == null
							|| user.getLoginName().contains("admin")) {
						loginUser.setLoginEquId(user.getLoginEquId());
					}

					if (loginUser.getLoginEquId() != null
							&& !user.getLoginEquId().equals(
									loginUser.getLoginEquId())
							&& !user.getLoginName().contains("admin")) {
						if (user.getOpPlatform() == 1) {
							jsonView.failPack("手机号与您的手机IMEI码不匹配！");
							result = JSON.toJSONString(jsonView);
							return result;
						} else if (user.getOpPlatform() == 2) {
							jsonView.failPack("手机号与您初次登录所记录的设备码不匹配！");
							result = JSON.toJSONString(jsonView);
							return result;
						}
					}
				}
			}

			loginUser.setOpPlatform(user.getOpPlatform());
			Map<String, Object> condition = new HashMap<String, Object>();
			condition.put("userId", loginUser.getId());
			// 更新最后登录时间
			loginUser.setLastLoginTime(new Date());
			userService.editLoginTime(loginUser); // 登录成功后修改用户最后登录时间

			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
					.getRequestAttributes()).getRequest();
			HttpSession session = request.getSession();
			// 用户信息放入session中
			session.setAttribute("loginUser", loginUser);
			String userJson = JSON.toJSONString(loginUser);
			jsonView.successPack(userJson);
			logInfoService.add("用户登录", "用户登录");
		} catch (ServiceException e) {
			log.error("更新最后登录时间失败", e);
		} catch (ExcessiveAttemptsException e) {
			jsonView.failPack("连续登陆失败超过5次，5分钟后再尝试！");
		}catch(IncorrectCredentialsException e){
			jsonView.failPack("密码不正确！");
		}catch (AuthenticationException e) {
			jsonView.failPack("账号不存在！");
		} catch (Exception e) {
			e.printStackTrace();
		}
		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String getByLoginPrivi() {

		String result;
		String username = (String) SecurityUtils.getSubject().getPrincipal();
		try {
			List<Permission> list = PermissionService
					.getPermissionByLoginName(username);
			result = JSON.toJSONStringWithDateFormat(list,
					"yyyy-MM-dd HH:mm:ss");
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

	public String getByLoginRole() {

		String result;

		try {
			List<User> list = userService.getAllRole();
			result = JSON.toJSONStringWithDateFormat(list,
					"yyyy-MM-dd HH:mm:ss");
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

	public String getPage(String jsonStr) {
		String result = "";
		Page page;

		try {
			Map<String, Object> mapBean = new HashMap<String, Object>();

			if (!StringUtils.isBlank(jsonStr)) {
				page = JSON.parseObject(jsonStr, Page.class);

				if (page != null) {
					User user = null;
					String objCondition = null;

					if (null != page.getObjCondition()) {
						objCondition = page.getObjCondition().toString();
					}

					if (StringUtils.isNotBlank(objCondition)
							&& !"{}".equalsIgnoreCase(objCondition)) {
						user = JSON.parseObject(objCondition,
								this.getEntityClass());
						mapBean = BeanObjectToMap.convertBean(user);
					}
				}
			} else {
				page = new Page();
			}

			page = this.getService().findByPage(page, mapBean);
			result = JSON.toJSONStringWithDateFormat(page,
					"yyyy-MM-dd HH:mm:ss", SerializerFeature.WriteMapNullValue);
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("UserRestServiceImpl getPage is error,{jsonStr:"
					+ jsonStr + "}", e);
		}

		// result = JSON.toJSONString(jsonView);

		return result;
	}

	public String deleteUserByIds(String ids, String loginNames) {
		boolean flag = false;
		try {
			flag = userService.deleteUserByIds(ids, loginNames);
			jsonView.successPack(JSON.toJSONString(flag));
			String[] idsArray = ids.split(",");
			String[] loginNamesArray = loginNames.split(",");
			String desc = "删除用户：<br/>";
			for (int i = 0; i < idsArray.length; i++) {
				desc = desc.concat("用户id：" + idsArray[i] + ",用户名："
						+ loginNamesArray[i] + "<br/>");
			}
			logInfoService.add("用户模块", desc);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(JSON.toJSONString(flag));
			log.error("BaseRestServiceImpl deleteById is error,{Id:" + ids
					+ "}", e);
		}

		return JSON.toJSONString(jsonView);
	}

	@Override
	public String update(String jsonStr) {
		String result;
		try {
			User user = JSON.parseObject(jsonStr, this.getEntityClass());

			if (user != null) {
				result = String.valueOf(this.getService().update(user));
				logInfoService.add("用户模块", "修改用户：(姓名：" + user.getLoginName()
						+ ")");
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
			log.error("BaseRestServiceImpl update is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String checkOriginalPw(String jsonStr) {
		String result;
		try {
			User user = JSON.parseObject(jsonStr, this.getEntityClass());

			if (user != null) {
				User loginUser = userService.findByLoginName(user
						.getLoginName());
				if (loginUser != null) {
					if (!loginUser.getPassword().equals(
							MD5Util.md5(user.getPassword()).toUpperCase())) {
						jsonView.successPack("1");
					} else {
						jsonView.successPack("0");
					}
				}
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			String message = e.getMessage();

			if (StringUtils.isBlank(message)) {
				message = "更新数据失败！";
			}

			jsonView.failPack("false", message);
			log.error("BaseRestServiceImpl update is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}
}
