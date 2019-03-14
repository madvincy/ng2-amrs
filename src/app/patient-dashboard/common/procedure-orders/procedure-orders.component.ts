import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PatientService } from '../../services/patient.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { ProcedureOrdersService } from './procedure-orders.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
import { flatMap, take } from 'rxjs/operators';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import * as Tesseract from 'tesseract.js';


@Component({
  selector: 'app-procedure-orders',
  templateUrl: './procedure-orders.component.html',
  styleUrls: ['./procedure-orders.component.css']
})
export class ProcedureOrdersComponent implements OnInit {
  public procedureOrders = [];
  public activeProcedureOrders = [];
  public inactiveProcedureOrders = [];
  public selectedOrders = [];
  public orderStatus = [];
  public reviseOrders;
  public error: string;
  public page = 1;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public subscription: Subscription;
  public addOrders = false;
  public addOrderSet = false;
  public searchText: string;
  public column: string;
  public isDesc = false;
  public drug: string;
  public previousOrder: string;
  public concept: string;
  public encounter: string;
  public route: string;
  public frequency: string;
  public orderReasonNonCoded: string;
  public instructions: string;
  private personUuid: string;
  private provider: string;
  private patient: any;
  private patientIdentifer: any;
  public loadingProcedureOrderStatus = true;
  public orderSent: any;
  public orderValue: any;
  public display = false;
  public displayStop = false;
  public displayEdit = false;
  public displayRenew = false;
  public displayNew = false;
  public selectedProcedure: string;
  public header: string;
  public status = false;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public errors: any = [];
  public proc = [];
  public successAlert: any = '';
  public currentDate;
  public selectedLocation: string;
  public locationList = false;
  public location: string;
  public submittedProcedureOrder;
  public subscriptions = [];
  public imageSaved = false;
  public imageUploadFailed = false;
  private procedure: string;
  public procedureList = false;
  public procedureName: string;
  public imageServerId: any;
  public imageText: string;
  public imageStatusValue: any;

  constructor(private patientService: PatientService,
    private userService: UserService,
    private orderResourceService: OrderResourceService,
    private ProcedureOrderService: ProcedureOrdersService,
    private encounterResourceService: EncounterResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private fileUploadResourceService: FileUploadResourceService,
    private conceptResourceService: ConceptResourceService,
    private obsResourceService: ObsResourceService,
  ) { }

