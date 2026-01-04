import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryDTO, StatesDTO, LGADTO } from '../data/application/location.dto';
import { PaymentRefResponse } from '../data/application/payment.data';
import { PreRegistrationDataDTO } from '../data/application/preregistrationdatadto';
import { RegistrantDataDTO } from '../data/application/registrantdatadto';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  apiRoot = environment.apiURL;

  constructor(private http: HttpClient) { }

  openApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/setup/applications?status=open`);
  }
  departments(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/setup/departments?program_id=${id}`);
  }
  initializeApplication(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/applicants`, payload);
  }

  personalDetails(app_no: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`, payload);
  }
  makePayment(app_no: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`, payload);
  }


  registrationData(): Observable<PreRegistrationDataDTO> {
    return this.http.get<PreRegistrationDataDTO>(`${this.apiRoot}/api/v1/data/pre-registration-data`);
  }
  countries(): Observable<CountryDTO> {
    return this.http.get<CountryDTO>(`${this.apiRoot}/api/v1/data/countries`);
  }
  states(): Observable<StatesDTO> {
    return this.http.get<StatesDTO>(`${this.apiRoot}/api/v1/data/countries/NGA/states`);
  }
  lgas(id: number): Observable<LGADTO> {
    return this.http.get<LGADTO>(`${this.apiRoot}/api/v1/data/states/${id}/lgas`);
  }
  registratantData(app_no: string): Observable<RegistrantDataDTO> {
    return this.http.get<RegistrantDataDTO>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`);
  }

  uploadFile(fileData: any): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/uploads`, fileData);
  }
  verifyPayment(ref: { ref_id: string }): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/callbacks/verify-payment-status`, ref);
  }
  getPaymentRef( refPayload:{ application_no: string }): Observable<PaymentRefResponse> {
    return this.http.post<PaymentRefResponse>(`${this.apiRoot}/api/v1/applicants/initiate-payment`, refPayload);
  }
}
