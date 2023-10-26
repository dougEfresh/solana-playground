import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

import Checkbox from "../Checkbox";
import LangIcon from "../LangIcon";
import { Framework, Level } from "./TutorialCard";
import type { FilterParam } from "./filters";
import type { TutorialLanguage } from "../../utils/pg";

interface FilterSectionProps {
  param: FilterParam;
  filters: readonly string[];
  sortFn?: (a: string, b: string) => number;
}

const FilterSection: FC<FilterSectionProps> = ({ param, filters, sortFn }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValues = searchParams.getAll(param);

  return (
    <FilterSectionWrapper>
      <FilterSectionTitle>{param}</FilterSectionTitle>
      {filters
        .filter(Boolean)
        .sort(sortFn)
        .map((filter) => (
          <Checkbox
            key={filter}
            label={<FilterLabel query={param}>{filter}</FilterLabel>}
            checked={searchValues.includes(filter)}
            onChange={(ev) => {
              if (ev.target.checked) {
                searchParams.append(param, filter);
              } else {
                const otherValues = searchValues.filter((f) => f !== filter);
                searchParams.delete(param);
                for (const otherValue of otherValues) {
                  searchParams.append(param, otherValue);
                }
              }

              setSearchParams(searchParams, { replace: true });
            }}
          />
        ))}
    </FilterSectionWrapper>
  );
};

const FilterSectionWrapper = styled.div`
  padding: 1rem;

  & label {
    margin: 0.5rem 0;
    padding: 0.25rem;
  }
`;

const FilterSectionTitle = styled.div`
  ${({ theme }) => css`
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-size: ${theme.font.other.size.small};
  `}
`;

interface FilterLabelProps {
  query: FilterParam;
  children: any;
}

const FilterLabel: FC<FilterLabelProps> = ({ query, ...props }) => {
  switch (query) {
    case "level":
      return <Level {...props} />;
    case "framework":
      return <FilterLabelFramework {...props} />;
    case "language":
      return <Language {...props} />;
    // case "category":
    //   return <Category {...props} />;
  }
};

const FilterLabelFramework = styled(Framework)`
  padding: 0 0.25rem;
  background: none;
  box-shadow: none;
`;

interface LanguageProps {
  children: TutorialLanguage;
}

const Language: FC<LanguageProps> = ({ children }) => (
  <LanguageWrapper>
    <LangIcon fileName={getLanguageExtension(children)} />
    {children}
  </LanguageWrapper>
);

const LanguageWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-size: ${theme.font.other.size.small};
    font-weight: bold;

    & *:first-child {
      margin-right: 0.375rem;
    }
  `}
`;

const getLanguageExtension = (lang: TutorialLanguage) => {
  switch (lang) {
    case "Python":
      return ".py";
    case "Rust":
      return ".rs";
    case "TypeScript":
      return ".ts";
  }
};

// const Category = styled.span`
//   ${({ theme }) => css`
//     font-size: ${theme.font.other.size.small};
//     font-weight: bold;
//   `}
// `;

export default FilterSection;
