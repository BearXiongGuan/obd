package com.hq.bm.utils.shapefile;

@SuppressWarnings("serial")
public class InvalidShapeTypeException extends RuntimeException
{
  public InvalidShapeTypeException()
  {
  }

  public InvalidShapeTypeException(String paramString)
  {
    super(paramString);
  }
}