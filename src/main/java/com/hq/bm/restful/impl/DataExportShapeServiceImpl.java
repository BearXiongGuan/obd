package com.hq.bm.restful.impl;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.*;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.hq.bm.entity.Building;
import com.hq.bm.entity.SysParam;
import com.hq.bm.service.ISysParamService;
import lombok.extern.slf4j.Slf4j;

import oracle.net.aso.k;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject; 

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
//import javax.servlet.http.HttpServletRequest;

import com.hq.bm.entity.BaseEntity;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.restful.IDataExportShapeService;
import com.hq.bm.service.IBaseService;
import com.hq.bm.utils.shapefile.InvalidFileException;
import com.hq.bm.utils.shapefile.Point;
import com.hq.bm.utils.shapefile.Record;
import com.hq.bm.utils.shapefile.RecordField;
import com.hq.bm.utils.shapefile.ShapeObject;
import com.hq.bm.utils.shapefile.Shapefile;
import com.hq.bm.utils.shapefile.TableDescription;
import com.hq.bm.utils.shapefile.TableDescriptor;

@Path("expshp")
@Component
@Slf4j
public class DataExportShapeServiceImpl extends BaseRestServiceImpl<BaseEntity> implements IDataExportShapeService {

	@Context
	private ServletContext context;
	
	@Context
	private HttpServletResponse response;
	
	@Context
	private HttpServletRequest request;

	@Autowired
	private ISysParamService sysParamService;
	
	@POST
	@Path("exportGeomShape")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public String exportGeomShape(@FormParam("tabtype") String tabType , @FormParam("serviceurl") String serviceURL ,  
			@FormParam("optype") String optype , @FormParam("featuresdata") String featuresJson) {
		// TODO Auto-generated method stub
		String pathString = "/" ;
		String paramName="";
		featuresJson = featuresJson.replaceAll("@", "\"") ;
		
		String tomcatPathString = context.getRealPath(pathString) ;
		tomcatPathString += "shape\\" ;

		File tempFile1 = new File(tomcatPathString) ;
		if (!tempFile1.exists()){
			tempFile1.mkdir() ;
		}
		else{
			if (!tempFile1.isDirectory()) {
				tempFile1.mkdir() ;
			}
		}

		String strResString = "{\"status\":\"failure\"}";
		
		JSONObject geomObject = JSON.parseObject(featuresJson) ;
		
		//String wgurlString = "http://192.168.1.47:6080/arcgis/rest/services/zsdx/wg/MapServer/0/query";
		String wgurlString = serviceURL ;

		String[] sourceStrArray = wgurlString.split("/");
		for(int i = 0; i < sourceStrArray.length; i++) {
			if(sourceStrArray[i].equals("wg")){
				paramName = "WG_SHAPE_EXPORT";
			}else if(sourceStrArray[i].equals("jzw")){
				paramName = "JZW_SHAPE_EXPORT";
			}else if(sourceStrArray[i].equals("xfbj")){
				paramName = "YFBJ_SHAPE_EXPORT";
			}else if(sourceStrArray[i].equals("yfbj")){
				paramName = "XFBJ_SHAPE_EXPORT";
			}
		}
		try {
			String params = "geometry=" + URLEncoder.encode(geomObject.toJSONString(),"UTF-8");
			
			if (optype.equals("1")) {
				params += "&geometryType=" + URLEncoder.encode("esriGeometryPoint","UTF-8"); 
			}
			else {
				params += "&geometryType=" + URLEncoder.encode("esriGeometryPolygon","UTF-8"); 
			}
			
			params += "&spatialRel=" + URLEncoder.encode("esriSpatialRelIntersects","UTF-8");  
			params += "&outFields="+ URLEncoder.encode("*","UTF-8"); 
			params += "&returnGeometry="+ URLEncoder.encode("true","UTF-8");
			params += "&f=" + URLEncoder.encode("pjson","UTF-8"); 
			
			wgurlString += "?" + params ;
			URL url = new URL(wgurlString);
			HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
			httpConn.setRequestMethod("GET"); 
			InputStream inStrm1 = httpConn.getInputStream();    
			ByteArrayOutputStream outStream1 = new ByteArrayOutputStream();
	        byte[] buffer1 = new byte[1024];
	        int len1 = 0;
	        while( (len1 = inStrm1.read(buffer1)) !=-1 ){
	            outStream1.write(buffer1, 0, len1);
	        }
	        byte[] data1 = outStream1.toByteArray();//网页的二进制数据
	        outStream1.close();
	        
			strResString = new String(data1 , "UTF-8") ;
			
			HashMap<String, FieldDefine> fieldsMap = new HashMap<String, FieldDefine>() ;
			JSONObject jsonObject = JSONObject.parseObject(strResString) ;
			if (jsonObject.containsKey("error")) {
				return strResString ;
			}
			
			JSONObject fieldsJsonObject = new JSONObject() ;
			fieldsJsonObject.put("fields", jsonObject.get("fields")) ;
			JSONArray  fieldsJsonArr = fieldsJsonObject.getJSONArray("fields") ;
            //过滤掉不需要的字段
			SysParam list = sysParamService.findOne(paramName);
			if(list !=null) {
				sourceStrArray = list.getParamValue().split(",");
				for (int i = 0; i < fieldsJsonArr.size(); i++) {
					JSONObject ob = (JSONObject) fieldsJsonArr.get(i);
					for (int j = 0; j < sourceStrArray.length; j++) {
						if (ob.getString("name").equals(sourceStrArray[j])) {
							fieldsJsonArr.remove(i);
							--i;
							continue;
						}
					}
				}
			}


			JSONObject featureJsonObject = new JSONObject() ;
			featureJsonObject.put("features", jsonObject.get("features")) ;
			JSONArray  featuresJsonArr = featureJsonObject.getJSONArray("features") ;

			String filenameString = "test" ;
			Date sysdate = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMDDHHmmss");
			filenameString = "ExportShape_" + sdf.format(sysdate);
			
			strResString = createShapeFileZip(tomcatPathString , filenameString , fieldsJsonArr , featuresJsonArr) ;
			
			downLoadShpapeZip(tomcatPathString, filenameString);
			
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//log.error("DataExportShapeServiceImpl exportWGShape is error,{jsonStr:" + jsonStr + "}", e);
			return strResString ;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//log.error("DataExportShapeServiceImpl exportWGShape is error,{jsonStr:" + jsonStr + "}", e);
			return strResString ;
		}

		return strResString;
	}
	
