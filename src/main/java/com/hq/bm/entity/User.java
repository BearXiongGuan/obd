package com.hq.bm.entity;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * Created by admin on 2017/3/6.
 */
@Data
public class User extends BaseEntity {

    private String id;

    private String loginName;

    private String password;

    private String loginEquId;

    private String tel;

    private String username;

    private String orgId;

    private String orgName;

    private String roleId;

    private String name;

    private Date creatTime;

    private Date updateTime;

    private Date lastLoginTime;

    private int  userStateId;

    private String userState;

    private int  createrId;

    private Organization organization;

    private List<Role> roleList;

    private int opPlatform;//操作平台 0：web 1：andriod 2：ios
      
    private String idCode;//验证码
    
    private String ip;

}
