import { createFileRoute } from '@tanstack/react-router'

import { Page } from '@/components/page';
import { Button } from '@/components/button';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (<Page>
    <div className="flex flex-col justify-center items-center text-center p-8 gap-4">
      <div className="text-2xl md:text-3xl dark:text-violet-200">
        Tranquility Home Grid
      </div>
      <img 
        src="logo192.png" 
        className="size-64"
      />

      <Button>
        Play Daily
      </Button>
    </div>
  </Page>)
}
