import { TestBed, inject, async } from '@angular/core/testing';
import { RetrospectiveSettingsComponent  } from '../settings/settings.component';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import {EditRetroVisitProviderComponent} from  '../visit-provider/edit-retro-visit-provider.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';


describe('RetrospectiveSettings Component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            RetrospectiveSettingsComponent ,
            EditRetroVisitProviderComponent
    ],
    schemas:[ CUSTOM_ELEMENTS_SCHEMA],
    providers:[ProviderResourceService,
        LocalStorageService]
    }).compileComponents();
  }));
  it('should create the RetrospectiveSettings Component', function(done) {
    const fixture = TestBed.createComponent(RetrospectiveSettingsComponent );
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    done();
  });
});