package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by admin on 2017/3/6.
 */
@Data
public class Organization extends BaseEntity {
    private String id;

    private String id1;

    private String orgPid;

    private String text;

    private String orgDesc;

    private Integer createrId;

    private Integer seq;

    private Integer orgLevel;
}

