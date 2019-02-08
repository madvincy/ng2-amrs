import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EtlApi } from '../../etl-api/etl-api.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Angulartics2Module } from 'angulartics2';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import {
  PatientEncountersComponent
} from './patient-encounters/patient-encounters.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { FormsComponent } from './forms/forms.component';
import { LabDataSummaryComponent } from './lab-data-summary/lab-data-summary.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { VisitComponent } from './visit/visit.component';
import { EditVisitTypeComponent } from './visit/visit-details/edit-visit-type.component';
import {
  PatientIdentifierComponent
} from './patient-identifier/patient-identifier.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientSearchService } from '../../patient-search/patient-search.service';
import { FormOrderMetaDataService } from './forms/form-order-metadata.service';
import { FormListService } from './forms/form-list.service';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { PatientEncounterService } from './patient-encounters/patient-encounters.service';
import { EncounterListComponent } from './patient-encounters/encounter-list.component';
import {
  PatientEncounterObservationsComponent
} from './patient-encounters/patient-encounter-observations.component';
import { PatientService } from '../services/patient.service';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { LabSyncComponent } from './lab-data-summary/lab-sync.component';
import { HivSummaryService } from '../hiv/hiv-summary/hiv-summary.service';
import { LabResultComponent } from './lab-data-summary/lab-result.component';
import { ContactsComponent } from './patient-info/contacts.component';
import { AddressComponent } from './patient-info/address.component';
import { PatientDemographicsComponent } from './patient-info/patient-demograpics.component';
import { PatientVitalsService } from './patient-vitals/patient-vitals.service';
import { FormSchemaService } from './formentry/form-schema.service';
import { UtilsModule } from '../../utils/utils.module';
import { FormDataSourceService } from './formentry/form-data-source.service';
import { FormentryComponent } from './formentry/formentry.component';
import { PrettyEncounterViewerComponent } from './formentry/pretty-encounter-viewer.component';
import { FormentryHelperService } from './formentry/formentry-helper.service';
import { FormEntryModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { FromentryGuard } from './formentry/formentry.guard';
import { PatientPreviousEncounterService } from '../services/patient-previous-encounter.service';
import {
  FormCreationDataResolverService
} from './formentry/form-creation-data-resolver.service';
import { LabTestOrdersComponent } from './lab-orders/lab-test-orders.component';
import { FormSubmissionService } from './formentry/form-submission.service';
import { PatientReminderService } from './patient-reminders/patient-reminders.service';
import { DraftedFormsService } from './formentry/drafted-forms.service';
import { DraftedFormNavComponent } from './formentry/drafted-form-nav.component';
import { TodaysVitalsComponent } from './todays-vitals/todays-vitals.component';
import { TodaysVitalsService } from './todays-vitals/todays-vitals.service';
import { PatientRemindersComponent } from './patient-reminders/patient-reminders.component';
import { OrderListComponent } from './formentry/order-list.component';
import {
  PatientRelationshipService
} from './patient-relationships/patient-relationship.service';
import {
  PatientRelationshipSearchComponent
} from './patient-relationships/patient-relationship-search.component';
import {
  AddPatientRelationshipComponent
} from './patient-relationships/add-patient-relationship.component';
import {
  EditPatientRelationshipComponent
} from './patient-relationships/edit-patient-relationship.component';
import {
  PatientRelationshipTypeService
} from './patient-relationships/patient-relation-type.service';
import {
  PatientRelationshipsComponent
} from './patient-relationships/patient-relationships.component';
import { EditAddressComponent } from './patient-info/edit-address.component';
import {
  EditPatientIdentifierComponent
} from './patient-identifier/edit-patient-identifier.component';
import { PatientCareStatusResourceService } from '../../etl-api/patient-care-status-resource.service';
import { PatientIdentifierService } from './patient-identifier/patient-identifiers.service';
import { EditContactsComponent } from './patient-info/edit-contacts.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { FileUploaderModule } from 'ngx-file-uploader';

import {
  HivPatientClinicalSummaryService
} from '../hiv/patient-clinical-summaries/hiv-patient-clinical-summary.service';
import { EditDemographicsComponent } from './patient-info/edit-demographics.component';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { VisitPeriodComponent } from './visit/visit-period/visit-period.component';
import { LocatorMapComponent } from './locator-map/locator-map.component';
import { SecurePipe } from './locator-map/secure.pipe';
import { CohortMemberModule } from '../../patient-list-cohort/cohort-member/cohort-member.module';
import { EditHealtCenterComponent } from './patient-info/edit-healthcenter.component';
import {
  VisitEncountersListComponent
} from './visit-encounters/visit-encounters-list.component';
import { VisitEncountersComponent } from './visit-encounters/visit-encounters.component';
import { VisitEncountersPipe } from './visit-encounters/visit-encounters.pipe';
import { PatientEncounterProviderPipe } from './patient-encounters/patient-encounter-provider.pipe';
import {
  OrderByAlphabetPipe
} from './visit-encounters/visit-encounter.component.order.pipe';
import { OrderByEncounterTimeAscPipe } from './visit-encounters/orderByEncounterTime.pipe';
import { EncounterTypeFilter } from './patient-encounters/encounter-list.component.filterByEncounterType.pipe';
import { ZeroVlPipe } from './../../shared/pipes/zero-vl-pipe';
import { HivCareLibModule } from '../../hiv-care-lib/hiv-care-lib.module';
import { LabOrderSearchModule } from '../../lab-order-search/lab-order-search.module';
import { PatientSearchModule } from '../../patient-search/patient-search.module';
import { PatientProgramService } from '../programs/patient-programs.service';
import { FormentryReferralsHandlerService } from './formentry/formentry-referrals-handler.service';
import { PatientReferralsModule } from './patient-referrals/patient-referrals.module';
import { VisitDetailsComponent } from './visit/visit-details/visit-details.component';
import { VisitStarterComponent } from './visit/visit-starter/visit-starter.component';
import { TodayVisitService } from './visit/today-visit.service';
import { TodayVisitsComponent } from './visit/today-visits/today-visits.component';
import { VisitSummaryComponent } from './visit/visit-summary/visit-summary.component';
import { FormUpdaterService } from './formentry/form-updater.service';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../utils/session-storage.service';
import { PatientImagingComponent } from './imaging/patient-imaging.component';
import { ProgramManagerModule } from '../../program-manager/program-manager.module';
import { ZscoreService } from '../../shared/services/zscore.service';
import { GroupEnrollmentModule } from '../group-enrollment/group-enrollment.module';
import { VitalsDatasource } from './todays-vitals/vitals.datasource';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule, MatFormFieldModule } from '@angular/material';
import { PocHttpInteceptor } from 'src/app/shared/services/poc-http-interceptor';

