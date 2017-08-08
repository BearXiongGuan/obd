package com.hq.bm.utils.shapefile;

/**
 * 一个shape类，包括几何数据和属性数据
 */

import java.util.ArrayList;
import java.util.Collection;

public class ShapeObject {
	public static final int UNDEFINED = 0;
	public static final int POINT = 1;
	public static final int MULTIPOINT = 8;
	public static final int POLYLINE = 3;
	public static final int POLYGON = 5;
	private ArrayList<Point> points = new ArrayList<Point>();     //所有的点集合
	private ArrayList<Integer> parts = new ArrayList<Integer>();     //各部分点的个数，如带洞多边形的外环和内环点个数
	private Record rec = new Record();
	private BoundingBox bBox = new BoundingBox();
	private int fType;

	public ShapeObject() {
		this.fType = 0;
		this.parts.add(new Integer(0));
	}

	public ShapeObject(int fType) {
		this.fType = fType;
		if (this.fType != 1)
			this.parts.add(new Integer(0));
	}

	public void addPoint(Point pt) {
			this.points.add(pt);
	}

	public void removePoint(int ptIndex) throws IndexOutOfBoundsException {
		this.points.remove(ptIndex);
	}

	public Point getPoint(int ptIndex) throws IndexOutOfBoundsException {
		return (Point) this.points.get(ptIndex);
	}

	public ArrayList<Point> getPoints() {
		return this.points;
	}

	public void setPoints(Collection<Point> pts) {
		this.points = new ArrayList<Point>(pts);
	}

	public void addPart(int fType) {
		if (fType != 0)
			this.parts.add(new Integer(fType));
	}

	public void removePart(int partIndex) throws IndexOutOfBoundsException {
		this.parts.remove(partIndex);
	}

	public int getPart(int partIndex) throws IndexOutOfBoundsException {
		Integer localInteger = (Integer) this.parts.get(partIndex);
		return localInteger.intValue();
	}

	public void setParts(Collection<Integer> parts) {
		this.parts = new ArrayList<Integer>(parts);
	}

	public ArrayList<Integer> getParts() {
		return this.parts;
	}

	public int getType() {
		return this.fType;
	}

	public void setType(int fType) {
		this.fType = fType;
	}

	public Record getRecord() {
		return this.rec;
	}

	public void setRecord(Record rec) {
		this.rec = rec;
	}

	public void setBoundingBox(BoundingBox bbox) {
		this.bBox = bbox;
	}

	public BoundingBox getBoundingBox() {
		return this.bBox;
	}

	public int getPointCount() {
		return this.points.size();
	}

	public int getPartCount() {
		return this.parts.size();
	}

	public void computeExtents() {
		switch (this.fType) {
		case 1:
			break;
		case 0:
		case 3:
		case 5:
		case 8:
			if (getPointCount() > 0) {
				Point pt1 = getPoint(0);
				this.bBox.setXMin(pt1.getX());
				this.bBox.setXMax(pt1.getX());
				this.bBox.setYMin(pt1.getY());
				this.bBox.setYMax(pt1.getY());
			}
			for (int i = 0; i < getPoints().size(); i++) {
				Point pt2 = getPoint(i);
				if (this.bBox.getXMin() > pt2.getX())
					this.bBox.setXMin(pt2.getX());
				if (this.bBox.getXMax() < pt2.getX())
					this.bBox.setXMax(pt2.getX());
				if (this.bBox.getYMin() > pt2.getY())
					this.bBox.setYMin(pt2.getY());
				if (this.bBox.getYMax() >= pt2.getY())
					continue;
				this.bBox.setYMax(pt2.getY());
			}
		case 2:
		case 4:
		case 6:
		case 7:
		}
	}
}