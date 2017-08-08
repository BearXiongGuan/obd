package com.hq.bm.entity;

import java.util.Date;

import lombok.Data;

/**
 * Created by Administrator on 2017/5/5.
 */
@Data
public class Addr extends BaseEntity {

	private long addrId;

	private String name;

	private int grade;

	private long parentId;

	private int confirm;

	private int amend;

	private int greenLabel;

	private Date recDate;

	private String addr;

	private int operType;

	private long logId;
}
