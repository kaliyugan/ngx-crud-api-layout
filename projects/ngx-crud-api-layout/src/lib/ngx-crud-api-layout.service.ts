import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class NgxCrudApiLayoutService {

  screenMode: string = 'NEW';
  save: boolean = false;
  update: boolean = false;
  constructor(private datePipe: DatePipe) {

  }

  keys(object: {}) {
    return Object.keys(object);
  }

  setScreenMode(mode) {
    this.screenMode = mode;
  }

  getScrenMode() {
    return this.screenMode;
  }

  isSaved() {
    return this.save;
  }

  setSaved(v) {
    this.save = v;
  }

  
  downloadAsExcel(fileName, sheetTitle, header, dataList) {

    console.log('-----------------');

    const title = sheetTitle;
    const header1 = header;
    let data = dataList;
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(sheetTitle);


    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
    worksheet.mergeCells('A1:D2');
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header1);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    worksheet.addRows(data);




    for (var i = 1; i <= header1.length; i++) {
      worksheet.getColumn(i).width = 20;
    }
    worksheet.addRow([]);








    //Footer Row
    let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    })



    console.log('end');
  }


}
