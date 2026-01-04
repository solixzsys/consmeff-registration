import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile } from '../../data/application/transformer.dto';
import { formstepDTO } from '../../data/application/form.dto';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private readonly _formsteps = new BehaviorSubject<formstepDTO>({
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  });
  public formsteps$ = this._formsteps.asObservable();

  private readonly _personalform = new BehaviorSubject<TPersonalDetailDTO |null>(null);
  public personalform$ = this._personalform.asObservable();
 
  private readonly _nextofkinform = new BehaviorSubject<TNextOfKinDTO |null>(null);
  public nextofkinform$ = this._nextofkinform.asObservable();

  private readonly _academicHistory = new BehaviorSubject<TAcademicHistory[] |null>(null);
  public academicHistory$ = this._academicHistory.asObservable();

  private readonly _olevelResult = new BehaviorSubject<TOLevelResult[] |null>(null);
  public olevelResult$ = this._olevelResult.asObservable();

  private readonly _uploadFile = new BehaviorSubject<TUploadFile |null>(null);
  public uploadFile$ = this._uploadFile.asObservable();



  constructor() { }

  setFormSteps(form:formstepDTO){
    this._formsteps.next(form)
  }

  setPersonalFormData(payload:TPersonalDetailDTO){
    if(payload !=null){
      this._personalform.next(payload)
    }
  }

  setNextOfKinFormData(payload:TNextOfKinDTO){
    if(payload !=null){
      this._nextofkinform.next(payload)
    }
  }

  setAcademicHistoryFormData(payload:TAcademicHistory[]){
    if(payload !=null){
      this._academicHistory.next(payload)
    }
  }
 
  setOlevelResultFormData(payload:TOLevelResult[]){
    if(payload !=null){
      this._olevelResult.next(payload)
    }
  }
 
  setuploadFileFormData(payload:TUploadFile){
    if(payload !=null){
      this._uploadFile.next(payload)
    }
  }

  
}
