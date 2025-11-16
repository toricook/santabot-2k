export type GameStatus = "pre-draw" | "in-progress";
export type InviteStatus = "accepted" | "pending" | "bounced";

export type AdminParticipant = {
  id: string;
  name: string;
  email: string;
};

export type AdminInvitee = {
  email: string;
  status: InviteStatus;
};

export type AdminConsoleState = {
  game: {
    id: string;
    name: string;
  };
  participants: AdminParticipant[];
  invitees: AdminInvitee[];
  gameStatus: GameStatus;
  latestAssignmentYear: string | null;
};
