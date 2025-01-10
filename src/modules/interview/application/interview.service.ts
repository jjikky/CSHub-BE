import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from '../dto/interview.req.dto';
import { IInterviewRepository } from '../domain/repository/iinterview.repository';
import { InterviewGroupMapper } from '../../quiz/domain/mapper/interview-group.mapper';

import {
  InterviewIdDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  FindInterviewByCategoryResDto,
  // FindInterviewInfoDto,
} from '../dto/interview.res.dto';
import { LikeService } from 'src/modules/like/application/like.service';
// import { PaginationResDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class InterviewService {
  constructor(
    @Inject('IInterviewRepository')
    private readonly interviewRepository: IInterviewRepository,
    private readonly likeService: LikeService,
  ) {}

  async create(
    createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<InterviewIdDto> {
    const interview = await this.interviewRepository.create(
      createInterviewReqDto,
    );
    return { id: interview.id };
  }

  async findAll(): Promise<FindInterviewByCategoryResDto[]> {
    const interviews = await this.interviewRepository.findAll();
    return InterviewGroupMapper.toGroups(interviews);
  }

  async findOne(
    id: number,
    userId?: number,
  ): Promise<FindInterviewResDto | FindInterviewWithLikeResDto> {
    const interview = await this.interviewRepository.findById(id);

    if (!userId) {
      return interview;
    }

    const like = await this.likeService.findOne(id, userId);

    return {
      ...interview,
      isLiked: !!like,
    };
  }

  async search(
    userId: number,
    searchInterviewReqDto: SearchInterviewReqDto,
  ): Promise<any> {
    // ): Promise<PaginationResDto<FindInterviewInfoDto>> {
    const { interviews, total } = userId
      ? await this.interviewRepository.searchWithLike(
          userId,
          searchInterviewReqDto,
        )
      : await this.interviewRepository.search(searchInterviewReqDto);

    const items = interviews.map((interview) => ({
      ...interview,
      isLiked: userId
        ? (interview.likes?.some((like) => like.userId === userId) ?? false)
        : false,
    }));

    const totalPage = Math.ceil(total / searchInterviewReqDto.limit || 10);
    return { items, total, totalPage };
  }
}
