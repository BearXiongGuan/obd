package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by Administrator on 2017/3/22.
 */
@Data
public class Building extends BaseEntity {

	private int objectId;

	private double facId;

	private String facName;

	private int facType;

	private String city;

	private int type;

	private double regionId;

	private int buildingf;

	private String county;

	private String village;

	private double parentId;

	private String addrId;

	private String code;

	private String gridType;

	private double dpId;

	private double minLatitude;

	private double maxLatitude;

	private double minLongitude;

	private double maxLongitude;

	private String facnameWg;

	private String addr;

	private String structureType;

	private String jzwType;

	private Long floorNum;

	private Long roomNum;

	private String thumbnail;

	private Integer del_flag;
	
	private String remark;
}
