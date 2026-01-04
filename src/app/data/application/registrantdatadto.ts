

export interface RegistrantDataDTO {
  data?: RegistrantData;
}

export interface RegistrantData {
  gender: string;

  id:                           number;
  application_no:               string;
  first_name:                   string;
  last_name:                    string;
  other_names:                  string;
  email:                        string;
  phone_number:                 string;
  alt_phone_number:             string;
  certificate_of_birth:         CertificateOfBirth|undefined;
  o_level_result:               OLevelResult[];
  certificate_of_origin:        CertificateOfBirth|undefined;
  passport_photo:               CertificateOfBirth|undefined;
  payment_slip:               CertificateOfBirth|undefined;
  marital_status:               string;
  disability:               string;
  payment_status:               string;
  utme_result:                  UtmeResult|undefined;
  residential_address:          Address|undefined;
  correspondence_address:       Address|undefined;
  nationality:                  string;
  dob: string;
  state_of_origin:              string;
  lga:                          string;
  primary_parent_or_guardian:   AryParentOrGuardian|undefined;
  secondary_parent_or_guardian: AryParentOrGuardian|undefined;
  approval_status:              string;
  payment_record:               null;
  program:                      Department;
  session:                      Session;
  academic_history?:             AcademicHistory[];
  department:                   Department;
  deleted_at:                   null;
  created_at:                   Date|undefined;
  updated_at:                   Date|undefined;
}

export interface AcademicHistory {
  institution:      string;
  certificate_type: string;
  from_date:        string;
  to_date:          string;
  certificate:      CertificateOfBirth;
}

export interface CertificateOfBirth {
  file_url?:  string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

export interface Address {
  address:     string;
  street_name: string;
  land_mark:   string;
  city:        string;
  lga:         LGA;
  state:       State;
  country:     Country;
}

export interface Country {
  id:   number;
  name: string;
}
export interface LGA {
  id:   number;
  name: string;
}



export interface State {
  id:      number;
  name:    string;
  capital: string;
}

export interface Department {
  id:   number;
  name: string;
  code: string;
}

export interface OLevelResult {
  name:string;
  subjects: Subject[];
  file:     CertificateOfBirth;
}

export interface Subject {
  subject: string;
  grade:   string;
}

export interface AryParentOrGuardian {
  lga: string;
  title:                  string;
  first_name:             string;
  last_name:              string;
  other_names:            string;
  email:                  string;
  gender:                 string;
  phone_number:           string;
  alt_phone_number:       string;
  occupation:             string;
  residential_address:    string;
  correspondence_address: string;
  nationality:            string;
  state_of_origin:        string;
}

export interface Session {
  id:         number;
  name:       string;
  start_date: Date;
  end_date:   Date;
}

export interface UtmeResult {
  score?: number;
  file:  CertificateOfBirth;
}


