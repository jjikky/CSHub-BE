import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from '../application/catgegory.service';
import { Role } from 'src/modules/user/domain/role.enum';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/role.decorator';
import { CreateSubCategoryReqDto } from '../dto/category.req.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { SubCategoryWithCountDto } from '../dto/category.res.dto';
import { ApiGetItemsResponse } from 'src/common/decorator/swagger.decorator';
import { FindSubCategoryByMainReqDto } from '../dto/category.req.dto';

@ApiTags('Category')
@ApiExtraModels(CreateSubCategoryReqDto, SubCategoryWithCountDto)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  async createSubCategory(@Body() body: CreateSubCategoryReqDto) {
    return this.categoryService.createSubCategory(body);
  }

  @Get('/:main_category')
  @Public()
  @ApiOperation({
    summary: '메인 카테고리별 서브카테고리와 인터뷰 개수 조회',
    description:
      '메인 카테고리에 속한 서브카테고리들의 이름과 각각의 인터뷰 개수를 반환합니다.',
  })
  @ApiGetItemsResponse(SubCategoryWithCountDto)
  async findSubCategoryWithCount(
    @Param() { main_category }: FindSubCategoryByMainReqDto,
  ): Promise<SubCategoryWithCountDto[]> {
    return await this.categoryService.findSubCategoryWithCount(main_category);
  }
}
