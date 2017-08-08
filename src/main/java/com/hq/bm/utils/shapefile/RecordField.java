package com.hq.bm.utils.shapefile;

/**
 * 属性
 * @author Administrator
 *
 */

public class RecordField
{
  private String fName;
  private String fVale;

  public RecordField()
  {
  }

  public RecordField(String fName)
  {
    this.fName = fName;
  }

  public RecordField(String fName, String fVale)
  {
    this.fName = fName;
    this.fVale = fVale;
  }

  public void setName(String fName)
  {
    this.fName = fName;
  }

  public void setValue(String fVale)
  {
    this.fVale = fVale;
  }

  public String getName()
  {
    return this.fName;
  }

  public String getValue()
  {
    return this.fVale;
  }
}