  ngOnInit() {
    this.getCurrentlyLoadedPatient();
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.getProvider();
    this.getProcedures();
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.currentDate = Date.now();
  }

  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          const amrsId = _.find(this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (identifer.identifierType.uuid === '58a4732e-135x9-11df-a1f1-0026b9348838') {
                return true;
              }
            });
          if (amrsId) {
            this.patientIdentifer = amrsId.identifier;
          }
          this.getProcedureOrders();
        }
      }
    );
  }
  public getProvider() {
    this.ProcedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
  }

  public getProcedureOrders() {
    this.fetchingResults = true;
    const procedures = [];
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.orderResourceService.getAllOrdersByPatientUuuid(patientUuId, this.caresetting)
      .subscribe((data) => {
        data = data.results;
        data.forEach((value) => {
          if (value.orderType.uuid === 'a53c9e41-e265-11e8-b2c9-02420aff002f') {
            procedures.push(value);
            console.log(procedures, 'selectejxgZHXd');
          }
        });
        if (procedures) {
          this.procedureOrders = procedures.reverse();
          console.dir(this.procedureOrders);
          this.selectedOrders = this.procedureOrders;
          for (let i = 0; i < this.selectedOrders.length; i++) {
            console.log(this.checkResults(this.selectedOrders[i].uuid), 'ranything');
            // this.selectedOrders[i].status = this.checkResults(this.selectedOrders[i].uuid);
        }
        console.log(this.selectedOrders, 'selected');

          this.filterOrders(this.procedureOrders);
          this.procedureOrders.forEach((value) => {
            if (value.dateStopped) {
              this.inactiveProcedureOrders.push(value);
            } else if (!value.dateStopped) {
              this.activeProcedureOrders.push(value);
            }
          });
          this.fetchingResults = false;
          this.loadingProcedureOrderStatus = false;
          this.isBusy = false;
        }

        // check if procedure has results
        // if so change  results to be viewable and add  edit  ability to actions column
      });
  }
  private filterOrders(orders) {
    const orderStatus = [];
    orders.forEach((value) => {
      if (value.dateStopped) {
        orderStatus.push('INACTIVE');
      } else if (!value.dateStopped) {
        orderStatus.push('ACTIVE');
      }
    });
    if (orderStatus.length > 0) {
      this.orderStatus = this.getUniqueNames(orderStatus);
    }
  }
  private getUniqueNames(originArr) {
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
  private getProcedures() {
    this.ProcedureOrderService.getAllConcepts().subscribe((data) => {
      data = data.results;
      data.forEach((value) => {
        if (value.conceptClass.uuid === '8d490bf4-c2cc-11de-8d13-0010c6dffd0f') {
          this.proc.push(value);
        }
      });
    });
  }
  public getConceptsClass(searchText) {
    this.procedureList = true;
    let ProcedureResults: any[];
    const conceptClassesUuidArray = '8d490bf4-c2cc-11de-8d13-0010c6dffd0f';
    ProcedureResults = this.conceptResourceService.getConceptByConceptClassesUuid(searchText, conceptClassesUuidArray);
    console.log(ProcedureResults, 'ayee');

  }
  public procedureChanged(drug) {
    this.procedureList = false;
    this.procedureName = drug.name;
  }

  public addProc(show) {
    this.display = show;
    this.displayNew = show;
    this.header = 'New Procedure Order';
  }
  public dismissDialog() {
    this.display = false;
  }


  public saveOrder() {
    const procedureOrderPayload = this.createPayload();

    const encounterPayLoad = {
      patient: this.patient.uuid,
      encounterType: '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
      // encounterType: '6a664732-560c-4ad4-ac38-b59ebe330897',
      location: this.selectedLocation,
      encounterProviders: [{
        provider: this.provider,
        encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
      }]
    };

    if (this.error) {
      console.log(this.error);
      this.error = 'There was an error getting creating the Procedure Order';
    } else {

      this.encounterResourceService.saveEncounter(encounterPayLoad).subscribe((response: any) => {
        if (response) {
          procedureOrderPayload.encounter = response.uuid;
          this.orderResourceService.saveProcedureOrder(procedureOrderPayload).subscribe((res) => {
            this.submittedProcedureOrder = res;
            this.display = false;
            this.getProcedureOrders();
          });
        } else {
          this.error = 'Error creating Encounter';
        }
      });
    }

  }

  public createPayload() {
    let procedureOrderPayload;

    if (!this.procedure) {
      this.errors.push({
        message: 'Please Select A procedure'
      });
      setTimeout(() => {
        this.errors = false;
      }, 1000);
    } else {
      procedureOrderPayload = {
        patient: this.patient.uuid,
        careSetting: this.caresetting,
        orderer: this.provider,
        encounter: '',
        concept: this.procedure,
        type: 'order'
      };
      this.error = '';
    }
    return procedureOrderPayload;
  }

  public onFileChange(file, orderNumber) {
   this.fileUploadResourceService.upload(file).subscribe((result: any) => {
      this.imageServerId = result.image;
      console.log(this.imageServerId, 'salama sasa');
      const obsPayload = {
        obsDatetime: this.toDateString(new Date()),
        encounter: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        location: this.selectedLocation ,
        concept: 'c7aae9ad-ce25-46fc-897c-d92b40cf61d0',
        person: this.patient.uuid,
        value: this.imageServerId,
        order: orderNumber
      };

      console.log(obsPayload);


      this.obsResourceService.saveObs(obsPayload).pipe(take(1)).subscribe(
        (success) => {
          if (success) {
            console.log('success');
          }
        },
        (error) => {
          console.error('error', error);
        }
      );
    },
    (error) => {
      console.error('error', error);
    });

    // const imageValue = this.subscriptions.push(this.fileUploadResourceService.upload(file).pipe(flatMap((result: any) => {
    //   this.imageServerId = result.image;
    //   this.imageUploadFailed = false;
    //   this.imageSaved = false;
    //   return result.image;
    // })).pipe(take(1)).subscribe((patient) => {
    //   this.imageSaved = true;

    //   this.displaySuccessAlert();
    // }, (error) => {
    //   this.imageUploadFailed = true;
    // }));
    // converting image to text
    // Tesseract.recognize(file)
    //   .progress(result => {
    //     console.log(result, 'IMAGE 2 TEXT');
    //     if (result.status === 'recognizing text') {
    //       // this.progress.set(result.progress);
    //     }
    //   })
    //   .catch(e => {
    //     alert(e);
    //   })
    //   .then(result => {
    //     this.imageText = result.text;
    //   });



  }
  private displaySuccessAlert() {
    this.imageSaved = true;
    setTimeout(() => {
      this.imageSaved = false;
    }, 3000);
  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  checkResults(orderNumber) {
    const patientUuId = this.patient.uuid;
     this.obsResourceService.getObsPatientObsByOrder(patientUuId).subscribe((result: any) => {
      result = result.results;
      result.forEach((value) => {
         this.checkValue(value, orderNumber);
         console.error(this.checkValue(value, orderNumber));
         return this.imageStatusValue;

      });
    },
    (error) => {
      console.error('error', error);
    });
  }
  checkValue(value: any, orderNumber) {
    if (value.order) {
      if (value.order.uuid === orderNumber) {
        console.log(value.order.orderNumber, 'imagePresents');
        this.imageStatusValue = 1;
      } else  {
        this.imageStatusValue = 0;
       }
    } else {
      this.imageStatusValue = 0;
    }
  }

}
