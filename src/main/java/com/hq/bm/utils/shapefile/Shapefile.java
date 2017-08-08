package com.hq.bm.utils.shapefile;

/**
 * 读写shapefile的入口类
 */

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.EOFException;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Iterator;

//import com.linuxense.javadbf.* ;
//import com.mongodb.client.model.Field;

public class Shapefile {
	protected TableDescription tblDescription = new TableDescription();
	protected BoundingBox bBox = new BoundingBox();
	private int fType;
	private ArrayList<ShapeObject> shpStore = new ArrayList<ShapeObject>();
	private ArrayList<String> wMesg = new ArrayList<String>();

	public static final int SHAPETYPE_POINT = 1;
	public static final int SHAPETYPE_MULTIPOINT = 8;
	public static final int SHAPETYPE_POLYLINE = 3;
	public static final int SHAPETYPE_POLYGON = 5;
	public static final int FIELDTYPE_CHARACTER = 101;
	public static final int FIELDTYPE_NUMBER = 102;
	public static final int FIELDTYPE_FLOAT = 103;
	public static final int FIELDTYPE_DATE = 104;
	public static final int FIELDTYPE_LOGICAL = 105;

	public Shapefile() {
	}

	public Shapefile(int paramInt) {
		this.fType = paramInt;
	}

	public Shapefile(String shpFileName) throws InvalidFileException,
			IOException {
		FileInputStream shpReader = null;
		FileInputStream shxReader = null;
		FileInputStream dbfReader = null;
		shpReader = new FileInputStream(shpFileName + ".shp");
		try {
			shxReader = new FileInputStream(shpFileName + ".shx");
		} catch (FileNotFoundException localFileNotFoundException1) {
			shxReader = null;
		}
		try {
			dbfReader = new FileInputStream(shpFileName + ".dbf");
		} catch (FileNotFoundException localFileNotFoundException2) {
			dbfReader = null;
		}
		createNewTable(shpReader, shxReader, dbfReader);
	}

	public Shapefile(InputStream shpReader, InputStream shxReader,
			InputStream dbfReader) throws InvalidFileException, IOException {
		createNewTable(shpReader, shxReader, dbfReader);
	}

	private void createNewTable(InputStream shpReader, InputStream shxReader,
			InputStream dbfReader) throws InvalidFileException, IOException {
		DataInputStream shpInput = null;
		DataInputStream shxInput = null;
		DataInputStream dbfInput = null;
		shpInput = new DataInputStream(shpReader);
		shxInput = new DataInputStream(shxReader);
		boolean isDbfReader = true;
		boolean isShxReader = true;
		this.wMesg = new ArrayList<String>();
		if (dbfReader == null) {
			isDbfReader = false;
			this.wMesg.add("Unable to access the records stream for reading. "
					+ "The shapefile will lack record attributes.");
		} else {
			dbfInput = new DataInputStream(dbfReader);
		}
		if (shxReader == null) {
			isShxReader = false;
			this.wMesg
					.add(new String(
							"Unable to access the index stream for reading. "
									+ "This will not affect the accuracy of the shapefile."));
		} else {
			shxInput = new DataInputStream(shxReader);
		}
		int k = shpInput.readInt();
		if (k != 9994)
			throw new InvalidFileException(k + " is not a valid file code.");
		shpInput.skipBytes(20);
		shpInput.skipBytes(4);
		int m = swapBytes(shpInput.readInt());
		if (m != 1000)
			throw new InvalidFileException(m + " is not a valid file version.");
		this.fType = swapBytes(shpInput.readInt());
		this.bBox.setXMin(swapBytes(shpInput.readDouble()));
		this.bBox.setYMin(swapBytes(shpInput.readDouble()));
		this.bBox.setXMax(swapBytes(shpInput.readDouble()));
		this.bBox.setYMax(swapBytes(shpInput.readDouble()));
		shpInput.skip(32L);
		ShapeObject shpObj = null;
		do
			switch (this.fType) {
			case 1:
				shpObj = creatPoint(shpInput);
				if (shpObj == null)
					continue;
				this.shpStore.add(shpObj);
				break;
			case 8:
				shpObj = creatMultiPoint(shpInput);
				if (shpObj == null)
					continue;
				this.shpStore.add(shpObj);
				break;
			case 3:
				shpObj = creatPolyline(shpInput);
				if (shpObj == null)
					continue;
				this.shpStore.add(shpObj);
				break;
			case 5:
				shpObj = createPolygon(shpInput);
				if (shpObj == null)
					continue;
				this.shpStore.add(shpObj);
			case 2:
			case 4:
			case 6:
			case 7:
			}
		while (shpObj != null);
		if (isDbfReader) {
			ArrayList<Record> records = new ArrayList<Record>();
			creatDbfFile(dbfInput, getShapeObjectCount(), this.tblDescription,
					records);
			for (int n = 0; n < getShapeObjectCount(); n++) {
				shpObj = (ShapeObject) this.shpStore.get(n);
				shpObj.setRecord((Record) records.get(n));
			}
		}
	}

	private ShapeObject creatPoint(DataInputStream shpInput) throws IOException {
		try {
			shpInput.readInt();
			shpInput.readInt();
			int k = swapBytes(shpInput.readInt());
			if (k != 1)
				this.wMesg.add(new String(
						"Invalid shape type in shape record: Shape record type "
								+ k + " in file of type " + getType()));
			ShapeObject shpObj = new ShapeObject(1);
			Point pt = new Point();
			pt.setX(swapBytes(shpInput.readDouble()));
			pt.setY(swapBytes(shpInput.readDouble()));
			shpObj.addPoint(pt);
			return shpObj;
		} catch (EOFException ex) {
		}
		return null;
	}

