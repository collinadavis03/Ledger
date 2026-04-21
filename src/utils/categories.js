export const CATEGORIES = [
  'Transport',
  'Groceries',
  'Dining',
  'Subscriptions',
  'Housing',
  'Health & Fitness',
  'Shopping',
  'Income',
  'Transfers',
  'Healthcare',
  'Other',
]

const CATEGORY_RULES = [
  {
    keywords: ['uber', 'lyft', 'gas', 'shell', 'bp', 'chevron', 'parking', 'transit', 'bus', 'subway', 'exxon', 'fuel'],
    category: 'Transport',
  },
  {
    keywords: ['grocery', 'safeway', 'kroger', 'walmart', 'target', 'costco', 'whole foods', 'trader joe', 'aldi', 'publix', 'heb', 'wegmans', 'meijer'],
    category: 'Groceries',
  },
  {
    keywords: ['restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'chipotle', 'pizza', 'doordash', 'grubhub', 'uber eats', 'dining', 'sushi', 'burger', 'taco', 'diner', 'bistro', 'panera', 'subway'],
    category: 'Dining',
  },
  {
    keywords: ['netflix', 'spotify', 'hulu', 'amazon prime', 'disney', 'youtube premium', 'apple music', 'hbo', 'peacock', 'paramount', 'subscription'],
    category: 'Subscriptions',
  },
  {
    keywords: ['rent', 'mortgage', 'electric', 'water bill', 'internet', 'phone bill', 'insurance', 'utility', 'comcast', 'att', 'verizon', 't-mobile'],
    category: 'Housing',
  },
  {
    keywords: ['gym', 'fitness', 'planet fitness', 'anytime fitness', 'crossfit', 'nike', 'adidas', 'sporting goods', 'dicks sporting', 'under armour'],
    category: 'Health & Fitness',
  },
  {
    keywords: ['amazon', 'ebay', 'etsy', 'shopping', 'mall', 'clothing', 'fashion', 'best buy', 'apple store', 'home depot', 'lowes', 'ikea'],
    category: 'Shopping',
  },
  {
    keywords: ['salary', 'payroll', 'direct dep', 'direct deposit', 'income', 'payment received', 'refund', 'reimbursement'],
    category: 'Income',
  },
  {
    keywords: ['transfer', 'zelle', 'venmo', 'paypal', 'cashapp', 'wire', 'ach'],
    category: 'Transfers',
  },
  {
    keywords: ['hospital', 'pharmacy', 'doctor', 'dental', 'medical', 'cvs', 'walgreens', 'rite aid', 'clinic', 'urgent care', 'optometrist'],
    category: 'Healthcare',
  },
]

export function categorize(description) {
  const lower = description.toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.category
  }
  return 'Other'
}

export const CATEGORY_EMOJIS = {
  Transport: '🚗',
  Groceries: '🛒',
  Dining: '🍕',
  Subscriptions: '📺',
  Housing: '🏠',
  'Health & Fitness': '💪',
  Shopping: '🛍️',
  Income: '💰',
  Transfers: '💸',
  Healthcare: '💊',
  Other: '📦',
}

export const PALETTE = [
  '#6EE7B7', '#60A5FA', '#F472B6', '#FBBF24', '#A78BFA',
  '#34D399', '#F87171', '#38BDF8', '#FB923C', '#E879F9', '#94A3B8',
]

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
