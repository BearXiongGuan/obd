package com.hq.bm.entity;

import java.util.Date;

import lombok.Data;

/**
 * Created by admin on 2017/5/24.
 */
@Data
public class RptBroadbandPermeateData extends BaseEntity {
	private String objName;
	private Integer objType;
	private Integer broadbandNum;
	private Integer telNum;
	private Integer itvNum;
	private Integer roomNum;
	private Double broadbandPermeateData;
	private Date updatetime;
	private String county;
	private String village;
	private Long orgId;
}
