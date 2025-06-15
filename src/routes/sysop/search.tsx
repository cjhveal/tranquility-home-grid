import * as React from 'react';

import { createFileRoute } from '@tanstack/react-router'

import {type NrdbCardT} from '@/types.ts';
import { getImageUrlForCard } from '@/data/cards';
import { CardSearch } from '@/components/card-search';

export const Route = createFileRoute('/sysop/search')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedCard, setSelectedCard] = React.useState<NrdbCardT | null>(null)

  const handleSelectCard = React.useCallback((card: NrdbCardT) => {
    setSelectedCard(card)
  }, []);
    
  return <div>
    <h1> search test</h1>

    <div>
      <CardSearch onSelect={handleSelectCard}/>
    </div>

    <div>
      {selectedCard && (
        <img src={getImageUrlForCard(selectedCard)} />
      )}
    </div>
  </div>
}
