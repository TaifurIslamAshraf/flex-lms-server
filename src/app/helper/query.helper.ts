import { Aggregate, FilterQuery, Model, PipelineStage, Query } from "mongoose";

export class QueryHelper<T> {
  model: Query<T[], T>;
  query: Record<string, unknown>;

  constructor(model: Query<T[], T>, query: Record<string, unknown>) {
    this.model = model;
    this.query = query;
  }
  search(searchFields: string[]): this {
    const search = this.query?.search;
    if (search) {
      const searchConditions = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(search as string, "i") },
      }));
      this.model = this.model.find({ $or: searchConditions } as FilterQuery<T>);
    }
    return this;
  }
  filterByCategory(): this {
    const category = this.query?.category;
    if (category) {
      this.model = this.model.find({ category: { $in: category } });
    }
    return this;
  }
  filterByStock(): this {
    const stock = this.query?.stock;
    if (stock) {
      this.model = this.model.find({ "inventory.stockStatus": stock });
    }
    return this;
  }
  sort(): this {
    const sort = this.query?.sort;
    if (sort) {
      this.model = this.model.sort((sort as string).split(",").join(" "));
    }
    return this;
  }
  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.model = this.model.skip(skip).limit(limit);
    return this;
  }
  select(): this {
    const select = this.query?.select;
    if (select) {
      this.model = this.model.select((select as string).split(",").join(" "));
    }
    return this;
  }
  async metaData(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  }> {
    const filter = this.model.getFilter();
    const total = await this.model.model.countDocuments(filter);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    return { page, limit, total, totalPage };
  }
}

export class AggregateQueryHelper<T> {
  model: Aggregate<T[]>;
  query: Record<string, unknown>;
  mongooseModel: Model<T>;

  constructor(
    model: Aggregate<T[]>,
    query: Record<string, unknown>,
    mongooseModel: Model<T>
  ) {
    this.model = model;
    this.query = query;
    this.mongooseModel = mongooseModel;
  }

  search(): this {
    const search = this.query?.search;
    if (search) {
      this.model = this.mongooseModel.aggregate([
        { $match: { $text: { $search: search as string } } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.model = this.model.skip(skip).limit(limit);
    return this;
  }

  filterByCategory(): this {
    const category = this.query?.category;

    if (category) {
      this.model = this.mongooseModel.aggregate([
        { $match: { category } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    }

    return this;
  }

  filterBySubCategory(): this {
    const subcategory = this.query?.subcategory;

    if (subcategory) {
      this.model = this.mongooseModel.aggregate([
        { $match: { subcategory } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    }

    return this;
  }

  filterByPrice(): this {
    const price = this.query?.price;

    if (price === "free") {
      this.model = this.mongooseModel.aggregate([
        { $match: { price: 0 } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    } else if (price === "paid") {
      this.model = this.mongooseModel.aggregate([
        { $match: { price: { $gt: 0 } } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    } else if (price === "offers") {
      this.model = this.mongooseModel.aggregate([
        { $match: { estimatedPrice: { $gt: 0 } } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    }

    return this;
  }

  filterByLevel(): this {
    const level = this.query?.level;

    if (level) {
      this.model = this.mongooseModel.aggregate([
        { $match: { level } },
        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    }

    return this;
  }

  filterByOrderStatus(): this {
    const orderStatus = this.query?.orderStatus;
    if (orderStatus) {
      this.model = this.mongooseModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            orderStatus: {
              $in: Array.isArray(orderStatus) ? orderStatus : [orderStatus],
            },
          },
        },
        {
          $project: {
            _id: 1,
            accountType: 1,
            orderStatus: 1,
            phone: 1,
            items: 1,
            orderedAt: 1,
            "userInfo.name": 1,
            "userInfo.email": 1,
          },
        },

        ...this.model.pipeline(),
      ]) as Aggregate<T[]>;
    }
    return this;
  }

  async metaData(): Promise<{
    totalPage: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  }> {
    const pipeline = this.model.pipeline() as PipelineStage[];

    const matchStage = pipeline.find(
      (stage) => "$match" in stage
    ) as PipelineStage.Match;

    const filter = matchStage ? matchStage.$match : {};
    const total = await this.mongooseModel.countDocuments(filter);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return { totalPage, currentPage: page, nextPage, prevPage };
  }
}
