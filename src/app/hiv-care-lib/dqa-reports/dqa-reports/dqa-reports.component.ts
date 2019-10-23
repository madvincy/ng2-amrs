import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClinicDashboardCacheService } from 'src/app/clinic-dashboard/services/clinic-dashboard-cache.service';

@Component({
  selector: 'app-dqa-reports',
  templateUrl: './dqa-reports.component.html',
  styleUrls: ['./dqa-reports.component.css']
})
export class DqaReportsComponent implements OnInit {
  public title = 'DQA Report';
  public dqaReportTypes: any = require('./dqa-reports.json');
  constructor(   private router: Router,
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  public navigateToReport(reportName: any) {
    this.router.navigate(['dqa-report-patientlist'], {
      relativeTo: this.route,
      queryParams: {
        reportId: reportName.id,
        locationUuids: reportName.location
      }
    });
  }
}
