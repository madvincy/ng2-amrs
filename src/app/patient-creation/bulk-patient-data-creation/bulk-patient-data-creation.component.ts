import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { PatientCreationService } from '../patient-creation.service';
import { PatientCreationResourceService } from 'src/app/openmrs-api/patient-creation-resource.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-bulk-patient-data-creation',
  templateUrl: './bulk-patient-data-creation.component.html',
  styleUrls: ['./bulk-patient-data-creation.component.css']
})
export class BulkPatientDataCreationComponent implements OnInit {
  public persons: any;
  public patients: Patient[];
  public referred: any[] = [];
  public errors: any[] = [];
  public isResetButton: boolean = true;
  public totalPatients: number;
  public isLoading: boolean = false;
  public dataLoaded: boolean = false;
  public hasConductedSearch = false;
  public page: number = 1;
  public adjustInputMargin: string = '240px';
  public subscription: Subscription;
  public referralSubscription: Subscription;
  public title: string = 'Patient Search';
  public errorMessage: string = '';
  public noMatchingResults: boolean = false;
  public lastSearchString: string = '';
  public providerUuid: string = '';
  public userId;
  public payloads: any = [];
  public failedPayloads: any = [];

  constructor(
    private patientCreationService: PatientCreationService,
    private patientCreationResourceService: PatientCreationResourceService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.userId = this.userService.getLoggedInUser().openmrsModel.systemId;
  }
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      if (jsonData.data) {
        this.persons = jsonData.data;
        this.createPatients(this.persons);
        // console.log(this.persons);
      }
    }
    reader.readAsBinaryString(file);
  }
  public createPatients(patient) {
   
    let patientIdentifiers = [];
    let patientIdentifier = '';
    patient.forEach(person => {
      // generating identifiers
      const ids = [];
      const attributes = [];
      this.patientCreationService.generateIdentifier(this.userId).pipe(take(1)).subscribe((data: any) => {
        console.log(person.HospitalNumber)
        if(data) {
          ids.push({
            identifierType: '58a4732e-1359-11df-a1f1-0026b9348838',
            identifier: data.identifier,
            location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
            preferred: true
          });
        }
        if(person.KenyaNationalId){
          ids.push({
            identifierType: '58a47054-1359-11df-a1f1-0026b934883',
            identifier: person.KenyaNationalId,
            location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
            preferred: false
          });
        }
        if(person.HospitalNumber) {
          ids.push({
            identifierType: '3dd5882d-6de9-4784-b350-79c0d3da3883',
            identifier: person.HospitalNumber,
            location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
            preferred: false
          });
          
        }
      });
      // this.errorAlert = false;
      // setting up identifiers


      if (person.patientPhoneNumber) {
        attributes.push({
          value: person.patientPhoneNumber,
          attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
        });
      }
      if (person.alternativePhoneNumber) {
        attributes.push({
          value: person.alternativePhoneNumber,
          attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
        });
      }
      if (person.partnerPhoneNumber) {
        attributes.push({
          value: person.partnerPhoneNumber,
          attributeType: 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46'
        });
      }
      if (person.nextofkinPhoneNumber) {
        attributes.push({
          value: person.nextofkinPhoneNumber,
          attributeType: 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d'
        });
      }
      const dateFormat = 'MMM dd, yyyy';
      const payload = {
        person: {
          names: [{
            givenName: person.givenName,
            middleName: person.middleName,
            familyName: person.familyName
          }],
          gender: person.gender,
          birthdate: person.birthDate,
          birthdateEstimated: person.birthdateEstimated,
          attributes: attributes,
          dead: person.dead,
          deathDate: person.deathDate,
          deathdateEstimated: person.deathdateEstimated,
          causeOfDeath: person.causeOfDeath,
          dateCreated: person.dateCreated,
          // creator: this.getCreator(person.creatorName),
          addresses: [{
            address1: person.address1 || null,
            address2: person.address2 || null,
            address3: person.address3 || null,
            address4: person.address4 ,
            address5: person.address5,
            address6: person.address6,
            address7: person.address7,
            address8: person.address8,
            address9: person.address9,
            address10: person.address10,
            address11: person.address11,
            address12: person.address12,
            address13: person.address13,
            address14: person.address14,
            address15: person.address15,
            cityVillage: person.cityVillage,
            latitude: person.latitude,
            longitude: person.longitude,
            stateProvince: person.stateProvince
          }]
        },
        identifiers: ids
      };
      setTimeout(() => {
        this.payloads.push(payload);
      }, 300);     
    });
  }
  public uploadPatients() {
    let count = 0;
    this.payloads.forEach(payload => {
      setTimeout(() => {
        count = count + 1;
        console.log('count')
        this.createNewPatient(payload); 
      }, 200); 
    });
  }
  public createNewPatient(payload) {
        this.patientCreationResourceService.savePatient(payload).pipe(
        take(1)).subscribe((success) => {
          if(success) {
            console.log('patient created')
          }
        }, (err) => {
          this.failedPayloads.push(payload);
            console.log('error', payload);
        });
  }
  public getCreator(userName) {
    //would use uuid but they dont exist by the uuid
  //   this.userService.getUserByUuid(useruuid).pipe(
  //     take(1)).subscribe((result) => {
  //       const specificCreator = {
  //         'id': result.uuid,
  //         'itemName': result.person.display
  //       };
  //     });
  // });
  console.log(userName);
  //only use on kakamega
  this.userService
  .searchUsers(userName).pipe(
    take(1)).subscribe((results) => {
      if (results[0] && results[0].uuid ) {
        console.log(results[0].uuid)
        return results[0].uuid;
      } else {
        return '6564deb6-46ae-4b0d-af15-8fb31bde6c9b';
      }
    });
    

  }
  public createFailedSheet() {
   console.log(this.failedPayloads, 'failed');
  }
}
