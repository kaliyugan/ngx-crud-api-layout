import { FormGroup } from '@angular/forms';
import { MasterScreen } from './model/MasterScreen';

export declare interface CRUDOperation<T, D> {
  ngScreenInformation(): MasterScreen;
  ngFormGroup():FormGroup;
  ngPrimaryId():string;
  ngCreate(): Result;
  ngDelete(): Result;
  ngUpdate(): Result;
  ngNew(): void;
  ngFindAll():T[];
  ngFindById(arg:D):T;
}


export declare interface Result {
  code: string;
  message: string;
  messageType: MessageType;
}



export  enum MessageType {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}