package com.hq.bm.service.impl;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.RptBroadbandPermeateData;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.RptBroadbandPermeateMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.IRptBroadbandPermeateService;
import com.hq.bm.utils.FileUtils;

/**
 * Created by Administrator on 2017/5/24.
 */
@Service
public class RptBroadbandPermeateServiceImpl extends
		BaseServiceImpl<RptBroadbandPermeateData> implements
		IRptBroadbandPermeateService {
	@Autowired
	private RptBroadbandPermeateMapper rptBroadbandPermeateMapper;

	@Override
	public BaseMapper<RptBroadbandPermeateData> getBaseMapper() {
		return rptBroadbandPermeateMapper;
	}

	public Page exportRptBroadbandPermeateXls(Page page,
			Map<String, Object> map, HttpServletRequest request,
			HttpServletResponse response) throws ServiceException {
		page.setTotal(rptBroadbandPermeateMapper.getCount(map));
		map.put("startRowNum", page.getStartRowNum());
		map.put("pageSize", page.getPageSize());
		map.put("endRowNum", page.getEndRowNum());
		page.setRows(rptBroadbandPermeateMapper.findByPage(map));
		int objType = (Integer) map.get("objType");
		String typeName = "";
		if (objType == 4) {
			typeName = "网格";
		} else if (objType == 5) {
			typeName = "建筑物";
		}
		List<RptBroadbandPermeateData> list = rptBroadbandPermeateMapper
				.findByPage(map);
		HSSFWorkbook workbook = new HSSFWorkbook();// 创建一个Excel文件，当前这个文件在内存中
		HSSFSheet sheet = workbook.createSheet(typeName + "宽带渗透率统计数据");// 创建一个sheet页
		sheet.setColumnWidth(0, 60 * 256);
		sheet.setColumnWidth(1, 35 * 256);
		sheet.setColumnWidth(2, 25 * 256);
		sheet.setColumnWidth(3, 15 * 256);
		sheet.setColumnWidth(4, 35 * 256);
		sheet.setColumnWidth(5, 25 * 256);
		sheet.setColumnWidth(6, 15 * 256);
		sheet.setColumnWidth(7, 15 * 256);
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
		HSSFCell headCell4 = headRow.createCell(4);
		HSSFCell headCell5 = headRow.createCell(5);
		HSSFCell headCell6 = headRow.createCell(6);
		HSSFCell headCell7 = headRow.createCell(7);

		headCell0.setCellValue(typeName + "名称");
		headCell0.setCellStyle(cellStyle);
		headCell1.setCellValue("宽带业务数");
		headCell1.setCellStyle(cellStyle);
		headCell2.setCellValue("固话业务数");
		headCell2.setCellStyle(cellStyle);
		headCell3.setCellValue("ITV业务数");
		headCell3.setCellStyle(cellStyle);
		headCell4.setCellValue("房间数");
		headCell4.setCellStyle(cellStyle);
		headCell5.setCellValue("宽带渗透率");
		headCell5.setCellStyle(cellStyle);
		headCell6.setCellValue("分公司");
		headCell6.setCellStyle(cellStyle);
		headCell7.setCellValue("营销服务中心");
		headCell7.setCellStyle(cellStyle);
		HSSFDataFormat format = workbook.createDataFormat();
		cellStyle.setDataFormat(format.getFormat("yyyy年m月d日"));
		for (RptBroadbandPermeateData rptBroadbandPermeateData : list) {// 循环list，将数据写到Excel文件中
			HSSFRow dataRow = sheet.createRow(sheet.getLastRowNum() + 1);
			dataRow.createCell(0).setCellValue(
					rptBroadbandPermeateData.getObjName());
			dataRow.createCell(1).setCellValue(
					rptBroadbandPermeateData.getBroadbandNum());
			dataRow.createCell(2).setCellValue(
					rptBroadbandPermeateData.getTelNum());
			dataRow.createCell(3).setCellValue(
					rptBroadbandPermeateData.getItvNum());
			dataRow.createCell(4).setCellValue(
					rptBroadbandPermeateData.getRoomNum());
			dataRow.createCell(5).setCellValue(
					rptBroadbandPermeateData.getBroadbandPermeateData());
			dataRow.createCell(6).setCellValue(
					rptBroadbandPermeateData.getCounty());
			dataRow.createCell(7).setCellValue(
					rptBroadbandPermeateData.getVillage());
		}
		ServletOutputStream out = null;
		// 文件下载：一个流（输出流）、两个头
		try {
			out = response.getOutputStream();
			Date now = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");// 可以方便地修改日期格式
			String hehe = dateFormat.format(now);
			String filename = typeName + "宽带渗透率统计数据" + hehe + ".xls";
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
