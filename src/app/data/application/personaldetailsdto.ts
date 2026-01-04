

export interface PersonalDetailDTO {
  certificate_of_birth?:         CertificateOfBirth;
  o_level_result?:               OLevelResult[];
  certificate_of_origin?:        CertificateOfBirth;
  passport_photo?:               CertificateOfBirth;
  marital_status?:               string;
  disability?:               string;
  utme_result?:                  UtmeResult;
  residential_address?:          Address;
  correspondence_address?:       Address;
  nationality?:                  string;
  state_of_origin?:              string;
  lga?:                          string;
  primary_parent_or_guardian?:   AryParentOrGuardian;
  secondary_parent_or_guardian?: AryParentOrGuardian;
  academic_history?:             AcademicHistory[];
}

export interface AcademicHistory {
  institution:      string;
  certificate_type: string;
  from_date:        string;
  to_date:          string;
  certificate?:      CertificateOfBirth|string;
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
  lga_id:      string;
}

export interface OLevelResult {
  name:string;
  subjects: Subject[];
  file?:     CertificateOfBirth;
}

export interface Subject {
  subject: string;
  grade:   string;
}

export interface AryParentOrGuardian {
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
  lga:string;
}

export interface UtmeResult {
  score?: number;
  file:  CertificateOfBirth;
}

