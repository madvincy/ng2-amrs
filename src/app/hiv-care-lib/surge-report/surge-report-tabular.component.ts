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
  results: Object;
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  public get surgeReportSummaryData(): Array<any> {
    return this._rowDefs;
  }
  @Input('surgeReportSummaryData')
  public set surgeReportSummaryData(v: Array<any>) {
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


  public setColumns(sectionsData: Array<any>) {
    const defs = [];
    const locations = ['locations'];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
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

  private setCellSelection() {
      this.gridOptions.rowSelection = 'single';
      this.gridOptions.onCellClicked = e => {
        const selectedIndicator = { headerName: e.colDef.headerName, field: e.colDef.field, location: e.data.location_uuid };
        this.indicatorSelected.emit(selectedIndicator);
      };
  }
}
