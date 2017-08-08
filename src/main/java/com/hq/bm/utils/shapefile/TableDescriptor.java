package com.hq.bm.utils.shapefile;

/**
 * 字段信息类，包括名称、类型、宽度和精度等
 * @author Administrator
 *
 */

public class TableDescriptor
{
  private String descriptor;
  private int tType = 101;   //101--string   102--int  103--double 
  private int tWidth;
  private int tPrecision;

  public TableDescriptor()
  {
  }

  public TableDescriptor(String descriptor)
  {
    this.descriptor = descriptor;
  }

  public TableDescriptor(String descriptor, int type)
  {
    this.descriptor = descriptor;
    this.tType = type;
  }

  public TableDescriptor(String descriptor, int type, int width)
  {
    this.descriptor = descriptor;
    this.tType = type;
    this.tWidth = width;
  }

  public int getWidth()
  {
    return this.tWidth;
  }

  public void setWidth(int width)
  {
    this.tWidth = width;
  }

  public int getPrecision()
  {
    return this.tPrecision;
  }

  public void setPrecision(int precision)
  {
    this.tPrecision = precision;
  }

  public String getName()
  {
    return this.descriptor;
  }

  public int getType()
  {
    return this.tType;
  }

  public void setName(String descriptor)
  {
    this.descriptor = descriptor;
  }

  public void setType(int type)
    throws InvalidFieldTypeException
  {
    this.tType = type;
  }
}