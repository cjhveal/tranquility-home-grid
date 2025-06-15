import React from 'react';

import { createFileRoute } from '@tanstack/react-router'

import {
  CardConstraint,
  TitleStartConstraint,
  TitleIncludesConstraint,
  CostConstraint,
  FactionConstraint,
  IllustratorConstraint,
  UniqueConstraint,
  SubtypeConstraint,
  InfluenceConstraint,
  } from '@/constraints';

import {allCards, cardsByFormat, allSubtypes} from '@/data/cards';

export const Route = createFileRoute('/sysop/builder')({
  component: RouteComponent,
})

const COSTS = [0,1,2,3,4,5];
const ALPHABET = Array.from({ length: 26}, (v, n) => String.fromCharCode(n + 97));
const TITLE_WORDS = ["data", "net", "grid", "project", "wall", "campaign", "job", "test", "2", "3"]
const INFLUENCE_COUNTS = [0,1,2,3,4,5];
 

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

const allConstraints = [
  ...COSTS.map(cost => new CostConstraint(cost)),
  ...ALPHABET.map(char => new TitleStartConstraint(char)),
  ...[...allSubtypes.values()].map(subtype => new SubtypeConstraint(subtype)),
  ...TITLE_WORDS.map(word => new TitleIncludesConstraint(word)),
  ...INFLUENCE_COUNTS.map(inf => new InfluenceConstraint(inf)),
];

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

  const name = constraint && (constraint.infoText.name);
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
}
function BuilderGrid({selectedId, onSelectId, constraintMap}: BuilderGridProps) {

  const intersectConstraints = (firstId: string|null, secondId: string|null) => {
    const firstConstraint = firstId && constraintMap[firstId];
    const secondConstraint = secondId && constraintMap[secondId];

    if (firstConstraint && secondConstraint) {
      return CardConstraint.and({name: `${firstId}+${secondId}`}, firstConstraint, secondConstraint)
    } else if (firstConstraint) {
      return firstConstraint;
    } else if (secondConstraint) {
      return secondConstraint;
    }
  }

  const computeIntersectionCounts = (firstId: string | null, secondId: string | null) => {
    const constraint = intersectConstraints(firstId, secondId);

    if (constraint) {
      return {
        eternal: constraint.filter(allCards).length,
        standard: constraint.filter(cardsByFormat.standard).length,
        startup: constraint.filter(cardsByFormat.startup).length,
      }
      
    }
  }

  return <div className="grid grid-cols-4 gap-4 max-w-2xl">
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

function RouteComponent() {
  const [selectedId, setSelectedId] = React.useState("1");
  const [constraintMap, setConstraintMap] = React.useState({
    "1": null,
    "2": null,
    "3": null,
    "A": null,
    "B": null,
    "C": null,
  });

  const selectConstraint = (constraint: CardConstraint) => {
    const nextMap = {...constraintMap, [selectedId]: constraint}
    setConstraintMap(nextMap)
  }
  

  return <div>
    <h1>Sysop Tools</h1>
    

    <BuilderGrid 
      selectedId={selectedId}
      onSelectId={setSelectedId}
      constraintMap={constraintMap}
    />

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
      {allConstraints.map(constraint => (
        <tr onClick={() => selectConstraint(constraint)}>
          <td>{constraint.infoText.name}</td>
          <td>{constraint.filter(allCards).length}</td>
          <td>{constraint.filter(cardsByFormat.standard).length}</td>
          <td>{constraint.filter(cardsByFormat.startup).length}</td>
        </tr>
      ))}
      </tbody>
    </table>

  </div>
}
