import type { WorkAreaSection } from '../types/workAreaSection';

const WATER_NETWORKS_MERGED: WorkAreaSection = {
  id: 'water-networks',
  title: 'شبكات المياه',
  titleEn: 'Water Networks',
  imageCount: 2,
  imageWorkAreaIds: ['water-ductile', 'water-hdpe'],
  blocks: [
    {
      type: 'highlight',
      title: 'انابيب الدكتايل',
      titleEn: 'Ductile Pipes',
      body: 'اعمال حفر تمديد مشاريع المياه وتمديد انابيب الدكتايل وما يلزمها من لحام واختبار وردم وتسليم حسب المواصفات الهندسية المعتمدة',
      bodyEn:
        'Excavation and extension works for water projects, ductile pipe laying, and necessary welding, testing, backfilling, and delivery according to approved engineering specifications.',
    },
    {
      type: 'highlight',
      title: 'انابيب HDPE',
      titleEn: 'HDPE Pipes',
      body: 'اعمال حفر وتمديد مشاريع المياه وتمديد انابيب HDPE وما يلزمها من لحام ووصلات واختبار وردم وتسليم حسب المواصفات الهندسية المعتمدة.',
      bodyEn:
        'Excavation and extension works for water projects, HDPE pipe laying, and necessary welding, connections, testing, backfilling, and delivery according to approved engineering specifications.',
    },
  ],
};

function mergeWaterNetworkSections(sections: WorkAreaSection[]): WorkAreaSection[] {
  const merged = sections.find((section) => section.id === 'water-networks');
  const ductile = sections.find((section) => section.id === 'water-ductile');
  const hdpe = sections.find((section) => section.id === 'water-hdpe');

  if (!merged && !ductile && !hdpe) return sections;

  const waterSection: WorkAreaSection = merged
    ? {
        ...WATER_NETWORKS_MERGED,
        ...merged,
        title: 'شبكات المياه',
        titleEn: merged.titleEn || 'Water Networks',
        imageCount: merged.imageCount ?? 2,
        imageWorkAreaIds: merged.imageWorkAreaIds?.length
          ? merged.imageWorkAreaIds
          : ['water-ductile', 'water-hdpe'],
        blocks: merged.blocks?.length ? merged.blocks : WATER_NETWORKS_MERGED.blocks,
      }
    : {
        ...WATER_NETWORKS_MERGED,
        blocks: [...(ductile?.blocks ?? []), ...(hdpe?.blocks ?? [])],
      };

  const result: WorkAreaSection[] = [];
  let inserted = false;

  for (const section of sections) {
    if (section.id === 'water-networks' || section.id === 'water-ductile' || section.id === 'water-hdpe') {
      if (!inserted) {
        result.push(waterSection);
        inserted = true;
      }
      continue;
    }
    result.push(section);
  }

  return inserted ? result : [waterSection, ...sections];
}

/** Ensures legacy split water sections render as one titled section with two pipe types. */
export function normalizeWorkAreaSections(sections: WorkAreaSection[]): WorkAreaSection[] {
  if (!sections.length) return sections;
  return mergeWaterNetworkSections(sections);
}
