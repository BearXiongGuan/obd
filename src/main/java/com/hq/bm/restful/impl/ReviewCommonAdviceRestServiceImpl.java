package com.hq.bm.restful.impl;

import com.hq.bm.entity.ReviewCommonAdvice;
import com.hq.bm.restful.IReviewCommonAdviceRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IReviewCommonAdviceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by Administrator on 2017/4/26.
 */
@Component
@Slf4j
public class ReviewCommonAdviceRestServiceImpl extends BaseRestServiceImpl<ReviewCommonAdvice> implements IReviewCommonAdviceRestService {

    @Autowired
    private IReviewCommonAdviceService reviewCommonAdviceService;

    public IBaseService getService() {
        return reviewCommonAdviceService;
    }

}
