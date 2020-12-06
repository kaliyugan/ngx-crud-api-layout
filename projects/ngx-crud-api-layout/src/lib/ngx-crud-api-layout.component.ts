import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { OrderPipe } from 'ngx-order-pipe';
import { PaginationInstance } from 'ngx-pagination';
import { ColumnConfig } from './model/ColumnConfig';
import { MasterScreen } from './model/MasterScreen';
import { CRUDOperation, MessageType, Result } from './ngx-crud-api-layout.operation';
import { NgxCrudApiLayoutService } from './ngx-crud-api-layout.service';

@Component({
  selector: 'ngx-crud-api-layout',
  template: `
  <div class="card">
  <div class="card-header">
    <div class="row">
      <div class="col-sm-12 col-md-6">

        <div style="height: 36px;">

          <div style="float: left;">
            <h3 class="mb-0">{{masterScreen?.name}}</h3>
          </div>
          <div style="float: left;">
            <button type="button" class="btn btn-primary" style="padding: 2px 5px;" data-toggle="modal"
              data-target="#myModal" (click)="openNew(myModal)" *ngIf="masterScreen?.permission?.create" title="New"
              sty>+</button>

          </div>


        </div>
        <p class="text-sm mb-0">
          {{masterScreen?.description}}
        </p>
      </div>

      <div class="col-sm-12 col-md-6">

        <div class="dataTables_filter" id="datatable-basic_length" style="float: right; margin-left: 5px;">
          <select (change)="onPageSizeChange($event.target.value)" name="datatable-basic_length"
            aria-controls="datatable-basic" class="form-control form-control-sm">
            <option value="7">7</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div id="datatable-basic_filter" class="dataTables_filter" style="float: right; margin-left: 5px;">
          <input type="search" class="form-control form-control-sm" placeholder="Search ..." [(ngModel)]="searchText">
        </div>

        <div id="datatable-basic_filter" class="dataTables_filter" style="float: right; margin-left: 5px;">
          <button type="button" class="btn btn-primary" style="padding: 2px 5px;" data-toggle="modal"
            data-target="#columnModal" (click)="openColumnModal(columnModal)" title="Column Show/Hide">
            <i _ngcontent-xtm-c23="" aria-hidden="true" class="fa fa-table"></i>
          </button>

        </div>
        <div id="datatable-basic_filter" class="dataTables_filter" style="float: right; margin-left: 0px;">
          <button type="button" class="btn btn-primary" style="padding: 2px 5px;" title="Download" (click)="download()">
            <i _ngcontent-xtm-c23="" aria-hidden="true" class="fa fa-download"></i></button>
        </div>
      </div>


    </div>
  </div>
  <div class="table-responsive py-2">
    <div id="datatable-basic_wrapper" class="dataTables_wrapper dt-bootstrap4">

      <div class="row">
        <div class="col-sm-12">
          <table class="table table-flush dataTable" id="datatable-basic" role="grid"
            aria-describedby="datatable-basic_info">
            <thead class="thead-light">
              <tr role="row">
                <th *ngFor="let c of _tempColumnConfig" [class.active]="order === 'c.name'" (click)="setOrder(c.name)"
                  class="sorting_asc" tabindex="0" aria-controls="datatable-basic" rowspan="1" colspan="1"
                  aria-label="Name: activate to sort column descending" aria-sort="ascending">
                  {{c.name}} <span [hidden]="reverse">▼</span><span [hidden]="!reverse">▲</span></th>
                <th tabindex="0" aria-controls="datatable-basic" rowspan="1" colspan="1" style="width: 100px;">
                  Action</th>
              </tr>
            </thead>

            <tbody>

              <tr
                *ngFor="let row of rowData | filter:searchText | orderBy: order:reverse:false | paginate: config; let i = index;">

                <td *ngFor="let r of _tempColumnConfig" [ngStyle]="columnStyle(r.dataType)">
                  <label *ngIf="r.dataType == 'Date'">{{row[r.key] | dateFormat}}</label>
                  <label *ngIf="r.dataType == 'String'">{{row[r.key]}} </label>
                  <label *ngIf="r.dataType == 'Currency'">{{row[r.key] | currency}} </label>
                  <label *ngIf="r.dataType == 'Number'">{{row[r.key]}} </label>
                </td>

                <td class="actionColumn">
                  <a class="btn btn-sm" (click)="openUpdate(myModal,row)" *ngIf="masterScreen?.permission?.edit"
                    style="margin-right: 5px; padding:0; cursor:pointer;    border: 0" title="Edit">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a class="btn btn-sm" (click)="openDeleteModel(deleteModel, row)"
                    *ngIf="masterScreen?.permission?.delete"
                    style="margin-right: 5px; padding:0; cursor:pointer;     border: 0" title="Delete">
                    <i class="fa fa-trash"></i>
                  </a>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="dataTables_paginate paging_simple_numbers" id="datatable-basic_paginate"
            style="text-align: center;">
            <pagination-controls [id]="config.id" [maxSize]="maxSize" [directionLinks]="directionLinks"
              [autoHide]="autoHide" [previousLabel]="labels.previousLabel" [nextLabel]="labels.nextLabel"
              [screenReaderPaginationLabel]="labels.screenReaderPaginationLabel"
              [screenReaderPageLabel]="labels.screenReaderPageLabel"
              [screenReaderCurrentLabel]="labels.screenReaderCurrentLabel" (pageChange)="onPageChange($event)">
            </pagination-controls>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>




<ng-template #myModal let-modal>
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title"> {{masterScreen?.name}}</h4>
    <button type="button" class="close" aria-label="Close" data-target="#warningModel"
      (click)="closeModelWindow(warningModel)">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">

    <ng-content></ng-content>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" *ngIf="saveCloseBtn" (click)="preSave()" title="Save">Save</button>
    <button type="button" class="btn btn-secondary" *ngIf="saveCloseBtn" data-target="#warningModel"
      (click)="closeModelWindow(warningModel)" title="Close">Close</button>
  </div>
</ng-template>




<ng-template #columnModal let-modal>
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title"> {{masterScreen?.name}} - Columns</h4>
    <button type="button" class="close" aria-label="Close" data-target="#columnModal" (click)="closeColumnModal()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <ul class="list-group">
      <li class="list-group-item" style="cursor: pointer;" *ngFor="let column of masterScreen?.columnConfig"
        (click)="onChange(column)">
        <input type="checkbox" value={{column.enable}} *ngIf="column.enable == true" checked>
        <input type="checkbox" value={{column.enable}} *ngIf="column.enable == false">
        {{column.name}}
      </li>

    </ul>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="preSave()" title="Save">Save</button>
    <button type="button" class="btn btn-secondary" data-target="#columnModal" (click)="closeColumnModal()"
      title="Close">Close</button>


  </div>
</ng-template>








<ng-template #deleteModel let-modal>

  <div class="modal-header">
    <h4 id="deleteModel" class="modal-title">{{masterScreen?.name}}</h4>
    <button type="button" (click)="closeDeleteModal()" class="close">
      <span aria-hidden="true">×</span>
    </button>
  </div>

  <div class="modal-body">
    <span *ngIf="btnEnable">Do you want delete this {{masterScreen?.name}}?</span>
    <span *ngIf="closeBtnEnable" style="color: green">{{deletedMessage}}</span>
  </div>


  <div class="modal-footer">
    <button type="button" data-dismiss="modal" *ngIf="closeBtnEnable" class="btn btn-secondary">Close</button>
    <button type="button" class="btn btn-primary" *ngIf="btnEnable" (click)="preDelete()">Yes</button>
    <button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">No</button>
  </div>

</ng-template>


<ng-template #warningModel let-modal>
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title"> {{masterScreen?.name}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="closeWarningModal()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <span>Changes Made Need to save (yes / No) .</span>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="preSave()" title="Save">Yes</button>
    <button type="button" class="btn btn-secondary" (click)="closeWarningModal()" title="Close">No</button>
  </div>
</ng-template>
<notifier-container></notifier-container>
  `,
  styles: [
  ]
})
export class NgxCrudApiLayoutComponent implements OnInit {

