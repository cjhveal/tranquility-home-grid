import * as React from 'react';

import { Description } from '@headlessui/react'

import { Button } from '@/components/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@/components/dialog'
import {CardSearch} from '@/components/card-search';

function ConstraintText({text}: {text: string}) {
  return <span className="font-medium text-2xl px-1">
    {text}
  </span>
}

export interface CardSelectDialogProps {
  isOpen: boolean,
  onClose: () => void,
}
export function CardSelectDialog({isOpen, onClose}: CardSelectDialogProps) {
  const firstConstraint = "Cost 2";
  const secondConstraint = "Barrier"

  return <Dialog open={isOpen} onClose={onClose}>
    <DialogBackdrop onClick={onClose} />

    <DialogPanel>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex w-full gap-2">
          <CardSearch autoFocus />
          <Button variant="solid">Run</Button>
        </div>
        <Description>
          Select a card that is both: <ConstraintText text={firstConstraint}/> and <ConstraintText text={secondConstraint} />
        </Description>

        <div>12 possible answers in Standard format</div>
      </div>
    </DialogPanel>
  </Dialog>
}
