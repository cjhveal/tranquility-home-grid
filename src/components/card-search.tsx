import * as React from 'react';

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

import {type NrdbCardT} from '@/types';
import {cardsByFormat} from '@/data/cards';

function getCurrentFormatCards() {
  return cardsByFormat['standard'];
}


export interface CardSearchProps {
  onSelect?: (card: NrdbCardT) => void,
};
export function CardSearch({onSelect}: CardSearchProps) {
  const cardsInFormat = React.useMemo(() => getCurrentFormatCards(), []);

  const [selectedCard, setSelectedCard] = React.useState<NrdbCardT | null>(null);
  const [query, setQuery] = React.useState('');

  const handleSelectCard = React.useCallback((card: NrdbCardT) => {
    setSelectedCard(card);

    if (onSelect) {
      onSelect(card);
    }
  }, [onSelect]);
  
/*
 * @TODO: Use uFuzzy to do fuzzy searching for the card input
 */
  const filteredCards = React.useMemo(() => {
    return query === ''
      ? cardsInFormat
      : cardsInFormat.filter((card) => {
          return card.stripped_title.toLowerCase().includes(query.toLowerCase())
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
        aria-label="Card"
        displayValue={(card: NrdbCardT | null) => (card?.title || '')}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions anchor="bottom" className="w-(--input-width) border empty:invisible">
        {({option: card}) => (
          <ComboboxOption key={card.code} value={card} className="data-focus:bg-blue-100">
            {card.title}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
