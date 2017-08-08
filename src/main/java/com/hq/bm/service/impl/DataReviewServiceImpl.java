package com.hq.bm.service.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.hq.bm.entity.DataReview;
import com.hq.bm.entity.LogInfo;
import com.hq.bm.entity.Organization;
import com.hq.bm.entity.User;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.DataReviewMapper;
import com.hq.bm.mapper.LogInfoMapper;
import com.hq.bm.mapper.OrganizationMapper;
import com.hq.bm.service.IDataReviewService;
import com.hq.bm.utils.ConnectionUtil;
import com.hq.bm.utils.IDGenerator;

/**
 * Created by Administrator on 2017/4/21.
 */
@Service
public class DataReviewServiceImpl extends BaseServiceImpl<DataReview>
		implements IDataReviewService {

	@Autowired
	private DataReviewMapper dataReviewMapper;
	@Autowired
	private OrganizationMapper organizationMapper;
	@Autowired
	private LogInfoMapper logInfoMapper;

	@Override
	public BaseMapper<DataReview> getBaseMapper() {
		// TODO Auto-generated method stub
		return dataReviewMapper;
	}

	// 审核数据，flag=1表示通过审核，flag=2表示驳回,opPlatform=0表示web端,opPlatform=1表示android端,opPlatform=2表示ios端
	public String reviewData(String ids, String flag, String opPlatform,
			String ip, String reviewer, String remark) {

		Connection connection = ConnectionUtil.getConnection();

		try {
			// 创建存储过程的对象
			CallableStatement c = connection
					.prepareCall("{call REVIEW_DATA(?,?,?,?,?,?,?)}");
			// 给存储过程的第一个参数设置值
			c.setString(1, ids);
			// 给存储过程的第二个参数设置值
			c.setString(2, flag);
			// 给存储过程的第三个参数设置值
			c.setString(3, opPlatform);
			// 给存储过程的第四个参数设置值
			c.setString(4, ip);
			// 给存储过程的第五个参数设置值
			c.setString(5, reviewer);
			// 给存储过程的第六个参数设置值
			c.setString(6, remark);
			// 注册存储过程的第七个参数
			c.registerOutParameter(7, java.sql.Types.INTEGER);
			// 执行存储过程
			c.execute();
			// 得到存储过程的输出参数值
			int result = c.getInt(7);// 1-成功，0-失败

			connection.close();

			return "{\"status\":" + result + "}";

		} catch (SQLException e) {
			e.printStackTrace();
			return "{\"status\":0}";
		}
	}

	public String updateBuildingProperty(DataReview dataReview)
			throws ServiceException {
		List<Organization> list;
		String id = IDGenerator.getID();
		Organization organization;

		try {
			if (StringUtils.isBlank(dataReview.getId())
					|| dataReview.getId().equalsIgnoreCase("0")) {
				dataReview.setId(id);
			}
			if (dataReview.getDataType() == 2 ) {
				list = organizationMapper.findCountyIDByFaceID(dataReview
						.getDatakeyId());
				dataReview.setCountyId(Long.parseLong(list.get(0).getId()));
				dataReview.setMkcenterId(Long.parseLong(list.get(0).getId1()));
			} else if (dataReview.getDataType() == 3 || dataReview.getDataType() == 4) {
				organization = organizationMapper.findIdByName(dataReview
						.getCountyName());
				dataReview.setCountyId(Long.parseLong(organization.getId()));
				organization = organizationMapper.findIdByName(dataReview
						.getMkName());
				dataReview.setMkcenterId(Long.parseLong(organization.getId()));
			}
			dataReview.setCreateDate(new Date());
			return save(dataReview);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}

	public String updateOTBProperty(String p_ocfids, float p_longitude,float p_latitude,
									String p_platform,String p_ip,String p_submitperson) {

		Connection connection = ConnectionUtil.getConnection();

		try {
			// 创建存储过程的对象
			CallableStatement c = connection
					.prepareCall("{call MOVE_OTB(?,?,?,?,?,?,?,?)}");

			c.setString(1, p_ocfids);
			c.setString(2, p_submitperson);
			c.setFloat(3, p_longitude);
			c.setFloat(4,  p_latitude);
			c.setString(5, p_platform);
			c.setString(6, p_ip);
			c.registerOutParameter(7, Types.INTEGER);
			c.registerOutParameter(8, Types.VARCHAR);
			// 执行存储过程
			c.execute();
			// 得到存储过程的输出参数值
			int result = c.getInt(7);// 1-成功，0-失败，-1-存在重复提交
			String msg = c.getString(8); // 重复提交的设施信息

			connection.close();

			return "{\"status\":" + result + ", \"message\":\"" + msg +"\"}";

		} catch (SQLException e) {
			e.printStackTrace();
			return "{\"status\":0}";
		}
	}

	public String saveWg(DataReview dataReview) throws ServiceException {
		String id = IDGenerator.getID();
		try {
			if (StringUtils.isBlank(dataReview.getId())
					|| dataReview.getId().equalsIgnoreCase("0")) {
				dataReview.setId(id);
			}

			dataReview.setCreateDate(new Date());
			return save(dataReview);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

	}

	@Override
	public String save(DataReview dataReview) throws ServiceException {
		//dataReviewMapper.save(dataReview);
		//addLog(dataReview);
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		Connection connection = ConnectionUtil.getConnection();
		try {
			// 创建存储过程的对象
			CallableStatement c = connection
					.prepareCall("{call SAVE_REVIEWDATA(?,?,?,?,?,?,?,?,?,?,?,?)}");
			// 给存储过程的第一个参数设置值
			c.setInt(1, dataReview.getDataType());
			// 给存储过程的第二个参数设置值
			c.setInt(2, dataReview.getStatus());
			// 给存储过程的第三个参数设置值
			c.setLong(3, dataReview.getCountyId());
			// 给存储过程的第四个参数设置值
			c.setLong(4, dataReview.getMkcenterId());
			// 给存储过程的第五个参数设置值
			c.setLong(5, dataReview.getDatakeyId());
			// 给存储过程的第六个参数设置值
			c.setString(6, dataReview.getDataKeyName());
			// 给存储过程的第七个参数设置值
			c.setString(7, dataReview.getCreater());
			// 给存储过程的第八个参数设置值
			c.setString(8, dataReview.getOldValue());
			// 给存储过程的第九个参数设置值
			c.setString(9, dataReview.getNewValue());
			// 给存储过程的第十个参数设置值
			User user=(User)request.getSession().getAttribute("loginUser");
			c.setInt(10, user.getOpPlatform());
			// 给存储过程的第十一个参数设置值
			c.setString(11, user.getOpPlatform()==0?request.getRemoteAddr():user.getIp());
			// 注册存储过程的第十二个参数
			c.registerOutParameter(12, java.sql.Types.INTEGER);
			// 执行存储过程
			c.execute();
			// 得到存储过程的输出参数值
			int result = c.getInt(12);// 1-成功，0-失败,-1-数据重复

			connection.close();
			if(result==-1){
				return "exists";
			} else if (result==0) {
				return "fail";
			} else {
				return "success";
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return "fail";
		}
	}

	@Override
	public boolean update(DataReview entity) throws ServiceException {
		return super.update(entity);
	}

	@Override
	public boolean deleteById(String id) throws ServiceException {
		return super.deleteById(id);
	}

	// 记录日志
	private void addLog(DataReview dataReview) {
		String dataTypeName = "";
		// 数据类型判断
		switch (dataReview.getDataType()) {
		case 1:
			dataTypeName = "光设施";
			break;
		case 2:
			dataTypeName = "建筑物";
			break;
		case 3:
			dataTypeName = "网格";
			break;
		case 4:
			dataTypeName = "服务区";
			break;
		default:
			break;
		}
		String statusName = "";
		// 操作类型判断
		switch (dataReview.getStatus()) {
		case 1:
			statusName = "添加";
			break;
		case 2:
			statusName = "修改";
			break;
		case 3:
			statusName = "删除";
			break;
		case 4:
			if (dataReview.getDataType() == 1) {
				statusName = "坐标修改";
			} else {
				statusName = "图形修改";
			}
			break;
		default:
			break;
		}
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes()).getRequest();
		HttpSession session = request.getSession();
		User loginUser = (User) session.getAttribute("loginUser");
		LogInfo log = new LogInfo();
		log.setUserId(Integer.parseInt(loginUser.getId()));
		log.setOpTime(new Date());
		log.setOpPlatform(loginUser.getOpPlatform());
		log.setOpIp(request.getRemoteAddr());
		log.setRemark("");
		log.setModName(dataTypeName + "模块");
		log.setOpDesc(dataTypeName + statusName + "：(" + dataTypeName + "id："
				+ dataReview.getDatakeyId() + "，" + dataTypeName + "名称："
				+ dataReview.getDataKeyName() + ")");
		logInfoMapper.add(log);
	}

	public Integer getCount(Map<String, Object> map) throws ServiceException {
		return dataReviewMapper.getCount(map);
	}
}
