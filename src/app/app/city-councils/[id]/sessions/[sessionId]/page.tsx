import { OnlyRolesCanAccess } from "@/components/permission/only-who-can-access";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Office } from "./_components/office";
import { OrderDay } from "./_components/order-of-the-day";

interface SessionProps {
  params: {
    id: string;
    sessionId: string;
  };
}

export default function Session({ params }: SessionProps) {
  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN", "PRESIDENT", "ASSISTANT"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Criar nova sessão</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/app/city-councils/${params?.id}/sessions`}
              >
                Sessões
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar nova sessão</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Expediente</CardTitle>
              <CardDescription>
                Defina os dados da fase de expediente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Office cityCouncilId={params.id} sessionId={params.sessionId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orderm do dia</CardTitle>
              <CardDescription>
                Defina os dados da fase de ordem do dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderDay cityCouncilId={params.id} sessionId={params.sessionId} />
            </CardContent>
          </Card>
        </div>
      </main>
    </OnlyRolesCanAccess>
  );
}
