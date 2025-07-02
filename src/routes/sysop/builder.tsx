import React from 'react';

import { createFileRoute } from '@tanstack/react-router'

import type { 
  NrdbCardT,
  NrdbDataByFormat,
} from '@/types';

import {
  CardConstraint,
  TitleIncludesConstraint,
} from '@/constraints';

import { type IncompletePuzzleConstraints } from '@/puzzle';

import {
  makeAllCostConstraints,
  makeAllTitleStartConstraints,
  makeAllInfluenceConstraints,
  makeAllFactionConstraints,
  makeAllTypeConstraints,
  makeAllSubtypeConstraints,

  generatePuzzle,
} from '@/game/generator';

import {Button} from '@/components/button';

import {fetchNrdbData} from '@/utils/nrdbData';

export const Route = createFileRoute('/sysop/builder')({
  component: RouteComponent,
  loader: async () => {
    const dataByFormat = await fetchNrdbData()

    return {dataByFormat}
  },
})

const TITLE_WORDS = ["data", "net", "grid", "project", "wall", "campaign", "job", "test", "2", "3"]

 

interface BuilderGridBaseCellProps extends React.PropsWithChildren{
  onClick?: () => void,
  ringColor: string,
  isSelectable?: boolean,
}
function BuilderGridBaseCell(props: BuilderGridBaseCellProps) {
  const {ringColor, isSelectable = false, ...rest} = props;
  return <div 
    className={`flex flex-col justify-center items-center gap-2 min-size-16 aspect-square rounded-xl ring-2 ${ringColor} ${isSelectable && 'cursor-pointer'}`}
    {...rest}
  />
}


interface BuilderGridHeaderProps extends React.PropsWithChildren {
  selectedId?: string,
  cellId?: string,
  onClick?: () => void,
  constraint?: CardConstraint | null,
}
function BuilderGridHeader({selectedId, cellId, onClick, constraint}: BuilderGridHeaderProps) {
  const isSelectable = Boolean(cellId);
  const isSelected = cellId && (cellId === selectedId);
  const ringColor = (!isSelectable && 'ring-black') || (isSelected ? 'ring-red-700' : 'ring-blue-700')

  const name = constraint && (constraint.getName());
  return <BuilderGridBaseCell
    ringColor={ringColor}
    isSelectable={isSelectable}
    onClick={onClick}
  >
    {name}
  </BuilderGridBaseCell>
}

interface BuilderGridCellProps {
  counts?: {
    eternal: number,
    standard: number,
    startup: number,
  }
}
function BuilderGridCell({counts}: BuilderGridCellProps) {
  return <BuilderGridBaseCell ringColor="ring-black">
    <div>{counts?.eternal}</div>
    <div>{counts?.standard}</div>
    <div>{counts?.startup}</div>
  </BuilderGridBaseCell>
}

interface BuilderGridProps {
  selectedId: string,
  onSelectId: (id: string) => void,
  constraintMap: Record<string, CardConstraint | null>,
  dataByFormat: NrdbDataByFormat,
}
function BuilderGrid({selectedId, onSelectId, constraintMap, dataByFormat}: BuilderGridProps) {

  const intersectConstraints = (firstId: string|null, secondId: string|null) => {
    const firstConstraint = firstId && constraintMap[firstId];
    const secondConstraint = secondId && constraintMap[secondId];

    if (firstConstraint && secondConstraint) {
      return (cards: NrdbCardT[]) => {
        return secondConstraint.filter(firstConstraint.filter(cards));
      }
    } else if (firstConstraint) {
      return (cards: NrdbCardT[]) => firstConstraint.filter(cards);
    } else if (secondConstraint) {
      return (cards: NrdbCardT[]) => secondConstraint.filter(cards);
    }
  }

  const computeIntersectionCounts = (firstId: string | null, secondId: string | null) => {
    const filterCards = intersectConstraints(firstId, secondId);

    if (filterCards) {
      return {
        eternal: filterCards(dataByFormat.eternal.cards).length,
        standard: filterCards(dataByFormat.standard.cards).length,
        startup: filterCards(dataByFormat.startup.cards).length,
      }
      
    }
  }

  return <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
    <div />
    <BuilderGridHeader cellId="A" selectedId={selectedId} onClick={() => onSelectId("A")} constraint={constraintMap["A"]} />
    <BuilderGridHeader cellId="B" selectedId={selectedId} onClick={() => onSelectId("B")} constraint={constraintMap["B"]} />
    <BuilderGridHeader cellId="C" selectedId={selectedId} onClick={() => onSelectId("C")}  constraint={constraintMap["C"]} />

    <BuilderGridHeader cellId="1" selectedId={selectedId} onClick={() => onSelectId("1")} constraint={constraintMap["1"]} />
    <BuilderGridCell counts={computeIntersectionCounts("A","1")} />
    <BuilderGridCell counts={computeIntersectionCounts("B","1")} />
    <BuilderGridCell counts={computeIntersectionCounts("C","1")} />
    
    <BuilderGridHeader cellId="2" selectedId={selectedId} onClick={() => onSelectId("2")} constraint={constraintMap["2"]} />
    <BuilderGridCell counts={computeIntersectionCounts("A","2")} />
    <BuilderGridCell counts={computeIntersectionCounts("B","2")} />
    <BuilderGridCell counts={computeIntersectionCounts("C","2")} />

    <BuilderGridHeader cellId="3" selectedId={selectedId} onClick={() => onSelectId("3")} constraint={constraintMap["3"]} />
    <BuilderGridCell counts={computeIntersectionCounts("A","3")} />
    <BuilderGridCell counts={computeIntersectionCounts("B","3")} />
    <BuilderGridCell counts={computeIntersectionCounts("C","3")} />
  </div>
}