  order: string;
  reverse: boolean = false;


  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  /**
   * Notifier service
   */
  private notifier: NotifierService;

  searchText: string;

  /**
   * 
   * 
   * 
   * 
   * 
   * @param notifierService 
   * @param excelService 
   * @param formBuilder 
   * @param commanService 
   * @param config 
   * @param modalService 
   * @param pipe 
   */
  constructor(notifierService: NotifierService, private orderPipe: OrderPipe, private crudApiService: NgxCrudApiLayoutService, public formBuilder: FormBuilder, config: NgbModalConfig, private modalService: NgbModal, private pipe: DecimalPipe) {
    this.notifier = notifierService;
    config.backdrop = 'static';
    config.keyboard = false;
  }



  public myModal;
  public warningModel;
  public deleteModel;
  public columnModal;

  public maxSize: number = 5;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public _map: any;
  public row: any = {};
  closeResult: string;

  rowData: any = [];
  masterScreen: MasterScreen;
  form: FormGroup;



  @Input() CRUDOperation: CRUDOperation<any, any>;


  deletedMessage: String;
  deleteMessageEnable: boolean;
  closeBtnEnable: boolean = false;
  btnEnable: boolean = true;
  saveCloseBtn: boolean = true;


  _tempColumnConfig: ColumnConfig[] = [];


