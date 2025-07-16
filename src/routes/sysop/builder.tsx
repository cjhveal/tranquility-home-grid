import React from 'react';

import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';

import type { 
  NrdbCardT,
  NrdbDataByFormat,
} from '@/game/types';

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

import {useTRPC, setSysopToken} from '@/utils/trpc';
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

type ConstraintWithCounts = {
  constraint: CardConstraint,
  counts: {
    [K in keyof NrdbDataByFormat]: number;
  }
}

interface ConstraintsTableProps {
  constraintsWithCounts: ConstraintWithCounts[],
  selectConstraint: (c: CardConstraint) => void,
}
function ConstraintsTable({constraintsWithCounts, selectConstraint}: ConstraintsTableProps) {
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
        {constraintsWithCounts.map(({constraint, counts}) => {
          const name = constraint.getName();
          return (
            <tr key={name} onClick={() => selectConstraint(constraint)}>
              <td>{name}</td>
              <td>{counts.eternal}</td>
              <td>{counts.standard}</td>
              <td>{counts.startup}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}
function DatePicker(props: DatePickerProps) {
  const { value, onChange } = props;

  const handleChange = (timestamp: string) => {
    onChange(timestamp.slice(0,10));    
  }

  const moveDay = (days: number) => {
    const date = new Date(value);

    date.setDate(date.getDate() + days);

    handleChange(date.toISOString());
  }


  return <div className="flex gap-4">
    <Button onClick={() => moveDay(-1)}>
      -
    </Button>
    <input
      type="date"
      value={value}
      onChange={(event) => handleChange(event.target.value)}
    />
    <Button onClick={() => moveDay(1)}>
      +
    </Button>
  </div>
}


function RouteComponent() {
  const trpc = useTRPC();
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

  const constraintsWithCounts = React.useMemo<ConstraintWithCounts[]>(() => {
    return allConstraints.map(constraint => ({
      constraint,
      counts: {
        eternal: constraint.filter(dataByFormat.eternal.cards).length,
        standard: constraint.filter(dataByFormat.standard.cards).length,
        startup: constraint.filter(dataByFormat.startup.cards).length,
      },
    }));
  }, [allConstraints, dataByFormat]);

  const [selectedId, setSelectedId] = React.useState("1");
  const [constraintMap, setConstraintMap] =  React.useState<IncompletePuzzleConstraints>(puzzle.constraints);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().slice(0,10));

  const handleDateChange = (timestamp: string) => {
    setSelectedDate(timestamp);
  }

  const selectConstraint = React.useCallback((constraint: CardConstraint) => {
    setConstraintMap(state => ({...state, [selectedId]: constraint}))
  }, [setConstraintMap]);

  const getPuzzleSpec = () => {
    if (constraintMap["1"] && constraintMap["2"] && constraintMap["3"] && constraintMap["A"] && constraintMap["B"] && constraintMap["C"]) {
      return {
        date: selectedDate,
        constraint1: constraintMap["1"].toSpec(),
        constraint2: constraintMap["2"].toSpec(),
        constraint3: constraintMap["3"].toSpec(),
        constraintA: constraintMap["A"].toSpec(),
        constraintB: constraintMap["B"].toSpec(),
        constraintC: constraintMap["C"].toSpec(),
      }
    }
  }

  const [isOpenSysopControls, setIsOpenSysopControls] = React.useState(false);
  const [sysopKeyValue, setSysopKeyValue] = React.useState<string>('');

  const handleSetSysopKey = () => {
    if (sysopKeyValue) {
      setSysopToken(sysopKeyValue);
      setIsOpenSysopControls(true);
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

  const sysopTestMutation = useMutation(trpc.sysopTest.mutationOptions());

  const handleTestSysopKey = () => {
    sysopTestMutation.mutate({test: 'wow!'});
  }

  const createPuzzleMutation = useMutation(trpc.createPuzzle.mutationOptions());
  const handleCreatePuzzle = () => {
    const spec = getPuzzleSpec();
    if (!spec) {
      return;
    }
    createPuzzleMutation.mutate(spec);
  }
  
  return <div>
    <h1>Sysop Tools</h1>
    

    <BuilderGrid 
      selectedId={selectedId}
      onSelectId={setSelectedId}
      constraintMap={constraintMap}
      dataByFormat={dataByFormat}
    />


    <div className="flex items-center justify-center w-full gap-4 p-4">
      <Button onClick={handleGeneratePuzzle}>
        Generate New Puzzle
      </Button>
      <Button onClick={handleCopyPuzzleSpec}>
        Copy Puzzle Spec
      </Button>
    </div>

    
    <div className="flex items-center justify-center w-full gap-4 p-4">
      <DatePicker value={selectedDate} onChange={handleDateChange}/>
    </div>

    {isOpenSysopControls && (<div className="flex items-center justify-center w-full gap-4 p-4">
      <Button onClick={handleTestSysopKey}>
        Test Sysop
      </Button>
      <Button onClick={handleCreatePuzzle}>
        Create Puzzle
      </Button>
      <Button onClick={() => setIsOpenSysopControls(false)}>Edit Key</Button>
    </div>)}
    {!isOpenSysopControls && (<div className="flex items-center justify-center w-full gap-4 p-4">
      <input
        type="password"
        className="py-1 px-2 rounded-lg text-black ring ring-violet-400"
        value={sysopKeyValue}
        onChange={(event) => {
          setSysopKeyValue(event.target.value);
        }}
      />
      <Button onClick={handleSetSysopKey}>
        Jack In
      </Button>
    </div>)}

    <ConstraintsTable 
      constraintsWithCounts={constraintsWithCounts}
      selectConstraint={selectConstraint}
    />


  </div>
}
