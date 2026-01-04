// To parse this data:
//
//   import { Convert, PreRegistrationDataDTO } from "./file";
//
//   const preRegistrationDataDTO = Convert.toPreRegistrationDataDTO(json);

export interface PreRegistrationDataDTO {
  subject_grades: string[];
  titles:             string[];
  marital_statuses:   string[];
  id_types:           string[];
  certificate_types:  string[];
  relationship_types: string[];
  gender:             string[];
  occupations:        string[];
}

