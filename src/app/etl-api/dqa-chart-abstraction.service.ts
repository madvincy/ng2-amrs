import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DqaChartAbstractionService {

  constructor(
    public http: HttpClient,
    public appSettingsService: AppSettingsService
  ) { }


  public get url(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getDqaChartAbstractionReport(params: any): Observable<any> {
    return of(this.testData());
    // tslint:disable-next-line: max-line-length
    // const requestUrl = this.url + 'dqa-report';
    // return this.http.get(requestUrl, {
    // }).pipe(
    //   map((response: Response) => {
    //     console.log('RESPONSE', response);
    //     return response;
    //   }), catchError((err: any) => {
    //     console.log('Err', err);
    //     const error: any = err;
    //     const errorObj = {
    //       'error': error.status,
    //       'message': error.statusText
    //     };
    //     return of(errorObj);
    //   }));
  }


  // tslint:disable-next-line: member-ordering
  public testData() {
    return [
      {
        'location_uuid': '1ada636b-08b9-46b3-b03c-5cc16f732f2e',
        'location': 'Kitale',
        'results': [
          {
            'uuid': '1ada636b-08b9-46b3-b03c-5cc16f732f2e',
            'person_id': 753914,
            'identifiers': '24132KT-7',
            'person_name': 'Mohammed Juma Karanja',
            'gender': 'M',
            'birthdate': '1968-01-01',
            'age': 51,
            'last_appointment_date': '2019-10-23 13:34:21',
            'next_appointment': '2019-11-20 00:00:00',
            'drugs_given': '3TC ## EFV ## TDF',
            'weight': 50,
            'height': 168,
            'BMI': 17.7154,
            'condom_provided_this_visit': 1,
            'tb_screened_this_visit': 1,
            'last_ipt_start_date': '2016-03-08 00:00:00'
          },
          {
            'uuid': '5b8b0a94-1359-11df-a1f1-0026b9348838',
            'person_id': 6986,
            'identifiers': '1724WB-6, 5208KT-8, 16161-01307',
            'person_name': 'Roseline Navayo Chesoli',
            'gender': 'F',
            'birthdate': '1974-02-02',
            'age': 45,
            'last_appointment_date': '2019-10-23 13:29:02',
            'next_appointment': '2019-11-06 00:00:00',
            'drugs_given': '3TC ## TDF ## DTG',
            'weight': 56,
            'height': 159,
            'BMI': 22.1510,
            'condom_provided_this_visit': 1,
            'tb_screened_this_visit': 1,
            'last_ipt_start_date': '2006-04-13 00:00:00'
          }
        ]
      }
      // tslint:disable-next-line: semicolon
    ]
  }

}

