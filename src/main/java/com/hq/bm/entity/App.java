package com.hq.bm.entity;

import lombok.Data;

import java.util.Date;

/**
 * Created by Administrator on 2017/4/17.
 */
@Data
public class App extends BaseEntity{
    private String id;

    private Date updateDate;

    private String version;

    private String updateDesc;

    private String url;

    private long size;

}
