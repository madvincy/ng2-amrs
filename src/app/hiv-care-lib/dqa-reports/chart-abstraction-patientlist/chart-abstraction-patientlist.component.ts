import { Component, OnInit } from '@angular/core';
import { DqaChartAbstractionService } from 'src/app/etl-api/dqa-chart-abstraction.service';
import { Router, ActivatedRoute } from '@angular/router';
import moment = require('moment');

@Component({
  selector: 'app-chart-abstraction-patientlist',
  templateUrl: './chart-abstraction-patientlist.component.html',
  styleUrls: ['./chart-abstraction-patientlist.component.css']
})
export class ChartAbstractionPatientlistComponent implements OnInit {
  public extraColumns: Array<any> = [];
  public params: any;
  public patientData: any;
  public nextStartIndex = 0;
  public overrideColumns: Array<any> = [];
  public hasLoadedAll = false;
  public allDataLoaded = false;
  public previousButton = false;
  public isLoading = true;

  constructor(public dqaResource: DqaChartAbstractionService, private router: Router, private route: ActivatedRoute, ) { }

  ngOnInit() {
    let requestParams: any;
    this.addExtraColumns();
    this.route
      .queryParams
      .subscribe((params) => {
        if (params) {
          this.params = params;
          requestParams = {
            locations: this.params.locationUuids,
            limit: 300,
            offset: 0
          };

          this.getPatientList(requestParams);
        }
      }, (error) => {
        console.error('Error', error);
      });
  }
  private getPatientList(params: any) {
    this.dqaResource.getDqaChartAbstractionReport(params)
      .subscribe(
        (data) => {
          this.patientData = data.results.results;
          this.isLoading = false;
          console.log(this.allDataLoaded);
          if (this.allDataLoaded) {
            this.hasLoadedAll = false;
          } else {
            this.hasLoadedAll = true;
          }
        }
      );
  }
  public addExtraColumns() {
    const extraColumns = {
      person_id: 'Unique Patient ID',
      birthdate: 'DOB',
      last_appointment_date: 'Date Of Last Appointment',
      next_appointment: 'Date Of Next Appointment ',
      drugs_given: 'Drugs Given',
      weight: 'Weight',
      height: 'Height',
      BMI: 'BMI',
      condom_provided_this_visit: 'Condom Issued',
      tb_screened_this_visit: 'TB screening',
      last_ipt_start_date: 'IPT initiated'
    };
    for (const indicator in extraColumns) {
      if (indicator) {
        this.extraColumns.push({
          headerName: extraColumns[indicator],
          field: indicator
        });
      }
    }
  }
  public loadMoreDQAList(option) {
    this.previousButton = true;
    this.isLoading = true;
    let loadMoreParams: any;
    loadMoreParams = {
      locations: this.params.locationUuids,
      limit: 300,
      offset: 0
    };
    if (this.nextStartIndex > 300 && option === 'prev') {
      this.nextStartIndex -= this.patientData.length;
      loadMoreParams.offset = this.nextStartIndex;
      this.getPatientList(loadMoreParams);
    }
    if (option === 'next') {
      this.nextStartIndex += this.patientData.length;
      loadMoreParams.offset = this.nextStartIndex;
      this.getPatientList(loadMoreParams);
    }
    if (option === 'all') {
      loadMoreParams.limit = 200000000000;
      this.nextStartIndex = 0;
      loadMoreParams.offset = this.nextStartIndex;
      this.getPatientList(loadMoreParams);
      this.allDataLoaded = true;
    }


    // this.cacheDefaulterListParam(loadMoreParams);
    //   return params;
  }
  public goBack() {
    this.route.parent.parent.params.subscribe((params) => {
      const locationUuid = params['location_uuid'];
      this.router.navigate(['clinic-dashboard/' + locationUuid + '/hiv/dqa-reports']);
    });
  }
}
