import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';


declare const jsPDF: any;

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
    console.log(sectionsData);
    this.sectionIndicatorsValues = sectionsData[0];

  }

  public setColumns(sectionsData: Array<any>) {
    const defs = [];
    console.log(sectionsData);
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      created.children = [];
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < section.indicators.length; j++) {
        console.log(section.indicators[j], 'swavinsy2');
        const sectionIndicatorValues = [];
        let indicatorValue = '-';
        const indicatorDefinition = section.indicators[j].indicator;
        console.log(this.sectionIndicatorsValues[indicatorDefinition], 'swavinsy');
        if (this.sectionIndicatorsValues[indicatorDefinition] || this.sectionIndicatorsValues[indicatorDefinition] === 0) {
            indicatorValue = this.sectionIndicatorsValues[indicatorDefinition];
        }
        sectionIndicatorValues.push([ indicatorValue ]);
        // for (const key in this.sectionIndicatorsValues) {
        //   if (this.sectionIndicatorsValues[i][key].indexOf(toSearch) !== -1) {
        //     console.log('found', this.sectionIndicatorsValues[i][key]);
        //   }
        // }
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          value: sectionIndicatorValues
        };
        created.children.push(child);
      }
      defs.push(created);
    }
    console.log(defs);

    this.gridOptions.columnDefs = defs;
    console.log(this.gridOptions);

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
    console.log(this.surgeWeeklyReportSummaryData);
  }

  private setCellSelection() {
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.onCellClicked = e => {
      const selectedIndicator = { headerName: e.colDef.headerName, field: e.colDef.field };
      this.indicatorSelected.emit(selectedIndicator);
    };
  }
  public downloadPdf() {

      const doc = new jsPDF('p', 'pt');
      const res = doc.autoTableHtmlToJson(document.getElementById('example'));
      doc.autoTable(res.columns, res.data, {margin: {top: 80}});
      const header = function(data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.text('Testing Report', data.settings.margin.left, 50);
      };
      const options = {
        beforePageContent: header,
        margin: {
          top: 80
        },
        startY: doc.autoTableEndPosY() + 20
      };
      doc.autoTable(res.columns, res.data, options);
      doc.save('table.pdf');
  }
}
