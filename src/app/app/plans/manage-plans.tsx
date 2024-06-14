"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/services/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useModal from "@/hooks/use-modal";
import { EditForm } from "./forms/edit-plan";

type InputsPlan = {
  name: string;
  price: number;
  trial: number;
};

export interface Plan {
  id: string;
  name: string;
  active: boolean;
  value: number;
  trialDays: number;
  durationInMonths: number;
  public: boolean;
  isDefault: boolean;
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

// .object().shape({
//   name: yup.string().required("O nome é obrigatório"),
//   price: yup
//     .number()
//     .moreThan(-1, "insira um numero maior ou igual a 0")
//     .typeError("insira um numero")
//     .required("O preço é obrigatório"),
//   trial: yup
//     .number()
//     .moreThan(-1, "insira um numero maior ou igual a 0")
//     .typeError("insira um numero maior ou igual a 0")
//     .required("Caso não queira periodo de trial digite 0"),
//   durationInMonths: yup.number().when("price", {
//     is: (price: number) => price <= 0,
//     then: () =>
//       yup
//         .number()
//         .min(0, "O número deve ser igual a 0")
//         .max(0, "O número deve ser igual a 0")
//         .typeError("insira um numero")
//         .required("O intervalo é obrigatório"),
//     otherwise: () =>
//       yup
//         .number()
//         .moreThan(0, "O número deve ser maior que 0")
//         .typeError("insira um numero"),
//   }),
// });

export function ManagePlans() {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [turnInDefaultPlan, setTurnInDefaultPlan] = useState("");

  const [loading, setLoading] = useState(true);

  const { isOpen: createPlanIsOpen, onOpenChange: createPlanOnOpenChange } =
    useModal();
  const {
    isOpen: turnDefaultPlanIsOpen,
    onOpenChange: turnDefaultPlanOnOpenChange,
  } = useModal();
  const { isOpen: updatePlanIsOpen, onOpenChange: updatePlanOnOpenChange } =
    useModal();
  const { isOpen: deletePlanIsOpen, onOpenChange: deletePlanOnOpenChange } =
    useModal();

  const planForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { formState, reset, watch, control } = planForm;

  const queryData = async () => {
    const response = await fetchApi(`/plans/fetch`);

    if (!response.ok) {
      setLoading(false);
      toast.error("Erro ao buscar planos",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const data = await response.json();

    setPlans(data);
    setLoading(false);

    // setProjects(data);
  };

  const onSubmitCreatePlan: SubmitHandler<z.infer<typeof schema>> = async (
    dataForm
  ) => {
    const requestData = {
      name: dataForm.name,
      value: dataForm.price,
      trialDays: dataForm.trial,
      durationInMonths: dataForm.durationInMonths,
    };

    const response = await fetchApi(`/plans/create/plan`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      toast.error("Erro ao criar plano",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Plano criado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    reset();
    window.location.reload();
  };

  async function handleActivatePlan(planId: string, planStatus: boolean) {
    if (planStatus) {
      inactivatePlan(planId);
    } else {
      activatePlan(planId);
    }
  }

  async function handlePublishPlan(planId: string, planStatus: boolean) {
    if (planStatus) {
      unpublishPlan(planId);
    } else {
      publishPlan(planId);
    }
  }

  function handleTurnInDefaultPlan(planId: string) {
    setTurnInDefaultPlan(planId);
    turnDefaultPlanOnOpenChange();
  }

  async function inactivatePlan(planId: string) {
    const response = await fetchApi(`/plans/deactivate/plan/${planId}`);

    if (!response.ok) {
      toast.error("Erro ao inativar plano",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Plano inativado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    const plansUpdated = plans.map((plan) => {
      if (plan.id === planId) {
        plan.active = !plan.active;
        plan.public = false;

        return plan;
      }

      return plan;
    });

    setPlans(plansUpdated);
  }

  async function activatePlan(planId: string) {
    const response = await fetchApi(`/plans/activate/plan/${planId}`);

    if (!response.ok) {
      toast.error("Erro ao ativar plano",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Plano ativado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    const plansUpdated = plans.map((plan) => {
      if (plan.id === planId) {
        plan.active = !plan.active;

        return plan;
      }

      return plan;
    });

    setPlans(plansUpdated);
  }

  async function unpublishPlan(planId: string) {
    const response = await fetchApi(`/plans/unpublish/plan/${planId}`);

    if (!response.ok) {
      toast.error("Erro ao tornar plano não público",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Operação realizada com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    const plansUpdated = plans.map((plan) => {
      if (plan.id === planId) {
        plan.public = !plan.public;

        return plan;
      }

      return plan;
    });

    setPlans(plansUpdated);
  }

  async function deletePlan(planId: string) {
    const response = await fetchApi(`/plans/delete/${planId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const plansUpdated = plans.filter((plan) => plan.id !== planId);
    setPlans(plansUpdated);

    toast.success("Plano deletado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  // const priceWatch = useWatch({
  //   control,
  //   name: "price",
  // });

  async function publishPlan(planId: string) {
    const response = await fetchApi(`/plans/publish/plan/${planId}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Operação realizada com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    const plansUpdated = plans.map((plan) => {
      if (plan.id === planId) {
        plan.public = !plan.public;

        return plan;
      }

      return plan;
    });

    setPlans(plansUpdated);
  }

  async function turnDefault() {
    const response = await fetchApi(`/plans/turn-default/${turnInDefaultPlan}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      return;
    }

    toast.success("Operação realizada com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    const plansUpdated = plans.map((plan) => {
      if (plan.id === turnInDefaultPlan) {
        plan.isDefault = !plan.isDefault;
        return plan;
      }

      plan.isDefault = false;
      return plan;
    });
    setPlans(plansUpdated);
    turnDefaultPlanOnOpenChange();
  }

  function handleClickEdit(plan: Plan) {
    setCurrentPlan(plan);
    updatePlanOnOpenChange();
  }

  function handleClickDelete(plan: Plan) {
    setCurrentPlan(plan);
    deletePlanOnOpenChange();
  }

  function handleCloseConfirmations() {
    setTurnInDefaultPlan("");
  }

  useEffect(() => {
    queryData();
  }, []);

  const price = watch("price");
  const isFree = price <= 0;

  useEffect(() => {
    if (price <= 0) {
      planForm.setValue("durationInMonths", 0);
      planForm.setValue("trial", 0);
    }
  }, [price]);

  useEffect(() => {
    planForm.setValue("price", 0);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-end">
        <Button onClick={createPlanOnOpenChange}>Criar plano</Button>
      </div>

      <div className="w-full flex flex-col gap-2">
        {plans.length <= 0 ? (
          <div>
            <h1> Não há nenhum plano</h1>
          </div>
        ) : (
          plans.map((plan: Plan) => (
            <Card
              key={plan.id}
              className={`flex items-center justify-between p-4 ${
                !plan.active && "bg-zinc-400/60"
              }`}
            >
              <div className={`${!plan.active ? "text-zinc-700" : ""}`}>
                <h1 className="text-lg text-zinc-800 mb-2">{plan.name}</h1>

                <p>
                  Valor:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(plan.value / 100)}
                </p>
                {plan.durationInMonths > 0 && (
                  <p>Cobrança a cada {plan.durationInMonths} mês</p>
                )}

                <p>Periodo de teste: {plan.trialDays} dias</p>
              </div>

              <div className="min-h-[168px] flex flex-col justify-between">
                <div className="flex ml-auto gap-2">
                  <Button onClick={() => handleClickEdit(plan)}>
                    Editar plano
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleClickDelete(plan)}
                  >
                    Deletar plano
                  </Button>
                </div>

                <div className="flex items-center">
                  <span className="ms-3 text-sm font-medium text-gray-900 mr-2">
                    Ativar
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      checked={plan.active}
                      onChange={(event) =>
                        handleActivatePlan(plan.id, plan.active)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>

                  <span className="ms-3 text-sm font-medium text-gray-900 mr-2">
                    Públicar
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      checked={plan.public}
                      onChange={(event) =>
                        handlePublishPlan(plan.id, plan.public)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>

                  <span className="ms-3 text-sm font-medium text-gray-900 mr-2">
                    Default
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      checked={plan.isDefault}
                      onChange={(event) => handleTurnInDefaultPlan(plan.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={createPlanIsOpen} onOpenChange={createPlanOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar plano</DialogTitle>
          </DialogHeader>

          <form
            className="w-full p-4"
            autoComplete="new-password"
            onSubmit={planForm.handleSubmit(onSubmitCreatePlan)}
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
                {...planForm.register("name", {
                  required: true,
                })}
              />
              <p className="text-sm text-red-400">
                {formState.errors.name?.message}
              </p>
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
                control={planForm.control}
                render={({ field }) => (
                  <CurrencyInput
                    value={field.value}
                    onChangeValue={(_, value) => {
                      field.onChange(value);
                    }}
                    InputElement={
                      <input
                        // type="number"
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
                autoComplete="new-password"
                disabled={isFree}
                className="bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...planForm.register("durationInMonths", {
                  required: true,
                  valueAsNumber: true,
                })}
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
                {...planForm.register("trial", { valueAsNumber: true })}
              />
              <p className="text-sm text-red-400">
                {formState.errors.trial?.message}
              </p>
            </div>

            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* <DefaultModal
        title="Criar plano"
        open={openCreatePlanModal}
        handleClose={handleCloseCreatePlanModal}
      >
        <form
          className="w-full p-4"
          autoComplete="new-password"
          onSubmit={planForm.handleSubmit(onSubmitCreatePlan)}
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
              {...planForm.register("name", {
                required: true,
              })}
            />
            <p className="text-sm text-red-400">
              {formState.errors.name?.message}
            </p>
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
              control={planForm.control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChangeValue={(_, value) => {
                    field.onChange(value);
                  }}
                  InputElement={
                    <input
                      // type="number"
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
              autoComplete="new-password"
              disabled={isFree}
              className="bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...planForm.register("durationInMonths", {
                required: true,
              })}
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
              {...planForm.register("trial")}
            />
            <p className="text-sm text-red-400">
              {formState.errors.trial?.message}
            </p>
          </div>

          <Button type="submit">Salvar</Button>
        </form>
      </DefaultModal> */}

      <Dialog open={updatePlanIsOpen} onOpenChange={updatePlanOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar plano</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <EditForm plan={currentPlan} />
        </DialogContent>
      </Dialog>

      {/* <DefaultModal
        title="Editar plano"
        open={openEditPlanModal}
        handleClose={handleToogleEditPlanModal}
      >
        <EditForm plan={currentPlan} />
      </DefaultModal> */}

      <Dialog
        open={turnDefaultPlanIsOpen}
        onOpenChange={turnDefaultPlanOnOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Tem certeza que deseja tornar esse plano default
            </DialogTitle>
            <DialogDescription>
              Mudar o plano para default o transformará no plano de entrado do
              usuário, e pode existir apenas um plano default
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={turnDefaultPlanOnOpenChange}>Cancelar</Button>
            <Button onClick={turnDefault}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <ModalConfirmations
        open={openModalConfirmations}
        handleClose={handleCloseConfirmations}
        execute={() => turnDefault()}
        title={`Tem certeza que deseja tornar esse plano default`}
        description="Mudar o plano para default o transformará no plano de entrado do usuário, e pode existir apenas um plano default"
      /> */}
    </div>
  );
}
