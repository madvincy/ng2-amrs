import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import { Subject } from 'rxjs';

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

  ngOnInit() {
    this.setCellSelection();
  }
  public setData(sectionsData: any) {
    this.sectionIndicatorsValues = sectionsData;

  }
  public searchIndicator() {
    this.setColumns(this.sectionDefs);
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
      this.test = [];
    } else {
      this.setColumns(this.sectionDefs);
    }
  }

  public setColumns(sectionsData: Array<any>) {
    this.headers = [];
    const defs = [];
    const locations = ['locations'];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      const header = {
        label: section.sectionTitle,
        value: i
      };
      this.headers.push(header);
      created.children = [];
      for (let j = 0; j < section.indicators.length; j++) {
        const sectionIndicatorValues = [];
        const indicatorDefinition = section.indicators[j].indicator;
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          description: section.indicators[j].description,
          value: [],
          width: 360
        };
        this.sectionIndicatorsValues.forEach(element => {
          const val = {
            location: element['location_uuid'],
            value: '-'
          };
          if (element[indicatorDefinition] || element[indicatorDefinition] === 0) {
            val.value = element[indicatorDefinition];
          }
          child.value.push(val);
        });
        created.children.push(child);
      }
      defs.push(created);
    }
    console.log(this.gridOptions.columnDefs);
    this.gridOptions.columnDefs = defs;

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }
  public findPage(pageMove) {
    if (pageMove === 'next') {
      const i = this.locationNumber + 1;
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

  private setCellSelection(selectedInd?) {
    if (selectedInd) {
      this.indicatorSelected.emit(selectedInd);
    } else {
      this.gridOptions.rowSelection = 'single';
      this.gridOptions.onCellClicked = e => {
        const selectedIndicator = { headerName: e.colDef.headerName, field: e.colDef.field, location: e.data.location_uuid };
        this.indicatorSelected.emit(selectedIndicator);
      };
    }
  }
  public selectedIndicators() {
    this.setColumns(this.sectionDefs);
    const value = [];
    if (this.selectedIndicatorsList.length) {
      this.selectedIndicatorsList.forEach(indicator => {
        value.push(this.gridOptions.columnDefs[indicator]);
      });
      this.gridOptions.columnDefs = value;
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
}
