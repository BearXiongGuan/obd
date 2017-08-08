package com.hq.bm.utils.shapefile;

/**
 * 属性表字段信息类
 */

import java.util.ArrayList;
import java.util.Collection;
import java.util.Hashtable;
import java.util.Iterator;

public class TableDescription
{
  private ArrayList<TableDescriptor> tdList = new ArrayList<TableDescriptor>();
  private Hashtable<String, Boolean> tblDptManager = new Hashtable<String, Boolean>();
  private Boolean isValid = new Boolean(true);

  public TableDescription()
  {
  }

  public TableDescription(Collection<TableDescriptor> tds)
  {
    this.tdList = new ArrayList<TableDescriptor>(tds);
  }

  public TableDescriptor getTableDescriptor(String tableDes)
  {
    Iterator<TableDescriptor> itor = this.tdList.iterator();
    TableDescriptor tblDes = null;
    int i = 0;
    while (itor.hasNext())
    {
      tblDes = itor.next();
      if (!tblDes.getName().equals(tableDes))
        continue;
      i = 1;
      break;
    }
    if (i == 1)
      return tblDes;
    return null;
  }

  public TableDescriptor getTableDescriptor(int tdIndex)
    throws IndexOutOfBoundsException
  {
    return this.tdList.get(tdIndex);
  }

  public ArrayList<TableDescriptor> getTableDescriptors()
  {
    return this.tdList;
  }

  public void setTableDescriptorType(String tdName, int tType)
    throws InvalidDescriptorNameException, InvalidFieldTypeException
  {
    Iterator<TableDescriptor> itor = this.tdList.iterator();
    int i = 0;
    while (itor.hasNext())
    {
      TableDescriptor tdItem = itor.next();
      if (!tdItem.getName().equals(tdName))
        continue;
      tdItem.setType(tType);
      i = 1;
      break;
    }
    if (i == 0)
      throw new InvalidDescriptorNameException(tdName + " is not the name of a current TableDescriptor");
  }

  public void addTableDescriptor(TableDescriptor tblDptor)
    throws InvalidDescriptorNameException
  {
    if (tblDptor.getName() == null)
      throw new InvalidDescriptorNameException("TableDescriptors with a null name cannot be added.");
    Iterator<TableDescriptor> itor = this.tdList.iterator();
    int i = 0;
    while (itor.hasNext())
    {
      TableDescriptor td = itor.next();
      if (!td.getName().equals(tblDptor.getName()))
        continue;
      i = 1;
      break;
    }
    if (i == 1)
      throw new InvalidDescriptorNameException(tblDptor.getName() + " is already a member of the TableDescription");
    this.tdList.add(tblDptor);
    this.tblDptManager.put(tblDptor.getName(), this.isValid);
  }

  public int getFieldCount()
  {
    return this.tdList.size();
  }

  public void setTableDescriptors(Collection<TableDescriptor> paramCollection)
  {
    this.tdList = new ArrayList<TableDescriptor>(paramCollection);
    Iterator<TableDescriptor> itor = this.tdList.iterator();
    while (itor.hasNext())
    {
      TableDescriptor td = itor.next();
      this.tblDptManager.put(td.getName(), this.isValid);
    }
  }

  public void removeTableDescriptor(int tdIndex)
    throws IndexOutOfBoundsException
  {
    this.tdList.remove(tdIndex);
  }

  public void removeTableDescriptor(String tblName)
    throws InvalidDescriptorNameException
  {
    Iterator<TableDescriptor> itor = this.tdList.iterator();
    int i = 0;
    for (int j = 0; itor.hasNext(); j++)
    {
      TableDescriptor tblDesc = (TableDescriptor)itor.next();
      if (!tblDesc.getName().equals(tblName))
        continue;
      i = 1;
      this.tdList.remove(j);
      break;
    }
    if (i != 1)
      throw new InvalidDescriptorNameException(tblName + " is not the name of a current TableDescriptor");
  }

  public boolean contains(String tblName)
  {
    return this.tblDptManager.get(tblName) != null;
  }
}
