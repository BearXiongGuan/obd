package com.hq.bm.service.impl;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hq.bm.entity.Lightfacility;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.mapper.BaseMapper;
import com.hq.bm.mapper.LightfacilityMapper;
import com.hq.bm.restful.view.Page;
import com.hq.bm.service.ILightfacilityService;
import com.hq.bm.utils.ConnectionUtil;
import com.hq.bm.utils.FileUtils;
import com.hq.bm.utils.Log;

/**
 * Created by Administrator on 2017/3/9.
 */
@Service
public class LightfacilityServiceImpl extends BaseServiceImpl<Lightfacility>
		implements ILightfacilityService {

	@Autowired
	private LightfacilityMapper lightfacilityMapper;

	public BaseMapper<Lightfacility> getBaseMapper() {
		return lightfacilityMapper;
	}

	public List<Lightfacility> findByPosition(Map<String, Object> map)
			throws ServiceException {
		List<Lightfacility> list;

		try {
			list = lightfacilityMapper.findByPosition(map);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public List<Lightfacility> findByOBDName(String keyword)
			throws ServiceException {
		List<Lightfacility> list;

		try {
			list = lightfacilityMapper.findByOBDName(keyword);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public Lightfacility findPositionById(String id) throws ServiceException {
		Lightfacility lightfacility;

		try {
			lightfacility = lightfacilityMapper.findPositionById(id);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return lightfacility;
	}

	public Page findPageByName(Page page, Map<String, Object> map)
			throws ServiceException {
		try {
			page.setTotal(lightfacilityMapper.getCountForFindPageByName(map));
			map.put("startRowNum", page.getStartRowNum());
			map.put("pageSize", page.getPageSize());
			map.put("endRowNum", page.getEndRowNum());
			page.setRows(lightfacilityMapper.findPageByName(map));
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return page;
	}

	public Page findPageByNameToexportXls(Page page, Map<String, Object> map,
			HttpServletRequest request, HttpServletResponse response)
			throws ServiceException {

		page.setTotal(lightfacilityMapper.getCountForFindPageByName(map));
		map.put("startRowNum", page.getStartRowNum());
		map.put("pageSize", page.getPageSize());
		map.put("endRowNum", page.getEndRowNum());
		page.setRows(lightfacilityMapper.findPageByName(map));
		List<Lightfacility> list = lightfacilityMapper.findPageByName(map);
		HSSFWorkbook workbook = new HSSFWorkbook();// 创建一个Excel文件，当前这个文件在内存中
		HSSFSheet sheet = workbook.createSheet("分区数据");// 创建一个sheet页
		sheet.setColumnWidth(0, 60 * 256);
		sheet.setColumnWidth(1, 35 * 256);
		sheet.setColumnWidth(2, 25 * 256);
		sheet.setColumnWidth(3, 15 * 256);
		sheet.setColumnWidth(4, 15 * 256);
		sheet.setColumnWidth(5, 15 * 256);
		sheet.setColumnWidth(6, 8 * 256);
		sheet.setColumnWidth(7, 8 * 256);
		sheet.setColumnWidth(8, 8 * 256);
		sheet.setColumnWidth(9, 15 * 256);
		HSSFRow headRow = sheet.createRow(0);// 创建标题行
		headRow.createCell(0).setCellValue("设施名称");
		headRow.createCell(1).setCellValue("设施地址");
		headRow.createCell(2).setCellValue("营服中心");
		headRow.createCell(3).setCellValue("分公司");
		headRow.createCell(4).setCellValue("经度");
		headRow.createCell(5).setCellValue("纬度");
		headRow.createCell(6).setCellValue("端口容量");
		headRow.createCell(7).setCellValue("占用端口");
		headRow.createCell(8).setCellValue("空闲端口");
		headRow.createCell(9).setCellValue("录入时间");
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		HSSFDataFormat format = workbook.createDataFormat();
		cellStyle.setDataFormat(format.getFormat("yyyy年m月d日"));
		for (Lightfacility lightfacility : list) {// 循环list，将数据写到Excel文件中
			HSSFRow dataRow = sheet.createRow(sheet.getLastRowNum() + 1);
			dataRow.createCell(0).setCellValue(lightfacility.getOcfName());
			dataRow.createCell(1).setCellValue(lightfacility.getAddress());
			dataRow.createCell(2).setCellValue(lightfacility.getMkName());
			dataRow.createCell(3).setCellValue(lightfacility.getCountyName());
			dataRow.createCell(4).setCellValue(lightfacility.getLongitude());
			dataRow.createCell(5).setCellValue(lightfacility.getLatitude());
			dataRow.createCell(6).setCellValue(lightfacility.getPortXlCount());
			dataRow.createCell(7)
					.setCellValue(lightfacility.getPortXlCountZy());
			dataRow.createCell(8)
					.setCellValue(lightfacility.getPortXlCountKx());
			dataRow.createCell(9).setCellValue(lightfacility.getRecdate());
			dataRow.getCell(9).setCellStyle(cellStyle);
		}
		ServletOutputStream out = null;
		// 文件下载：一个流（输出流）、两个头
		try {
			out = response.getOutputStream();
			Date now = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");// 可以方便地修改日期格式
			String hehe = dateFormat.format(now);
			String filename = "设施资料" + hehe + ".xls";
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

	/**
	 * 导出选择的光设施
	 * 
	 * @param list
	 * @param request
	 * @param response
	 * @throws ServiceException
	 */
	public void exportXlsFromSelRows(List<Lightfacility> list,
			HttpServletRequest request, HttpServletResponse response)
			throws ServiceException {
		HSSFWorkbook workbook = new HSSFWorkbook();// 创建一个Excel文件，当前这个文件在内存中
		HSSFSheet sheet = workbook.createSheet("分区数据");// 创建一个sheet页
		sheet.setColumnWidth(0, 60 * 256);
		sheet.setColumnWidth(1, 35 * 256);
		sheet.setColumnWidth(2, 25 * 256);
		sheet.setColumnWidth(3, 15 * 256);
		sheet.setColumnWidth(4, 15 * 256);
		sheet.setColumnWidth(5, 15 * 256);
		sheet.setColumnWidth(6, 8 * 256);
		sheet.setColumnWidth(7, 8 * 256);
		sheet.setColumnWidth(8, 8 * 256);
		sheet.setColumnWidth(9, 15 * 256);
		HSSFRow headRow = sheet.createRow(0);// 创建标题行
		headRow.createCell(0).setCellValue("设施名称");
		headRow.createCell(1).setCellValue("设施地址");
		headRow.createCell(2).setCellValue("营服中心");
		headRow.createCell(3).setCellValue("分公司");
		headRow.createCell(4).setCellValue("经度");
		headRow.createCell(5).setCellValue("纬度");
		headRow.createCell(6).setCellValue("端口容量");
		headRow.createCell(7).setCellValue("占用端口");
		headRow.createCell(8).setCellValue("空闲端口");
		headRow.createCell(9).setCellValue("录入时间");
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		HSSFDataFormat format = workbook.createDataFormat();
		cellStyle.setDataFormat(format.getFormat("yyyy年m月d日"));
		for (Lightfacility lightfacility : list) {// 循环list，将数据写到Excel文件中
			HSSFRow dataRow = sheet.createRow(sheet.getLastRowNum() + 1);
			dataRow.createCell(0).setCellValue(lightfacility.getOcfName());
			dataRow.createCell(1).setCellValue(lightfacility.getAddress());
			dataRow.createCell(2).setCellValue(lightfacility.getMkName());
			dataRow.createCell(3).setCellValue(lightfacility.getCountyName());
			dataRow.createCell(4).setCellValue(lightfacility.getLongitude());
			dataRow.createCell(5).setCellValue(lightfacility.getLatitude());
			dataRow.createCell(6).setCellValue(lightfacility.getPortXlCount());
			dataRow.createCell(7)
					.setCellValue(lightfacility.getPortXlCountZy());
			dataRow.createCell(8)
					.setCellValue(lightfacility.getPortXlCountKx());
			dataRow.createCell(9).setCellValue(lightfacility.getRecdate());
			dataRow.getCell(9).setCellStyle(cellStyle);
		}
		ServletOutputStream out = null;
		// 文件下载：一个流（输出流）、两个头
		try {
			out = response.getOutputStream();
			Date now = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");// 可以方便地修改日期格式
			String hehe = dateFormat.format(now);
			String filename = "设施资料" + hehe + ".xls";
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
	}

	public Page findObdPageByWhere(Page page, Map<String, Object> map)
			throws ServiceException {
		try {
			page.setTotal(lightfacilityMapper.getCountForFindObdByWhere(map));
			map.put("startRowNum", page.getStartRowNum());
			map.put("pageSize", page.getPageSize());
			map.put("endRowNum", page.getEndRowNum());
			page.setRows(lightfacilityMapper.findObdPageByWhere(map));
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return page;

	}

	public List<Lightfacility> findObdByBuildingAddrID(String id)
			throws ServiceException {
		List<Lightfacility> list;

		try {
			list = lightfacilityMapper.findObdByBuildingAddrID(id);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public List<Lightfacility> findObdByBuildingAddrIDForWeb(String id)
			throws ServiceException {
		List<Lightfacility> list;

		try {
			list = lightfacilityMapper.findObdByBuildingAddrIDForWeb(id);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public Page findOTBByOrg(Page page, Map<String, Object> map)
			throws ServiceException {
		try {
			page.setTotal(lightfacilityMapper.getCountForfindOTBByOrg(map));
			map.put("startRowNum", page.getStartRowNum());
			map.put("pageSize", page.getPageSize());
			map.put("endRowNum", page.getEndRowNum());
			page.setRows(lightfacilityMapper.findOTBByOrg(map));
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return page;
	}

	public List<Lightfacility> findOBDByOTB(Map<String, Object> map)
			throws ServiceException {
		List<Lightfacility> list;

		try {
			list = lightfacilityMapper.findOBDByOTB(map);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public Page findOTBByIDAndName(Page page, Map<String, Object> map)
			throws ServiceException {
		try {
			page.setTotal(lightfacilityMapper
					.getCountForFindOTBByIDAndName(map));
			map.put("startRowNum", page.getStartRowNum());
			map.put("pageSize", page.getPageSize());
			map.put("endRowNum", page.getEndRowNum());
			page.setRows(lightfacilityMapper.findOTBByIDAndName(map));
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return page;
	}

	@Override
	@Log(operationType = "光设施模块", operationName = "保存数据")
	public String save(Lightfacility entity) throws ServiceException {
		return super.save(entity);
	}

	@Override
	@Log(operationType = "光设施模块", operationName = "更新一条数据")
	public boolean update(Lightfacility entity) throws ServiceException {
		return super.update(entity);
	}

	@Override
	@Log(operationType = "光设施模块", operationName = "根据id删除一条数据")
	public boolean deleteById(String id) throws ServiceException {
		return super.deleteById(id);
	}

	public List<Lightfacility> findObdByAddrids(String addrids)
			throws ServiceException {
		List<Lightfacility> list;

		try {
			list = lightfacilityMapper.findObdByAddrids(addrids);
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}

		return list;
	}

	public String checkOtbMoveable(String ocfids) throws ServiceException {
		Connection connection = ConnectionUtil.getConnection();
		String result="";
		try {
			CallableStatement c = connection
					.prepareCall("{call CHECK_OTB_MOVEABLE(?,?)}");
			// 给存储过程的第一个参数设置值
			c.setString(1, ocfids);
			// 给存储过程的第二个参数设置值
			c.registerOutParameter(2, Types.VARCHAR);  //p_defParam
			// 执行存储过程
			c.execute();
			
			result=c.getString(2);
			
			connection.close();
			
			return result;
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}
}
