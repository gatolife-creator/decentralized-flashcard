"use client";

import React, { useState } from "react";
import { EditingFlashcardList } from "../../../components/editing-flashcard-list";
import { CardData, MaterialMetaData } from "@/lib/interfaces";
import { materialDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { EditingFlashcardForm } from "../../../components/editing-flashcard-form";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateMaterialPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const router = useRouter();

  const onCardCreationFormSubmit = (values: CardData) => {
    const { front, back } = values;
    setCards([...cards, { front, back }]);
  };

  const onClickDelete = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
    console.log(cards);
  };

  const onMaterialCreationFormSubmit = async (values: MaterialMetaData) => {
    const { title, description } = values;
    const id = uuidv4();

    materialDB.materials.add({
      id,
      title,
      description,
      serializedCards: JSON.stringify(cards),
    });

    toast(
      <div className="flex items-center">
        <CheckCircle color="green" className="mr-2" />
        <div>教材が作成されました</div>
      </div>,
      {
        action: {
          label: "取り消す",
          onClick: () => console.log("取り消す"),
        },
      }
    );

    router.push("/materials");
  };

  const onClickMaterialDelete = () => {
    router.push("/materials");
  };

  const onChangeFrontInput = (index: number, front: string) => {
    const newCards = cards.map((card, i) => {
      if (i === index) {
        card.front = front;
      }
      return card;
    });
    setCards(newCards);
  };

  const onChangeBackInput = (index: number, back: string) => {
    const newCards = cards.map((card, i) => {
      if (i === index) {
        card.back = back;
      }
      return card;
    });
    setCards(newCards);
  };

  return (
    <div>
      <EditingFlashcardForm
        type="create"
        onCardCreationFormSubmit={onCardCreationFormSubmit}
        onMaterialCreationFormSubmit={onMaterialCreationFormSubmit}
        onClickMaterialDelete={onClickMaterialDelete}
      />

      <EditingFlashcardList
        cards={cards}
        onClickDelete={onClickDelete}
        onChangeFrontInput={onChangeFrontInput}
        onChangeBackInput={onChangeBackInput}
      />
    </div>
  );
}
