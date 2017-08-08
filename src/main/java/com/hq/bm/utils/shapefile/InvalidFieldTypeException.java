package com.hq.bm.utils.shapefile;

@SuppressWarnings("serial")
public class InvalidFieldTypeException extends RuntimeException
{
  public InvalidFieldTypeException()
  {
  }

  public InvalidFieldTypeException(String paramString)
  {
    super(paramString);
  }
}