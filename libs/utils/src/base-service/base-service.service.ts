import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  Model,
  Document,
  Types,
  FilterQuery,
  PopulateOptions,
  UpdateQuery,
  SortOrder,
} from 'mongoose';
import { PaginationDto } from '../dto/utils.dto';

export abstract class BaseService<C> {
  constructor(readonly Model: Model<C>) {}

  async save(doc: Document<{ _id: Types.ObjectId }, null, C>) {
    return doc.save();
  }

  create(data: Partial<C>) {
    return this.Model.create(data);
  }

  async findOneAndUpdateOrErrorOut(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: Array<PopulateOptions>,
  ) {
    try {
      const result = await this.Model.findOneAndUpdate(filter, data, {
        new: true,
      }).populate(population);
      if (!result)
        throw new BadRequestException(`${this.Model.modelName} not found`);

      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async findOneOrErrorOut(
    data: FilterQuery<C>,
    populate?: Array<PopulateOptions>,
  ) {
    const foundRecord = await this.Model.findOne(data).populate(populate);

    if (!foundRecord)
      throw new NotFoundException(`${this.Model.modelName} record not found`);

    return foundRecord;
  }

  async find(data: FilterQuery<C>, populate?: Array<PopulateOptions>) {
    return this.Model.find(data).populate(populate);
  }

  async deleteMany(data: FilterQuery<C>) {
    return this.Model.deleteMany(data);
  }

  async findAndPaginateResponse<T>(
    paginateData: PaginationDto,
    filter: FilterQuery<C>,
    sort?: string | { [key: string]: SortOrder },
    population?: Array<PopulateOptions>,
  ) {
    const { limit, page } = paginateData;
    const [foundItems, count] = await Promise.all([
      this.Model.find<T>(filter)
        .skip((page - 1) * limit)
        .sort(sort ?? { createdAt: -1 })
        .limit(limit)
        .populate(population),
      this.Model.countDocuments(filter),
    ]);

    return this.responsePaginator(paginateData, foundItems, count);
  }

  private responsePaginator<T>(
    pg: PaginationDto,
    foundItems: T[],
    itemCount: number,
  ) {
    const count = itemCount ?? 0;
    const totalPages = Math.ceil(count / pg.limit);
    const nextPage = pg.page + 1 > totalPages ? null : pg.page + 1;
    return {
      count,
      limit: pg.limit,
      totalPages,
      nextPage,
      currentPage: pg.page,
      foundItems,
    };
  }
}
