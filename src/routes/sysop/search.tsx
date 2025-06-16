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
    
  return <div className="h-screen max-w-2xl w-full">
    <h1> search test</h1>

    <div className="flex gap-2 w-full">
      <CardSearch onSelect={handleSelectCard}/>
      <div className="size-8 bg-amber-600"></div>
    </div>

    <div>
      {selectedCard && (
        <img src={getImageUrlForCard(selectedCard)} />
      )}
    </div>
  </div>
}