	private ShapeObject creatPolyline(DataInputStream shpInput)
			throws IOException {
		try {
			shpInput.readInt();
			shpInput.readInt();
			int k = swapBytes(shpInput.readInt());
			if (k != 3)
				this.wMesg.add(new String(
						"Invalid shape type in shape record: Shape record type "
								+ k + " in file of type " + getType()));
			ShapeObject shpObj = new ShapeObject(3);
			BoundingBox objBox = new BoundingBox();
			objBox.setXMin(swapBytes(shpInput.readDouble()));
			objBox.setYMin(swapBytes(shpInput.readDouble()));
			objBox.setXMax(swapBytes(shpInput.readDouble()));
			objBox.setYMax(swapBytes(shpInput.readDouble()));
			shpObj.setBoundingBox(objBox);
			int m = swapBytes(shpInput.readInt());
			int n = swapBytes(shpInput.readInt());
			for (int i = 0; i < m; i++) {
				shpObj.addPart(swapBytes(shpInput.readInt()));
			}
			for (int i = 0; i < n; i++) {
				Point localPoint = new Point();
				localPoint.setX(swapBytes(shpInput.readDouble()));
				localPoint.setY(swapBytes(shpInput.readDouble()));
				shpObj.addPoint(localPoint);
			}
			return shpObj;
		} catch (EOFException localEOFException) {
		}
		return null;
	}

	private ShapeObject creatMultiPoint(DataInputStream shpInput)
			throws IOException {
		try {
			shpInput.readInt();
			shpInput.readInt();
			ShapeObject shpObj = new ShapeObject(8);
			int k = swapBytes(shpInput.readInt());
			if (k != 8)
				this.wMesg.add(new String(
						"Invalid shape type in shape record: Shape record type "
								+ k + " in file of type " + getType()));
			BoundingBox objBox = new BoundingBox();
			objBox.setXMin(swapBytes(shpInput.readDouble()));
			objBox.setYMin(swapBytes(shpInput.readDouble()));
			objBox.setXMax(swapBytes(shpInput.readDouble()));
			objBox.setYMax(swapBytes(shpInput.readDouble()));
			shpObj.setBoundingBox(objBox);
			int m = swapBytes(shpInput.readInt());
			for (int i = 0; i < m; i++) {
				Point pt = new Point();
				pt.setX(swapBytes(shpInput.readDouble()));
				pt.setY(swapBytes(shpInput.readDouble()));
				shpObj.addPoint(pt);
			}
			return shpObj;
		} catch (EOFException ex) {
		}
		return null;
	}

	private ShapeObject createPolygon(DataInputStream shpInput)
			throws IOException {
		try {
			shpInput.readInt();
			shpInput.readInt();
			int k = swapBytes(shpInput.readInt());
			if (k != 5)
				this.wMesg.add(new String(
						"Invalid shape type in shape record: Shape record type "
								+ k + " in file of type " + getType()));
			ShapeObject shpObj = new ShapeObject(5);
			BoundingBox localBoundingBox = new BoundingBox();
			localBoundingBox.setXMin(swapBytes(shpInput.readDouble()));
			localBoundingBox.setYMin(swapBytes(shpInput.readDouble()));
			localBoundingBox.setXMax(swapBytes(shpInput.readDouble()));
			localBoundingBox.setYMax(swapBytes(shpInput.readDouble()));
			shpObj.setBoundingBox(localBoundingBox);
			int m = swapBytes(shpInput.readInt());
			int n = swapBytes(shpInput.readInt());
			for (int i = 0; i < m; i++) {
				shpObj.addPart(swapBytes(shpInput.readInt()));
			}
			for (int i = 0; i < n; i++) {
				Point pt = new Point();
				pt.setX(swapBytes(shpInput.readDouble()));
				pt.setY(swapBytes(shpInput.readDouble()));
				shpObj.addPoint(pt);
			}
			return shpObj;
		} catch (EOFException localEOFException) {
		}
		return null;
	}

	public int getShapeObjectCount() {
		return this.shpStore.size();
	}
	
	public void write(String fName) throws IOException {
		write(new FileOutputStream(fName + ".shp"), new FileOutputStream(fName
				+ ".shx"), new FileOutputStream(fName + ".dbf"));
		
		writeWGSPrj(fName) ;
	}
	
	private void writeWGSPrj(String fName) throws IOException{
		FileOutputStream prjFileOutputStream = new FileOutputStream(fName + ".prj");
		String prjString = "GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]]";
		prjFileOutputStream.write(prjString.getBytes()) ;
		prjFileOutputStream.close() ;
	}

