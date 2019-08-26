import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit, OnChanges  {
  @Input() SummaryData = [];
  @Input() sectionDefs: any;

  @Output()
  public indicatorSelected = new EventEmitter();
  private _rowDefs: Array<any>;
  public test = [];
  public gridOptions: any = {
    columnDefs: []
  };
  public pdfSrc: string = null;
  public isBusy = false;
  public headers = [];
  public sectionIndicatorsValues: Array<any>;
  public page = 1;
  public selectedResult: string;
  public selectedIndicatorsList = [];
  public errorFlag = false;
  public securedUrl: SafeResourceUrl;
  public pdfProxy: PDFDocumentProxy = null;
    public pdfMakeProxy: any = null;

  @Output()
  public CellSelection = new EventEmitter();

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.SummaryData) {
      console.log(changes.SummaryData);
      this.sectionIndicatorsValues = this.SummaryData;
      this.setColumns(this.sectionDefs);
    }
  }
  public setColumns(sectionsData: Array<any>) {
    console.log(sectionsData);
    this.headers = [];
    const defs = [];
    const locations = ['locations'];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      const header = {
        label: section.sectionTitle,
        value: i
      };
      this.headers.push(header);
      created.children = [];
      for (let j = 0; j < section.indicators.length; j++) {
        const indicatorDefinition = section.indicators[j].indicator;
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          description: section.indicators[j].description,
          value: [],
          width: 360
        };
        this.sectionIndicatorsValues.forEach(element => {
          const val = {
            location: element['location_uuid'],
            value: '-'
          };
          if (element[indicatorDefinition] || element[indicatorDefinition] === 0) {
            val.value = element[indicatorDefinition];
          }
          child.value.push(val);
        });
        created.children.push(child);
      }
      defs.push(created);
    }
    console.log(defs);
    this.gridOptions.columnDefs = defs;
  }
  public setCellSelection(col, val) {
    const selectedIndicator = { headerName: col.headerName, field: col.field, location: val.location };
    console.log(selectedIndicator);
    this.CellSelection.emit(selectedIndicator);
  }
  public searchIndicator() {
    this.setColumns(this.sectionDefs);
    if (this.selectedResult.length > 0) {
      this.gridOptions.columnDefs.forEach(object => {
        const make = {
          headerName: '',
          children: []
        };
        object.children.forEach(object2 => {
          if (object2['headerName'].toLowerCase().match(this.selectedResult) !== null) {
            make.headerName = object['headerName'];
            make.children.push(object2);
          }
        });
        if (make.headerName !== '') {
          this.test.push(make);
        }
      });
      this.gridOptions.columnDefs = [];
      this.gridOptions.columnDefs = this.test;
      this.test = [];
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
  public selectedIndicators() {
    this.setColumns(this.sectionDefs);
    const value = [];
    if (this.selectedIndicatorsList.length) {
      this.selectedIndicatorsList.forEach(indicator => {
        value.push(this.gridOptions.columnDefs[indicator]);
      });
      this.gridOptions.columnDefs = value;
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
  public downloadPdf() {

    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      console.log(canvas);

      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 15;
      pdf.setFontSize(10);
      pdf.text(0, 5, 'Surge Report');
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 16;
        console.log(position);
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('Ampath Surge Report.pdf');
    });

  this.generatePdf().pipe(take(1)).subscribe(
    (pdf) => {
      console.log('done');
        this.pdfSrc = pdf.pdfSrc;
        this.pdfMakeProxy = pdf.pdfProxy;
        this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
        this.isBusy = false;

    },
    (err) => {
        console.error(err);
        this.errorFlag = true;
        this.isBusy = false;
    }
);
    //  window.open(pdfMake.createPdf(dd), '_blank');
    // pdfMake.createPdf(dd).open({}, win);
  }
  public generatePdf(): Observable<any> {

    const dd = {
      content: [
        {text: 'Ampath Surge Report.pdf', margin: [0, 20, 0, 8]},
        {
          style: 'tableExample',
          table: {
            headerRows: 4,
            widths: ['*', '*', '*', '*', '*', '*' , '*'],
            body: this.bodyValues(),
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'white'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };
    console.log('body', dd);
    const pdfStructure = dd;
    return Observable.create((observer: Subject<any>) => {
  // JSON stringify and parse was done to handle a potential bug in pdfMake
  const p = JSON.stringify(pdfStructure);
  const x = JSON.parse(p);

  const pdfProxy = pdfMake.createPdf(x
  );
  pdfProxy.getBase64((output) => {
      const int8Array: Uint8Array =
          this._base64ToUint8Array(output);
      const blob = new Blob([int8Array], {
          type: 'application/pdf'
      });
      observer.next({
          pdfSrc: URL.createObjectURL(blob),
          pdfDefinition: pdfStructure,
          pdfProxy: pdfProxy
      });
  });
}).pipe(first());
  }
  private _base64ToUint8Array(base64: any): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
}
public bodyValues() {
  const body = [];
  // let span = 0;
console.log(this.gridOptions);
  this.gridOptions.columnDefs.forEach(columnDefs => {
    const head = [];
    const part = {text: columnDefs.headerName, style: 'tableHeader', fillColor: '#337ab7',
    colSpan: this.sectionIndicatorsValues.length + 1, alignment: 'left'};
    head.push(part);
    body.push(head);
    this.sectionIndicatorsValues.forEach(element => {
      head.push('test');
    });
    columnDefs.children.forEach(col => {
      const sec =  [];
      const test = { text: col.headerName, style: 'subheader',
      alignment: 'center'};
      sec.push(test);
    col.value.forEach(element => {
      const value = {text: element.value, style: 'subheader',
       alignment: 'center'};
       sec.push(value);
    });
    body.push(sec);
    });
});
return body;
  }
  public nextPage(): void {
    this.page++;
}
public prevPage(): void {
  this.page--;
}
public downloadPdfView(): void {
  this.pdfMakeProxy
      .download(('surge_report') + '.pdf');
}
}

