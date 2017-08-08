package com.hq.bm.utils.shapefile;

/**
 * 属性集
 */

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class Record
{
  private ArrayList<RecordField> records = new ArrayList<RecordField>();  //属性集合

  public Record()
  {
  }

  public Record(Collection<RecordField> Recs)
  {
    this.records = new ArrayList<RecordField>(Recs);
  }

  public void setField(RecordField field)
    throws InvalidFieldNameException
  {
    Iterator<RecordField> itor = this.records.iterator();
    int i = 0;
    while (itor.hasNext())
    {
      RecordField nField = (RecordField)itor.next();
      if (!nField.getName().equals(field.getName()))
        continue;
      i = 1;
      nField.setName(field.getName());
      nField.setValue(field.getValue());
      break;
    }
    if (i == 0)
      throw new InvalidFieldNameException(field.getName() + " is not the name of a current RecordField.");
  }

  public void setFields(Collection<RecordField> fileds)
  {
    this.records = new ArrayList<RecordField>(fileds);
  }

  public void addField(RecordField fld)
    throws InvalidFieldNameException
  {
    Iterator<RecordField> itor = this.records.iterator();
    int i = 0;
    while (itor.hasNext())
    {
      RecordField nField = (RecordField)itor.next();
      if (!nField.getName().equals(fld.getName()))
        continue;
      i = 1;
      break;
    }
    if (i == 1)
      throw new InvalidFieldNameException("There already exists a RecordField with the name " + fld.getName());
    this.records.add(new RecordField(fld.getName(), fld.getValue()));
  }

  public void removeField(String fldName)
    throws InvalidFieldNameException
  {
    Iterator<RecordField> itor = this.records.iterator();
    int found = 0;
    for (int j = 0; itor.hasNext(); j++)
    {
      RecordField nFld = (RecordField)itor.next();
      if (!nFld.getName().equals(fldName))
        continue;
      found = 1;
      this.records.remove(j);
      break;
    }
    if (found != 1)
      throw new InvalidDescriptorNameException(fldName + " is not the name of a current RecordField");
  }

  public void removeField(int fIndex)
    throws IndexOutOfBoundsException
  {
    this.records.remove(fIndex);
  }

  public RecordField getField(String fName)
  {
    Iterator<RecordField> itor = this.records.iterator();
    RecordField nField = null;
    int found = 0;
    while (itor.hasNext())
    {
      nField = (RecordField)itor.next();
      if (!nField.getName().equals(fName))
        continue;
      found = 1;
      break;
    }
    if (found == 1)
      return nField;
    return null;
  }

  public RecordField getField(int fIndex)
    throws IndexOutOfBoundsException
  {
    return (RecordField)this.records.get(fIndex);
  }

  public ArrayList<RecordField> getFields()
  {
    return this.records;
  }

  public int getFieldCount()
  {
    return this.records.size();
  }
}