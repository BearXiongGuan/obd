package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by Administrator on 2017/5/16.
 */
@Data
public class SysDict extends BaseEntity {
	private Long dictId;
	private String dictType;
	private String dictKey;
	private String dictDesc;
	private Integer dictStatus;
}
