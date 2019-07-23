import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';


@Component({
  selector: 'surge-report-tabular',
  templateUrl: './surge-report-tabular.component.html',
  styleUrls: ['./surge-report-tabular.component.css']
})
export class SurgeReportTabularComponent implements OnInit {
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;

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

  @Input()
  surgeWeeklyReportSummaryData: Array<any> = [];

  constructor() {}

  ngOnInit() {
    this.setCellSelection();
  }

  public setColumns(sectionsData: Array<any>) {
    const defs = [];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      created.children = [];
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < section.indicators.length; j++) {
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
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
  }

  private setCellSelection() {
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.onCellClicked = e => {
      const selectedIndicator = { headerName: e.colDef.headerName, field: e.colDef.field };
      this.indicatorSelected.emit(selectedIndicator);
    };
  }
}
