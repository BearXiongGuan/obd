package com.hq.bm.entity;

import lombok.Data;

@Data
public class FieldModifyConfig extends BaseEntity{
	private String tableName;
	private String fieldCnName;
	private String fieldEnName;
	private int dataType;// 1-设施，2-建筑物
	private int seq;//排序
}
