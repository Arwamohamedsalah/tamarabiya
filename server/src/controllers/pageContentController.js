const PageContent = require('../models/PageContent');
const asyncHandler = require('../middleware/asyncHandler');
const { localizePageContent } = require('../utils/localizeContent');

const DEFAULTS = {
  landscaping: {
    page: 'landscaping',
    introTitle: 'تنفيذ وتنسيق الحدائق',
    introDescription: 'نقدم خدمات شاملة في تنسيق الحدائق وتصميم المناظر الطبيعية، من التخطيط والتصميم إلى التنفيذ والصيانة. نحرص على إنشاء مساحات خضراء جميلة ومستدامة تعكس رؤيتك وتلبي احتياجاتك.',
    serviceTypes: [
      { name: 'Hardscape', nameAr: 'الهاردسكيب', desc: 'الممرات والأرضيات الصلبة', order: 0 },
      { name: 'Softscape', nameAr: 'السوفتسكيب', desc: 'الزراعة والنباتات', order: 1 },
      { name: 'Irrigation', nameAr: 'أنظمة الري', desc: 'ري حديث وذكي', order: 2 },
      { name: 'Maintenance', nameAr: 'الصيانة', desc: 'صيانة دورية شاملة', order: 3 },
    ],
    ctaTitle: 'هل لديك مشروع لاندسكيب؟',
    ctaDescription: 'تواصل معنا اليوم للحصول على استشارة مجانية',
    ctaButtonText: 'تواصل معنا',
  },
  fencing: {
    page: 'fencing',
    introTitle: 'تنفيذ وتركيب الهياكل الحديدية',
    introDescription: 'تنفيذ وتركيب الهياكل الحديدية من مصانع ومستودعات وهياكل اللوحات الإعلانية والسياجات وجاردريل الحماية بأنواعها. نوفر حلول متكاملة من التصميم والتصنيع إلى التركيب والصيانة. منتجاتنا تتميز بالجودة العالية والمتانة والالتزام بالمواصفات القياسية والمعايير الأمنية.',
    serviceTypes: [
      { name: 'Security Fencing', nameAr: 'السياجات الأمنية', desc: 'حماية محيطية متطورة', order: 0 },
      { name: 'Guardrails', nameAr: 'الجارد ريل', desc: 'حواجز الطرق والجسور', order: 1 },
      { name: 'Temporary Fencing', nameAr: 'الأسوار المؤقتة', desc: 'للمواقع والفعاليات', order: 2 },
      { name: 'Gate Systems', nameAr: 'أنظمة البوابات', desc: 'بوابات آلية وذكية', order: 3 },
    ],
    ctaTitle: 'تحتاج لحلول سياجات؟',
    ctaDescription: 'احصل على عرض أسعار مجاني لمشروعك',
    ctaButtonText: 'اطلب عرض سعر',
  },
  infrastructure: {
    page: 'infrastructure',
    introTitle: 'أعمال الطرق والحفر والردم والبنية التحتية',
    introDescription: 'نعمل على تنفيذ مشاريع الطرق من قطع وحفر وردم ومشاريع حفريات البنية التحتية معتمدة بذلك على تأمين المعدات اللازمة للمشروع وفنيين ومراقبين ذو خبرة سابقة. نمتلك الخبرة والكفاءة في تنفيذ مشاريع البنية التحتية والأعمال المدنية بأعلى معايير الجودة والسلامة.',
    serviceTypes: [
      { name: 'Water Networks', nameAr: 'شبكات المياه', desc: 'تمديد وصيانة شبكات المياه', order: 0 },
      { name: 'Sewage Systems', nameAr: 'الصرف الصحي', desc: 'أنظمة الصرف والمعالجة', order: 1 },
      { name: 'Electrical Works', nameAr: 'الأعمال الكهربائية', desc: 'شبكات الكهرباء والإنارة', order: 2 },
      { name: 'Telecom Infrastructure', nameAr: 'شبكات الاتصالات', desc: 'البنية التحتية للاتصالات', order: 3 },
      { name: 'Roads & Paving', nameAr: 'الطرق والرصف', desc: 'إنشاء وصيانة الطرق', order: 4 },
      { name: 'Drainage Systems', nameAr: 'أنظمة التصريف', desc: 'تصريف مياه الأمطار', order: 5 },
    ],
    ctaTitle: 'لديك مشروع بنية تحتية؟',
    ctaDescription: 'دعنا نساعدك في تحويل رؤيتك إلى واقع',
    ctaButtonText: 'استشارة مجانية',
  },
};

exports.getPageContent = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const lang = req.query.lang === 'en' ? 'en' : 'ar';
  if (!['landscaping', 'fencing', 'infrastructure'].includes(page)) {
    return res.status(400).json({ message: 'Invalid page' });
  }
  let doc = await PageContent.findOne({ page });
  if (!doc) {
    doc = await PageContent.create(DEFAULTS[page]);
  }
  res.json(localizePageContent(doc, lang));
});

exports.getAllPageContents = asyncHandler(async (req, res) => {
  const docs = await PageContent.find({});
  const pages = ['landscaping', 'fencing', 'infrastructure'];
  const result = {};
  for (const p of pages) {
    const found = docs.find((d) => d.page === p);
    result[p] = found
      ? found.toObject()
      : DEFAULTS[p];
  }
  res.json(result);
});

exports.updatePageContent = asyncHandler(async (req, res) => {
  const { page } = req.params;
  if (!['landscaping', 'fencing', 'infrastructure'].includes(page)) {
    return res.status(400).json({ message: 'Invalid page' });
  }
  let doc = await PageContent.findOne({ page });
  if (!doc) {
    doc = await PageContent.create({ ...DEFAULTS[page], ...req.body });
  } else {
    Object.assign(doc, req.body);
    await doc.save();
  }
  res.json(doc);
});
