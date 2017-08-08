package com.hq.bm.entity;

import java.util.Date;

import lombok.Data;

/**
 * Created by admin on 2017/3/24.
 */
@Data
public class FacilityPhoto extends BaseEntity {

	private int photoId;

	private long facid;

	private int factype;

	private Date createTime;

	private int createrId;

	private String creater;

	private String thumbnail;

	private String photo;

	private String remark;

	private double longitude;

	private double latitude;

	private String azimuth;

}
