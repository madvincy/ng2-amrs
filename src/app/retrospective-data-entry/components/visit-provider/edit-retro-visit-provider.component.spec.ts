import { TestBed, inject, async } from '@angular/core/testing';
import { EditRetroVisitProviderComponent } from './edit-retro-visit-provider.component';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';


describe('EditRetroVisitProvider Component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
    EditRetroVisitProviderComponent ,
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA],
    providers:[ProviderResourceService,
        VisitResourceService]
    }).compileComponents();
  }));
  it('should create the EditRetroVisitProvider component', async(() => {
    const fixture = TestBed.createComponent(EditRetroVisitProviderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});