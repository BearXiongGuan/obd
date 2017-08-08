package com.hq.bm.utils.shapefile;

public class BoundingBox
{
  private double xMin;
  private double xMax;
  private double yMin;
  private double yMax;

  public BoundingBox()
  {
  }

  public BoundingBox(double xMin, double yMin, double xMax, double yMax)
  {
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
  }

  public double getXMin()
  {
    return this.xMin;
  }

  public double getXMax()
  {
    return this.xMax;
  }

  public double getYMin()
  {
    return this.yMin;
  }

  public double getYMax()
  {
    return this.yMax;
  }

  public void setXMin(double xMin)
  {
    this.xMin = xMin;
  }

  public void setXMax(double xMax)
  {
    this.xMax = xMax;
  }

  public void setYMin(double yMin)
  {
    this.yMin = yMin;
  }

  public void setYMax(double yMax)
  {
    this.yMax = yMax;
  }
}
