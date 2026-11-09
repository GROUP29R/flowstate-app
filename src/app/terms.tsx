import React from 'react';

import { LegalDoc } from '@/components/LegalDoc';
import { TERMS_SECTIONS } from '@/constants/legal';

export default function TermsScreen() {
  return <LegalDoc title="Terms & Conditions" sections={TERMS_SECTIONS} />;
}