import { AddDrugOrdersComponent } from './drug-orders/add-drug-orders/add-drug-orders.component';
import { DrugOrdersComponent } from './drug-orders/drug-orders/drug-orders.component';
import { DrugOrderService } from './drug-orders/drug-order.service';
import { DrugOrderSetComponent } from './drug-orders/drug-order-set/drug-order-set.component';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {

        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
} from '@angular/material';
import { DrugsFilterPipe } from './drug-orders/drugs-filter.pipe';
import { DrugSetFilterPipe } from './drug-orders/drug-order-set/drugSet-filter.pipe';
import { DrugOrderSetDraftComponent } from './drug-orders/drug-order-set/drug-order-set-draft/drug-order-set-draft.component';
import { EditDrugComponent } from './drug-orders/edit-drug/edit-drug.component';



@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AccordionModule,
    DataTableModule,
    SharedModule,
    InputTextModule,
    MatTableModule,
    MessagesModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    CalendarModule,
    NgamrsSharedModule,
    Ng2Bs3ModalModule,
    OpenmrsApi,
    UtilsModule,
    TabViewModule,
    GrowlModule, PanelModule,
    FormEntryModule,
    ReactiveFormsModule,
    ConfirmDialogModule, DialogModule,
    EtlApi,
    ButtonModule,
    DateTimePickerModule,
    AgGridModule.withComponents([

    ]),
    FileUploaderModule,
    CohortMemberModule,
    LabOrderSearchModule,
    HivCareLibModule,
    PatientSearchModule,
    PatientReferralsModule,
    ProgramManagerModule,
    GroupEnrollmentModule
  ],
  exports: [
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    ClinicalNotesComponent,
    EncounterListComponent,
    VisitComponent,
    PatientBannerComponent,
    LabSyncComponent,
    LabResultComponent,
    ContactsComponent,
    PatientIdentifierComponent,
    AddressComponent,
    PatientDemographicsComponent,
    FormentryComponent,
    LabTestOrdersComponent,
    DraftedFormNavComponent,
    TodaysVitalsComponent,
    PatientRemindersComponent,

    OrderListComponent,
    PatientRelationshipsComponent,
    EditContactsComponent,
    EditAddressComponent,
    EditHealtCenterComponent,
    EditDemographicsComponent,
    EditPatientIdentifierComponent,
    EditPatientRelationshipComponent,
    AddPatientRelationshipComponent,
    PatientRelationshipSearchComponent,
    VisitPeriodComponent,
    TodayVisitsComponent,
    VisitSummaryComponent,
    LocatorMapComponent,
    SecurePipe,
    VisitEncountersListComponent,
    VisitEncountersComponent,
    VisitDetailsComponent,
    VisitStarterComponent,
    VisitEncountersPipe,
    PatientEncounterProviderPipe,
    ZeroVlPipe,
    OrderByAlphabetPipe,
    OrderByEncounterTimeAscPipe,
    EncounterTypeFilter,
    PatientImagingComponent,
  ],
  declarations: [
    VisitSummaryComponent,
    PatientInfoComponent,
    PatientEncountersComponent,
    PatientVitalsComponent,
    FormsComponent,
    LabDataSummaryComponent,
    LabOrdersComponent,
    ClinicalNotesComponent,
    EncounterListComponent,
    DrugsFilterPipe,
    DrugSetFilterPipe,
    VisitComponent,
    PatientBannerComponent,
    EditVisitTypeComponent,
    LabSyncComponent,
    LabResultComponent,
    ContactsComponent,
    PatientIdentifierComponent,
    AddressComponent,
    PatientDemographicsComponent,
    FormentryComponent,

    LabTestOrdersComponent,
    DraftedFormNavComponent,
    TodaysVitalsComponent,
    PatientRemindersComponent,
    OrderListComponent,
    PatientRelationshipsComponent,
    EditContactsComponent,
    EditAddressComponent,
    EditHealtCenterComponent,
    EditDemographicsComponent,
    EditPatientIdentifierComponent,
    EditPatientRelationshipComponent,
    AddPatientRelationshipComponent,
    PatientRelationshipSearchComponent,
    VisitPeriodComponent,
    TodayVisitsComponent,
    LocatorMapComponent,
    SecurePipe,
    VisitEncountersListComponent,
    VisitEncountersComponent,
    VisitDetailsComponent,
    VisitStarterComponent,
    VisitEncountersPipe,

    PatientEncounterProviderPipe,
    OrderByAlphabetPipe,
    OrderByEncounterTimeAscPipe,
    EncounterTypeFilter,
    // ZeroVlPipe,
    PatientImagingComponent,
    AddDrugOrdersComponent,
    DrugOrdersComponent,
    DrugOrderSetComponent,
    OrderListComponent,
    DrugOrderSetDraftComponent,
    EditDrugComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    },
    FormUpdaterService,
    PatientEncounterService,
    PatientSearchService,
    AppFeatureAnalytics,
    PatientService,
    PatientPreviousEncounterService,
    HivSummaryService,
    FormListService,
    FormOrderMetaDataService,
    PatientVitalsService,
    FormSchemaService,
    FormDataSourceService,
    FormentryHelperService,
    ConfirmationService,
    FromentryGuard,
    FormCreationDataResolverService,
    FormSubmissionService,
    PatientReminderService,
    DraftedFormsService,
    TodaysVitalsService,
    PatientProgramService,
    PatientRelationshipService,
    HivPatientClinicalSummaryService,
    DatePipe,
    ZeroVlPipe,
    PatientIdentifierService,
    PatientRelationshipTypeService,
    FormentryReferralsHandlerService,
    PatientCareStatusResourceService,
    ZscoreService,
    VitalsDatasource,
    TodayVisitService,
    DrugsFilterPipe,
    DrugSetFilterPipe,
    DrugOrderService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientDashboardCommonModule { }
