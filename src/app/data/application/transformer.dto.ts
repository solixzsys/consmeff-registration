import { AcademicHistory, CertificateOfBirth, OLevelResult } from "./registrantdatadto";

export interface TPersonalDetailDTO {
    firstname:                  string;
    lastname:                   string;
    middlename:                 string;
    email:                      string;
    phonenumber:                string;
    alternativePhoneNumber:     string;
    dateOfBirth:                Date|null;
    maritalStatus:              string;
    gender:                     string;
    nationality:                string;
    stateOfOrigin:              string;
    localGovernment:            string;
    disability:                 string;
    disabilityDetails:          string;
    houseNumber:                string;
    streetName:                 string;
    landmark:                   string;
    areaTown:                   string;
    residentialState:           string;
    residentialLocalGovernment: string;
}

export interface TNextOfKinDTO {
    title:                      string;
    firstname:                  string;
    lastname:                   string;
    middlename:                 string;
    gender:                     string;
    relationship:               string;
    occupation:                 string;
    phonenumber:                string;
    email:                      string;
    nationality:                string;
    stateOfOrigin:              string;
    localGovernment:            string;
    houseNumber:                string;
    streetName:                 string;
    landmark:                   string;
    areaTown:                   string;
    residentialState:           string;
    residentialLocalGovernment: string;
}


export interface TAcademicHistory extends  Omit<AcademicHistory,"certificate">{
    // certificate?:CertificateOfBirth
}

export interface TOLevelResult extends Omit<OLevelResult, "file"> {
    file?: CertificateOfBirth; // Making 'email' optional
  }


  export interface ExamRecord  {
    name: string;
    year: string;
    english: string;
    math: string;
    physics: string;
    chemistry: string;
    biology: string;
}

export interface TUploadFile{
    certificateofbirth:CertificateOfBirth;
    olevels:CertificateOfBirth[];
    passport:CertificateOfBirth;
    origin:CertificateOfBirth;
    utme:CertificateOfBirth;
}