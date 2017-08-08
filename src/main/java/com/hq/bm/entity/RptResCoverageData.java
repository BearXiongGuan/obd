package com.hq.bm.entity;

import lombok.Data;


/**
 * Created by Administrator on 2017/5/23.
 */
@Data
public class RptResCoverageData extends BaseEntity {
	
	private String objName;
	
	private Integer objType;
	
	private String finalData;
	
	private String county;
	
	private String village;
	
	private String orgId;
	
}
