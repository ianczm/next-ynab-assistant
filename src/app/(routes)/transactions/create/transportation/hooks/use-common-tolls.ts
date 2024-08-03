import { Toll } from "@/data/common/tolls";
import { ApiService } from "@/services/frontend/api-service";
import { GUID } from "@/ui/types/guid";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useCommonTolls(apiService: ApiService) {
  const [commonTolls, setCommonTolls] = useState<GUID<Toll>[]>([]);

  useEffect(() => {
    const fetchCommonTolls = async () => {
      const tolls: Toll[] = await apiService.getUniqueTolls().then((response) => response.data);
      setCommonTolls(tolls.map((toll) => ({ ...toll, guid: uuidv4() })));
    };
    fetchCommonTolls();
  }, [apiService]);

  return commonTolls;
}
