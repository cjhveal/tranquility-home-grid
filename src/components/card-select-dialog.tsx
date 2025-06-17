import * as React from 'react';

import { Description } from '@headlessui/react'

import {type NrdbCardT} from '@/types';
import {CardConstraint} from '@/constraints';

import { Button } from '@/components/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@/components/dialog'
import {CardSearch} from '@/components/card-search';

function ConstraintText({constraint}: {constraint: CardConstraint}) {
  return <span className="font-medium text-2xl px-1">
    {constraint.getName()}
  </span>
}

export interface CardSelectDialogProps {
  isOpen: boolean,
  onClose: () => void,
  firstConstraint: CardConstraint,
  secondConstraint: CardConstraint,
  cardsInFormat: NrdbCardT[],
}
export function CardSelectDialog({isOpen, onClose, firstConstraint, secondConstraint, cardsInFormat}: CardSelectDialogProps) {

  const answerCount = React.useMemo(() => {
    const filteredCards = secondConstraint.filter(firstConstraint.filter(cardsInFormat));

    return filteredCards.length;
  }, [cardsInFormat, firstConstraint, secondConstraint]);

  return <Dialog open={isOpen} onClose={onClose}>
    <DialogBackdrop onClick={onClose} />

    <DialogPanel>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex w-full gap-2">
          <CardSearch autoFocus cardsInFormat={cardsInFormat} />
          <Button variant="solid">Run</Button>
        </div>
        <Description>
          Select a card that is both: <ConstraintText constraint={firstConstraint}/> and <ConstraintText constraint={secondConstraint} />
        </Description>

        <div>{answerCount} possible answers in Standard format</div>
      </div>
    </DialogPanel>
  </Dialog>
}
