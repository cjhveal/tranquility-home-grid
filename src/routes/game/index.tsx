import { createFileRoute } from '@tanstack/react-router'

import { allCards, cardsByCost, cardsBySubtype, titleWordCount, cardsByTitleStartLetter } from '@/data/cards.ts';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
})


interface PageProps extends React.PropsWithChildren {}
function Page({children}: PageProps) {
  return (<div className="min-h-screen w-full dark:bg-slate-950 dark:text-violet-100">
    {children}
  </div>);
}

interface GameCellProps extends React.PropsWithChildren {

}
function GameCell({children}: GameCellProps) {
  return <div role="button" 
    className="flex aspect-square rounded-lg ring-2 ring-black dark:ring-violet-400 bg-white dark:bg-slate-950 cursor-pointer"
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
  const costTwo = cardsByCost["2"].length
  //const barrierCount = cardsBySubtype["Barrier"]?.size;

  const nameIncludes = allCards.filter(card => {
    return card.stripped_title.toLowerCase().includes("data")
  }).length;

  const allWordCounts = [...Object.entries(titleWordCount)].sort((entryA, entryB) => {
    return entryB[1] - entryA[1];
  })

  const allWordStarts = [...Object.entries(cardsByTitleStartLetter)]
    .sort((entryA, entryB) => entryB[1].length - entryA[1].length)

  return <Page>
    <div className="flex flex-col items-center justify-center w-full">

      <div className="max-w-2xl w-full">
        <header className="w-full flex items-center p-1 md:mt-4 mb-4 md:mb-12 gap-4 text-xl md:text-3xl font-medium">
          <img className="size-[48px] md:size-auto" src="icon@2x.png" />
          <div className="">Tranquility Home Grid</div>
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

            <GameCell>{nameIncludes} </GameCell>
            <GameCell> {costTwo}</GameCell>
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

        <div>Share, etc.</div>
        <div style={{display:"none"}}>
          {allWordCounts.map(([word, count]) => (<div>
            {count} {word}
          </div>))}
        </div>
        <div style={{display:"none"}}>
          {allWordStarts.map(([word, list]) => (<div>
            {list.length} {word}
          </div>))}
        </div>
        <footer></footer>
      </div>
    </div>
  </Page>
}