  ngOnInit(): void {
    this.masterScreen = this.CRUDOperation.ngScreenInformation();
    this.form = this.CRUDOperation.ngFormGroup();
    this.rowData = this.CRUDOperation.ngFindAll();
    this.masterScreen.columnConfig.forEach(element => {
      if (element.enable) {
        this._tempColumnConfig.push(element);
      }
    });

  }

  onChange(column: ColumnConfig) {

    this.masterScreen.columnConfig.forEach(element => {
      if (element.key == column.key) {
        if (element.enable == false) {
          element.enable = true;
        } else {
          element.enable = false;
        }
      }
    });

    this._tempColumnConfig = [];
    this.masterScreen.columnConfig.forEach(element => {
      if (element.enable) {
        this._tempColumnConfig.push(element);
      }
    });
  }


  download() {
    let Header = [];
    this.masterScreen.columnConfig.forEach(element => {
      Header.push(element.name);
    });
    let row = [];
    let dataList = [];
    this.rowData.forEach(element => {
      row = [];
      this.masterScreen.columnConfig.forEach(e => {
        row.push(element[e.key]);
      });
      dataList.push(row);
    });
    this.crudApiService.downloadAsExcel(this.masterScreen.name, this.masterScreen.name, Header, dataList);
  }


  /**
   * 
   * @param type 
   * 
   */
  columnStyle(type: string) {
    if (type == 'Number' || type == 'Currency') {
      return { "text-align": "right" }
    } else {
      return { "text-align": "left" }
    }
  }









  closeModelWindow(warningModel) {
    console.log('close model');
    console.log(this.form.touched);
    if (this.form.touched) {
      this.openWarning(warningModel);
    } else {
      this.modalService.dismissAll(this.myModal)
    }
  }










  /**
   * 
   * 
   */
  preSave() {
    if (this.crudApiService.getScrenMode().toString() == "NEW") {
      let r = this.CRUDOperation.ngCreate();
      this.closeModal(r, this.myModal);
    }
    if (this.crudApiService.getScrenMode().toString() == "UPDATE") {
      let r = this.CRUDOperation.ngUpdate();
      this.closeModal(r, this.myModal);
    }
  }



