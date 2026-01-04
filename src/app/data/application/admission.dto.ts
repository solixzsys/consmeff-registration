export interface OpenApplicationDTO {
    data: Datum[];
  }
  
  export interface Datum {
    id:        number;
    code:      string;
    session:   Session;
    program:   Program;
    level:     Level;
    opens_at:  Date;
    closes_at: Date;
  }
  
  export interface Level {
    id:        number;
    name:      string;
    is_active: boolean;
  }
  
  export interface Program {
    id:   number;
    name: string;
    code: string;
  }
  
  export interface Session {
    id:         number;
    name:       string;
    start_date: Date;
    end_date:   Date;
  }

  
export interface DepartmentsDTO {
  data: Department[];
}

export interface Department {
  id:      number;
  name:    string;
  code:    string;
  hod:     null;
  faculty: Faculty;
}

export interface Faculty {
  id:   number;
  name: string;
}


export interface AppInitResponseDTO {
  data: AppInitResponse;
}

export interface AppInitResponse {
  id:                           number;
  application_no:               string;
  first_name:                   string;
  last_name:                    string;
  other_names:                  string;
  email:                        string;
  phone_number:                 string;
  alt_phone_number:             string;
  certificate_of_birth:         null;
  o_level_result:               null;
  certificate_of_origin:        null;
  passport_photo:               null;
  marital_status:               string;
  disabilitys:               string;
  payment_status:               string;
  utme_result:                  null;
  residential_address:          null;
  correspondence_address:       null;
  nationality:                  null;
  state_of_origin:              null;
  lga:                          null;
  primary_parent_or_guardian:   null;
  secondary_parent_or_guardian: null;
  approval_status:              string;
  payment_record:               null;
  program:                      Department;
  session:                      Session;
  academic_history:             any[];
  department:                   Department;
  deleted_at:                   null;
  created_at:                   Date;
  updated_at:                   Date;
}

export interface Department {
  id:   number;
  name: string;
  code: string;
}

export interface Session {
  id:         number;
  name:       string;
  start_date: Date;
  end_date:   Date;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toAppInitResponseDTO(json: string): AppInitResponseDTO {
      return JSON.parse(json);
  }

  public static appInitResponseDTOToJson(value: AppInitResponseDTO): string {
      return JSON.stringify(value);
  }
}

  