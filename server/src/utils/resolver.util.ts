import { GraphQLResolveInfo } from "graphql";
import { ResolveTree, parse, simplify } from "graphql-parse-resolve-info";

const parseFields = (fields: Record<string, ResolveTree>) => {
  let select = {};
  Object.keys(fields).forEach((field) => {
    const subfields = Object.keys(fields[field].fieldsByTypeName);
    if (subfields.length !== 0) {
      select[field] = { select: parseFields(fields[field].fieldsByTypeName[subfields[0]]) };
    } else {
      select[field] = true;
    }
  });
  return select;
};

export const buildQuery = (info: GraphQLResolveInfo) => {
  const parsedResolveInfoFragment = parse(info);
  const { fields } = simplify(
    parsedResolveInfoFragment as ResolveTree,
    info.returnType,
  );
  return parseFields(fields);
}