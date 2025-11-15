import type { ReactElement } from "react";
import { AdminConsole } from "./AdminConsole";

type Params = Promise<{ gameId: string }>;

export default async function AdminPage({
  params,
}: {
  params: Params;
}): Promise<ReactElement> {
  const { gameId } = await params;

  return <AdminConsole gameId={gameId} />;
}
