package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by Administrator on 2017/5/3.
 */
@Data
public class Wg extends BaseEntity {
	private Long facId;
	private String facName;
	private Integer facType;
	private String city;
	private Integer type;
	private Integer regionId;
	private Integer buildingF;
	private String county;
	private String village;
	private Long parentId;
	private String addrId;
	private String code;
	private String gridType;
}
