import storage from '../services/storageService';

const sampleDishes = [
  { id: 'dosa_001', name: 'Plain Dosa', price: 40, category: 'Breakfast', description: 'Crispy rice and lentil crepe served with chutney and sambar.', image: 'https://picsum.photos/seed/dosa_001/240/160' },
  { id: 'masala_dosa_002', name: 'Masala Dosa', price: 70, category: 'Breakfast', description: 'Crispy dosa stuffed with spiced potato masala.', image: 'https://picsum.photos/seed/masala_dosa_002/240/160' },
  { id: 'idli_003', name: 'Idli', price: 30, category: 'Breakfast', description: 'Steamed rice cakes served with chutney and sambar.', image: 'https://picsum.photos/seed/idli_003/240/160' },
  { id: 'vada_004', name: 'Medu Vada', price: 35, category: 'Snacks', description: 'Crispy lentil fritters, savory and crunchy.', image: 'https://picsum.photos/seed/vada_004/240/160' },
  { id: 'sambar_005', name: 'Sambar Bowl', price: 50, category: 'Curries', description: 'Hearty lentil stew with vegetables and tamarind.', image: 'https://picsum.photos/seed/sambar_005/240/160' },
  { id: 'rasam_006', name: 'Rasam', price: 40, category: 'Soups', description: 'Spicy tangy soup, served hot.', image: 'https://picsum.photos/seed/rasam_006/240/160' },
  { id: 'uttapam_007', name: 'Uttapam', price: 60, category: 'Breakfast', description: 'Thick pancake topped with onions, tomatoes and chillies.', image: 'https://picsum.photos/seed/uttapam_007/240/160' },
  { id: 'upma_008', name: 'Upma', price: 45, category: 'Breakfast', description: 'Savory semolina porridge with mustard seeds and curry leaves.', image: 'https://picsum.photos/seed/upma_008/240/160' },
  { id: 'curd_rice_009', name: 'Curd Rice', price: 35, category: 'Comfort Food', description: 'Comforting rice mixed with yogurt and tempered spices.', image: 'https://picsum.photos/seed/curd_rice_009/240/160' },
  { id: 'paniyaram_010', name: 'Paniyaram', price: 50, category: 'Snacks', description: 'Small savory dumplings made from idli batter.', image: 'https://picsum.photos/seed/paniyaram_010/240/160' },
];

export async function seedSampleMaster() {
  const existing = (await storage.getMaster()) || { _meta: { invoiceCounter: 0 }, bills: [], dishes: [], employees: [], expenses: [], transactions: [] };
  // if dishes already exist, merge but avoid duplicates
  const existingIds = new Set((existing.dishes || []).map((d) => d.id));
  existing.dishes = existing.dishes || [];
  for (const d of sampleDishes) {
    if (!existingIds.has(d.id)) existing.dishes.push(d);
  }
  await storage.saveMaster(existing);
  return existing;
}

export default { seedSampleMaster };
