/** Shared search-result shape — used by the API route + /buscar UI. */
export interface SearchHit {
  type: "deck" | "rfc" | "rd" | "skill";
  title: string;
  desc: string;
  href: string;
}

export const SEARCH_TYPE_LABEL: Record<SearchHit["type"], string> = {
  deck: "Deck",
  rfc: "RFC",
  rd: "R&D",
  skill: "Skill",
};
