import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationReqDto {
  @ApiProperty({
    required: false,
    description: '페이지',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    description: '페이지 크기',
    example: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class PaginationResDto<T> {
  page: number;
  limit: number;

  @ApiProperty({
    description: '전체 데이터 수',
    example: 192,
  })
  total: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 20,
  })
  totalPage: number;

  @ApiProperty({ description: '데이터 목록' })
  items: T[];
}
