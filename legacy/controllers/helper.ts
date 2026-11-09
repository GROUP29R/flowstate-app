import supabase from '@/db/Supabase';

export const fetchPackagesWithDocuments = async () => {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      id,
      name,
      description,
      price,
      currency,
      package_documents (
        document_id,
        documents (
          id,
          title,
          description,
          price,
          preview,
          pdf_url
        )
      )
    `); 

  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }

  return data.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    currency: pkg.currency,
    documents: pkg.package_documents.map(pd => pd.documents),
  }));
};
