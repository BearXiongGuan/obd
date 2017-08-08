package com.hq.bm.utils.shapefile;

import java.util.ArrayList;

public class WarningMessages
{
  private ArrayList<String> wMesg = new ArrayList<String>();

  public ArrayList<String> getMessages()
  {
    return this.wMesg;
  }

  public String getMessage(int msgIndex)
    throws ArrayIndexOutOfBoundsException
  {
    return (String)this.wMesg.get(msgIndex);
  }

  public void addMessage(String msg)
  {
    this.wMesg.add(msg);
  }
}
