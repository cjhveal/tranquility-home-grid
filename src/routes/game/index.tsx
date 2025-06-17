import * as React from 'react';

import { createFileRoute } from '@tanstack/react-router'

import type {TConstraintKey} from '@/types';
import { CardConstraint } from '@/constraints';
import {parsePuzzleSpec, EXAMPLE_PUZZLE_1} from '@/puzzle';

import { Page } from '@/components/page';
import { CardSelectDialog } from '@/components/card-select-dialog';
import {cardsByFormat} from '@/data/cards';

// @TODO: Base this on format state
function getCurrentFormatCards() {
  return cardsByFormat['standard'];
}

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
  loader: () => {
    const puzzle =  parsePuzzleSpec(EXAMPLE_PUZZLE_1);

    return {puzzle};
  }
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

interface CardDialogState {
  isOpen: boolean,
  firstConstraint: CardConstraint,
  secondConstraint: CardConstraint,
}

function RouteComponent() {
  const {puzzle} = Route.useLoaderData();
  const cardsInFormat = React.useMemo(() => getCurrentFormatCards(), []);

  const [cardDialogState, setCardDialogState] = React.useState({
    isOpen: false,
    firstConstraint: puzzle.constraints["A"],
    secondConstraint: puzzle.constraints["1"],
  });
  const handleCloseCardDialog = () => {
    setCardDialogState((state) => ({...state, isOpen: false}))
  };

  const handleOpenCardDialog = React.useCallback((firstKey: TConstraintKey, secondKey: TConstraintKey) => {
    const firstConstraint = puzzle.constraints[firstKey];
    const secondConstraint = puzzle.constraints[secondKey];

    setCardDialogState((state) => {
      return {
        ...state,
        firstConstraint,
        secondConstraint,
        isOpen: true,
      }
    });
  }, [puzzle, setCardDialogState]);


  const {constraints} = puzzle;

  return <Page>
    <div className="flex flex-col items-center justify-center w-full">
      <CardSelectDialog 
        isOpen={cardDialogState.isOpen} 
        onClose={handleCloseCardDialog} 
        firstConstraint={cardDialogState.firstConstraint}
        secondConstraint={cardDialogState.secondConstraint}
        cardsInFormat={cardsInFormat}
      />

      <div className="max-w-2xl w-full">
        <header className="w-full flex items-center p-1 md:mt-4 mb-4 md:mb-12 gap-4 text-xl md:text-3xl font-medium">
          <img className="size-[48px] md:size-auto" src="icon@2x.png" />
          <div className="text-violet-200">Tranquility Home Grid</div>
        </header>

        <div className="px-2">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4">
            {/*TODO: Add a reasonable min height here rather than margin from header to limit chance of content shifting*/}
            <HeaderCell></HeaderCell>
            <HeaderCell>{constraints["A"].getName()}</HeaderCell>
            <HeaderCell>{constraints["B"].getName()}</HeaderCell>
            <HeaderCell>{constraints["C"].getName()}</HeaderCell>

            <HeaderCell>{constraints["1"].getName()}</HeaderCell>

            <GameCell onClick={() => handleOpenCardDialog("A", "1")}> </GameCell>
            <GameCell onClick={() => handleOpenCardDialog("B", "1")}> </GameCell>
            <GameCell onClick={() => handleOpenCardDialog("C", "1")} />

            <HeaderCell>{constraints["2"].getName()}</HeaderCell>

            <GameCell onClick={() => handleOpenCardDialog("A", "2")}/>
            <GameCell onClick={() => handleOpenCardDialog("B", "2")}/>
            <GameCell onClick={() => handleOpenCardDialog("C", "2")}/>


            <HeaderCell>{constraints["3"].getName()}</HeaderCell>

            <GameCell onClick={() => handleOpenCardDialog("A", "3")}/>
            <GameCell onClick={() => handleOpenCardDialog("B", "3")}/>
            <GameCell onClick={() => handleOpenCardDialog("C", "3")}/>
          </div>
        </div>


        <footer></footer>
      </div>
    </div>
  </Page>
}
