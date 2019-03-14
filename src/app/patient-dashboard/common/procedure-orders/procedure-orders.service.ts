import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import {of as observableOf} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProcedureOrdersService {
  public v = 'custom:(uuid,display,conceptClass)';


  constructor(private providerResourceService: ProviderResourceService,
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private conceptResourceService: ConceptResourceService) { }
  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'concept';
  }
  public getProviderByPersonUuid(uuid) {
    const providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.providerResourceService.getProviderByPersonUuid(uuid)
      .subscribe(
        (provider) => {
          const mappedProvider = {
            label: (provider as any).display,
            value: (provider as any).person.uuid,
            providerUuid: (provider as any).uuid
          };
          providerSearchResults.next(mappedProvider);
        },
        (error) => {
          providerSearchResults.error(error);
        }

      );
    return providerSearchResults.asObservable();
  }


  public getAllConcepts(cached: boolean = false, v: string = null):
    Observable<any> {
    const url = this.getUrl();
    const params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    }).map((response) => {
      return response;
    });
    // return this.http.get(url, {
    //   params: params
    // }).pipe(flatMap((procedures: any) => {

    //   if (procedures.results.length >= 500) {
    //     params = params.set('startIndex', '500');
    //     return this.http.get<any>(url, {
    //       params: params
    //     }).pipe(map((res) => {
    //       console.log(res, 'dsadsajagsda');

    //       return procedures.results.concat(res.results);

    //     }));

    //   } else {

    //     return observableOf(procedures.results);
    //   }

    // }));
  }


}
