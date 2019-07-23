import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SurgeResourceService {
  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService,
    public cacheService: DataCacheService
  ) { }

  public getSurgeWeeklyReport(params: any): Observable<any> {
    return this.http.get(`${this.url}/surge-report?year_week=${params.year_week}&locationUuids=${params.locationUuids}`)
      .pipe(
        catchError((err: any) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        }),
        map((response: Response) => {
          return response;
        })
      );
  }

  public getSurgeWeeklyReportPatientList(indicator: string, year_week: string, locationUuid: string): Observable<any> {
    return this.http.
    get(`${this.url}/surge-report-patient-list?indicators=${indicator}&year_week=${year_week}&locationUuids=${locationUuid}`)
      .pipe(
        map((response: Response) => {
          return response;
        }),
        catchError((err: Error) => {
          const error: any = err;
          const errorObj = {
            error: error.status,
            message: error.statusText
          };
          return Observable.of(errorObj);
        })
      );
  }
}
