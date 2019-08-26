
import { take } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'hei-indicators-pdf-view',
  templateUrl: './hei-indicators-pdf-view.component.html',
  styleUrls: ['./hei-indicators-pdf-view.component.css']
})
export class HeiIndicatorsPdfViewComponent
  implements OnInit, OnChanges {

  @Input() heiMonthlySummary = [];
  @Input() params: any;
  @Input() sectionDefs: any;
  public heiSummaryColdef = [];
  public data = [];
  public heisummaryGridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    groupDefaultExpanded : -1,
    onGridSizeChanged: () => {},
    onGridReady: () => {}
  };

  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.heiMonthlySummary) {
        this.processSummaryData(this.heiMonthlySummary);
    }
  }

  public processSummaryData(results) {
    this.data = results;
    this.setRowData(results);

  }
  public onCellClicked(event) {
    this.goToPatientList(event);
  }

  public setRowData(results) {
      const reportData = [];
      const sectionDefs = this.sectionDefs;
      console.log('sectionDefs', sectionDefs);

  }



public goToPatientList(data) {
      console.log('GotoPatientlist', data);

      // let queryParams = this.route.snapshot.params;
      const params: any = {
          locationUuids: data.data.location_uuid,
          indicators: data.colDef.field,
          startDate: this.params.startDate,
          endDate: this.params.endDate
      };
      console.log('Data', data);

      this._router.navigate(['./patient-list']
          , {
              relativeTo: this._route,
              queryParams: params
          });
     }


}
