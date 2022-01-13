import { Expose } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationParams {
  @Expose()
  @IsOptional()
  @IsInt()
  page?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  limit?: number;
}
