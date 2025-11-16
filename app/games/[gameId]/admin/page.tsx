import type { ReactElement } from "react";
import { AdminConsole } from "./AdminConsole";
import { loadAdminConsoleData } from "@/app/actions";

type Params = Promise<{ gameId: string }>;

export default async function AdminPage({
  params,
}: {
  params: Params;
}): Promise<ReactElement> {
  const { gameId } = await params;
  const initialState = await loadAdminConsoleData(gameId);

  return <AdminConsole gameId={gameId} initialState={initialState} />;
}
