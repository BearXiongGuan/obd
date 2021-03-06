package com.hq.bm.service.impl;

import com.hq.bm.entity.RptObdThickThinData;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.RptObdThickThinMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IRptObdThickThinService;
import com.hq.bm.utils.FileUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/23.
 */
@Service
public class RptObdThickThinServiceImpl extends
		BaseServiceImpl<RptObdThickThinData> implements IRptObdThickThinService {
	@Autowired
	private RptObdThickThinMapper rptObdThickThinMapper;

	@Override
	public BaseMapper<RptObdThickThinData> getBaseMapper() {
		return rptObdThickThinMapper;
	}

	public Page exportRptResCoverageXls(Page page, Map<String, Object> map,
			HttpServletRequest request, HttpServletResponse response)
			throws ServiceException {
		page.setTotal(rptObdThickThinMapper.getCount(map));
		map.put("startRowNum", page.getStartRowNum());
		map.put("pageSize", page.getPageSize());
		map.put("endRowNum", page.getEndRowNum());
		page.setRows(rptObdThickThinMapper.findByPage(map));
		int objType = (Integer) map.get("objType");
		String typeName = "";
		if (objType == 4) {
			typeName = "网格";
		} else if (objType == 5) {
			typeName = "建筑物";
		}
		List<RptObdThickThinData> list = rptObdThickThinMapper.findByPage(map);
		HSSFWorkbook workbook = new HSSFWorkbook();// 创建一个Excel文件，当前这个文件在内存中
		HSSFSheet sheet = workbook.createSheet(typeName + "资源覆盖率统计数据");// 创建一个sheet页
		sheet.setColumnWidth(0, 60 * 256);
		sheet.setColumnWidth(1, 35 * 256);
		sheet.setColumnWidth(2, 25 * 256);
		sheet.setColumnWidth(3, 15 * 256);
		HSSFRow headRow = sheet.createRow(0);// 创建标题行
		// 获取一行的样式
		CellStyle cellStyle = workbook.createCellStyle();
		// 创建字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.BLACK.index);// HSSFColor.VIOLET.index //字体颜色
		font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD); // 字体增粗
		// 设置字体
		cellStyle.setFont(font);
		// 设置样式
		headRow.setRowStyle(cellStyle);
		HSSFCell headCell0 = headRow.createCell(0);
		HSSFCell headCell1 = headRow.createCell(1);
		HSSFCell headCell2 = headRow.createCell(2);
		HSSFCell headCell3 = headRow.createCell(3);
		headCell0.setCellValue(typeName + "名称");
		headCell0.setCellStyle(cellStyle);
		headCell1.setCellValue("覆盖率");
		headCell1.setCellStyle(cellStyle);
		headCell2.setCellValue("分公司");
		headCell2.setCellStyle(cellStyle);
		headCell3.setCellValue("营服中心");
		headCell3.setCellStyle(cellStyle);
		HSSFDataFormat format = workbook.createDataFormat();
		cellStyle.setDataFormat(format.getFormat("yyyy年m月d日"));
		for (RptObdThickThinData rptObdThickThinData : list) {// 循环list，将数据写到Excel文件中
			HSSFRow dataRow = sheet.createRow(sheet.getLastRowNum() + 1);
			dataRow.createCell(0).setCellValue(rptObdThickThinData.getObjName());
			dataRow.createCell(1).setCellValue(
					rptObdThickThinData.getFinalData());
			dataRow.createCell(2).setCellValue(rptObdThickThinData.getCounty());
			dataRow.createCell(3).setCellValue(rptObdThickThinData.getVillage());
		}
		ServletOutputStream out = null;
		// 文件下载：一个流（输出流）、两个头
		try {
			out = response.getOutputStream();
			Date now = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");// 可以方便地修改日期格式
			String hehe = dateFormat.format(now);
			String filename = typeName + "" +
					"OBD覆盖厚薄分析统计数据" + hehe + ".xls";
			filename = FileUtils.encodeDownloadFilename(filename,
					request.getHeader("user-agent"));
			response.setContentType(request.getServletContext().getMimeType(
					filename));
			response.setHeader("content-disposition", "attachment;filename="
					+ filename);
			workbook.write(out);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				workbook.close();
				out.flush();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
}
