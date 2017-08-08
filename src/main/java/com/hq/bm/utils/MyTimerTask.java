package com.hq.bm.utils;

import java.util.Timer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class MyTimerTask implements ServletContextListener {

	private Timer timer = null;
	private WebApplicationContext springContext;

	public void contextDestroyed(ServletContextEvent event) {
		timer.cancel();
		event.getServletContext().log("定时器销毁");
	}

	public void contextInitialized(ServletContextEvent event) {
		try {
			springContext = WebApplicationContextUtils
					.getWebApplicationContext(event.getServletContext());
			// 在这里初始化监听器，在tomcat启动的时候监听器启动，可以在这里实现定时器功能
			timer = new Timer(true);
			event.getServletContext().log("定时器已启动");// 添加日志，可在tomcat日志中查看到
			// 调用exportHistoryBean，0表示任务无延迟，5*1000表示每隔5秒执行任务，60*60*1000表示一个小时；

			int scanSeconds = Integer.valueOf(PropertiesUtil.newInstance(
					"/config.properties").getValueByName(
					"icrementIndex.scanSeconds"));
			timer.schedule(
					(IncrementIndex) springContext.getBean("incrementIndex"),
					0, scanSeconds * 1000);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
