import { OnlyAdmin } from "@/components/permission/only-admin";

export default function Logs() {
  return (
    <OnlyAdmin>
      <h1>Logs</h1>
    </OnlyAdmin>
  );
}
