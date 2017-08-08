package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by Administrator on 2017/3/10.
 */
@Data
public class Permission extends BaseEntity {

    private String id;
    
    private String pid;

    private String text;

    private String priviCode;

    private int priviType;
}
