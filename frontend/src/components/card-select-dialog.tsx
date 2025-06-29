import * as React from 'react';
import clsx from 'clsx';

import { Description } from '@headlessui/react'

import type {
  NrdbCardT,
  TColKey,
  TRowKey,
} from '@/types';
import {CardConstraint} from '@/constraints';
import {type PuzzleConstraints} from '@/puzzle';

import { Button } from '@/components/button';
import {
  Dialog,
  DialogTitle,
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
  onSubmit: (col: TColKey, row: TRowKey, card: NrdbCardT) => void,
  colConstraintKey: TColKey,
  rowConstraintKey: TRowKey,
  cardsInFormat: NrdbCardT[],
  constraints: PuzzleConstraints,
}
export function CardSelectDialog({
  isOpen,
  onClose,
  onSubmit,
  colConstraintKey,
  rowConstraintKey,
  cardsInFormat,
  constraints,
}: CardSelectDialogProps) {
  const firstConstraint = constraints[colConstraintKey];
  const secondConstraint = constraints[rowConstraintKey];

  const [selectedCard, setSelectedCard] = React.useState<null | NrdbCardT>(null); 
  const [hasError, setHasError] = React.useState(false);

  const answerCount = React.useMemo(() => {
    const filteredCards = secondConstraint.filter(firstConstraint.filter(cardsInFormat));

    return filteredCards.length;
  }, [cardsInFormat, firstConstraint, secondConstraint]);

  const handleSelectCard = (card: null | NrdbCardT) => {
    setSelectedCard(card);
  }

  const handleCardError = () => {
    setHasError(true);
    setTimeout(() => setHasError(false), 500);
    console.log(hasError);
  }

  const handleSubmitCard = (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedCard) {
      handleCardError();
      event.preventDefault();
      return;
    }

    const firstErrors = firstConstraint.validate(selectedCard);
    const secondErrors = secondConstraint.validate(selectedCard);

    const allErrors = [
      ...(firstErrors || []),
      ...(secondErrors || []),
    ];

    console.log(allErrors);
    if (allErrors.length === 0) {
      onSubmit(colConstraintKey, rowConstraintKey, selectedCard);     
      onClose();
    } else {
      handleCardError();
    }

    event.preventDefault(); 
  }

  return <Dialog open={isOpen} onClose={onClose}>
    <DialogBackdrop onClick={onClose} />

    <DialogPanel>
      <div className="flex flex-col items-center space-y-4">
        <DialogTitle>
          Select a card that is both: <ConstraintText constraint={firstConstraint}/> and <ConstraintText constraint={secondConstraint} />
        </DialogTitle>
        <form 
          onSubmit={handleSubmitCard}
          className={clsx(
            "flex w-full gap-2",
            {"animate-shake": hasError},
          )}
        >
          <CardSearch autoFocus cardsInFormat={cardsInFormat} onSelect={handleSelectCard} />
          <Button variant="solid" type="submit">Run</Button>
        </form>

        <Description>{answerCount} possible answers in Standard format</Description>
      </div>
    </DialogPanel>
  </Dialog>
}
