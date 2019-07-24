import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import * as Moment from 'moment';

import { SurgeReportBaseComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-base.component';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';

@Component({
  selector: 'surge-report',
  templateUrl: '../../../hiv-care-lib/surge-report/surge-report-base.component.html',
})
export class SurgeReportComponent extends SurgeReportBaseComponent implements OnInit {

  public enabledControls = 'datesControl,locationControl';
  constructor(
    public router: Router, public route: ActivatedRoute, public surgeReport: SurgeResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService) {
    super(router, route, surgeReport);
  }

  ngOnInit() {
  }

  public generateReport() {
    this.getLocationsSelected();
    this.setQueryParams(this.locationUuids);
    super.generateReport();

  }

  public setQueryParams(params: any) {
    const queryParams = {
      'year_week': Moment(this.yearWeek).format('YYYYWW'),
      'locationUuids': this.getSelectedLocations(this.locationUuids)
    };
    this.params = queryParams;
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getLocationsSelected() {
    this.dataAnalyticsDashboardService.getSelectedLocations().pipe(take(1)).subscribe(
      (data) => {
        if (data) {
          this.locationUuids = data.locations;
        }
      });
  }

  private getSelectedLocations(locationUuids: any): string {
    if (!locationUuids || locationUuids.length === 0) {
      return '';
    }

    let selectedLocations = '';

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations = selectedLocations + ',' + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }

  public onTabChanged(val) {
    if (this.currentView === 'daily') {
      this.currentView = 'weekly';
      this.enabledControls = 'weekControl,locationControl';
    } else {
      this.enabledControls = 'datesControl,locationControl';
      this.currentView = 'daily';
    }
  }
}
