import { useLocation } from "react-router-dom";
import { useMemo } from "react";

//Pega o q da busca
export function useQuery() {
  const { search } = useLocation();

  //useMemo é igual ao useState, mas não renderiza o componente
  return useMemo(() => new URLSearchParams(search), [search]);
}
