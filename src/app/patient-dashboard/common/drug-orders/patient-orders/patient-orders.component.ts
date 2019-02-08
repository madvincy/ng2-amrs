import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { AppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytics.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';


@Component({
  selector: 'app-patient-orders',
  templateUrl: './patient-orders.component.html',
  styleUrls: ['./patient-orders.component.css']
})
export class PatientOrdersComponent implements OnInit {
  patient: any;
  patientOrders = [];
  error: string;
  page = 1;
  fetchingResults: boolean;
  isBusy: boolean;
  subscription: Subscription;
  displayDialog = false;
  currentOrder: any;
  orderType;
  orderTypes = [];
  private allItemsSelected = false;
  private copies = 2;
  private patientIdentifer: any;
  private isPrinting = false;
  private collectionDate = new Date();
  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private orderResourceService: OrderResourceService
  ) {}

  ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Orders Loaded', 'ngOnInit');
      this.getCurrentlyLoadedPatient();
  }

  getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          const amrsId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.identifierType.uuid === '58a4732e-1359-11df-a1f1-0026b9348838') {
                return true;
              }
            });
          if (amrsId) {
            this.patientIdentifer = amrsId.identifier;
          }
          this.getPatientOrders();
        }
      }
    );
  }

  getPatientOrders() {
    this.fetchingResults = true;
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.orderResourceService.getOrdersByPatientUuid(patientUuId)
      .subscribe((result) => {
        this.patientOrders = result.results;
        console.log(this.patientOrders, 'each order');
        this.orderTypes = this.getOrderTypes(this.patientOrders);
        this.patientOrders.sort((a, b) => {
          const key1 = a.dateActivated;
          const key2 = b.dateActivated;
          if (key1 > key2) {
            return -1;
          } else if (key1 === key2) {
            return 0;
          } else {
            return 1;
          }
        });
        this.fetchingResults = false;
        this.isBusy = false;
      }, (err) => {
        this.error = err;
        console.log('error', this.error);
      });
  }

  getOrderTypes(orders) {
    let newOrderTypes = [];
    orders.forEach((value) => {
      newOrderTypes.push(value.orderType.display);
    });
    if (newOrderTypes) {
      newOrderTypes = this.getUniqueNames(newOrderTypes);
      return newOrderTypes;
    }
  }

  getUniqueNames(originArr) {
    const newArr = [];
    const originLength = originArr.length;
    let found, x, y;
    for (x = 0; x < originLength; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
        if (originArr[x] === newArr[y]) {
          found = true;
          break;
        }
      }
      if (!found) {
        newArr.push(originArr[x]);
      }
    }
    return newArr;
  }

}
