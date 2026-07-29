export interface ProjectSection {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  order?: number;
}

export function createEmptyProject(order = 0): ProjectSection {
  return {
    id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    order,
  };
}
