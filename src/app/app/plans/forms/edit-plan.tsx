"use client";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { Plan } from "../manage-plans";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type InputsEditPlan = {
  name: string;
  price: number;
  durationInMonths: number;
  trial: number;
};

interface EditPlanProps {
  plan: Plan | null;
}

const schema = z.object({
  name: z.string(),
  price: z
    .number()
    .min(0, "insira um numero maior ou igual a 0")
    .refine((val) => !isNaN(val), "insira um numero"),
  trial: z
    .number()
    .min(0, "insira um numero maior ou igual a 0")
    .refine((val) => !isNaN(val), "insira um numero maior ou igual a 0"),
  durationInMonths: z.number(),
  // .refine((val: any, ctx:  any) => {
  //   const price = ctx.parent.price;
  //   if (price <= 0) {
  //     if (val !== 0) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: "O número deve ser igual a 0",
  //       });
  //     }
  //   } else {
  //     if (val <= 0) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: "O número deve ser maior que 0",
  //       });
  //     }
  //   }
  //   return true;
  // }, {
  //   message: "O intervalo é obrigatório",
  // }),
});

type schemaType = z.infer<typeof schema>;

export function EditForm({ plan }: EditPlanProps) {
  const editPlanForm = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  const { formState, watch } = editPlanForm;

  const onSubmitEditPlan: SubmitHandler<schemaType> = async (dataForm) => {
    const requestData = {
      price: dataForm.price,
      trialDays: dataForm.trial,
      durationInMonths: dataForm.durationInMonths,
      name: dataForm.name,
    };

    const response = await fetchApi(`/plans/update/plan/${plan?.id}`, {
      method: "PUT",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      toast.error("Erro ao editar plano",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Plano editado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.reload();
  };

  useEffect(() => {
    if (plan) {
      editPlanForm.setValue("price", plan.value / 100 ?? 0);
      editPlanForm.setValue("name", plan.name ?? "");
      editPlanForm.setValue("trial", plan.trialDays ?? 0);
      editPlanForm.setValue("durationInMonths", plan.durationInMonths ?? 1);
    }
  }, [plan]);

  const price = watch("price");

  useEffect(() => {
    if (price <= 0) {
      editPlanForm.setValue("durationInMonths", 0);
      editPlanForm.setValue("trial", 0);
    }
  }, [price]);

  const isFree = price <= 0;

  if (!plan) {
    return (
      <div className="w-full flex flex-col gap-4 p-2">
        <Skeleton className="h-10 w-full" />
        <div className="w-full flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  return (
    <form
      className="w-full p-4"
      id="edit"
      onSubmit={editPlanForm.handleSubmit(onSubmitEditPlan)}
    >
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Nome
        </label>
        <input
          type="text"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
          {...editPlanForm.register("name", {
            required: true,
          })}
        />
        <p className="text-sm text-red-400">{formState.errors.name?.message}</p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="price"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Preço
        </label>
        <Controller
          name="price"
          control={editPlanForm.control}
          render={({ field }) => (
            <CurrencyInput
              value={field.value}
              onChangeValue={(_, value) => {
                field.onChange(value);
              }}
              InputElement={
                <input
                  type="text"
                  id="currency"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              }
            />
          )}
        />
        <p className="text-sm text-red-400">
          {formState.errors.price?.message}
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="durationInMonths"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Cobrança a cada quantos meses
        </label>
        <input
          type="number"
          id="durationInMonths"
          defaultValue={0}
          disabled={isFree}
          className="bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          {...editPlanForm.register("durationInMonths", {
            required: true,
          })}
          autoComplete="new-password"
          required
        />
        <p className="text-sm text-red-400">
          {formState.errors.durationInMonths?.message}
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="trial"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Dias de periodo de teste
        </label>
        <input
          type="number"
          id="trial"
          disabled={isFree}
          className="bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
          {...editPlanForm.register("trial")}
        />
        <p className="text-sm text-red-400">
          {formState.errors.trial?.message}
        </p>
      </div>

      <Button type="submit">Editar</Button>
    </form>
  );
}