	private String downLoadShpapeZip(String shpDirString , String shpNameString){
		String resString = "{\"status\":\"failure\"}" ;
		
		String filename = shpNameString + ".zip" ;
		String zipFileString = shpDirString + filename ;
		
		File zipFile = new File(zipFileString) ;
		if (zipFile.exists()) {
			long len = zipFile.length() ;
			//response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
			//HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			
			String typeString = request.getServletContext().getMimeType(filename) ;
			response.setContentType(typeString);
            response.setHeader("content-disposition", "attachment;filename=" + filename);
			
			try {
				FileInputStream fis = new FileInputStream(zipFile);
				BufferedInputStream buff = new BufferedInputStream(fis);
				byte[] b = new byte[1024];    
				long k = 0;
				OutputStream myout = response.getOutputStream();
				while (k < zipFile.length()) {
					int j = buff.read(b, 0, 1024);
					k += j;
					myout.write(b, 0, j);
				}
				myout.flush();
				myout.close();
				
				resString = "{\"status\":\"sucess\"}" ;
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return resString ;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return resString ;
			}
			
		}
		
		return resString ;
	}
	
	/**
	 * 
	 * @param shpDirString   文件保存路径
	 * @param shpNameString   文件名称，不包括.shp等
	 * @param newFeaturesArray   feature集合，包括属性数据和几何数据
	 */
	private String createShapeFileZip(String shpDirString , String shpNameString,
			JSONArray  fieldsJsonArr , JSONArray  featuresJsonArr){
		String reString = "{\"status\":\"failure\"}" ;
		
		TableDescription fieldsDescription = new TableDescription() ;       //属性字段
		int fieldsNum = fieldsJsonArr.size();
		for (int i = 0; i < fieldsNum; i++) {
			JSONObject fieldJsonObject = fieldsJsonArr.getJSONObject(i) ;
			if(fieldJsonObject != null){
				String nameString = "" ;
				String aliasString = "" ;
				String typeString =  "";
				int fieldLen = -1 ;
				if (fieldJsonObject.containsKey("name")) {
					nameString = fieldJsonObject.getString("name") ;
					
					if(nameString.equals("SHAPE.AREA") || nameString.equals("SHAPE.LEN") || 
							nameString.equals("OBJECTID") || nameString.equals("OBJECTID_1")){
						continue ;
					}
				}
				if (fieldJsonObject.containsKey("alias")) {
					aliasString = fieldJsonObject.getString("alias") ;
				}
				if (fieldJsonObject.containsKey("type")) {
					typeString = fieldJsonObject.getString("type") ;
				}
				if (fieldJsonObject.containsKey("length")) {
					fieldLen = fieldJsonObject.getIntValue("length") ;
				}
				
				if(typeString.equals("esriFieldTypeString")){
					TableDescriptor tempFieldDescriptor  = new TableDescriptor(nameString) ;
					tempFieldDescriptor.setWidth(fieldLen) ;
					fieldsDescription.addTableDescriptor(tempFieldDescriptor) ;
				}else if (typeString.equals("esriFieldTypeDouble")) {
					//TableDescriptor tempFieldDescriptor  = new TableDescriptor(nameString , 103) ;   //暂时将esriFieldTypeDouble输出为string型
					TableDescriptor tempFieldDescriptor  = new TableDescriptor(nameString) ;
					tempFieldDescriptor.setWidth(100) ;
					fieldsDescription.addTableDescriptor(tempFieldDescriptor) ;
				}else if (typeString.equals("esriFieldTypeInteger") || typeString.equals("esriFieldTypeSmallInteger")) {
					TableDescriptor tempFieldDescriptor  = new TableDescriptor(nameString , 102) ;
					fieldsDescription.addTableDescriptor(tempFieldDescriptor) ;
				}
				
			}
		}
		
		String filenameString = shpDirString + shpNameString ;
		try {
			//Shapefile shapeReader = new Shapefile("D:\\whb\\xfbj");
			//int count = shapeReader.getShapeObjectCount() ;
			
			Shapefile shapeCreator = new Shapefile(Shapefile.SHAPETYPE_POLYGON) ;
			shapeCreator.setTableDescription(fieldsDescription) ;
			//shapeCreator.setType(Shapefile.SHAPETYPE_POLYGON);
			
			int featuresNum = featuresJsonArr.size() ;
			for (int i = 0; i < featuresNum ; i++) {
				JSONObject featuretempJsonObject = featuresJsonArr.getJSONObject(i) ;
				if (featuretempJsonObject != null) {
					Record attrsRecord = new Record() ;    //属性数据
					JSONObject attrsObject = featuretempJsonObject.getJSONObject("attributes") ;
					if (attrsObject != null) {
						Set<String> keySet = attrsObject.keySet() ;
						Iterator<String> iter = keySet.iterator(); 
						while (iter.hasNext()) {
							String keyString = iter.next() ;
							if (fieldsDescription.contains(keyString)) {
								String valueString = attrsObject.getString(keyString) ;
								if(valueString == null)
								{
									valueString = " " ;
								}
								RecordField attRecordField = new RecordField(keyString , valueString) ;
								attrsRecord.addField(attRecordField) ;
							}
							
						}
					}
					
					//ShapeObject shapeObject = new ShapeObject(ShapeObject.POLYGON) ;    //几何数据
					
					ShapeObject shapeObject = new ShapeObject(5) ;
					JSONObject geomObject = featuretempJsonObject.getJSONObject("geometry");
					if(geomObject != null){
						JSONArray ringsArray = geomObject.getJSONArray("rings") ;
						int jsSize = ringsArray.size() ;
						for (int k = 0; k < jsSize ; k++) {
							String ringsString = ringsArray.getString(k) ;
							String str1 = ringsString.substring(2 , ringsString.length()-2) ;
							str1 = str1.trim() ;
							String[] strArr = str1.split("\\],\\[") ;   //[113.589145691621,22.5922753361387],[113.604390855055,22.5875734214771]
							
							for (int j = 0; j < strArr.length; j++) {
								String str2 = strArr[j] ;
								String[] strArr1 = str2.split(",") ;
								if(strArr1.length == 2){
									String lonString = strArr1[0] ;   //经度
									String latString = strArr1[1] ;   //纬度
									double lon = Double.parseDouble(lonString) ;
									double lat = Double.parseDouble(latString) ;
									Point point = new Point(lon , lat) ;
									shapeObject.addPoint(point) ;
								}
							}
							
							if (k != jsSize-1) {
								shapeObject.addPart(strArr.length) ;
							}
						}
					}
					
					shapeObject.setRecord(attrsRecord) ;
					shapeCreator.addShapeObject(shapeObject) ;
				}
			}
			shapeCreator.computeExtents() ;
			shapeCreator.write(filenameString) ;
			
			String shpFileString = filenameString + ".shp" ;
			String shxFileString = filenameString + ".shx" ;
			String dbfFileString = filenameString + ".dbf" ;
			String prjFileString = filenameString + ".prj" ;
			
			File shpFile = new File(shpFileString) ;
			if (!shpFile.exists()) {
				return reString ;
			}
			
			File shxFile = new File(shxFileString);
			if (!shxFile.exists()) {
				return reString ;
			}
			
			File dbfFile = new File(dbfFileString) ;
			if (!dbfFile.exists()) {
				return reString ;
			}
			
			String zipFileString = filenameString + ".zip" ;
			File zipFile = new File(zipFileString) ;
			InputStream inputStream = null ;
			ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(zipFile)) ;
			zipOutputStream.setComment("") ;
			
			inputStream = new FileInputStream(shpFile) ;
			zipOutputStream.putNextEntry(new ZipEntry(shpFile.getName())) ;
			int temp = 0 ;
			while((temp = inputStream.read()) != -1){
				zipOutputStream.write(temp) ;
			}
			inputStream.close() ;
			
			inputStream = new FileInputStream(shxFile) ;
			zipOutputStream.putNextEntry(new ZipEntry(shxFile.getName())) ;
			temp = 0 ;
			while((temp = inputStream.read()) != -1){
				zipOutputStream.write(temp) ;
			}
			inputStream.close() ;
			
			inputStream = new FileInputStream(dbfFile) ;
			zipOutputStream.putNextEntry(new ZipEntry(dbfFile.getName())) ;
			temp = 0 ;
			while((temp = inputStream.read()) != -1){
				zipOutputStream.write(temp) ;
			}
			inputStream.close() ;
			
			File prjFile = new File(prjFileString) ;
			if (prjFile.exists()) {
				inputStream = new FileInputStream(prjFile) ;
				zipOutputStream.putNextEntry(new ZipEntry(prjFile.getName())) ;
				temp = 0 ;
				while((temp = inputStream.read()) != -1){
					zipOutputStream.write(temp) ;
				}
				inputStream.close() ;
			}
			
			zipOutputStream.close() ;
			
			reString = "{\"status\":\"sucess\"}" ;			
		} catch (InvalidFileException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//log.error("DataExportShapeServiceImpl createShapeFile is error ", e);
			return reString ;
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//log.error("DataExportShapeServiceImpl createShapeFile is error ", e);
			return reString ;
		}
		
