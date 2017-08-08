package com.hq.bm.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimerTask;

import lombok.extern.slf4j.Slf4j;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.IntField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.springframework.beans.factory.annotation.Autowired;

import com.hq.bm.entity.Addr;
import com.hq.bm.exception.ServiceException;
import com.hq.bm.service.IAddrService;

//索引  
@Slf4j
public class IncrementIndex extends TimerTask {
	private Directory dir;// 目录
	private String path;// 索引文件的存放路径
	private int searchCount;
	private IndexWriter indexWriter;
	private boolean isOk = false;

	@Autowired
	private IAddrService addrService;

	public IncrementIndex() {
		try {
			PropertiesUtil propertiesUtil = PropertiesUtil
					.newInstance("/config.properties");
			path = propertiesUtil.getValueByName("lucene.index_path");
			searchCount = Integer.valueOf(propertiesUtil
					.getValueByName("address.search_count"));
			File file = new File(path);
			if (file.exists() && file.isDirectory()) {

			} else {
				file.mkdirs();
			}
			dir = FSDirectory.open(file);
		} catch (Exception e) {
			log.error("IncrementIndex error,增量索引构造方法异常", e);
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		try {
			// createIndex();

			IncrementIndex increment = new IncrementIndex();
			IndexSearcher searcher = increment.getIndexSearcher();
			// findAddrsByAddr(searcher, "addr", "测试测试中山君煌休闲中心999房");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 根据类型获取地址信息
	 * 
	 * @param operType
	 * @return
	 * @throws Exception
	 */
	private List<Addr> getAddrsByOperType() throws Exception {
		return addrService.findLogAddrsByOperType();
	}

	/**
	 * 创建增量索引
	 * 
	 * @throws Exception
	 */
	public void createIndex() throws Exception {
		// 判断索引是否已经创建，如果已经创建则只需要在索引上做修改，否则创建索引
		if (!DirectoryReader.indexExists(dir) && !isOk) {
			isOk = true;
			// 创建索引
			IncrementIndex index = new IncrementIndex();
			Date date1 = new Date();
			ResultSet rs = index.getResult();
			System.out.println("开始建立索引。。。。");
			index.indexBuilding(path, rs);
			Date date2 = new Date();
			System.out.println("耗时：" + (date2.getTime() - date1.getTime())
					+ "ms");
		} else {
			// 索引增删改
			operateIndex();
		}

	}

	/**
	 * 索引增删改
	 * 
	 * @throws ServiceException
	 * @throws IOException
	 */

	private void operateIndex() throws ServiceException, IOException {
		try {
			// 查询所有数据
			List<Addr> addAddrs = getAddrsByOperType();
			if (addAddrs.size() == 0) {
				return;
			}
			indexWriter = this.getWriter();
			for (Addr addr : addAddrs) {
				if (addr.getOperType() == 0) {
					// 新增
					Document doc = new Document();// 创建文档
					doc.add(new Field("addrId", addr.getAddrId() + "",
							Field.Store.YES, Field.Index.ANALYZED));
					doc.add(new IntField("grade", addr.getGrade(),
							Field.Store.YES));
					doc.add(new Field("addr", addr.getAddr(), Field.Store.YES,
							Field.Index.ANALYZED));
					indexWriter.addDocument(doc);

				} else if (addr.getOperType() == 1) {
					// 修改
					Document doc = new Document();// 创建文档
					doc.add(new Field("addrId", addr.getAddrId() + "",
							Field.Store.YES, Field.Index.ANALYZED));
					doc.add(new IntField("grade", addr.getGrade(),
							Field.Store.YES));
					doc.add(new Field("addr", addr.getAddr(), Field.Store.YES,
							Field.Index.ANALYZED));
					indexWriter.updateDocument(
							new Term("addrId", "" + addr.getAddrId()), doc);
				} else if (addr.getOperType() == 2) {
					// 删除
					indexWriter.deleteDocuments(new Term("addrId", ""
							+ addr.getAddrId()));
				}
			}
			indexWriter.commit();
			clearLogAddrs(addAddrs.get(0).getLogId(),
					addAddrs.get(addAddrs.size() - 1).getLogId());
		} catch (Exception e) {
			indexWriter.rollback();
			log.error("IncrementIndex.operateIndex() error,索引更新操作异常", e);
			throw new ServiceException("索引更新操作异常", e);
		}
	}

	/**
	 * 多目录多线程查询
	 * 
	 * @param parentPath
	 *            父级索引目录
	 * @param service
	 *            多线程查询
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public IndexSearcher getIndexSearcher() throws IOException,
			InterruptedException {

		DirectoryReader reader = DirectoryReader.open(dir);
		IndexSearcher searcher = new IndexSearcher(reader);
		return searcher;
	}

	/**
	 * 查询数据库，返回结果集
	 * 
	 * @return
	 * @throws Exception
	 */
	public ResultSet getResult() throws Exception {
		Connection conn = ConnectionUtil.getConnection();
		Statement stmt = conn.createStatement();
		String sql = "select a.id,a.grade,a.addr from ADDR a";
		ResultSet rs = stmt.executeQuery(sql
				+ " where a.grade=7 and a.addr is not null");
		return rs;
	}

	public IndexWriter getWriter() throws Exception {
		if (null == indexWriter) {
			Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_44);
			IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_44,
					analyzer);
			indexWriter = new IndexWriter(dir, iwc);
		}
		return indexWriter;
	}

	/**
	 * 创建索引文件
	 * 
	 * @param path
	 * @param rs
	 * @return
	 * @throws ServiceException
	 * @throws IOException
	 */
	public boolean indexBuilding(String path, ResultSet rs)
			throws ServiceException, IOException {
		boolean isCreated = false;

		try {

			indexWriter = this.getWriter();
			dir = FSDirectory.open(Paths.get(path).toFile());// 得到luceneIndex目录

			while (rs.next()) {
				Document doc = new Document();// 创建文档
				doc.add(new Field("addrId", rs.getLong(1) + "",
						Field.Store.YES, Field.Index.ANALYZED));
				doc.add(new IntField("grade", rs.getInt(2), Field.Store.YES));
				doc.add(new Field("addr", rs.getString(3), Field.Store.YES,
						Field.Index.ANALYZED));
				indexWriter.addDocument(doc);
			}
			indexWriter.commit();
			isCreated = true;
		} catch (Exception e) {
			indexWriter.rollback();
			System.out.println("出错了" + e.getClass() + "\n   错误信息为:   "
					+ e.getMessage());
			isCreated = false;
			log.error("IncrementIndex.indexBuilding() error,索引文件初始建造异常", e);
			throw new ServiceException("创建索引失败", e);
		}finally{
			indexWriter.close();
		}
		return isCreated;
	}

	/**
	 * 根据地址全文检索匹配的地址
	 * 
	 * @param indexSearcher
	 * @param addr
	 * @param key
	 * @return
	 */
	public List<Map<String, Object>> findAddrsByAddr(
			IndexSearcher indexSearcher, String addr, String key) {
		System.out.println(key);
		try {
			Date date1 = new Date();
			QueryParser queryParser = new QueryParser(Version.LUCENE_44, addr,
					new StandardAnalyzer(Version.LUCENE_44));
			Query query = queryParser.parse(key);
			TopDocs topDocs = indexSearcher.search(query, searchCount);
			Date date2 = new Date();
			ScoreDoc[] docs = topDocs.scoreDocs;
			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
			for (int i = 0; i < docs.length; i++) {
				Document doc = indexSearcher.doc(docs[i].doc);
				Map<String, Object> item = new HashMap<String, Object>();
				item.put("addrId", doc.getField("addrId").stringValue());
				item.put("addr", doc.getField(addr).stringValue());
				list.add(item);
				System.out.println(doc.getField("addrId").stringValue() + ","
						+ doc.getField(addr).stringValue());
			}

			System.out.println("耗时：" + (date2.getTime() - date1.getTime())
					+ "ms");
			System.out.println("一共命中：" + docs.length + "条记录");
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("IncrementIndex.findAddrsByAddr() 参数：addr=" + addr
					+ ",key=" + key + " error,根据地址关键字查询地址异常", e);
		}
		return null;
	}

	@Override
	public void run() {
		try {
			createIndex();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 清空地址日志表
	 * 
	 * @param minId
	 * @param maxId
	 * @throws ServiceException
	 */
	public void clearLogAddrs(long minId, long maxId) throws ServiceException {
		Connection connection = ConnectionUtil.getConnection();

		try {
			// 创建存储过程的对象
			CallableStatement c = connection
					.prepareCall("{call clear_log_addr(?,?)}");
			// 给存储过程的第一个参数设置值
			c.setLong(1, minId);
			// 给存储过程的第二个参数设置值
			c.setLong(2, maxId);
			// 执行存储过程
			c.execute();
			connection.close();

		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), e);
		}
	}
}