package com.hq.bm.utils.shapefile;

@SuppressWarnings("serial")
public class InvalidFileException extends RuntimeException
{
  public InvalidFileException()
  {
  }

  public InvalidFileException(String paramString)
  {
    super(paramString);
  }
}