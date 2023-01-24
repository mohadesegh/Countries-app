import React, { useEffect, useRef } from "react";
import { Card } from "../../components/Card/Card";
import { CardsWrapper } from "../../components/CardsWrapper/CardsWrapper";
import { SearchField } from "../../components/SearchField/SearchField";
import { SelectField } from "../../components/SelectField/SelectField";
import { useAppContext } from "../../contexts/AppContext";
import { selectOptions } from "../../helpers/selectOptions";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { SearchContainer, Main, Container } from "./styles";
import styled from 'styled-components'

export const HomePage = () => {
  const [appState, actions] = useAppContext();
  const {
    allCountries,
    searchValue,
    selectFilter,
    loading,
    hasError,
    errorMessage,
  } = appState;
  const isMounted = useRef(true);

  let filteredCountries =
    selectFilter !== null
      ? allCountries.filter((country) => country.region === selectFilter)
      : allCountries;

  filteredCountries =
    searchValue !== ""
      ? filteredCountries.filter((country) =>
          country.name.common.toLowerCase().includes(searchValue.toLowerCase())
        )
      : filteredCountries;

  useEffect(() => {
    if (isMounted && !allCountries.length) {
      actions.getCountries();
    }

    return () => {
      isMounted.current = false;
    };
  }, [actions, allCountries]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (hasError) {
    return (
      <ErrorMessage
        message={"Error! :("}
        information={`Additional information: ${appState.errorMessage}`}
      />
    );
  }

  return (
    <Main>
      <Container>
        <SearchContainer>
          <SearchField />
          <SelectField title={"Filter by Region"} options={selectOptions} />
        </SearchContainer>
        {filteredCountries.length <= 0 && !loading && (
          <ErrorMessage
            message={"No countries or regions have been found :("}
          />
        )}

        {!!filteredCountries.length && (
          <CardsWrapper>
            {filteredCountries.map((country, index) => (
              <Card
                key={index}
                url={country.flags.png}
                title={country.name.common}
                population={country.population}
                region={country.region}
                capital={country.capital}
                countryIndex={country.cca3}
              />
            ))}
          </CardsWrapper>
        )}
      </Container>
    </Main>
  );
};
