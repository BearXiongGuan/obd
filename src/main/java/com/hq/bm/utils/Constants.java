package com.hq.bm.utils;

/**
 * Created by admin on 2017/3/7.
 */
public class Constants {

	/**
	 * Restful 对外的静态变量
	 */
	public final class jsonView {

		public static final String STATUS_SUCCESS = "success";

		public static final String STATUS_FAIL = "fail";

		/* 未认证（即未登陆系统） */
		public static final String UNAUTHENTICATED = "unauthenticated";

		/* 未授权(即登陆成功但没有相关操作权限) */
		public static final String UNAUTHORIZED = "unauthorized";

	}
}