	public void write(OutputStream shpWritor, OutputStream shxWritor,
			OutputStream dbfWritor) throws IOException {
		boolean canWriteShx = true;
		boolean canDbfWrite = true;
		this.wMesg = new ArrayList<String>();
		DataOutputStream shpOutput = new DataOutputStream(shpWritor);
		DataOutputStream shxOutput = null;
		DataOutputStream dbfOutput = null;
		if (shxWritor == null) {
			canWriteShx = false;
			this.wMesg
					.add("Unable to open index stream for writing. The shapefile will lack an .shx file.");
		} else {
			shxOutput = new DataOutputStream(shxWritor);
		}
		if (dbfWritor == null) {
			canDbfWrite = false;
			this.wMesg
					.add("Unable to open records stream for writing. The shapefile will lack a .dbf file.");
		} else {
			dbfOutput = new DataOutputStream(dbfWritor);
		}
		if ((this.bBox.getXMin() == 0.0D) && (this.bBox.getXMax() == 0.0D)
				&& (this.bBox.getYMin() == 0.0D)
				&& (this.bBox.getYMax() == 0.0D))
			computeExtents();
		shpOutput.writeInt(9994);
		if (canWriteShx)
			shxOutput.writeInt(9994);
		for (int i = 0; i < 5; i++) {
			shpOutput.writeInt(0);
			if (!canWriteShx)
				continue;
			shxOutput.writeInt(0);
		}
		int shpCnt = 0;
		switch (this.fType) {
		case 1:
			shpCnt = getShapeObjectCount() * 28 / 2 + 50;
			break;
		case 3:
		case 5:
			for (int i = 0; i < getShapeObjectCount(); i++) {
				ShapeObject shp = getShapeObject(i);
				shpCnt += (52 + shp.getPointCount() * 16 + shp.getPartCount() * 4) / 2;
			}
			shpCnt += 50;
			break;
		case 8:
			for (int n = 0; n < getShapeObjectCount(); n++) {
				ShapeObject shp = getShapeObject(n);
				shpCnt += (48 + shp.getPointCount() * 16) / 2;
			}
			shpCnt += 50;
		case 2:
		case 4:
		case 6:
		case 7:
		}
		shpOutput.writeInt(shpCnt);
		shpOutput.flush();
		shpCnt = getShapeObjectCount() * 8 / 2 + 50;
		if (canWriteShx)
			shxOutput.writeInt(shpCnt);
		shpOutput.writeInt(swapBytes(1000));
		if (canWriteShx)
			shxOutput.writeInt(swapBytes(1000));
		shpOutput.writeInt(swapBytes(this.fType));
		if (canWriteShx)
			shxOutput.writeInt(swapBytes(this.fType));
		shpOutput.writeLong(swapBytesl(this.bBox.getXMin()));
		shpOutput.writeLong(swapBytesl(this.bBox.getYMin()));
		shpOutput.writeLong(swapBytesl(this.bBox.getXMax()));
		shpOutput.writeLong(swapBytesl(this.bBox.getYMax()));
		shpOutput.writeLong(swapBytesl(0L));
		shpOutput.writeLong(swapBytesl(0L));
		shpOutput.writeLong(swapBytesl(0L));
		shpOutput.writeLong(swapBytesl(0L));
		if (canWriteShx) {
			shxOutput.writeLong(swapBytesl(this.bBox.getXMin()));
			shxOutput.writeLong(swapBytesl(this.bBox.getYMin()));
			shxOutput.writeLong(swapBytesl(this.bBox.getXMax()));
			shxOutput.writeLong(swapBytesl(this.bBox.getYMax()));
			shxOutput.writeLong(swapBytesl(0L));
			shxOutput.writeLong(swapBytesl(0L));
			shxOutput.writeLong(swapBytesl(0L));
			shxOutput.writeLong(swapBytesl(0L));
		}
		int shpOffset = 50;
		int shpNum = 1;
		for (int i = 0; i < getShapeObjectCount(); i++) {
			switch (this.fType) {
			case 1:
				shpOffset = creatPoint(shpOutput, shxOutput, shpOffset,
						getShapeObject(i), shpNum, canWriteShx);
				break;
			case 3:
				shpOffset = creatPolyline(shpOutput, shxOutput, shpOffset,
						getShapeObject(i), shpNum, canWriteShx);
				break;
			case 5:
				shpOffset = createPolygon(shpOutput, shxOutput, shpOffset,
						getShapeObject(i), shpNum, canWriteShx);
				break;
			case 8:
				shpOffset = creatMultiPoint(shpOutput, shxOutput, shpOffset,
						getShapeObject(i), shpNum, canWriteShx);
			case 2:
			case 4:
			case 6:
			case 7:
			}
			shpNum++;
		}
		ArrayList<Record> records = new ArrayList<Record>();
		for (int i = 0; i < getShapeObjectCount(); i++) {
			ShapeObject shp = getShapeObject(i);
			Record rec = shp.getRecord();
			records.add(rec);
		}
		if (canDbfWrite)
			creatDbfFile(dbfOutput, getShapeObjectCount(), this.tblDescription,
					records);
		shpOutput.close();
		if (canWriteShx)
			shxOutput.close();
		if (canDbfWrite)
			dbfOutput.close();
	}

	private int creatPoint(DataOutputStream shpOutput,
			DataOutputStream shxOutput, int shpOffset, ShapeObject shpObj,
			int shpIndex, boolean canWriteShx) throws IOException {
		shpOutput.writeInt(shpIndex);
		if (canWriteShx)
			shxOutput.writeInt(shpOffset);
		shpOffset += 14;
		shpOutput.writeInt(10);
		if (canWriteShx)
			shxOutput.writeInt(10);
		shpOutput.writeInt(swapBytes(1));
		Point pt = shpObj.getPoint(0);
		shpOutput.writeLong(swapBytesl(pt.getX()));
		shpOutput.writeLong(swapBytesl(pt.getY()));
		return shpOffset;
	}

