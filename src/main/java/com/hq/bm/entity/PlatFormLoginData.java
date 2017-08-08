package com.hq.bm.entity;

import lombok.Data;

/**
 * Created by admin on 2017/3/6.
 */
@Data
public class PlatFormLoginData extends BaseEntity{

        private int dataType;

        private String dataTime;

        private int iosCount;

        private int androidCount;

        private int webCount;

        private int count;
}
