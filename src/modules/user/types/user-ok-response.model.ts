import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApiOkResponseModel,
  ApiOkResponseWithPaginationModel,
  OkResponseModel,
  OkResponseWithPaginationModel,
} from 'src/shared/types/ok-response.model';
import { User } from '../entities/user.entity';

export type UserOkResponse = OkResponseModel<User>;

export class ApiUserOkResponse implements ApiOkResponseModel<User> {
  @ApiPropertyOptional({ default: 200 })
  statusCode: number;

  @ApiPropertyOptional({ type: User })
  data: User;
}

export class ApiUserCreatedResponse implements ApiOkResponseModel<User> {
  @ApiPropertyOptional({ default: 201 })
  statusCode: number;

  @ApiPropertyOptional({ type: User })
  data: User;
}

export type UserOkResponseWithPagination = OkResponseWithPaginationModel<User>;

export class ApiUserOkResponseWithPagination
  implements ApiOkResponseWithPaginationModel<User>
{
  @ApiPropertyOptional({ default: 200 })
  statusCode: number;

  @ApiPropertyOptional({ type: [User] })
  data: User[];

  @ApiPropertyOptional()
  totalCount: number;
}
