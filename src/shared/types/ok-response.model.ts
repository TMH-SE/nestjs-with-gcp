export class OkResponseModel<T> {
  data: T;
}

export class ApiOkResponseModel<T> extends OkResponseModel<T> {
  statusCode: number;
}

export class OkResponseWithPaginationModel<T> {
  data: T[];
  totalCount: number;
}

export class ApiOkResponseWithPaginationModel<T> extends OkResponseWithPaginationModel<T> {
  statusCode: number;
}
