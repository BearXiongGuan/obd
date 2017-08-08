package com.hq.bm.mapper;

import org.springframework.stereotype.Repository;

import com.hq.bm.entity.DataReview;

import java.util.HashMap;
import java.util.List;


/**
 * Created by Administrator on 2017/4/21.
 */
@Repository
public interface DataReviewMapper  extends BaseMapper<DataReview>{

    void save(DataReview dataReview);
}
