package com.hq.bm.entity;

import lombok.Data;

import java.util.Date;

/**
 * Created by admin on 2017/3/8.
 */
@Data
public class BaseEntity {

    private String id;

    private Date createDate;

    private Date updateDate;
}
