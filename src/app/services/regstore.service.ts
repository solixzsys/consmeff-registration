import { BehaviorSubject, firstValueFrom, ReplaySubject } from "rxjs";
 
import { Injectable } from "@angular/core";
 
import { ApplicationService } from "./application.service";
import { RegistrantDataDTO } from "../data/application/registrantdatadto";
import { PreRegistrationDataDTO } from "../data/application/preregistrationdatadto";
import { CountryDTO, LGA, StatesDTO } from "../data/application/location.dto";
import { TUploadFile } from "../data/application/transformer.dto";
 

@Injectable({
  providedIn: 'root'
})
export class RegStoreService {

  private readonly _regData = new BehaviorSubject<RegistrantDataDTO | null>(null);
  public regData$ = this._regData.asObservable();

  private readonly _preRegData = new BehaviorSubject<PreRegistrationDataDTO | null>(null);
  public preRegData$ = this._preRegData.asObservable();

  private readonly _countryData = new BehaviorSubject<CountryDTO | null>(null);
  public countryData$ = this._countryData.asObservable();

  private readonly _stateData = new BehaviorSubject<StatesDTO | null>(null);
  public stateData$ = this._stateData.asObservable();

  private readonly _lgaData = new BehaviorSubject<LGA[] | null>(null);
  public lgaData$ = this._lgaData.asObservable();

  private readonly _uploadFile = new BehaviorSubject<TUploadFile |null>(null);
    public uploadFile$ = this._uploadFile.asObservable();
  


  constructor(private appservice:ApplicationService,) {
     this.dataIntitialization();

  }

  setRegData(payload: RegistrantDataDTO) {
    this.setUploadFile(payload);
    this._regData.next(payload)
  }
  setpreRegData(payload: PreRegistrationDataDTO) {
    
    this._preRegData.next(payload)
  }
  setCountryData(payload: CountryDTO) {
    this._countryData.next(payload)
  }
  setStateData(payload: StatesDTO) {
    this._stateData.next(payload)
  }

  setLGAData(payload: LGA[]) {
    this._lgaData.next(payload)
  }

  // setUploadFile(payload:RegistrantDataDTO){
  //  if(payload.data !=null && payload.data !=undefined){
  //   let _u:TUploadFile={
  //     certificateofbirth: payload.data!.certificate_of_birth,
  //     olevels: payload.data!.o_level_result.map((m)=>m.file),
  //     passport: payload.data!.passport_photo,
  //     origin:payload.data!.certificate_of_origin,
  //     utme: payload.data!.utme_result.file
  //   };
  //   this._uploadFile.next(_u);
  //  }
  // }
  setUploadFile(payload: RegistrantDataDTO) {
    if (payload.data != null && payload.data != undefined) {
      let _u: TUploadFile = {
        certificateofbirth: payload.data!.certificate_of_birth!,
        olevels: payload.data!.o_level_result?.map((m) => m.file) || [],
        passport: payload.data!.passport_photo!,
        origin: payload.data!.certificate_of_origin!,
        utme: payload.data!.utme_result?.file!
      };
      this._uploadFile.next(_u);
    }
  }

  async dataIntitialization(): Promise<boolean> {

    let result = false;
    let app_no = sessionStorage.getItem("APP_NO") || "";
    if (app_no != "") {
      await firstValueFrom(this.appservice.registratantData(app_no))
        .then(async (data) => {
          console.log("fetching app data ............................");
          // console.log(data);

          this.setRegData(data);

          
        })
        .catch((err) => {
          result = false;
        })
    }

    return result;
  }


}