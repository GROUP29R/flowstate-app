import supabase from '@/db/Supabase';

export const purchasePackage = async (userId: string, packageId: string) => {
  // ✅ Check if user already purchased this package
  const { data: existing, error: checkError } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('package_id', packageId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    console.log('User already purchased this package');
    return { alreadyPurchased: true };
  }

  // ✅ Fetch all document IDs inside this package
  const { data: packageDocs, error: docsError } = await supabase
    .from('package_documents')
    .select('document_id')
    .eq('package_id', packageId);

  if (docsError) throw docsError;

  const documentIds = packageDocs.map(d => d.document_id);

  // ✅ Insert package purchase
  const { error: pkgError } = await supabase
    .from('purchases')
    .insert({ user_id: userId, package_id: packageId });

  if (pkgError) throw pkgError;

  // ✅ Insert all document purchases (avoid duplicates)
  const { data: existingDocs } = await supabase
    .from('purchases')
    .select('document_id')
    .eq('user_id', userId)
    .in('document_id', documentIds);

  const existingIds = existingDocs?.map(d => d.document_id) ?? [];
  const newDocs = documentIds.filter(id => !existingIds.includes(id));

  if (newDocs.length > 0) {
    const inserts = newDocs.map(id => ({
      user_id: userId,
      document_id: id,
    }));

    const { error: docError } = await supabase.from('purchases').insert(inserts);
    if (docError) throw docError;
  }

  return { success: true };
};
