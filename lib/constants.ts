import { v4 as uuidv4 } from "uuid";

export const DEFAULT_CATEGORIES = [
  {
    id: uuidv4(),
    name: "Personal",
    is_default: true,
  },
  {
    id: uuidv4(),
    name: "Work",
    is_default: true,
  },
  {
    id: uuidv4(),
    name: "Shopping",
    is_default: true,
  },
  {
    id: uuidv4(),
    name: "Health",
    is_default: true,
  },
  {
    id: uuidv4(),
    name: "Finance",
    is_default: true,
  },
] as const;
