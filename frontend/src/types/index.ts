type BaseUser = {
  id?: string
  username: string;
  role: "super_admin" | "admin" | "employee" | "";
  profile_image?: string;
  employee_type?: "Driver" | "Helper" | "Staff" | "" | undefined;
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

type SalConfig = {
  id?: number;
  sss?: number;
  philhealth?: number;
  pag_ibig?: number;
};

type Vehicle = {
  plate_number?: number;
  vehicle_type?: string;
  is_company_owned?: boolean;
};

type Trip = {
  trip_id: number;
  full_destination?: string;
  client_info: string;
  num_of_drops: number;
  start_date: string;
  end_date?: string;
  assignment_status: string;
  is_completed: boolean;
  vehicle: {
    plate_number: string;
  };
  employee?: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
  } | null;
};
