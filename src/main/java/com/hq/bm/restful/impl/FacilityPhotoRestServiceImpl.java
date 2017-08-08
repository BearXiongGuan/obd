package com.hq.bm.restful.impl;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;

import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import sun.misc.BASE64Decoder;

import com.alibaba.fastjson.JSON;
import com.hq.bm.entity.FacilityPhoto;
import com.hq.bm.restful.IFacilityPhotoRestService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.service.IFacilityPhotoService;
import com.mongodb.DB;
import com.mongodb.Mongo;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * Created by admin on 2017/3/24.
 */
@Path("facilityphoto")
@Component
@Slf4j
public class FacilityPhotoRestServiceImpl extends
		BaseRestServiceImpl<FacilityPhoto> implements IFacilityPhotoRestService {

	@Autowired
	private IFacilityPhotoService facilityPhotoService;

	@Context
	private HttpServletResponse response;

	private FileOutputStream out;

	private BufferedOutputStream bo;

	public IBaseService getService() {
		return facilityPhotoService;
	}

	// 图片存库地址
	private String photo;
	// 缩略图存库地址
	private String thumbnail;

	/**
	 * 建筑物图片上传接口
	 * 
	 * @param jsonStr
	 */
	public String uploadPhoto(String jsonStr) {
		try {
			// 解析参数为对象
			List<FacilityPhoto> facilityPhotos = JSON.parseArray(jsonStr,
					FacilityPhoto.class);
			for (FacilityPhoto f : facilityPhotos) {
				// 解析base64格式字符串为图片文件并上传
				generateImage(f.getPhoto(), f.getFacid());
				f.setThumbnail(thumbnail);
				f.setPhoto(photo);
				System.out.println(photo + "," + thumbnail);
				// 存库
				facilityPhotoService.add(f);
			}
			jsonView.successPack("success");

		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack("", "上传照片失败！");
			log.error("BaseRestServiceImpl getAll is error", e);
		}
		return JSON.toJSONString(jsonView);
	}

	/**
	 * 建筑物图片下载接口
	 * 
	 * @param jsonStr
	 */
	public void downloadPhoto(String fileName) {
		OutputStream out = null;
		Mongo mongo = null;
		try {
			// 创建输出流
			response.setHeader("Pragma", "no-cache");
			response.setHeader("Cache-Control", "no-cache");
			response.addHeader("expires", "0");
			response.setDateHeader("Expires", 0);
			// response.setHeader("Content-Type", getFileContentType(fileName));
			response.setContentType(getFileContentType(fileName));
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();

			mongo = new Mongo("localhost", 27017);
			DB db = mongo.getDB("photo");
			GridFS gfsPhoto = new GridFS(db, "photo_space");

			GridFSDBFile imageForOutput = gfsPhoto.findOne(fileName);

			InputStream imgIS = imageForOutput.getInputStream();

			int length;
			int bufferSize = 1024;
			byte[] buffer = new byte[bufferSize];

			while ((length = imgIS.read(buffer, 0, bufferSize)) > -1) {
				out.write(buffer, 0, length);
			}
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
		} finally {
			if (null != out) {
				try {
					out.flush();

					// 关闭输出流
					out.close();
				} catch (UnauthorizedException unauthorizedException) {
					jsonView.unauthorizedPack();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (null != mongo) {
				mongo.close();
			}
		}
		jsonView.successPack("success");

	}

	// base64字符串转化成图片
	public void generateImage(String imgStr, long facid)
			throws Exception {
		Mongo mongo = null;
		try {
			BASE64Decoder decoder = new BASE64Decoder();
			String fileName = this.generateFileName(imgStr, facid);
			// 生成建筑物图片
			photo = "p_".concat(fileName);
			// 生成建筑物缩略图
			thumbnail = "t_".concat(fileName);
			// base64解码
			imgStr = imgStr.substring(imgStr.lastIndexOf(",") + 1);
			byte[] b = decoder.decodeBuffer(imgStr);
			for (int i = 0; i < b.length; ++i) {
				if (b[i] < 0) {
					// 调整异常数据
					b[i] += 256;
				}
			}
			String folderName = "d:\\tempPhoto";
			File folder = new File(folderName);
			if (folder.exists() && folder.isDirectory()) {

			} else {
				folder.mkdir();
			}

			out = new FileOutputStream(folderName + "/" + photo);
			bo = new BufferedOutputStream(out);

			bo.write(b);
			bo.flush();
			bo.close();
			// 生成大图临时文件
			File tempPhotoFile = new File(folderName + "/" + photo);
			// 生成缩略图临时文件
			File tempThumbFile = new File(folderName + "/" + thumbnail);
			mongo = new Mongo("localhost", 27017);
			DB db = mongo.getDB("photo");

			GridFS gfsPhoto = new GridFS(db, "photo_space");
			// 保存大图
			GridFSInputFile gfsFile = gfsPhoto.createFile(tempPhotoFile);
			gfsFile.setFilename(photo);
			gfsFile.setContentType(getFileContentType(photo));
			gfsFile.save();

			Thumbnails.of(tempPhotoFile).size(200, 200).keepAspectRatio(false)
					.toFile(tempThumbFile);

			// 保存缩略图
			GridFSInputFile gfst = gfsPhoto.createFile(tempThumbFile);
			gfst.setFilename(thumbnail);
			gfst.save();
			// 删除临时文件
			tempPhotoFile.delete();
			tempThumbFile.delete();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != mongo) {
				mongo.close();
			}
		}

	}

	// 随机生成文件名，采用日期时分秒毫秒（例如：照片p_facid_20170327150123，缩略图t_facid_20170327150123）
	public String generateFileName(String imgStr, long facid) {
		String createFileName = "";
		Date sysdate = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY_MM_dd_HH_mm_ss_SSS");
		String fileName = sdf.format(new Date());
		String suffix = "";// 文件后缀名
		if (imgStr.indexOf("data:image/png;base64") != -1) {
			suffix = ".png";
		} else if (imgStr.indexOf("data:image/jpg;base64") != -1) {
			suffix = ".jpg";
		} else if (imgStr.indexOf("data:image/jpeg;base64") != -1) {
			suffix = ".jpeg";
		}
		fileName = ("" + facid).concat("_").concat(fileName);
		createFileName = fileName.concat(suffix);
		return createFileName;
	}

	// 设置图片的contentType
	public String getFileContentType(String fileName) {
		String contentType = "";
		if (fileName.indexOf(".png") != -1) {
			contentType = "image/png";
		} else if (fileName.indexOf(".jpg") != -1) {
			contentType = "image/jpg";
		} else if (fileName.indexOf(".jpeg") != -1) {
			contentType = "image/jpeg";
		}
		return contentType;
	}

	/**
	 * 根据设施类型和facid查询图片列表信息
	 */
	public String getPhotosByTypeAndFacid(String jsonStr) {
		String result = "";
		Map<String, Object> params = null;
		try {
			params = JSON.parseObject(jsonStr,
					new HashMap<String, Object>().getClass());
			List<FacilityPhoto> list = facilityPhotoService.findByMap(params);
			if (list != null && !list.isEmpty()) {
				result = JSON.toJSONStringWithDateFormat(list,
						"yyyy-MM-dd HH:mm:ss");
			}
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error(
					"FacilityPhotoRestServiceImpl getPhotosByTypeAndFacid is error,{jsonStr:"
							+ jsonStr + "}", e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}
}
