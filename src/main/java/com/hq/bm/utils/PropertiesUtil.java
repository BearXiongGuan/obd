package com.hq.bm.utils;

import java.io.InputStream;
import java.util.Properties;

/**
 * 操作属性文件工具类
 * 
 * @author xiongguan
 * 
 */
public class PropertiesUtil {

	private static Properties properties;

	private static PropertiesUtil propertiesUtil;

	public PropertiesUtil(String propertyFilePath) throws Exception {
		properties = new Properties();
		InputStream in = this.getClass().getResourceAsStream(propertyFilePath);
		properties.load(in);
	}

	/**
	 * 获取工具类的单例
	 * 
	 * @param propertyFilePath
	 * @return
	 * @throws Exception
	 */
	public static PropertiesUtil newInstance(String propertyFilePath)
			throws Exception {
		if (null == propertiesUtil) {
			return new PropertiesUtil(propertyFilePath);
		} else {
			return propertiesUtil;
		}
	}

	/**
	 * 根据属性名称获取属性值
	 * 
	 * @param name
	 * @return
	 */
	public static String getValueByName(String name) {
		return properties.getProperty(name);
	}

}
