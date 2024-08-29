"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  filter: string;
};

interface SerchUsersProps {
  handleFilterUsers: (filter: string) => void;
}

export function SearchUsers({ handleFilterUsers }: SerchUsersProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    handleFilterUsers(data.filter);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="w-[480px] flex items-center gap-2 ">
        <Input
          type="search"
          placeholder="Buscar usuário..."
          // value={searchTerm}
          // onChange={handleSearch}
          className="w-full"
          {...register("filter")}
        />

        <Button type="submit">Pesquisar</Button>
      </div>
    </form>
  );
}
