import * as React from 'react';

import {matchSorter} from 'match-sorter';

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

import {type NrdbCardT} from '@/types';



export interface CardSearchProps {
  autoFocus?: boolean,
  onSelect?: (card: null | NrdbCardT) => void,
  cardsInFormat: NrdbCardT[],
};
export function CardSearch({onSelect, autoFocus, cardsInFormat}: CardSearchProps) {
  const [selectedCard, setSelectedCard] = React.useState<NrdbCardT | null>(null);
  const [query, setQuery] = React.useState('');

  const handleSelectCard = React.useCallback((card: null | NrdbCardT) => {
    setSelectedCard(card);

    if (onSelect) {
      onSelect(card);
    }
  }, [onSelect, setSelectedCard]);
  
  const filteredCards = React.useMemo(() => {
    if (query === '') {
      return cardsInFormat;
    }

    return matchSorter(cardsInFormat, query, {
      keys: ['stripped_title'],
      threshold: matchSorter.rankings.ACRONYM,
    });
  }, [query, cardsInFormat])

  return (
    <Combobox 
      value={selectedCard}
      virtual={{ options: filteredCards }}
      onChange={handleSelectCard}
      onClose={() => setQuery('')}
    >
      <ComboboxInput
        autoComplete="off"
        autoFocus={autoFocus}
        aria-label="Card"
        className="w-full py-1 px-2 border border-black dark:text-violet-50 dark:border-violet-300 bg-white dark:bg-gray-950 rounded-md text-md md:text-xl"
        displayValue={(card: NrdbCardT | null) => (card?.title || '')}
        onChange={(event) => {
          handleSelectCard(null);
          setQuery(event.target.value)
        }}
      />
      <ComboboxOptions anchor="bottom" className="w-(--input-width) p-2 border dark:border-violet-300 bg-white dark:bg-gray-950 empty:invisible">
        {({option: card}) => (
          <ComboboxOption key={card.code} value={card} className="w-full p-2 rounded-md data-focus:bg-blue-100 dark:data-focus:bg-indigo-950 dark:text-violet-50">
            {card.title}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
