import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByCreatorArgs } from "./args/GroupByCreatorArgs";
import { Creator } from "../../../models/Creator";
import { CreatorGroupBy } from "../../outputs/CreatorGroupBy";

@TypeGraphQL.Resolver(_of => Creator)
export class GroupByCreatorResolver {
  @TypeGraphQL.Query(_returns => [CreatorGroupBy], {
    nullable: false
  })
  async groupByCreator(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCreatorArgs): Promise<CreatorGroupBy[]> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields)
          // remove __typename and others
          .filter(([key, value]) => !key.startsWith("__"))
          .map<[string, any]>(([key, value]) => {
            if (Object.keys(value).length === 0) {
              return [key, true];
            }
            return [key, transformFields(value)];
          }),
      );
    }

    const { count, avg, sum, min, max } = transformFields(
      graphqlFields(info as any)
    );
    return ctx.prisma.creator.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ count, avg, sum, min, max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
