package com.hq.bm.mapper;

import com.hq.bm.entity.PlatFormLoginData;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by 2D-wht-f019 on 2017/3/15.
 */
@Repository
public interface PlatFormLoginMapper extends BaseMapper<PlatFormLoginData> {

    List<PlatFormLoginData> getDayData(int count);

    List<PlatFormLoginData> getMonthData(int count);

    List<PlatFormLoginData> getYearData(int count);
}
