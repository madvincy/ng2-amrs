import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'surge-report-tabular',
  templateUrl: './surge-report-tabular.component.html',
  styleUrls: ['./surge-report-tabular.component.css']
})
export class SurgeReportTabularComponent implements OnInit {

  // public name = 'Table';
  // public src = 'https://github.com/valor-software/ng2-table/tree/master/components/table';
  // public ts: string = ts;
  // public doc: string = doc;
  // public titleDoc:string = titleDoc;
  // public html:string = html;
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  public get surgeWeeklyReportSummaryData(): Array<any> {
    return this._rowDefs;
  }
  @Input('surgeWeeklyReportSummaryData')
  public set surgeWeeklyReportSummaryData(v: Array<any>) {
    this._rowDefs = v;
    this.setData(v);
  }
  public locationNumber = 0;
  public sectionIndicatorsValues: Array<any>;
  private _sectionDefs: Array<any>;
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }

  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v;
    this.setColumns(v);
  }

  @Output()
  public indicatorSelected = new EventEmitter();
  private _rowDefs: Array<any>;

  constructor() { }

  ngOnInit() {
    console.log(this.surgeWeeklyReportSummaryData);
    this.setCellSelection();
  }
  public setData(sectionsData: any) {
    this.sectionIndicatorsValues = sectionsData[0];

  }

  public setColumns(sectionsData: Array<any>) {
    const defs = [];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      created.children = [];
      // tslint:disable-next-line:prefer-for-of
      this.reportViewValues(section.indicators);
      for (let j = 0; j < section.indicators.length; j++) {
        const sectionIndicatorValues = [];
        let indicatorValue = '-';
        const indicatorDefinition = section.indicators[j].indicator;
        if (this.sectionIndicatorsValues[indicatorDefinition] || this.sectionIndicatorsValues[indicatorDefinition] === 0) {
          indicatorValue = this.sectionIndicatorsValues[indicatorDefinition];
        }
        sectionIndicatorValues.push([indicatorValue]);
        // for (const key in this.sectionIndicatorsValues) {
        //   if (this.sectionIndicatorsValues[i][key].indexOf(toSearch) !== -1) {
        //     console.log('found', this.sectionIndicatorsValues[i][key]);
        //   }
        // }
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          value: sectionIndicatorValues,
          width: 250
        };
        created.children.push(child);
        // child[0];
      }
      defs.push(created);
    }

    this.gridOptions.columnDefs = defs;

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
    // console.log(this.surgeWeeklyReportSummaryData);
  }
  public findPage(pageMove) {
    console.log(this.locationNumber);
    if (pageMove === 'next') {
      const i = this.locationNumber + 1;
      console.log(i);
      this.locationNumber = i;
      this.sectionIndicatorsValues = this.surgeWeeklyReportSummaryData[i];
      this.setColumns(this.sectionDefs);
    } else {
      const i = this.locationNumber - 1;
      if (i >= 0) {
        this.sectionIndicatorsValues = this.surgeWeeklyReportSummaryData[i];
        this.setColumns(this.sectionDefs);
      }

    }
  }
  public reportViewValues(value) {

  }
  private setCellSelection(col?) {
    console.log(col);
    if (col) {
      const selectedIndicator = { headerName: col.headerName, field: col.field };
      this.indicatorSelected.emit(selectedIndicator);
    } else {
      this.gridOptions.rowSelection = 'single';
      this.gridOptions.onCellClicked = e => {
        const selectedIndicator = { headerName: e.colDef.headerName, field: e.colDef.field };
        this.indicatorSelected.emit(selectedIndicator);
      };
    }
  }
  public downloadPdf() {

    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }
}
