package com.hq.bm.entity;

import java.util.Date;

import lombok.Data;

/**
 * Created by Administrator on 2017/4/21.
 */
@Data
public class DataReview extends BaseEntity {

	private String reviewer;

	private Date reviewDate;

	private long countyId;

	private long mkcenterId;

	private String mkName;

	private String countyName;

	private int dataType;// 数据类型 1：设施 2：建筑物,3：网格，4：服务区

	private Date createDate;

	private String createDateStart;

	private String createDateEnd;

	private String reviewDateStart;

	private String reviewDateEnd;

	private long datakeyId;

	private String oldValue;

	private String newValue;

	private int reviewStatus;// 审核状态 0-未审核 1-已审核 2-未通过

	private String creater;

	private int userId;

	private String dataKeyName;

	private int status;// 状态 1-添加，2-修改，3-删除
	
	private String remark;

	private double shapeLen;

}
