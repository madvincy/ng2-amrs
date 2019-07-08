import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
export class ReportViewComponent implements OnInit {
  @Input() gridOptions: any;
  public pdfSrc: string = null;
  public isBusy = false;
  public page = 1;
  public errorFlag = false;
  public securedUrl: SafeResourceUrl;
  public pdfProxy: PDFDocumentProxy = null;
    public pdfMakeProxy: any = null;

  @Output()
  public CellSelection = new EventEmitter();

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  public setCellSelection(col, val) {
    const selectedIndicator = { headerName: col.headerName, field: col.field, location: val.location };
    this.CellSelection.emit(selectedIndicator);
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

//   this.generatePdf().pipe(take(1)).subscribe(
//     (pdf) => {
//       console.log('done');
//         this.pdfSrc = pdf.pdfSrc;
//         this.pdfMakeProxy = pdf.pdfProxy;
//         this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
//         this.isBusy = false;

//     },
//     (err) => {
//         console.error(err);
//         this.errorFlag = true;
//         this.isBusy = false;
//     }
// );
    //  window.open(pdfMake.createPdf(dd), '_blank');
    // pdfMake.createPdf(dd).open({}, win);
  }
//   public generatePdf(): Observable<any> {

//     const dd = {
//       content: [
//         {text: 'Ampath Surge Report.pdf', margin: [0, 20, 0, 8]},
//         {
//           style: 'tableExample',
//           table: {
//             headerRows: 4,
//             widths: ['*', '*', '*', '*', '*', '*' , '*'],
//             body: this.bodyValues(),
//           },
//           layout: {
//             fillColor: function (rowIndex, node, columnIndex) {
//               return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
//             }
//           }
//         },
//       ],
//       styles: {
//         header: {
//           fontSize: 18,
//           bold: true,
//           margin: [0, 0, 0, 10]
//         },
//         subheader: {
//           fontSize: 12,
//           bold: true,
//           margin: [0, 10, 0, 5]
//         },
//         tableExample: {
//           margin: [0, 5, 0, 15]
//         },
//         tableHeader: {
//           bold: true,
//           fontSize: 13,
//           color: 'white'
//         }
//       },
//       defaultStyle: {
//         // alignment: 'justify'
//       }
//     };
//     console.log('body', dd);
//     const pdfStructure = dd;
//     return Observable.create((observer: Subject<any>) => {
//   // JSON stringify and parse was done to handle a potential bug in pdfMake
//   const p = JSON.stringify(pdfStructure);
//   const x = JSON.parse(p);

//   const pdfProxy = pdfMake.createPdf(x
//   );
//   pdfProxy.getBase64((output) => {
//       const int8Array: Uint8Array =
//           this._base64ToUint8Array(output);
//       const blob = new Blob([int8Array], {
//           type: 'application/pdf'
//       });
//       observer.next({
//           pdfSrc: URL.createObjectURL(blob),
//           pdfDefinition: pdfStructure,
//           pdfProxy: pdfProxy
//       });
//   });
// }).pipe(first());
//   }
//   private _base64ToUint8Array(base64: any): Uint8Array {
//     const raw = atob(base64);
//     const uint8Array = new Uint8Array(raw.length);
//     for (let i = 0; i < raw.length; i++) {
//         uint8Array[i] = raw.charCodeAt(i);
//     }
//     return uint8Array;
// }
// public bodyValues() {
//   const body = [];
//   // let span = 0;
// console.log(this.gridOptions);
//   this.gridOptions.columnDefs.forEach(columnDefs => {
//     const head = [];
//     const part = {text: columnDefs.headerName, style: 'tableHeader', fillColor: '#337ab7',
//     colSpan: this.gridOptions.rowData.length + 1, alignment: 'left'};
//     head.push(part);
//     body.push(head);
//     this.gridOptions.rowData.forEach(element => {
//       head.push('test');
//     });
//     columnDefs.children.forEach(col => {
//       const sec =  [];
//       const test = { text: col.headerName, style: 'subheader',
//       alignment: 'center'};
//       sec.push(test);
//     col.value.forEach(element => {
//       const value = {text: element.value, style: 'subheader',
//        alignment: 'center'};
//        sec.push(value);
//     });
//     body.push(sec);
//     });
// });
// return body;
//   }
//   public nextPage(): void {
//     this.page++;
// }
// public prevPage(): void {
//   this.page--;
// }
// public downloadPdfView(): void {
//   this.pdfMakeProxy
//       .download(('surge_report') + '.pdf');
// }
}

