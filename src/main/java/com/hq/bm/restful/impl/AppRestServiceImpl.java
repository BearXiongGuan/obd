package com.hq.bm.restful.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.hq.bm.entity.App;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.IAppRestService;
import com.hq.bm.service.IAppService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.utils.PropertiesUtil;
import com.mongodb.DB;
import com.mongodb.DBCursor;
import com.mongodb.Mongo;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * Created by Administrator on 2017/4/17.
 */
@Path("app")
@Component
@Slf4j
public class AppRestServiceImpl extends BaseRestServiceImpl<App> implements
		IAppRestService {

	@Autowired
	private IAppService appService;

	@Context
	HttpServletRequest request;

	@Context
	private HttpServletResponse response;

	public IBaseService getService() {
		return appService;
	}

	public String getNewApp() {
		String result = "";

		try {
			App app = this.appService.getNew();

			result = JSON
					.toJSONStringWithDateFormat(app, "yyyy-MM-dd HH:mm:ss");

			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("AppRestServiceImpl getNewApp is error", e);
		}

		return result;
	}

	public String uploadApp(String id) {
		App app = new App();
		// 消息提示
		String message = "";
		Mongo mongo = null;
		try {
			// 使用Apache文件上传组件处理文件上传步骤：
			// 1、创建一个DiskFileItemFactory工厂
			DiskFileItemFactory factory = new DiskFileItemFactory();
			// 2、创建一个文件上传解析器
			ServletFileUpload upload = new ServletFileUpload(factory);
			// 解决上传文件名的中文乱码
			upload.setHeaderEncoding("UTF-8");
			// 3、判断提交上来的数据是否是上传表单的数据
			if (!ServletFileUpload.isMultipartContent(request)) {
				// 按照传统方式获取数据
			}
			// 4、使用ServletFileUpload解析器解析上传数据，解析结果返回的是一个List<FileItem>集合，每一个FileItem对应一个Form表单的输入项
			List<FileItem> list = upload.parseRequest(request);
			for (FileItem item : list) {
				// 如果fileitem中封装的是普通输入项的数据
				if (item.isFormField()) {
					String name = item.getFieldName();
					// 解决普通输入项的数据的中文乱码问题
					String value = item.getString("UTF-8");
					// value = new String(value.getBytes("iso8859-1"),"UTF-8");
					if (name.equals("version")) {
						app.setVersion(value);
					}
					if (name.equals("updateDesc")) {
						app.setUpdateDesc(value);
					}
				} else {// 如果fileitem中封装的是上传文件
					// 得到上传的文件名称，
					String filename = item.getName();
					long size = item.getSize();
					app.setSize(size);
					if (filename == null || filename.trim().equals("")) {
						continue;
					}
					// 注意：不同的浏览器提交的文件名是不一样的，有些浏览器提交上来的文件名是带有路径的，如：
					// c:\a\b\1.txt，而有些只是单纯的文件名，如：1.txt
					// 处理获取到的上传文件的文件名的路径部分，只保留文件名部分
					filename = filename
							.substring(filename.lastIndexOf("\\") + 1);
					// String fileprename = filename.substring(0,
					// filename.indexOf('.'));
					// String filesuffixname = filename.substring(filename
					// .lastIndexOf('.'));

					// 获取item中的上传文件的输入流
					String folderName = "d:\\tempApp";
					File folder = new File(folderName);
					if (folder.exists() && folder.isDirectory()) {

					} else {
						folder.mkdir();
					}
					File appFile = new File(folder, filename);
					item.write(appFile);
					mongo = new Mongo("127.0.0.1", 27017);
					DB db = mongo.getDB("photo");
					GridFS gfsApp = new GridFS(db, "app");
					// 保存大图
					GridFSInputFile gfsFile = gfsApp.createFile(appFile);
					gfsFile.setFilename(filename);
					gfsFile.save();
					app.setUrl(PropertiesUtil.newInstance("/config.properties")
							.getValueByName("project.rootPath")
							+ "restful/app/downloadApp/" + filename);
					appService.insert(app);

					// 删除处理文件上传时生成的临时文件
					item.delete();
					DBCursor cursor = gfsApp.getFileList();
					while (cursor.hasNext()) {
						System.out.println(cursor.next());
					}
					message = "app信息上传成功！";
				}
			}

			jsonView.successPack(message);
		} catch (Exception e) {
			jsonView.failPack("", "上传app失败！");
			log.error("appRestService uploadApp is error,{id:" + id + "}", e);
		} finally {
			if (null != mongo) {
				mongo.close();
			}
		}

		return JSON.toJSONString(jsonView);
	}

	public void downloadApp(String fileName) {
		OutputStream out = null;
		Mongo mongo = null;
		try {
			// 创建输出流
			response.setHeader("Pragma", "no-cache");
			response.setHeader("Cache-Control", "no-cache");
			response.addHeader("expires", "0");
			response.setDateHeader("Expires", 0);
			// response.setHeader("Content-Type", getFileContentType(fileName));
			// response.setContentType(getFileContentType(fileName));
			response.setCharacterEncoding("UTF-8");
			out = response.getOutputStream();

			mongo = new Mongo("127.0.0.1", 27017);
			DB db = mongo.getDB("photo");
			GridFS gfsApp = new GridFS(db, "app");

			GridFSDBFile appForOutput = gfsApp.findOne(fileName);

			InputStream appIS = appForOutput.getInputStream();

			int length;
			int bufferSize = 1024;
			byte[] buffer = new byte[bufferSize];

			while ((length = appIS.read(buffer, 0, bufferSize)) > -1) {
				out.write(buffer, 0, length);
			}

		} catch (Exception e) {
			jsonView.failPack(e);
		} finally {
			if (null != out) {
				try {
					out.flush();

					// 关闭输出流
					out.close();
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

	public String getAllApp() {
		String result = "";

		try {
			List<App> list = this.getService().findAll();
			result = JSON.toJSONStringWithDateFormat(list,
					"yyyy-MM-dd HH:mm:ss");
			jsonView.successPack(result);
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(e);
			log.error("BaseRestServiceImpl getAll is error", e);
		}

		// result = JSON.toJSONString(jsonView);

		return result;
	}

	public String check(String jsonStr) {
		String result;
		jsonView.setContent("");
		jsonView.setStatus("");

		App app = JSON.parseObject(jsonStr, this.getEntityClass());
		try {
			if (appService.isVersionExist(app.getVersion()) != 0)
				jsonView.setMessage("exist");
			else {
				jsonView.setMessage("notexist");
			}
		} catch (ServiceException e) {
			String message = e.getMessage();

			if (StringUtils.isBlank(message)) {
				message = "保存数据失败！";
			}

			jsonView.failPack("false", message);

			log.error("BaseRestServiceImpl save is error,{jsonStr:" + jsonStr
					+ "}," + e.getMessage(), e);
		}

		result = JSON.toJSONString(jsonView);

		return result;
	}

	public String deleteAppByUrl(String url) {
		boolean flag = false;
		Mongo mongo = null;
		try {
			String apkFileName = url.substring(url.lastIndexOf("/") + 1);

			// 删除表中数据
			flag = appService.deleteByUrl(url);

			// 删除mongodb中的apk文件
			mongo = new Mongo("127.0.0.1", 27017);
			DB db = mongo.getDB("photo");
			GridFS gfsApp = new GridFS(db, "app");
			gfsApp.remove(apkFileName);
			mongo.close();
			jsonView.successPack(JSON.toJSONString(flag));
		} catch (UnauthorizedException unauthorizedException) {
			jsonView.unauthorizedPack();
		} catch (Exception e) {
			jsonView.failPack(JSON.toJSONString(flag));
			log.error("BaseRestServiceImpl deleteAppByUrl is error,{url:" + url
					+ "}", e);
		} finally {
			if (null != mongo) {
				mongo.close();
			}
		}

		return JSON.toJSONString(jsonView);
	}
}