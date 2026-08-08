import React from 'react';
import { LegalLayout } from '@/shared/ui/layouts/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | LexForge',
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="August 8, 2026">
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>LexForge uses cookies for the following purposes:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> These are required for the operation of our website, including logging into secure areas of our application.</li>
        <li><strong>Performance Cookies:</strong> These allow us to recognize and count the number of visitors and see how visitors move around our website. This helps us improve the way our website works.</li>
        <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website, enabling us to personalize our content for you (e.g., your preferred language model settings).</li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>
        You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
      </p>
    </LegalLayout>
  );
}