	private int creatMultiPoint(DataOutputStream shpOutput,
			DataOutputStream shxOutput, int shpOffset, ShapeObject shpObj,
			int shpIndex, boolean canWriteShx) throws IOException {
		if ((shpObj.getBoundingBox().getXMin() == 0.0D)
				&& (shpObj.getBoundingBox().getXMax() == 0.0D)
				&& (shpObj.getBoundingBox().getYMin() == 0.0D)
				&& (shpObj.getBoundingBox().getYMax() == 0.0D))
			shpObj.computeExtents();
		shpOutput.writeInt(shpIndex);
		if (canWriteShx)
			shxOutput.writeInt(shpOffset);
		shpOffset += (48 + shpObj.getPointCount() * 16) / 2;
		shpOutput.writeInt((40 + shpObj.getPointCount() * 16) / 2);
		if (canWriteShx)
			shxOutput.writeInt((40 + shpObj.getPointCount() * 16) / 2);
		shpOutput.writeInt(swapBytes(8));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getXMin()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getYMin()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getXMax()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getYMax()));
		shpOutput.writeInt(swapBytes(shpObj.getPointCount()));
		for (int i = 0; i < shpObj.getPointCount(); i++) {
			Point pt = shpObj.getPoint(i);
			shpOutput.writeLong(swapBytesl(pt.getX()));
			shpOutput.writeLong(swapBytesl(pt.getY()));
		}
		return shpOffset;
	}

	private int creatPolyline(DataOutputStream shpOutput,
			DataOutputStream shxOutput, int shpOffset, ShapeObject shpObj,
			int shpIndex, boolean canWriteShx) throws IOException {
		if ((shpObj.getBoundingBox().getXMin() == 0.0D)
				&& (shpObj.getBoundingBox().getXMax() == 0.0D)
				&& (shpObj.getBoundingBox().getYMin() == 0.0D)
				&& (shpObj.getBoundingBox().getYMax() == 0.0D))
			shpObj.computeExtents();
		shpOutput.writeInt(shpIndex);
		if (canWriteShx)
			shxOutput.writeInt(shpOffset);
		shpOffset += (52 + shpObj.getPartCount() * 4 + shpObj.getPointCount() * 16) / 2;
		shpOutput.writeInt((44 + shpObj.getPartCount() * 4 + shpObj
				.getPointCount() * 16) / 2);
		if (canWriteShx)
			shxOutput.writeInt((44 + shpObj.getPartCount() * 4 + shpObj
					.getPointCount() * 16) / 2);
		shpOutput.writeInt(swapBytes(3));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getXMin()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getYMin()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getXMax()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getYMax()));
		shpOutput.writeInt(swapBytes(shpObj.getPartCount()));
		shpOutput.writeInt(swapBytes(shpObj.getPointCount()));
		shpOutput.writeInt(0);
		for (int i = 1; i < shpObj.getPartCount(); i++) {
			shpOutput.writeInt(swapBytes(shpObj.getPart(i)));
		}
		for (int j = 0; j < shpObj.getPointCount(); j++) {
			Point pt = shpObj.getPoint(j);
			shpOutput.writeLong(swapBytesl(pt.getX()));
			shpOutput.writeLong(swapBytesl(pt.getY()));
		}
		return shpOffset;
	}

	private int createPolygon(DataOutputStream shpOutput,
			DataOutputStream shxOutput, int shpOffset, ShapeObject shpObj,
			int shpIndex, boolean canWriteShx) throws IOException {
		if ((shpObj.getBoundingBox().getXMin() == 0.0D)
				&& (shpObj.getBoundingBox().getXMax() == 0.0D)
				&& (shpObj.getBoundingBox().getYMin() == 0.0D)
				&& (shpObj.getBoundingBox().getYMax() == 0.0D))
			shpObj.computeExtents();
		shpOutput.writeInt(shpIndex);
		if (canWriteShx)
			shxOutput.writeInt(shpOffset);
		shpOffset += (52 + shpObj.getPartCount() * 4 + shpObj.getPointCount() * 16) / 2;
		shpOutput.writeInt((44 + shpObj.getPartCount() * 4 + shpObj
				.getPointCount() * 16) / 2);
		if (canWriteShx)
			shxOutput.writeInt((44 + shpObj.getPartCount() * 4 + shpObj
					.getPointCount() * 16) / 2);
		shpOutput.writeInt(swapBytes(5));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getXMin()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getYMin()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getXMax()));
		shpOutput.writeLong(swapBytesl(shpObj.getBoundingBox().getYMax()));
		shpOutput.writeInt(swapBytes(shpObj.getPartCount()));
		shpOutput.writeInt(swapBytes(shpObj.getPointCount()));
		shpOutput.writeInt(0);
		for (int i = 1; i < shpObj.getPartCount(); i++) {
			shpOutput.writeInt(swapBytes(shpObj.getPart(i)));
		}
		for (int j = 0; j < shpObj.getPointCount(); j++) {
			Point pt = shpObj.getPoint(j);
			shpOutput.writeLong(swapBytesl(pt.getX()));
			shpOutput.writeLong(swapBytesl(pt.getY()));
		}
		return shpOffset;
	}

	public int getType() {
		return this.fType;
	}

	public void setType(int paramInt) {
		this.fType = paramInt;
	}

	public void addShapeObject(ShapeObject shpObj)
			throws InvalidShapeTypeException, InvalidFieldNameException {
		if ((shpObj.getType() != this.fType) && (shpObj.getType() != 0))
			throw new InvalidShapeTypeException(
					"Tried to add ShapeObject of type " + shpObj.getType()
							+ " to Shapefile of type " + this.fType);
		Iterator<RecordField> recItor = shpObj.getRecord().getFields()
				.iterator();
		while (recItor.hasNext()) {
			RecordField recFld = recItor.next();
			if (this.tblDescription.contains(recFld.getName()))
				continue;
			throw new InvalidFieldNameException(recFld.getName()
					+ " does not exist in the Shapefile's TableDescription");
		}
		this.shpStore.add(shpObj);
	}

	public void removeShapeObject(int shpIndex)
			throws IndexOutOfBoundsException {
		this.shpStore.remove(shpIndex);
	}

	public ShapeObject getShapeObject(int shpIndex)
			throws IndexOutOfBoundsException {
		return (ShapeObject) this.shpStore.get(shpIndex);
	}

	public ArrayList<ShapeObject> getShapeObjects() {
		return this.shpStore;
	}

	public void setShapeObjects(Collection<ShapeObject> shps)
			throws InvalidShapeTypeException, InvalidFieldNameException {
		this.shpStore = new ArrayList<ShapeObject>();
		Iterator<ShapeObject> shpItor = shps.iterator();
		while (shpItor.hasNext()) {
			ShapeObject shpObj = (ShapeObject) shpItor.next();
			addShapeObject(shpObj);
		}
	}

	public BoundingBox getBoundingBox() {
		return this.bBox;
	}

	public void setBoundingBox(BoundingBox bBox) {
		this.bBox = bBox;
	}

	private void creatDbfFile(InputStream dbfInput, int paramInt,
			TableDescription tblDscpt, ArrayList<Record> records)
			throws IOException {
		DataInputStream dbf = new DataInputStream(dbfInput);
		dbf.skip(4L);
		int i = swapBytes(dbf.readInt());
		if (i != paramInt)
			throw new RuntimeException(
					"Inconsistant records file: the number of records does not match the number of shape objects");
		dbf.skip(2L);
		dbf.skip(2L);
		dbf.skip(3L);
		dbf.skip(13L);
		dbf.skip(4L);
		int j = dbf.readByte();

		Object tblObj;
		int m;
		do {
			byte[] tblFld = new byte[10];
			tblObj = new TableDescriptor();
			tblFld[0] = (byte) j;
			for (m = 1; m < 10; m++)
				tblFld[m] = dbf.readByte();
			dbf.skip(1L);
			((TableDescriptor) tblObj).setName(new String(tblFld).trim());
			int n = (char) dbf.readByte();
			switch (n) {
			case 67:
				((TableDescriptor) tblObj).setType(101);
				break;
			case 78:
				((TableDescriptor) tblObj).setType(102);
				break;
			case 70:
				((TableDescriptor) tblObj).setType(103);
				break;
			case 68:
				((TableDescriptor) tblObj).setType(104);
				break;
			case 76:
				((TableDescriptor) tblObj).setType(105);
			case 69:
			case 71:
			case 72:
			case 73:
			case 74:
			case 75:
			case 77:
			}
			dbf.skip(4L);
			((TableDescriptor) tblObj).setWidth(dbf.readByte());
			((TableDescriptor) tblObj).setPrecision(dbf.readByte());
			dbf.skip(2L);
			dbf.skip(1L);
			dbf.skip(2L);
			dbf.skip(1L);
			dbf.skip(8L);
			j = dbf.readByte();
			tblDscpt.addTableDescriptor((TableDescriptor) tblObj);
		} while (j != 13);
		for (int k = 0; k < i; k++) {
			tblObj = new Record();
			dbf.skip(1L);
			for (m = 0; m < tblDscpt.getFieldCount(); m++) {
				TableDescriptor tblDescriptor = tblDscpt.getTableDescriptor(m);
				byte[] fldWidth = new byte[tblDescriptor.getWidth()];
				for (int i1 = 0; i1 < tblDescriptor.getWidth(); i1++)
					fldWidth[i1] = dbf.readByte();
				((Record) tblObj).addField(new RecordField(tblDescriptor
						.getName(), new String(fldWidth).trim()));
			}
			records.add((Record) tblObj);
		}
	}
	
	/*private void createDbfFile1(OutputStream dbfOutput, int shpNum,
			TableDescription tblDescription, ArrayList<Record> records){
		//DataOutputStream dbfWritor = new DataOutputStream(dbfOutput);
		TableDescriptor tblDescript;
		if (tblDescription.getFieldCount() == 0) {
			tblDescription.addTableDescriptor(new TableDescriptor(" ", 101, 1));
			records = new ArrayList<Record>();
			for (int i = 0; i < shpNum; i++) {
				RecordField recFld = new RecordField(" ", " ");
				Record rec = new Record();
				((Record) rec).addField(recFld);
				records.add(rec);
			}
		} else {
			Iterator<Record> recItor = records.iterator();
			boolean canAddField = true;
			while (recItor.hasNext()) {
				Record iRec = recItor.next();
				Iterator<TableDescriptor> recFldDescItor = tblDescription
						.getTableDescriptors().iterator();
				while (recFldDescItor.hasNext()) {
					tblDescript = (TableDescriptor) recFldDescItor.next();
					Iterator<RecordField> recFldItor = iRec.getFields()
							.iterator();
					while (recFldItor.hasNext()) {
						RecordField recField = recFldItor.next();
						if (!recField.getName().equals(tblDescript.getName()))
							continue;
						canAddField = false;
					}
					if (canAddField)
						iRec.addField(new RecordField(tblDescript.getName(),
								" "));
					canAddField = true;
				}
			}
		}
		
		DBFWriter writer = new DBFWriter();
		
		int fieldNum = tblDescription.getFieldCount() ;
		DBFField[] fields = new DBFField[fieldNum] ;
		for (int i = 0; i < fieldNum; i++){
			tblDescript = tblDescription.getTableDescriptor(i);
			String nameString = tblDescript.getName() ;
			int type = tblDescript.getType() ;
			int width = tblDescript.getWidth() ;
			if (type == 101) {
				DBFField tempField = new DBFField() ;
				tempField.setName(nameString) ;
				tempField.setDataType(DBFField.FIELD_TYPE_C) ;
				tempField.setFieldLength(width) ;
				fields[i] = tempField ;
			}
			else if (type == 102) {
				DBFField tempField = new DBFField() ;
				tempField.setName(nameString) ;
				tempField.setDataType(DBFField.FIELD_TYPE_N) ;
				fields[i] = tempField ;
			}
			else if (type == 103) {
				DBFField tempField = new DBFField() ;
				tempField.setName(nameString) ;
				tempField.setDataType(DBFField.FIELD_TYPE_F) ;
				fields[i] = tempField ;
			}
			else if (type == 104) {
				DBFField tempField = new DBFField() ;
				tempField.setName(nameString) ;
				tempField.setDataType(DBFField.FIELD_TYPE_D) ;
				fields[i] = tempField ;
			}
		}
		try {
			writer.setFields(fields);
			for (int i = 0; i < records.size(); i++){
				Record mRec = records.get(i);
				Object[] fieldValues = new Object[fieldNum] ;
				for (int j = 0; j < fieldNum; j++) {
					DBFField tempField = fields[j] ;
					String nameString = tempField.getName() ;
					Byte typeByte = tempField.getDataType() ;
					RecordField recordField = mRec.getField(nameString) ;
					String valueString = recordField.getValue() ;
					if (typeByte == DBFField.FIELD_TYPE_C) {
						fieldValues[j] = valueString ;
					}
				}
				TableDescriptor mTblDescriptor = tblDescription.getTableDescriptor(i);
				RecordField mRecFld = mRec.getField(mTblDescriptor.getName());
				
				
				
			}
			
			
		} catch (DBFException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		
	}*/

	private void creatDbfFile(OutputStream dbfOutput, int shpNum,
			TableDescription tblDescription, ArrayList<Record> records)
			throws IOException {
		DataOutputStream dbfWritor = new DataOutputStream(dbfOutput);
		TableDescriptor tblDescript;
		if (tblDescription.getFieldCount() == 0) {
			tblDescription.addTableDescriptor(new TableDescriptor(" ", 101, 1));
			records = new ArrayList<Record>();
			for (int i = 0; i < shpNum; i++) {
				RecordField recFld = new RecordField(" ", " ");
				Record rec = new Record();
				((Record) rec).addField(recFld);
				records.add(rec);
			}
		} else {
			Iterator<Record> recItor = records.iterator();
			boolean canAddField = true;
			while (recItor.hasNext()) {
				Record iRec = recItor.next();
				Iterator<TableDescriptor> recFldDescItor = tblDescription
						.getTableDescriptors().iterator();
				while (recFldDescItor.hasNext()) {
					tblDescript = (TableDescriptor) recFldDescItor.next();
					Iterator<RecordField> recFldItor = iRec.getFields()
							.iterator();
					while (recFldItor.hasNext()) {
						RecordField recField = recFldItor.next();
						if (!recField.getName().equals(tblDescript.getName()))
							continue;
						canAddField = false;
					}
					if (canAddField)
						iRec.addField(new RecordField(tblDescript.getName(),
								" "));
					canAddField = true;
				}
			}
		}
		dbfWritor.writeByte(3);
		Calendar mDate = Calendar.getInstance();
		int year = mDate.get(1);
		year -= 2000;
		dbfWritor.writeByte((byte) year);
		dbfWritor.writeByte((byte) (mDate.get(2) + 1));
		dbfWritor.writeByte((byte) mDate.get(5));
		dbfWritor.writeInt(swapBytes(records.size()));
		short s = (short) (tblDescription.getFieldCount() * 32 + 32 + 1);
		dbfWritor.writeShort(swapBytes(s));
		short totalFldWidth = 0;

		for (int i = 0; i < tblDescription.getFieldCount(); i++) {
			tblDescript = tblDescription.getTableDescriptor(i);
			if (tblDescript.getType() == 105)
				tblDescript.setWidth(1);
			if (tblDescript.getWidth() == 0) {
				int fldWidth = 0;
				Iterator<Record> recItor = records.iterator();
				while (recItor.hasNext()) {
					Record mRec = recItor.next();
					RecordField mRecFld = mRec.getField(tblDescript.getName());
					if (fldWidth >= mRecFld.getValue().length())
						continue;
					fldWidth = mRecFld.getValue().length();
				}
				tblDescript.setWidth(fldWidth);
			}
			totalFldWidth = (short) (totalFldWidth + tblDescript.getWidth());
		}
		totalFldWidth = (short) (totalFldWidth + 1);
		dbfWritor.writeShort(swapBytes(totalFldWidth));

		for (int i = 0; i < 20; i++)
			dbfWritor.writeByte(0);

		for (int i = 0; i < tblDescription.getFieldCount(); i++) {
			TableDescriptor tblDescriptor = tblDescription
					.getTableDescriptor(i);
			String fldName = tblDescriptor.getName();
			byte[] fldLength = fldName.getBytes();
			for (int j = 0; j < 10; j++)
				if (fldLength.length > j)
					dbfWritor.writeByte(fldLength[j]);
				else
					dbfWritor.writeByte(0);
			dbfWritor.writeByte(0);
			switch (((TableDescriptor) tblDescriptor).getType()) {
			case 101:
				dbfWritor.writeByte(67);
				break;
			case 104:
				dbfWritor.writeByte(68);
				break;
			case 102:
				dbfWritor.writeByte(78);
				break;
			case 103:
				dbfWritor.writeByte(70);
				break;
			case 105:
				dbfWritor.writeByte(76);
			}
			for (int j = 0; j < 4; j++)
				dbfWritor.writeByte(0);
			dbfWritor.writeByte(tblDescriptor.getWidth());
			dbfWritor.writeByte(tblDescriptor.getPrecision());
			for (int j = 0; j < 14; j++)
				dbfWritor.writeByte(0);
		}
		dbfWritor.writeByte(13);
		/**
		 * write header over. begin to write record
		 * 
		 */
		for (int i = 0; i < records.size(); i++) {
			dbfWritor.writeByte(32);
			Record mRec = records.get(i);
			for (int j = 0; j < tblDescription.getFieldCount(); j++) {
				TableDescriptor mTblDescriptor = tblDescription
						.getTableDescriptor(j);
				RecordField mRecFld = mRec.getField(mTblDescriptor
						.getName());
				String str = mRecFld.getValue();
				int index = 0;
				if (mTblDescriptor.getType() == 103) {
					DecimalFormat decFormat = new DecimalFormat("0.###E000");
					String value = decFormat.format(Double.parseDouble(str));
					StringBuffer strB = new StringBuffer(value);
					index = value.indexOf("-");
					if (index == -1)
						strB.insert(value.indexOf("E") + 1, '+');
					//str = strB.toString();
				}

				byte[] mFldWidth = null;
				byte[] mFldValueWidth = null;
				int mFldValueLen = 0;

				if ((mTblDescriptor.getType() == 102)
						|| (mTblDescriptor.getType() == 103)
						|| (mTblDescriptor.getType() == 104)) {
					mFldWidth = new byte[mTblDescriptor.getWidth()];
					mFldValueWidth = str.getBytes();
					for (int fldIndex = 0; fldIndex < mFldWidth.length; fldIndex++)
						mFldWidth[fldIndex] = 32;
					index = mFldWidth.length - 1;
					mFldValueLen = mFldValueWidth.length - 1;
					
					while (true) {
						mFldWidth[index] = mFldValueWidth[mFldValueLen];
						index--;
						mFldValueLen--;
						if (index <= -1)
							break;
						if (mFldValueLen > -1)
							continue;
						else
						{
							break ;
						}
					}
				}
				if (mTblDescriptor.getType() == 101) {
					mFldWidth = new byte[mTblDescriptor.getWidth()];
					mFldValueWidth = str.getBytes();
					for (int fldIndex = 0; fldIndex < mFldWidth.length; fldIndex++)
						mFldWidth[fldIndex] = 32;
					index = 0;
					mFldValueLen = 0;
					do {
						mFldWidth[index] = mFldValueWidth[mFldValueLen];
						index++;
						mFldValueLen++;
						if (index >= mFldWidth.length)
							break;
					} while (mFldValueLen < mFldValueWidth.length);
				} else if (mTblDescriptor.getType() == 105) {
					mFldWidth = new byte[1];
					if ((str.equals("T")) || (str.equals("t")))
						mFldWidth[0] = 84;
					else if ((str.equals("F")) || (str.equals("f")))
						mFldWidth[0] = 70;
					else
						mFldWidth[0] = 63;
				} else {
					/*mFldWidth = new byte[mTblDescriptor.getWidth()];
					for (int fldIndex = 0; fldIndex < mFldWidth.length; fldIndex++)
						mFldWidth[fldIndex] = 32;*/
				}
				for (int i9 = 0; i9 < mTblDescriptor.getWidth(); i9++)
					dbfWritor.writeByte(mFldWidth[i9]);
				
			}
		}
		dbfWritor.writeByte(26);
	}

	public void setTableDescription(TableDescription tblDescript) {
		this.tblDescription = tblDescript;
	}

	public void computeExtents() {
		Object pt1;
		Object pt2;
		switch (this.fType) {
		case 1:
			if (getShapeObjectCount() > 0) {
				ShapeObject shp = (ShapeObject) this.shpStore.get(0);
				if (shp.getPointCount() > 0) {
					pt1 = shp.getPoint(0);
					this.bBox.setXMin(((Point) pt1).getX());
					this.bBox.setXMax(((Point) pt1).getX());
					this.bBox.setYMin(((Point) pt1).getY());
					this.bBox.setYMax(((Point) pt1).getY());
				}
			}
			for (int i = 0; i < getShapeObjectCount(); i++) {
				pt1 = (ShapeObject) this.shpStore.get(i);
				if (((ShapeObject) pt1).getPointCount() <= 0)
					continue;
				pt2 = ((ShapeObject) pt1).getPoint(0);
				if (this.bBox.getXMin() > ((Point) pt2).getX())
					this.bBox.setXMin(((Point) pt2).getX());
				if (this.bBox.getXMax() < ((Point) pt2).getX())
					this.bBox.setXMax(((Point) pt2).getX());
				if (this.bBox.getYMin() > ((Point) pt2).getY())
					this.bBox.setYMin(((Point) pt2).getY());
				if (this.bBox.getYMax() >= ((Point) pt2).getY())
					continue;
				this.bBox.setYMax(((Point) pt2).getY());
			}
			break;
		case 3:
		case 5:
		case 8:
			if (getShapeObjectCount() > 0) {
				pt1 = (ShapeObject) this.shpStore.get(0);
				if (((ShapeObject) pt1).getPointCount() > 0) {
					pt2 = ((ShapeObject) pt1).getPoint(0);
					this.bBox.setXMin(((Point) pt2).getX());
					this.bBox.setXMax(((Point) pt2).getX());
					this.bBox.setYMin(((Point) pt2).getY());
					this.bBox.setYMax(((Point) pt2).getY());
				}
			}
			for (int j = 0; j < getShapeObjectCount(); j++) {
				pt2 = (ShapeObject) this.shpStore.get(j);
				for (int k = 0; k < ((ShapeObject) pt2).getPointCount(); k++) {
					Point localPoint = ((ShapeObject) pt2).getPoint(k);
					if (this.bBox.getXMin() > localPoint.getX())
						this.bBox.setXMin(localPoint.getX());
					if (this.bBox.getXMax() < localPoint.getX())
						this.bBox.setXMax(localPoint.getX());
					if (this.bBox.getYMin() > localPoint.getY())
						this.bBox.setYMin(localPoint.getY());
					if (this.bBox.getYMax() >= localPoint.getY())
						continue;
					this.bBox.setYMax(localPoint.getY());
				}
			}
		case 2:
		case 4:
		case 6:
		case 7:
		}
	}

	public TableDescription getTableDescription() {
		return this.tblDescription;
	}

	protected static short swapBytes(short paramShort) {
		int i = (paramShort & 0xFF) << 8;
		int j = (paramShort & 0xFF00) >>> 8;
		return (short) (i | j);
	}

	protected static int swapBytes(int paramInt) {
		int i = (paramInt & 0xFF) << 24;
		int j = (paramInt & 0xFF00) << 8;
		int k = (paramInt & 0xFF0000) >>> 8;
		int m = ((paramInt & 0xFF000000) >>> 24) & 0xFF;
		return i | j | k | m;
	}

	protected static double swapBytes(double paramDouble) {
		long value = Double.doubleToRawLongBits(paramDouble);
		long l3 = (value & 0xFFL) << 56;
		long l4 = (value & 0xFF00L) << 40;
		long l5 = (value & 0xFF0000L) << 24;
		long l6 = (value & 0xFF000000L) << 8;
		long l7 =  (value & 0xFF00000000L )>>> 8;
		long l8 =  (value & 0xFF0000000000L )>>> 24;
		long l9 =  (value & 0xFF000000000000L ) >>> 40;
		long l10 = (value >>> 56) & 0xFF;
		long l2 = l3 | l4 | l5 | l6 | l7 | l8 | l9 | l10;
		return Double.longBitsToDouble(l2);
	}

	protected static double swapBytes(long paramLong) {
		long value = paramLong;
		long l3 = (value & 0xFFL) << 56;
		long l4 = (value & 0xFF00L) << 40;
		long l5 = (value & 0xFF0000L) << 24;
		long l6 = (value & 0xFF000000L) << 8;
		long l7 =  (value & 0xFF00000000L )>>> 8;
		long l8 =  (value & 0xFF0000000000L )>>> 24;
		long l9 =  (value & 0xFF000000000000L ) >>> 40;
		long l10 = (value >>> 56) & 0xFF;
		long l2 = l3 | l4 | l5 | l6 | l7 | l8 | l9 | l10;
		return Double.longBitsToDouble(l2);
	}

	protected static long swapBytesl(long paramLong) {
		long value = paramLong;
		long l3 = (value & 0xFFL) << 56;
		long l4 = (value & 0xFF00L) << 40;
		long l5 = (value & 0xFF0000L) << 24;
		long l6 = (value & 0xFF000000L) << 8;
		long l7 =  (value & 0xFF00000000L )>>> 8;
		long l8 =  (value & 0xFF0000000000L )>>> 24;
		long l9 =  (value & 0xFF000000000000L ) >>> 40;
		long l10 = (value >>> 56) & 0xFF;
		long l2 = l3 | l4 | l5 | l6 | l7 | l8 | l9 | l10;
		return l2;
	}

	protected static long swapBytesl(double paramDouble) {
		long value = Double.doubleToRawLongBits(paramDouble);
		long l3 = (value & 0xFFL) << 56;
		long l4 = (value & 0xFF00L) << 40;
		long l5 = (value & 0xFF0000L) << 24;
		long l6 = (value & 0xFF000000L) << 8;
		long l7 =  (value & 0xFF00000000L )>>> 8;
		long l8 =  (value & 0xFF0000000000L )>>> 24;
		long l9 =  (value & 0xFF000000000000L ) >>> 40;
		long l10 = (value >>> 56) & 0xFF;
		long l2 = l3 | l4 | l5 | l6 | l7 | l8 | l9 | l10;
		return l2;
	}

	public ArrayList<String> getWarningMessages() {
		return this.wMesg;
	}

}