interface ConstraintsTableProps {
  constraints: CardConstraint[],
  selectConstraint: (c: CardConstraint) => void,
  dataByFormat: NrdbDataByFormat,
}
function ConstraintsTable({constraints, selectConstraint, dataByFormat}: ConstraintsTableProps) {
  return (
    <table className="mx-auto max-w-2xl">
      <thead>
        <tr>
          <th>Constraint</th>
          <th>Eternal</th>
          <th>Standard</th>
          <th>Startup</th>
        </tr>
      </thead>

      <tbody>
        {constraints.map(constraint => {
          const name = constraint.getName();
          return (
            <tr key={name} onClick={() => selectConstraint(constraint)}>
              <td>{name}</td>
              <td>{constraint.filter(dataByFormat.eternal.cards).length}</td>
              <td>{constraint.filter(dataByFormat.standard.cards).length}</td>
              <td>{constraint.filter(dataByFormat.startup.cards).length}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function RouteComponent() {
  const {dataByFormat} = Route.useLoaderData();

  const puzzle = React.useMemo(() => generatePuzzle(dataByFormat.standard), [dataByFormat.standard]);

  const allConstraints = React.useMemo<CardConstraint[]>(() => [
  ...makeAllCostConstraints(),
  ...makeAllTitleStartConstraints(),
  ...makeAllTypeConstraints(),
  ...makeAllSubtypeConstraints(dataByFormat.eternal),
  ...TITLE_WORDS.map(word => new TitleIncludesConstraint({parts: [word]})),
  ...makeAllInfluenceConstraints(),
  ...makeAllFactionConstraints(),
], [dataByFormat]);

  const [selectedId, setSelectedId] = React.useState("1");
  const [constraintMap, setConstraintMap] =  React.useState<IncompletePuzzleConstraints>(puzzle.constraints);

  const selectConstraint = React.useCallback((constraint: CardConstraint) => {
    setConstraintMap(state => ({...state, [selectedId]: constraint}))
  }, [setConstraintMap]);

  const getPuzzleSpec = () => {
    if (constraintMap["1"] && constraintMap["2"] && constraintMap["3"] && constraintMap["A"] && constraintMap["B"] && constraintMap["C"]) {
      return {
        id: 1,
        constraints: {
          "1": constraintMap["1"].toSpec(),
          "2": constraintMap["2"].toSpec(),
          "3": constraintMap["3"].toSpec(),
          "A": constraintMap["A"].toSpec(),
          "B": constraintMap["B"].toSpec(),
          "C": constraintMap["C"].toSpec(),
        }
      }
    }
  }

  const handleGeneratePuzzle = () => {
    const newPuzzle = generatePuzzle(dataByFormat.standard);

    setConstraintMap(newPuzzle.constraints);
  }

  const handleCopyPuzzleSpec = () => {
    const spec = getPuzzleSpec();

    
    if (spec) {
      window.navigator.clipboard.writeText(JSON.stringify(spec));
    }
  }
  

  return <div>
    <h1>Sysop Tools</h1>
    

    <BuilderGrid 
      selectedId={selectedId}
      onSelectId={setSelectedId}
      constraintMap={constraintMap}
      dataByFormat={dataByFormat}
    />

    <Button onClick={handleGeneratePuzzle}>
      Generate Puzzle
    </Button>
    <Button onClick={handleCopyPuzzleSpec}>
      Copy Puzzle Spec
    </Button>

    <ConstraintsTable 
      constraints={allConstraints}
      selectConstraint={selectConstraint}
      dataByFormat={dataByFormat}
    />


  </div>
}
