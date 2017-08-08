package com.hq.bm.entity;

import lombok.Data;

import java.util.Date;

/**
 * Created by admin on 2017/3/6.
 */
@Data
public class LogInfo extends BaseEntity{


    private int userId;

    private Date opTime;

    private int opPlatform;//操作平台 0：web 1：andriod 2：ios

    private String modName;//模块/功能名称

    private String opIp;

    private String opDesc;

    private String remark;

    private String userName;

}
