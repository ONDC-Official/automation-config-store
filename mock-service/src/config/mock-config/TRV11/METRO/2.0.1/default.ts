interface ActionData {
  id: string;
  updated_at: string;
  [key: string]: any;
}

let id = 0;
export let isGrievance: boolean = false;
export let action: ActionData[] = [];

export function getLastActionId(actionType: "issue_close" | string): string {
  const newId = `A${++id}`;
  if (actionType === "issue_close") id = 0;
  return newId;
}

export function getActionsList(
  data: Record<string, any>,
  date: string,
  actionType: "issue_close" | string
): ActionData[] {
  const newAction: ActionData = {
    ...data,
    id: getLastActionId(actionType),
    updated_at: date,
  };
  const updatedList = [...action, newAction];

  action = actionType === "issue_close" ? [] : updatedList;
  return updatedList;
}

export function getGrievance(data: boolean) {
  isGrievance = data;
}
