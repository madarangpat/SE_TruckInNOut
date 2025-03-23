type BaseUser = {
  username: string;
  role: "super_admin" | "admin" | "employee" | "N/A";
  profile_image?: string;
};

type User = BaseUser & {
  first_name?: string;
  last_name?: string;
  cellphone_no?: string;
  email: string;
  philhealth_no?: string;
  pag_ibig_no?: string;
  sss_no?: string;
  license_no?: string;
  [key: string]: any;
};

type SalConfig = BaseUser & {
  sss?: number;
  philhealth?: number;
  pag_ibig?: number;
  vale?: number;
  sss_loan?: number;
  pag_ibig_loan?: number;
  cash_advance?: number;
  cash_bond?: number;
  charges?: number;
  others?: number;
  overtime?: number;
  additionals?: number;
};

type Vehicle = {
  plate_number?: number;
  vehicle_type?: string;
  is_company_owned?: boolean;
};
