export interface CountryDTO {
    data: Countries[];
  }
  
  export interface Countries {
    code:    string;
    name:    string;
    capital: string;
  }
  
  
export interface LGADTO {
    data: LGA[];
  }
  
  export interface LGA {
    id:   number;
    name: string;
  }
  export interface StatesDTO {
    data: States[];
  }
  
  export interface States{
    id:      number;
    name:    string;
    capital: string;
  }
  
  