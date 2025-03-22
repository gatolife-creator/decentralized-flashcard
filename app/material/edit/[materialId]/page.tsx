"use client";

import { EditingFlashcardList } from "@/components/editing-flashcard-list";
import { materialDB } from "@/lib/db";
import { CardData, MaterialData } from "@/lib/interfaces";
import React, { useEffect, useState } from "react";
import { EditingFlashcardForm } from "../../../../components/editing-flashcard-form";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditMaterialPage({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) {
  const [materialId, setMaterialId] = useState("");
  const [material, setMaterial] = useState({ title: "", description: "" });
  const [cards, setCards] = useState<CardData[]>([]);
  const router = useRouter();

  const onClickDelete = (index: number) => {
    // console.log(materialId);
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const onCardCreationFormSubmit = (values: CardData) => {
    const { front, back } = values;
    setCards([...cards, { front, back }]);
  };

  const onMaterialCreationFormSubmit = async (values: MaterialData) => {
    const { title, description } = values;
    materialDB.materials
      .where("id")
      .equals(materialId)
      .modify({
        title,
        description,
        serializedCards: JSON.stringify(cards),
      });

    toast(
      <div className="flex items-center">
        <CheckCircle color="green" className="mr-2" />
        <div>教材が更新されました</div>
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

  const onClickMaterialDelete = async () => {
    await materialDB.materials.delete(materialId);
    toast(
      <div className="flex items-center">
        <CheckCircle color="green" className="mr-2" />
        <div>教材が削除されました</div>
      </div>
    );
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

  useEffect(() => {
    (async () => {
      const { materialId } = await params;

      if (materialId) {
        const material = await materialDB.materials.get({ id: materialId });
        setMaterialId(materialId);
        if (material) {
          const { title, description, serializedCards } = material;
          setMaterial({ title, description });
          setCards(JSON.parse(serializedCards));
        } else {
          console.error("Material not found");
        }
      }
    })();
  }, [params]);
  return (
    <>
      <EditingFlashcardForm
        type="edit"
        title={material.title}
        description={material.description}
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
    </>
  );
}
