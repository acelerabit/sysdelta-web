import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52fsds",
      amount: 100,
      status: "pending",
      email: "example@gmail.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "489e1d4276756",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d4256456",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d42231",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d425656",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d4232432",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d4267",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d427",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d426",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d425",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d424",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d421",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },{
      id: "489e1d422",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "489e1er422",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "489e124d422",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
  ]
}

export default async function Subscriptions() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
