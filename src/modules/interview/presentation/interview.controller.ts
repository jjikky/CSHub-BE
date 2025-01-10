import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InterviewService } from '../application/interview.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/modules/user/domain/role.enum';
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetPagedItemsResponse,
  ApiGetItemsResponse,
  ApiGetResponse,
} from 'src/common/decorator/swagger.decorator';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from '../dto/interview.req.dto';
import {
  FindIntervieInfoWithLikeDto,
  FindInterviewByCategoryResDto,
  FindInterviewInfoDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  InterviewIdDto,
} from '../dto/interview.res.dto';
import { PaginationResDto } from 'src/common/dto/pagination.dto';
@ApiTags('Interview')
@ApiExtraModels(
  CreateInterviewReqDto,
  InterviewIdDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  FindIntervieInfoWithLikeDto,
  FindInterviewInfoDto,
  FindInterviewByCategoryResDto,
)
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<InterviewIdDto> {
    return await this.interviewService.create(createInterviewReqDto);
  }

  @Public()
  @Get('/search')
  @ApiGetPagedItemsResponse(FindInterviewInfoDto)
  async search(
    @Query() searchInterviewReqDto: SearchInterviewReqDto,
    @User() user?: UserAfterAuth,
  ): Promise<PaginationResDto<FindInterviewInfoDto>> {
    return await this.interviewService.search(user?.id, searchInterviewReqDto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get()
  @ApiGetItemsResponse(FindInterviewByCategoryResDto)
  async findAll(): Promise<FindInterviewByCategoryResDto[]> {
    return await this.interviewService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiGetResponse(FindIntervieInfoWithLikeDto)
  async findOne(
    @Param('id') id: number,
    @User() user?: UserAfterAuth,
  ): Promise<FindInterviewResDto | FindInterviewWithLikeResDto> {
    return await this.interviewService.findOne(id, user?.id);
  }
}
