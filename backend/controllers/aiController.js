const categoryBaselines = {
  Books: 0.45,
  Electronics: 0.55,
  Cycles: 0.58,
  Furniture: 0.42,
  'Hostel Essentials': 0.38,
  Stationery: 0.35,
  Others: 0.4,
};

const conditionMultipliers = {
  New: 0.9,
  Good: 0.72,
  Fair: 0.55,
  Poor: 0.35,
};

const roundToNearestTen = (value) => Math.max(10, Math.round(value / 10) * 10);

const extractAgeInYears = (age) => {
  const value = Number(String(age || '').match(/\d+(\.\d+)?/)?.[0] || 0);
  if (!value) return 0;
  return String(age).toLowerCase().includes('month') ? value / 12 : value;
};

exports.suggestPrice = async (req, res) => {
  const { category = 'Others', condition = 'Good', originalPrice, quickSell, age } = req.body;
  const basePrice = Number(originalPrice) || 1000;
  const categoryFactor = categoryBaselines[category] || categoryBaselines.Others;
  const conditionFactor = conditionMultipliers[condition] || conditionMultipliers.Good;
  const ageInYears = extractAgeInYears(age);
  const ageFactor = Math.max(0.35, 1 - ageInYears * 0.12);
  const urgencyFactor = quickSell ? 0.88 : 1;
  const suggested = roundToNearestTen(basePrice * ((categoryFactor + conditionFactor) / 2) * ageFactor * urgencyFactor);

  return res.json({
    suggested,
    range: {
      low: roundToNearestTen(suggested * 0.9),
      high: roundToNearestTen(suggested * 1.12),
    },
    reasoning: quickSell
      ? 'Priced slightly lower using age, condition, category demand, and quick-sell urgency.'
      : 'Calculated from original price, age-based depreciation, category demand, and condition.',
  });
};

exports.generateDescription = async (req, res) => {
  const {
    name = 'Campus item',
    category = 'Others',
    condition = 'Good',
    age,
    pickupLocation = 'campus',
    bundleItems,
  } = req.body;

  const extras = Array.isArray(bundleItems)
    ? bundleItems.filter(Boolean)
    : String(bundleItems || '').split(',').map((item) => item.trim()).filter(Boolean);

  const description = [
    `${name} in ${condition.toLowerCase()} condition, suitable for ${category.toLowerCase()} needs on campus.`,
    age ? `Used for about ${age}.` : 'Gently used and ready for the next student.',
    extras.length ? `Includes ${extras.join(', ')}.` : '',
    `Pickup can be arranged near ${pickupLocation}.`,
  ].filter(Boolean).join(' ');

  return res.json({ description });
};

exports.detectScam = async (req, res) => {
  const text = `${req.body.name || ''} ${req.body.description || ''}`.toLowerCase();
  const price = Number(req.body.price);
  const originalPrice = Number(req.body.originalPrice);
  const riskyTerms = ['advance payment', 'outside campus', 'wire transfer', 'urgent only', 'no inspection'];
  const matches = riskyTerms.filter((term) => text.includes(term));
  const veryLowPrice = originalPrice && price && price < originalPrice * 0.15;
  const score = Math.min(100, matches.length * 25 + (veryLowPrice ? 35 : 0));

  return res.json({
    score,
    risk: score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low',
    flags: [
      ...matches.map((term) => `Contains "${term}"`),
      ...(veryLowPrice ? ['Price is unusually low compared with original price'] : []),
    ],
  });
};
