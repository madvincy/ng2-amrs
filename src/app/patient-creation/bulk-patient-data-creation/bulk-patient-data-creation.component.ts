import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-patient-data-creation',
  templateUrl: './bulk-patient-data-creation.component.html',
  styleUrls: ['./bulk-patient-data-creation.component.css']
})
export class BulkPatientDataCreationComponent implements OnInit {
 public persons : any;
  constructor() { }

  ngOnInit() {
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
      // const dataString = JSON.stringify(jsonData);
      console.log(jsonData.Sheet1);
      if(jsonData.Sheet1) {
        console.log(jsonData.Sheet1[0]);
        this.persons.push(jsonData.sheet1);
        console.log(this.persons);
      }
      

      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      // this.setDownload(dataString);
    }
    reader.readAsBinaryString(file);
  }

}
