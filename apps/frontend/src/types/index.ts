export interface Country {
  id: string;
  name: string;
  states?: State[];
}

export interface State {
  id: string;
  name: string;
  countryId: string;
  country?: Country;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  stateId?: string;
  countryId?: string;
  dateCreated: string;
  state?: State;
  country?: Country;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  stateId?: string;
  countryId?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
