import { useSearchGroupsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type GroupProfile = {
  slug: string;
  handle: string;
  address: string;
  name: string;
  picture: string;
};

const useGroupQuery = (query: string): GroupProfile[] => {
  const [results, setResults] = useState<GroupProfile[]>([]);
  const [searchGroups] = useSearchGroupsLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    searchGroups({ variables: { request: { query } } }).then(({ data }) => {
      const groups = data?.searchGroups?.items;
      const groupsResults = (groups ?? []).map(
        (group): GroupProfile => ({
          slug: group.metadata?.slug || "",
          handle: group.metadata?.slug || "",
          address: group.address,
          name: group.metadata?.name || "",
          picture: group.metadata?.icon || ""
        })
      );

      setResults(groupsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });
  }, [query]);

  return results;
};

export default useGroupQuery;
