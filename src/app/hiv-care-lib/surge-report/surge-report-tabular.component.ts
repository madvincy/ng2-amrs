import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';
import { SearchService } from './search.service';



@Component({
  selector: 'surge-report-tabular',
  templateUrl: './surge-report-tabular.component.html',
  styleUrls: ['./surge-report-tabular.component.css']
})
export class SurgeReportTabularComponent implements OnInit {

  @Input() displayTabluarFilters: Boolean;
  public currentView = 'pdf';
  searchTerm$ = new Subject<string>();
  public test = [];
  results: Object;
  public headers = [];
  public selectedIndicatorsList = [];
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
  public selectedResult: string;
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

  constructor(private searchService: SearchService) {
    // this.searchService.search(this.searchTerm$)
    //   .subscribe(results => {
    //     this.results = results;
    //   });
  }

  ngOnInit() {
    console.log(this.surgeWeeklyReportSummaryData);
    this.setCellSelection();
  }
  public setData(sectionsData: any) {
    this.sectionIndicatorsValues = sectionsData[0];

  }
  public searchIndicator() {
    this.setColumns(this.sectionDefs);
    console.log(this.gridOptions);
    if (this.selectedResult.length > 0) {
      this.gridOptions.columnDefs.forEach(object => {
        const make = {
          headerName: '',
          children: []
        };
        object.children.forEach(object2 => {
          if (object2['headerName'].toLowerCase().match(this.selectedResult) !== null) {
            make.headerName = object['headerName'];
            make.children.push(object2);
          }
        });
        if (make.headerName !== '') {
          this.test.push(make);
        }
      });
      this.gridOptions.columnDefs = [];
      this.gridOptions.columnDefs = this.test;
      console.log(this.test);
      this.test = [];
    } else {
      this.setColumns(this.sectionDefs);
    }
  }

  public setColumns(sectionsData: Array<any>) {
    this.headers = [];
    const defs = [];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      const header = {
        label: section.sectionTitle ,
        value: i
      };
      this.headers.push(header);
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
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          description: section.indicators[j].description,
          value: sectionIndicatorValues,
          width: 250
        };
        created.children.push(child);
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
      console.log(canvas);
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
  public selectedIndicators() {
    this.setColumns(this.sectionDefs);
    this.selectedIndicatorsList.push(0);
    const value = [];
    if (this.selectedIndicatorsList.length) {
      this.selectedIndicatorsList.forEach( indicator => {
        if (indicator !== 0) {
          value.push(this.gridOptions.columnDefs[indicator]);
        }
      });
      this.gridOptions.columnDefs = value;
    } else {
     this.setColumns(this.sectionDefs);
    }
  }
}