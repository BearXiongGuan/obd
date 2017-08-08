package com.hq.bm.entity;

import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * Created by Administrator on 2017/3/9.
 */
@Data
public class Lightfacility extends BaseEntity {

	private long ocfId;

	private String ocfCode;

	private String ocfName;

	private String address;

	private int ocfType;

	private int facstatus;

	private Date recdate;

	private long stId;

	private double height;

	private long attriOcfid;

	private int nmAccesstype;

	private int netLevel;

	private long countyId;

	private long mkcenterId;

	private double longitude;

	private double latitude;

	private int portXlCount;

	private int portXlCountZy;

	private int portXlCountKx;

	private double minLatitude;

	private double maxLatitude;

	private double minLongitude;

	private double maxLongitude;

	private String mkName;

	private String countyName;
	
	private String ocftypename;
	
	private String facstatusname;
	
	private String recorder;
	
	private String addr;
	
	private String nmAccesstypename;
	
	private String remark;

	private String thumbnail;

}