		return reString ;
	}
	
	private String generateGeojonFile(String pathString , String resJsonString){
		String jsonFilePathString = "" ;
		File tempFile = new File(pathString) ;
		try {
			boolean isSucess = tempFile.createNewFile() ;
			if(isSucess){
				FileWriter fw = new FileWriter(pathString);
				fw.write(resJsonString) ;
				fw.close() ;
				jsonFilePathString = pathString ;
			}
			else{
				return jsonFilePathString ;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return jsonFilePathString ;
	}
	
	private String generateShapefile1(String jsonPathString , String shapePathString){
		String strShapeFileURL = ""  ;
		
		/*ogr.RegisterAll();
        gdal.SetConfigOption("GDAL_FILENAME_IS_UTF8","YES");   //支持中文路径
        gdal.SetConfigOption("SHAPE_ENCODING","");    //支持中文字段
        
        DataSource ds = ogr.Open(jsonPathString , 0);
        if (ds == null)
        {
            System.out.println("打开文件失败！" );
            return strShapeFileURL;
        }
        
        String strVectorFile = "" ;
        String strDriverName = "ESRI Shapefile";
        Driver dv = ogr.GetDriverByName(strDriverName);
        if (dv == null) {
            System.out.println(strVectorFile + " 驱动不可用！\n");
            return strShapeFileURL;
        }
        
        //DataSource oDS = dv.CreateDataSource(shapePathString, null);
        
        dv.CopyDataSource(ds, shapePathString);*/
        
		return strShapeFileURL ;
	}
	
	private String generateShapeFile(String strShapePath , String strResJson){
		String strShapeFileURL = ""  ;
		
		//GeoJSONReader jsonReader = new GeoJSONReader(ctx, factory)
		/*JtsSpatialContext cxtContext = initContext() ;
		ShapeReader geojsonReader = cxtContext.getFormats().getGeoJsonReader() ;
		ShapeWriter shapeWriter = cxtContext.getFormats().getWriter(ShapeIO.POLY) ;
		
		try {
			File tempFile = new File(strShapePath) ;
			boolean isSucess = tempFile.createNewFile() ;
			Writer writer = new FileWriter(strShapePath) ;
			Shape v = geojsonReader.read(strResJson) ;
			//shapeWriter.write(output, shape);
			
			shapeWriter.write(writer, v) ;
		} catch (InvalidShapeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		
		return strShapeFileURL ;
	}

	@Override
	public IBaseService<BaseEntity> getService() {
		// TODO Auto-generated method stub
		return null;
	}

	@POST
	@Path("exportAttrShape")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("application/octet-stream")
	public String exportAttrShape(@FormParam("tabtype") String tabType, @FormParam("serviceurl") String serviceURL , 
			@FormParam("optype") String optype,
			@FormParam("featuresdata") String featuresdata)
			throws ServiceException {
		// TODO Auto-generated method stub
		String strResString = "{\"status\":\"failure\"}";
		
		String pathString = "/" ;
		String paramName="";
		String tomcatPathString = context.getRealPath(pathString) ;
		tomcatPathString += "shape\\" ;

		File tempFile1 = new File(tomcatPathString) ;
		if (!tempFile1.exists()){
			tempFile1.mkdir() ;
		}
		else{
			if (!tempFile1.isDirectory()) {
				tempFile1.mkdir() ;
			}
		}
		String wgurlString = serviceURL ;
		String[] sourceStrArray = wgurlString.split("/");
		for(int i = 0; i < sourceStrArray.length; i++) {
			if(sourceStrArray[i].equals("wg")){
				paramName = "WG_SHAPE_EXPORT";
			}else if(sourceStrArray[i].equals("jzw")){
				paramName = "JZW_SHAPE_EXPORT";
			}else if(sourceStrArray[i].equals("xfbj")){
				paramName = "YFBJ_SHAPE_EXPORT";
			}else if(sourceStrArray[i].equals("yfbj")){
				paramName = "XFBJ_SHAPE_EXPORT";
			}
		}
		
		try {
			String whereString = "" ;
			String [] strArrStrings = featuresdata.split(",") ;
			if (optype.equals("1")) {
				for (int i = 0; i < strArrStrings.length; i++) {
					String strmmString = "COUNTY='" + strArrStrings[i] + "'" ;
					if (i == 0) {
						whereString += strmmString ;
					}
					else{
						whereString += " OR " + strmmString ;
					}
				}
			}
			else if (optype.equals("2")) {
				for (int i = 0; i < strArrStrings.length; i++) {
					String strmmString = "VILLAGE='" + strArrStrings[i] + "'" ;
					if (i == 0) {
						whereString += strmmString ;
					}
					else{
						whereString += " OR " + strmmString ;
					}
				}
			}
			else if (optype.equals("3") || optype.equals("4")) {
				for (int i = 0; i < strArrStrings.length; i++) {
					String strmmString = "FACID='" + strArrStrings[i] + "'" ;
					if (i == 0) {
						whereString += strmmString ;
					}
					else{
						whereString += " OR " + strmmString ;
					}
				}
			}
			
			String params = "where=" + URLEncoder.encode(whereString,"UTF-8");
			params += "&outFields="+ URLEncoder.encode("*","UTF-8"); 
			params += "&returnGeometry="+ URLEncoder.encode("true","UTF-8");
			params += "&f=" + URLEncoder.encode("pjson","UTF-8"); 
			
			String strURL = serviceURL ;
			strURL += "?" + params ;
			URL url = new URL(strURL);
			HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
			httpConn.setRequestMethod("GET"); 
			InputStream inStrm1 = httpConn.getInputStream();    
			ByteArrayOutputStream outStream1 = new ByteArrayOutputStream();
	        byte[] buffer1 = new byte[1024];
	        int len1 = 0;
	        while( (len1 = inStrm1.read(buffer1)) !=-1 ){
	            outStream1.write(buffer1, 0, len1);
	        }
	        byte[] data1 = outStream1.toByteArray();//网页的二进制数据
	        outStream1.close();
	        
			strResString = new String(data1 , "UTF-8") ;
			
			//HashMap<String, FieldDefine> fieldsMap = new HashMap<String, FieldDefine>() ;
			JSONObject jsonObject = JSONObject.parseObject(strResString) ;
			if (jsonObject.containsKey("error")) {
				return strResString ;
			}
			JSONObject fieldsJsonObject = new JSONObject() ;
			fieldsJsonObject.put("fields", jsonObject.get("fields")) ;
			JSONArray  fieldsJsonArr = fieldsJsonObject.getJSONArray("fields") ;

			SysParam list = sysParamService.findOne(paramName);
			if(list !=null) {
				sourceStrArray = list.getParamValue().split(",");
				for (int i = 0; i < fieldsJsonArr.size(); i++) {
					JSONObject ob = (JSONObject) fieldsJsonArr.get(i);
					for (int j = 0; j < sourceStrArray.length; j++) {
						if (ob.getString("name").equals(sourceStrArray[j])) {
							fieldsJsonArr.remove(i);
							--i;
							continue;
						}
					}
				}
			}
			
			JSONObject featureJsonObject = new JSONObject() ;
			featureJsonObject.put("features", jsonObject.get("features")) ;
			JSONArray  featuresJsonArr = featureJsonObject.getJSONArray("features") ;
			
			String filenameString = "test" ;
			Date sysdate = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMDDHHmmss");
			filenameString = "ExportShape_" + sdf.format(sysdate);
			
			strResString = createShapeFileZip(tomcatPathString , filenameString , fieldsJsonArr , featuresJsonArr) ;
			
			downLoadShpapeZip(tomcatPathString, filenameString);
			
			strResString = "{\"status\":\"success\"}";
			
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//log.error("DataExportShapeServiceImpl exportWGShape is error,{jsonStr:" + jsonStr + "}", e);
			return strResString ;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//log.error("DataExportShapeServiceImpl exportWGShape is error,{jsonStr:" + jsonStr + "}", e);
			return strResString ;
		}
		
		return strResString ;
	}
	
}

//字段定义
class FieldDefine{
	private String nameString;
	private String aliasString ;
	private String esriTypeString ;
	private int length ;
	
	public FieldDefine(){
		nameString = "" ;
		aliasString = "" ;
		esriTypeString = "" ;
		length = -1 ;
	}
	
	public FieldDefine(String name , String alias , String esriType , int len){
		nameString = name ;
		aliasString = alias ;
		esriTypeString = esriType ;
		length = len ;
	}
	
	public String getName(){
		return nameString ;
	}
	public void setName(String name){
		nameString = name ;
	}
	
	public String getAlias(){
		return aliasString ;
	}
	public void setAlias(String alias){
		aliasString = alias ;
	}
	
	public String getEsriType(){
		return esriTypeString ;
	}
	public void setEsriType(String esriType){
		esriTypeString = esriType ;
	}
	
	public int getLength(){
		return length;
	}
	public void setLength(int len){
		length = len ;
	}
}
