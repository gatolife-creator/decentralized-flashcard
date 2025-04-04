"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2 } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface EditingFlashcardProps {
  front: string;
  back: string;
  index: number;
  onClickDelete: (index: number) => void;
  onChangeFrontInput: (front: string) => void;
  onChangeBackInput: (back: string) => void;
}

export function EditingFlashcard({ ...props }: EditingFlashcardProps) {
  const { front, back, index, onClickDelete } = props;

  const onChangeFrontInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChangeFrontInput(e.target.value);
  };

  const onChangeBackInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChangeBackInput(e.target.value);
  };

  return (
    <Card className="my-5 w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>{index}</div>
          <Button
            className="mx-1 cursor-pointer"
            size="icon"
            variant="destructive"
            onClick={() => {
              onClickDelete(index - 1);
            }}
          >
            <Trash2 />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 lg:grid-cols-2">
        <Textarea
          className="w-full resize-none"
          placeholder="問題文を入力してください"
          defaultValue={front}
          onChange={onChangeFrontInput}
        />
        <Textarea
          className="w-full resize-none"
          placeholder="答えを入力してください"
          defaultValue={back}
          onChange={onChangeBackInput}
        />
      </CardContent>
    </Card>
  );
}
