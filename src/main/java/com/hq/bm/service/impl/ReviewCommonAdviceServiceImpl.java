package com.hq.bm.service.impl;


import com.hq.bm.entity.ReviewCommonAdvice;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.ReviewCommonAdviceMapper;
import com.hq.bm.service.IReviewCommonAdviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2017/4/26.
 */
@Service
public class ReviewCommonAdviceServiceImpl extends BaseServiceImpl<ReviewCommonAdvice> implements IReviewCommonAdviceService {

    @Autowired
    private ReviewCommonAdviceMapper reviewCommonAdviceMapper;

    public BaseMapper<ReviewCommonAdvice> getBaseMapper() {
        return reviewCommonAdviceMapper;
    }

}
