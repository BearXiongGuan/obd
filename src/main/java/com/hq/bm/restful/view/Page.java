package com.hq.bm.restful.view;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class Page implements Serializable {
    private int pageSize = 10;
    private int pageNumber = 1;
    private int total = 0;
    private int totalPageNum = 0;
    private int startRowNum = 0;
    private int endRowNum = 0;
    private Object objCondition;

    @SuppressWarnings("rawtypes")
    private List rows;

    public Page() {

    }

    public Page(int pageSize, int total) {
        this.pageSize = pageSize;
        this.total = total;
        int mod = total % pageSize;
        totalPageNum = mod == 0 ? (total / pageSize) : (total / pageSize) + 1;

        if (startRowNum <= 0) {
            startRowNum = 0;
            endRowNum = pageSize;
        }
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
        this.startRowNum = (pageSize * (pageNumber - 1));
        this.endRowNum = (pageSize * pageNumber);

    }

    public void setTotal(int total) {
        this.total = total;
        int mod = total % pageSize;
        totalPageNum = mod == 0 ? (total / pageSize) : (total / pageSize) + 1;

        if (startRowNum <= 0) {
            startRowNum = 0;
            endRowNum = pageSize;
        }
    }

    public int getStartRowNum() {
        this.startRowNum = (pageSize * (pageNumber - 1));
        return startRowNum;
    }

    public int getEndRowNum() {
        this.endRowNum = (pageSize * pageNumber);
        return endRowNum;
    }
}
