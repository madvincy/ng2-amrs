import { take } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HeiReportService } from './../../etl-api/hei-report.service';

@Component({
  selector: 'hei-indicators-report',
  templateUrl: './hei-indicators-report.component.html',
  styleUrls: ['./hei-indicators-report.component.css']
})
export class HeiIndicatorsReportComponent
  implements OnInit {

  @Input() locations = '';
  public params = {
    'startDate': '',
    'endDate': '',
    'locationUuids': ''
  };
  public heiSummary: any;
  public sectionDefs: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _heiReportService: HeiReportService
  ) { }

  public ngOnInit() {
  }

  public selectedFilter($event) {
    console.log('selected filter', $event);
    this.setParams($event);
    this.getHeiSummary(this.params);
  }

  public setParams(filterParams: any) {
     this.params = {
      'startDate': filterParams.startDate,
      'endDate': filterParams.endDate,
      'locationUuids': this.locations
     };

  }

  public getHeiSummary(params: any) {
     this._heiReportService.getHeiIndicatorsReport(params).subscribe((result) => {
       if (result) {
         this.heiSummary = result.result;
         this.sectionDefs = result.sectionDefinitions;
         console.log('summary', result);
       }
     });

  }


}
