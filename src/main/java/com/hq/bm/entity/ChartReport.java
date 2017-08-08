package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by Administrator on 2017/4/28.
 */
@Data
public class ChartReport extends BaseEntity {

	private String titles;

	private String values;

	private Float defParam;
	
	private String broadboadNum ;    //宽带业务数
	private String telNum ;     //固话数	
	private String itvNum ;     //ITV数目
	private String broadboadRate ;   //宽带渗透率
}
