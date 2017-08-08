package com.hq.bm.utils;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConnectionUtil {
	public static Connection getConnection() {
		Connection conn = null;
		try {

			PropertiesUtil pu = PropertiesUtil
					.newInstance("/config.properties");

			String url = pu.getValueByName("connection.url");

			String username = pu.getValueByName("connection.username");

			String password = pu.getValueByName("connection.password");

			if (null == conn) {
				// 获得连接
				conn = DriverManager.getConnection(url, username, password);

			} else {
				return conn;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conn;
	}

}
