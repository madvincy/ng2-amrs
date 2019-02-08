import { Injectable } from '@angular/core';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderSentenceGeneratorService {
  public concept: string;
  public words: any;
  public  sentence = [];
  public conceptName = [];
  public routes = [];
  public finalSentence: string;

  constructor(private conceptResourceService: ConceptResourceService,
   private  orderResourceService: OrderResourceService) { }

  public translateDraftOrderSentence (array) {
    for ( let i = 0; i <= array.length; i ++) {
      const value: any = array[i];
    this.conceptResourceService.getConceptByUuid(value).subscribe((res) => {
      this.concept = res.name.display;
    this.sentence.push (this.concept);
    }, (err) => {
    });
  }
    return this.sentence;

  }

  public getRouteName (route) {
    const routesSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.orderResourceService.getOrderEntryConfig().subscribe((data) => {
      this.routes = data.drugRoutes;
    for (let a = 0; a < this.routes.length; a++) {
       if (this.routes[a].uuid === route) {
        const mappedRoutes = {
          label: this.routes[a].display,
          routeUuid: this.routes[a].uuid
        };
        console.log(mappedRoutes );
        routesSearchResults.next(mappedRoutes);
          // console.log(this.routes[a]);
          // return this.routes[a].display;
       }
    }
    },
    (error) => {
      routesSearchResults.error(error);
    } );
    return routesSearchResults.asObservable();
  }
  public generateSentence (array) {
    this.finalSentence = array.join();
    return this.finalSentence;
  }
}
