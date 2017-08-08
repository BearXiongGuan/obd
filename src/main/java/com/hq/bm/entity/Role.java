package com.hq.bm.entity;

import lombok.Data;

import java.util.Date;

/**
 * Created by admin on 2017/3/6.
 */
@Data
public class Role extends BaseEntity {

    private String name;

    private String id;

    private Date creatTime;

    private int creatId;

    private String description;

    private  String code;

    private String priviIds;
    
    private String priviId;
}
