package com.hq.bm.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hq.bm.entity.ChartReport;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.service.IChartReportService;
import com.hq.bm.utils.ConnectionUtil;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;

/**
 * Created by Administrator on 2017/4/28.
 */

@Service
public class ChartReportServiceImpl implements IChartReportService<ChartReport> {

	public String getChartReport(String jsonStr) throws ServiceException {

		Connection connection = ConnectionUtil.getConnection();

		try {
			JSONObject jo = JSON.parseObject(jsonStr);
			int userId = Integer.valueOf(jo.get("userId").toString());
			int type = Integer.valueOf(jo.get("type").toString());
			int fgsId = Integer.valueOf(jo.get("fgsId").toString() == null ? "0" : jo.get("fgsId").toString());
			// 创建存储过程的对象
			CallableStatement c = connection
					.prepareCall("{call PK_RPT.GET_RES_COVERAGE_DATA(?,?,?,?,?)}");
			// 给存储过程的第一个参数设置值
			c.setInt(1, userId);
			// 给存储过程的第二个参数设置值
			c.setInt(2, type);
			// 给存储过程的第三个个参数设置值
			c.setInt(3, fgsId);
			// 注册存储过程的第四个参数
			c.registerOutParameter(4, java.sql.Types.VARCHAR);
			// 注册存储过程的第五个参数
			c.registerOutParameter(5, java.sql.Types.VARCHAR);
			// 执行存储过程
			c.execute();
			// 得到存储过程的输出参数值
			System.out.println(c.getString(4) + "---" + c.getString(4));

			ChartReport chartReport = new ChartReport();

			chartReport.setTitles(c.getString(4));

			chartReport.setValues(c.getString(5));

			connection.close();

			return "{\"status\":true,\"content\":"
					+ JSON.toJSONString(chartReport) + "}";

		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

	public String getChartThickThinReport(String jsonStr) throws ServiceException {
		Connection connection = ConnectionUtil.getConnection();

		try {
			JSONObject jo = JSON.parseObject(jsonStr);
			int userId = Integer.valueOf(jo.get("userId").toString());
			int type = Integer.valueOf(jo.get("type").toString());
			int fgsId = Integer.valueOf(jo.get("fgsId").toString() == null ? "0" : jo.get("fgsId").toString());
			// 创建存储过程的对象
			CallableStatement c = connection
					.prepareCall("{call PK_RPT.GET_OBD_COVERTHICKTHIN_DATA(?,?,?,?,?,?)}");
			// 给存储过程的第一个参数设置值
			c.setInt(1, userId);
			// 给存储过程的第二个参数设置值
			c.setInt(2, type);
			// 给存储过程的第三个个参数设置值
			c.setInt(3, fgsId);
			// 注册存储过程的第四个参数
			c.registerOutParameter(4, java.sql.Types.VARCHAR);
			// 注册存储过程的第五个参数
			c.registerOutParameter(5, java.sql.Types.VARCHAR);
            // 注册存储过程的第六个参数
			c.registerOutParameter(6, Types.FLOAT);  //p_defParam
			// 执行存储过程
			c.execute();
			// 得到存储过程的输出参数值
			System.out.println(c.getString(4) + "---" + c.getString(4));

			ChartReport chartReport = new ChartReport();

			chartReport.setTitles(c.getString(4));

			chartReport.setValues(c.getString(5));

			chartReport.setDefParam(c.getFloat(6));

			connection.close();

			return "{\"status\":true,\"content\":"
					+ JSON.toJSONString(chartReport) + "}";

		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

	//获取宽带利用率
	public String getChartBrandBoadRate(String jsonString) throws ServiceException{
		Connection connection = ConnectionUtil.getConnection();
		try {
			JSONObject jo = JSON.parseObject(jsonString);
			int userId = Integer.valueOf(jo.get("userId").toString());
			int type = Integer.valueOf(jo.get("type").toString());
			int fgsId = Integer.valueOf(jo.get("fgsId").toString() == null ? "0" : jo.get("fgsId").toString());
			// 创建存储过程的对象
			CallableStatement c = connection.prepareCall("{call PK_RPT.GET_BROADBAND_PERMEATE_DATA(?,?,?,?,?,?,?,?)}");
			// 给存储过程的第一个参数设置值
			c.setInt(1, userId);
			// 给存储过程的第二个参数设置值
			c.setInt(2, type);
			// 给存储过程的第三个个参数设置值
			c.setInt(3, fgsId);
			// 注册存储过程的第四个参数
			c.registerOutParameter(4, java.sql.Types.VARCHAR);
			c.registerOutParameter(5, java.sql.Types.VARCHAR);
			c.registerOutParameter(6, java.sql.Types.VARCHAR);
			c.registerOutParameter(7, java.sql.Types.VARCHAR);
			c.registerOutParameter(8, java.sql.Types.VARCHAR);
			
			// 执行存储过程
			c.execute();
			// 得到存储过程的输出参数值
			System.out.println(c.getString(4) + "---" + c.getString(4));

			ChartReport chartReport = new ChartReport();
			chartReport.setTitles(c.getString(4));
			chartReport.setBroadboadRate(c.getString(5));
			chartReport.setBroadboadNum(c.getString(6));
			chartReport.setTelNum(c.getString(7));
			chartReport.setItvNum(c.getString(8));
			
			connection.close();

			return "{\"status\":true,\"content\":"
					+ JSON.toJSONString(chartReport) + "}";

		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}
}