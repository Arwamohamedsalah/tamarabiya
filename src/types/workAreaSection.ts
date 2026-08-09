export type TableRow = {
  col1: string;
  col1En: string;
  col2: string;
  col2En: string;
};

export type WorkAreaBlock =
  | { type: 'paragraph'; text: string; textEn: string }
  | { type: 'heading'; text: string; textEn: string }
  | { type: 'highlight'; title: string; titleEn: string; body: string; bodyEn: string }
  | { type: 'list'; intro?: string; introEn?: string; items: string[]; itemsEn: string[] }
  | {
      type: 'table';
      title?: string;
      titleEn?: string;
      headerCol1: string;
      headerCol1En: string;
      headerCol2: string;
      headerCol2En: string;
      rows: TableRow[];
    };

export interface WorkAreaSection {
  id: string;
  title: string;
  titleEn: string;
  imageCount?: number;
  /** When set, images are loaded from these work-area IDs (one slot each, in order). */
  imageWorkAreaIds?: string[];
  blocks: WorkAreaBlock[];
}