  /**
   * 
   * 
   */
  closeModal(data: Result, modal) {
    let res = data;
    if (res.code != null && res.code != undefined) {
      if (res.messageType == MessageType.FAILURE) {
        this.notifier.notify('error', '' + res.message + '');
      } else {
        this.modalService.dismissAll(modal)
        this.notifier.notify('success', '' + res.message + '');
      }
    }
  }



  /**
   * 
   */
  closeDeleteModal() {
    this.modalService.dismissAll(this.deleteModel)
  }


  closeColumnModal() {
    this.modalService.dismissAll(this.columnModal)
  }


  closeWarningModal() {
    //this.warningModel = warningModel;
    this.modalService.dismissAll(this.warningModel)
    this.modalService.dismissAll(this.myModal)
  }







  /**
   * 
   * @param row 
   * 
   */
  preUpdate(row: any) {
    for (var key in this.form.getRawValue()) {
      this.form.get(key).enable();
    }
    this.crudApiService.setScreenMode('UPDATE');
    this.row = row;
    let d = this.CRUDOperation.ngFindById(row[this.CRUDOperation.ngPrimaryId()]);
    this.form.patchValue(d);
    this.form.get(this.CRUDOperation.ngPrimaryId()).disable();
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsUntouched({ onlySelf: true });
      }
    });
  }







  /**
   * 
   */
  preDelete() {
    let r = this.CRUDOperation.ngDelete();
    this.closeModal(r, this.deleteModel);
  }





  /**
   * 
   * @param content 
   * @param row 
   */
  openDelete(content, row) {
    let s = this.masterScreen.size;
    let d = { ariaLabelledBy: 'modal-basic-title' };
    if (s != undefined) {
      d['size'] = s;
    }
    this.modalService.open(content, d).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }




  /**
   * 
   * @param content 
   * @param row 
   */
  openUpdate(content, row) {
    this.saveCloseBtn = true;
    let s = this.masterScreen.size;
    let d = { ariaLabelledBy: 'modal-basic-title' };
    if (s != undefined) {
      d['size'] = s;
    }

    this.modalService.open(content, d).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.preUpdate(row);
  }







  /**
   * 
   * @param content 
   */
  openNew(content) {
    let s = this.masterScreen.size;
    let d = { ariaLabelledBy: 'modal-basic-title' };
    if (s != undefined) {
      d['size'] = s;
    }
    this.saveCloseBtn = true;
    this.modalService.open(content, d).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`; { size: 'lg' }
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.addNew();
  }






  /**
   * 
   * @param content 
   */
  openWarning(warningModel) {
    let d = { ariaLabelledBy: 'modal-basic-title' };
    this.saveCloseBtn = true;
    this.modalService.open(warningModel, d).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`; { size: 'lg' }
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }




  openDeleteModel(deleteModel, row) {
    let d = { ariaLabelledBy: 'modal-basic-title' };
    this.saveCloseBtn = true;
    this.modalService.open(deleteModel, d).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`; { size: 'lg' }
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


  }



  openColumnModal(columnModal) {
    let d = { ariaLabelledBy: 'modal-basic-title' };
    this.modalService.open(columnModal, d).result.then((result) => {

    }, (reason) => {

    });


  }









  addNew() {
    this.form.reset();
    for (var key in this.form.getRawValue()) {
      this.form.get(key).enable();
    }
    this.crudApiService.setScreenMode('NEW');
    this.CRUDOperation.ngNew();
  }







  //------------------------------ Pagenation Start------------------------------- //

  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 7,
    currentPage: 1
  };


  public labels: any = {
    previousLabel: '',
    nextLabel: '',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };


  onPageSizeChange(number: number) {
    this.config.itemsPerPage = number;
  }


  onPageChange(number: number) {
    this.config.currentPage = number;
  }

  //------------------------------ Pagenation End------------------------------- //



}
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
}

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, 'dd-MMM-yyyy');
  }
}

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, 'dd-MMM-yyyy hh:mm:ss');
  }
}
