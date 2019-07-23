import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PouchdbService } from 'src/app/pouchdb-service/pouchdb.service';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { CacheService } from 'ionic-cache';

import { SurgeReportBaseComponent } from './surge-report-base.component';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
import { SurgeReportTabularComponent } from './surge-report-tabular.component';
import { ReportFilterComponent } from 'src/app/reporting-utilities/report-filter/report-filter.component';

const routes = [{
    path: 'test',
    component: SurgeReportTabularComponent
}];

class MockCacheStorageService {
    constructor(a, b) { }
    public ready() {
      return true;
    }
  }

describe('SurgeReportBaseComponent', () => {
    let component: SurgeReportBaseComponent;
    let fixture: ComponentFixture<SurgeReportBaseComponent>;
    // tslint:disable-next-line: prefer-const
    let debugElement: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [SurgeReportBaseComponent, SurgeReportTabularComponent, ReportFilterComponent],
        providers: [
            SurgeResourceService,
            AppSettingsService,
            DataCacheService,
            LocalStorageService,
            DataCacheService, CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }, PouchdbService
        ],
        imports : [
            RouterTestingModule.withRoutes(routes),
            HttpClientTestingModule
        ],
        schemas : [
            NO_ERRORS_SCHEMA
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SurgeReportBaseComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject surge report resource service', () => {

    });

  });
