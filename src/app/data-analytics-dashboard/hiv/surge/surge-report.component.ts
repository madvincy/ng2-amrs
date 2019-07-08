import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as rison from 'rison-node';
import * as Moment from 'moment';

import { SurgeReportBaseComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-base.component';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';



@Component({
  selector: 'surge-report',
  templateUrl: '../../../hiv-care-lib/surge-report/surge-report-base.component.html',
})
export class SurgeReportComponent extends SurgeReportBaseComponent implements OnInit {

  public enabledControls = 'weekControl,locationControl';

  constructor(
    public router: Router, public route: ActivatedRoute, public surgeReport: SurgeResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService, private location: Location) {
    super(router, route, surgeReport);
  }

  ngOnInit() {
    this.yearWeek = Moment(new Date()).format('YYYY-[W]WW');
    this.loadParametersFromUrl();
  }

  public generateReport() {
    this.storeParamsInUrl();
    super.generateReport();
  }

  public storeParamsInUrl() {
    this.setSelectedLocation();

    const state = {
      'year_week': this.yearWeek,
      'locationUuids': this.getSelectedLocations(this.locationUuids),
      'displayTabluarFilters': this.displayTabluarFilters
    };

    const stateUrl = rison.encode(state);
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'state': stateUrl
    };

    this.params = state;
    this.location.replaceState(path.toString());
  }

  public loadParametersFromUrl() {
    const path = this.router.parseUrl(this.location.path());

    if (path.queryParams['state']) {
      const state = rison.decode(path.queryParams['state']);
      this.yearWeek = state.year_week;
      this.generateReport();
    }

  }

  public setSelectedLocation() {
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
