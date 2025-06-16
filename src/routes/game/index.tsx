import * as React from 'react';

import { createFileRoute } from '@tanstack/react-router'

import { allCards, cardsByCost, cardsBySubtype, titleWordCount, cardsByTitleStartLetter } from '@/data/cards.ts';

import { Page } from '@/components/page';
import { CardSearch } from '@/components/card-search';
import { CardSelectDialog } from '@/components/card-select-dialog';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
})



interface GameCellProps extends React.PropsWithChildren {
  onClick?: () => void;
}
function GameCell({children, onClick}: GameCellProps) {
  return <div 
    role="button" 
    className="flex aspect-square rounded-lg transition ring-2 ring-black dark:ring-violet-300 bg-white dark:bg-gray-950 dark:inset-shadow-sm hover:dark:inset-shadow-violet-700 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
}

interface HeaderCellProps extends React.PropsWithChildren {
}
function HeaderCell({children}: HeaderCellProps) {
  return <div className="flex flex-col min-w-16 min-h-16 justify-center items-center text-center text-xl md:text-3xl font-medium md:mb-4">
    {children}
  </div>
}


function RouteComponent() {
  const [isCardDialogOpen, setIsCardDialogOpen] = React.useState(false);
  const handleCloseCardDialog = () => setIsCardDialogOpen(false);

  return <Page>
    <div className="flex flex-col items-center justify-center w-full">
      <CardSelectDialog isOpen={isCardDialogOpen} onClose={handleCloseCardDialog} />

      <div className="max-w-2xl w-full">
        <header className="w-full flex items-center p-1 md:mt-4 mb-4 md:mb-12 gap-4 text-xl md:text-3xl font-medium">
          <img className="size-[48px] md:size-auto" src="icon@2x.png" />
          <div className="text-violet-200">Tranquility Home Grid</div>
        </header>

        <div className="px-2">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4">
            {/*TODO: Add a reasonable min height here rather than margin from header to limit chance of content shifting*/}
            <HeaderCell>Rarity: 0</HeaderCell>
            <HeaderCell>Name includes "data"</HeaderCell>
            <HeaderCell>Cost 2</HeaderCell>
            <HeaderCell>Faction: NBN, Shaper</HeaderCell>
          </div>


          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4">
            <HeaderCell>Barrier</HeaderCell>

            <GameCell onClick={() => setIsCardDialogOpen(true)}> </GameCell>
            <GameCell> </GameCell>
            <GameCell />

            <HeaderCell>Region</HeaderCell>

            <GameCell />
            <GameCell />
            <GameCell />


            <HeaderCell>Unique</HeaderCell>

            <GameCell />
            <GameCell />
            <GameCell />
          </div>
        </div>


        <footer></footer>
      </div>
    </div>
  </Page>
}
