export interface LegalSection {
  title: string;
  body: string;
}

export const LEGAL_UPDATED = 'November 2026';
export const SUPPORT_EMAIL = 'flowstate@gmail.com';

export const TERMS_SECTIONS: LegalSection[] = [
  { title: '1. Acceptance of terms', body: 'By creating an account or using the FlowState E-Learning app you agree to these Terms. If you do not agree, please do not use the app. You must be at least 16 years old, or have the consent of a parent or guardian.' },
  { title: '2. Your account', body: 'You are responsible for keeping your login details secure and for all activity under your account. Provide accurate information and tell us promptly if you suspect unauthorised access.' },
  { title: '3. Courses and content', body: 'Courses, videos, documents and other materials are provided for your personal, non-commercial learning. You may not copy, redistribute, resell or publicly share course content without written permission.' },
  { title: '4. Acceptable use', body: 'Do not misuse the app: no attempts to break security, scrape content, share your account, harass others, or upload unlawful material.' },
  { title: '5. Third-party services', body: 'The app relies on third-party services, including Supabase (accounts and data) and YouTube (video playback). Their own terms and privacy policies apply when you use those features.' },
  { title: '6. Availability and changes', body: 'We aim to keep the app available and accurate but cannot guarantee uninterrupted service. We may update courses, features or these Terms from time to time; continued use means you accept the updated Terms.' },
  { title: '7. Disclaimer and liability', body: 'The app and its content are provided “as is”. To the extent permitted by law, FlowState is not liable for indirect or consequential losses arising from your use of the app.' },
  { title: '8. Termination', body: 'You may stop using the app at any time. We may suspend or close accounts that breach these Terms.' },
  { title: '9. Contact', body: `Questions about these Terms? Email ${SUPPORT_EMAIL}.` },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  { title: '1. Who we are', body: 'FlowState E-Learning provides online courses through this app. This policy explains what personal information we collect, why, and the choices you have.' },
  { title: '2. Information we collect', body: 'Account details (name, email address, password — stored securely by our authentication provider), an optional profile photo, your course enrolments, your notification and consent preferences, and any messages you send to support.' },
  { title: '3. How we use it', body: 'To create and secure your account, give you access to the courses and documents you enrol in, remember your preferences, respond to support requests, and improve the app.' },
  { title: '4. Where it is stored', body: 'Data is stored with Supabase. Course videos are played through YouTube’s embedded player, and on Android PDFs may be displayed through Google’s document viewer; those providers may process technical data under their own privacy policies.' },
  { title: '5. Sharing', body: 'We do not sell your personal information. We share it only with service providers that help us run the app, or where the law requires it.' },
  { title: '6. Retention and your rights', body: 'We keep your data while your account is active. You can ask to access, correct or delete your information at any time by contacting us.' },
  { title: '7. Security', body: 'We use industry-standard safeguards, but no system is completely secure. Choose a strong, unique password.' },
  { title: '8. Children', body: 'The app is intended for users aged 16 and over.' },
  { title: '9. Changes and contact', body: `We may update this policy and will change the date below when we do. Questions or requests: ${SUPPORT_EMAIL}.` },
];
