package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by Administrator on 2017/5/16.
 */
@Data
public class SysParam extends BaseEntity {
    private String paramName;

    private String paramValue;

    private String remark;
}
