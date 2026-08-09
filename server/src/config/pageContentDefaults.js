/**
 * Default CMS content for service pages — matches company profile (PDF).
 */
const LANDSCAPING_WORK_AREAS = require('./landscapingWorkAreas.json');
const FENCING_WORK_AREAS = require('./fencingWorkAreas.json');
const INFRASTRUCTURE_WORK_AREAS = require('./infrastructureWorkAreas.json');

const PAGE_CONTENT_DEFAULTS = {
  landscaping: {
    page: 'landscaping',
    introTitle: 'اللاندسكيب وتنسيق الحدائق',
    introTitleEn: 'Landscaping & Garden Design',
    introDescription:
      'يركز هذا القطاع على تجميل وتنسيق المساحات الخارجية للمشاريع السكنية والتجارية والحكومية، ويشمل السوفتسكيب والهاردسكيب وأنظمة الري الذاتية والحديثة، إضافة إلى الصيانة والتشغيل.',
    introDescriptionEn:
      'This sector focuses on beautifying and organizing outdoor spaces for residential, commercial, and government projects, including softscape, hardscape, modern irrigation systems, and maintenance & operations.',
    serviceTypes: [
      {
        name: 'Softscape',
        nameAr: 'السوفتسكيب',
        desc: 'الأشجار الكبيرة: توريد وزراعة الأشجار الضخمة والنخيل وأشجار الظل. الأشجار الصغيرة والشجيرات: زراعة أشجار الزينة والشجيرات والزهور وتوزيعها جمالياً. مغطيات التربة والثيل: تنفيذ المسطحات الخضراء الطبيعية والصناعية.',
        descEn:
          'Large trees: supply and planting of mature trees, palms, and shade trees. Shrubs & ornamentals: decorative trees, shrubs, and flowers with aesthetic distribution. Turf & ground cover: natural and artificial green surfaces.',
        order: 0,
      },
      {
        name: 'Irrigation Systems',
        nameAr: 'أنظمة الري الذاتية والحديثة',
        desc: 'توريد وتركيب شبكات الري بالتنقيط والرش. تركيب محابس الري الكهربائية والفلاتر وبرمجة الديكودرات. تركيب المضخات ووحدات التحكم لترشيد استهلاك المياه.',
        descEn:
          'Supply and installation of drip and sprinkler networks. Electric irrigation valves, filters, and decoder programming. Pumps and control units to optimize water consumption.',
        order: 1,
      },
      {
        name: 'Hardscape',
        nameAr: 'الهاردسكيب',
        desc: 'الخرسانة المطبوعة للممرات والساحات الخارجية. الأرضيات المطاطية للممرات الرياضية ومناطق الألعاب. تنفيذ ملاعب الأطفال والمنشآت الرياضية وتركيب المظلات والكراسي والطاولات وسلال النفايات.',
        descEn:
          'Stamped concrete for paths and outdoor plazas. Rubber flooring for sports walkways and play areas. Children playgrounds, sports facilities, shades, benches, tables, and waste bins.',
        order: 2,
      },
      {
        name: 'Maintenance & Operations',
        nameAr: 'الصيانة والتشغيل',
        desc: 'قص وترميم وتسميد المسطحات الخضراء، تقليم الأشجار، رش المبيدات، وإعادة تأهيل شبكات الري.',
        descEn:
          'Mowing, renovation, and fertilization of green areas. Tree pruning, pesticide spraying, and rehabilitation of irrigation networks.',
        order: 3,
      },
    ],
    workAreaSections: LANDSCAPING_WORK_AREAS,
    ctaTitle: 'هل لديك مشروع لاندسكيب؟',
    ctaTitleEn: 'Have a landscaping project?',
    ctaDescription: 'تواصل معنا اليوم للحصول على استشارة مجانية',
    ctaDescriptionEn: 'Contact us today for a free consultation',
    ctaButtonText: 'تواصل معنا',
    ctaButtonTextEn: 'Contact Us',
  },
  fencing: {
    page: 'fencing',
    introTitle: 'الهياكل والسياجات الأمنية',
    introTitleEn: 'Metal Structures & Security Fencing',
    introDescription:
      'يركز هذا القطاع على أعمال الحماية الحديدية والإنشائية للمنشآت الحيوية والطرق، ويشمل السياجات الأمنية المعتمدة (HCIS)، حواجز الطرق (Guardrail)، والهياكل الحديدية للمشاريع الصناعية والتجارية والسكنية.',
    introDescriptionEn:
      'This sector focuses on steel protection and structural works for critical facilities and roads, including HCIS-approved security fencing, road guardrails, and steel structures for industrial, commercial, and residential projects.',
    serviceTypes: [
      {
        name: 'HCIS Security Fencing',
        nameAr: 'السياجات الأمنية المعتمدة (HCIS)',
        desc: 'أسوار مخصصة لحماية المنشآت الصناعية والحيوية في المملكة العربية السعودية، وتصنف حسب مستوى الحماية من Class 1 (حماية عالية جداً) إلى Class 4 (حماية أساسية).',
        descEn:
          'Perimeter fences for industrial and critical facilities in Saudi Arabia, classified from Class 1 (highest protection) to Class 4 (basic protection).',
        order: 0,
      },
      {
        name: 'Road Guardrails',
        nameAr: 'الجارد ريل — حواجز الطرق المعدنية',
        desc: 'تركيب الحواجز المعدنية على الطرق السريعة والشوارع وفق مواصفات وزارة النقل والخدمات اللوجستية وهيئة المواصفات السعودية (SASO). الأنواع المعتمدة: W Beam Guardrail — C POST، Thrie-Beam، والكابل الستيل.',
        descEn:
          'Installation on highways and streets per MOT and SASO specifications. Approved types: W Beam Guardrail — C POST, Thrie-Beam, and steel cable barriers.',
        order: 1,
      },
      {
        name: 'Steel Structures',
        nameAr: 'الهياكل الحديدية',
        desc: 'تنفيذ وتركيب المنشآت الحديدية للمشاريع الصناعية والتجارية والسكنية: المستودعات، المصانع، الهناجر، الجمالونات للأسقف، والمباني سابقة التجهيز (PEB)، وتصنف إلى هياكل خفيفة وثقيلة.',
        descEn:
          'Fabrication and installation for industrial, commercial, and residential projects: warehouses, factories, hangars, roof girders, and pre-engineered buildings (PEB) — light and heavy structures.',
        order: 2,
      },
    ],
    workAreaSections: FENCING_WORK_AREAS,
    ctaTitle: 'تحتاج لحلول سياجات أو هياكل معدنية؟',
    ctaTitleEn: 'Need fencing or steel structure solutions?',
    ctaDescription: 'احصل على عرض أسعار مجاني لمشروعك',
    ctaDescriptionEn: 'Get a free quote for your project',
    ctaButtonText: 'اطلب عرض سعر',
    ctaButtonTextEn: 'Request a Quote',
  },
  infrastructure: {
    page: 'infrastructure',
    introTitle: 'أعمال الطرق والبنية التحتية',
    introTitleEn: 'Earth Work & Infrastructure',
    introDescription:
      'تخصص الشركة في تمديد شبكات المياه والصرف الصحي ومياه السيول وفق المواصفات الهندسية، بما يشمل أعمال الحفر والتمديد واللحام والاختبار والردم.',
    introDescriptionEn:
      'The company specializes in water, sewage, and stormwater networks per engineering specifications, including excavation, laying, welding, testing, and backfilling.',
    serviceTypes: [
      {
        name: 'Ductile Iron Water Networks',
        nameAr: 'انابيب الدكتايل',
        desc: 'أعمال حفر وتمديد ولحام واختبار وردم المشاريع حسب المواصفات الهندسية.',
        descEn:
          'Excavation, laying, welding, pressure testing, and backfilling per engineering specifications.',
        order: 0,
      },
      {
        name: 'HDPE Water Networks',
        nameAr: 'انابيب HDPE',
        desc: 'أعمال الحفر والتمديد واللحام بالوصلات واختبارها لشبكات المياه (البولي إيثيلين عالي الكثافة).',
        descEn:
          'High-density polyethylene pipes: excavation, laying, fusion welding, testing, and commissioning for water networks.',
        order: 1,
      },
      {
        name: 'GRP Sewage & Storm Networks',
        nameAr: 'الصرف الصحي والسيول — أنابيب GRP',
        desc: 'أعمال الحفر وتمديد أنابيب البلاستيك المسلح بألياف زجاجية للصرف الصحي والسيول، واختبارها وردمها، بالإضافة إلى تنفيذ المناهيل (غرف التفتيش) والغرف ومصائد المياه.',
        descEn:
          'Glass-fiber reinforced plastic pipes for sewage and stormwater: excavation, laying, testing, backfilling, manholes, chambers, and catch basins.',
        order: 2,
      },
    ],
    workAreaSections: INFRASTRUCTURE_WORK_AREAS,
    ctaTitle: 'لديك مشروع بنية تحتية؟',
    ctaTitleEn: 'Have an infrastructure project?',
    ctaDescription: 'دعنا نساعدك في تحويل رؤيتك إلى واقع',
    ctaDescriptionEn: 'Let us help you turn your vision into reality',
    ctaButtonText: 'استشارة مجانية',
    ctaButtonTextEn: 'Free Consultation',
  },
};

module.exports = { PAGE_CONTENT_DEFAULTS };
