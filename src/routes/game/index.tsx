import * as React from 'react';

import clsx from 'clsx';
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import type {NrdbCardT, TColKey, TRowKey} from '@/game/types';
import {
  parsePuzzleSpec,
  EXAMPLE_PUZZLE_3,
  EXAMPLE_PUZZLE_4,
  getBlankSolution,

  type TGrid,
  type TSolution,
} from '@/puzzle';
import {PuzzleValidator} from '@/game/generator';

import { Page } from '@/components/page';
import { CardSelectDialog, useCardDialogState } from '@/components/card-select-dialog';

import { useTRPC } from '@/utils/trpc';
import {fetchNrdbData} from '@/utils/nrdbData';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
  loader: async () => {
    const puzzle =  parsePuzzleSpec(EXAMPLE_PUZZLE_4);

    const dataByFormat = await fetchNrdbData();

    return {puzzle, dataByFormat};
  }
})

const GAME_CELL_BACKGROUNDS = {
  "red": "bg-linear-to-br from-red-700 to-amber-800",
  "green": "bg-linear-to-r from-green-700 to-teal-600",
  "blue": "bg-linear-to-b from-cyan-600 to-blue-800",
  "violet": "bg-radial-[at_10%_100%] from-violet-950 to-black animate-radial-pulse",
  "ultraviolet": "ultraviolet-background-animation"
}

function getBackgroundFromCardPool(cardPool: NrdbCardT[]): keyof typeof GAME_CELL_BACKGROUNDS {
  const size = cardPool.length;

  if (size <= 2) {
    return 'ultraviolet';
  } else if (size <= 4) {
    return 'violet';
  } else if (size <= 9) {
    return 'blue';
  } else if (size <= 16) {
    return 'green';
  } else {
    return 'red';
  }
}

interface GameCellProps {
  col: TColKey,
  row: TRowKey,
  onOpenDialog: (c: TColKey, r: TRowKey) => void,
  solution: TSolution,
  cardPoolGrid: TGrid<NrdbCardT[]>,
}
function GameCell({onOpenDialog, col, row, solution, cardPoolGrid}: GameCellProps) {
  const currentSolution = solution[col][row];
  const currentCardPool = cardPoolGrid[col][row]

  const backgroundClass = React.useMemo(() => {
    const key = getBackgroundFromCardPool(currentCardPool);

    return GAME_CELL_BACKGROUNDS[key];
  }, [currentCardPool]);

  const title = currentSolution?.title;

  const handleOpenDialog = React.useCallback(() => {
    if (!currentSolution) {
      onOpenDialog(col, row);
    }
  }, [currentSolution, onOpenDialog]);
  return <div 
    role="button" 
    className={clsx(
      "flex flex-col justify-center items-center text-center aspect-square p-1 rounded-lg text-lg md:text-2xl transition ring-2 ring-black dark:ring-violet-300 bg-white dark:bg-gray-950 cursor-pointer",
      { [backgroundClass]: currentSolution },
    )}
    onClick={handleOpenDialog}
  >
    {title && (<span className="bg-black/40 rounded-md p-1">
      {title}
    </span>)}
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
  const {puzzle, dataByFormat} = Route.useLoaderData();
  const trpc = useTRPC();

  const scheduleQuery = useQuery(trpc.getPuzzles.queryOptions());

  const cardsInFormat = dataByFormat.standard.cards;

  const cardPoolGrid = React.useMemo(() => {
    const validator = new PuzzleValidator(cardsInFormat, puzzle.constraints);

    return validator.intersectGrid();
  }, [cardsInFormat, puzzle.constraints]);

  const {
    cardDialogState,
    handleOpenCardDialog,
    handleCloseCardDialog,
  } = useCardDialogState();


  const [solutionState, setSolutionState] = React.useState<TSolution>(getBlankSolution())

  const handleSubmitCard = (col: TColKey, row: TRowKey, card: NrdbCardT) => {
    setSolutionState(state => {
      return {
        ...state,
        [col]: {
          ...state[col],
          [row]: card,
        }
      }
    })
  }

  const {constraints} = puzzle;

  return <Page>
    <div className="flex flex-col items-center justify-center w-full">
      <CardSelectDialog 
        {...cardDialogState}
        isOpen={cardDialogState.isOpen} 
        onClose={handleCloseCardDialog} 
        onSubmit={handleSubmitCard}
        cardsInFormat={cardsInFormat}
        constraints={constraints}
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

            <GameCell col="A" row="1" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
            <GameCell col="B" row="1" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
            <GameCell col="C" row="1" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />

            <HeaderCell>{constraints["2"].getName()}</HeaderCell>

            <GameCell col="A" row="2" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
            <GameCell col="B" row="2" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
            <GameCell col="C" row="2" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />


            <HeaderCell>{constraints["3"].getName()}</HeaderCell>

            <GameCell col="A" row="3" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
            <GameCell col="B" row="3" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
            <GameCell col="C" row="3" onOpenDialog={handleOpenCardDialog} solution={solutionState} cardPoolGrid={cardPoolGrid} />
          </div>
        </div>


        <footer></footer>
      </div>
    </div>
  </Page>
}
