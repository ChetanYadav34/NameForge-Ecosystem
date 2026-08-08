import React from 'react';
import { MarketingLayout } from '@/shared/ui/layouts/MarketingLayout';
import { Container, Card, Input, Textarea, Button } from '@lexforge/ui';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | LexForge',
};

export default function ContactPage() {
  return (
    <MarketingLayout
      title="Contact LexForge"
      subtitle="Get in touch with our team for enterprise licensing, academic partnerships, or general inquiries."
      badge="Support"
    >
      <Container>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border border-slate-200 bg-white shadow-sm">
            <form className="flex flex-col gap-6" action="#" method="POST">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-900">Name</label>
                <Input id="name" placeholder="Dr. Jane Doe" className="w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-900">Email Address</label>
                <Input id="email" type="email" placeholder="jane@university.edu" className="w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-slate-900">Subject</label>
                <select id="subject" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option>Enterprise Licensing</option>
                  <option>Academic Research Partnership</option>
                  <option>Media Inquiry</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-900">Message</label>
                <Textarea id="message" placeholder="How can we help?" className="w-full min-h-[150px]" />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-4">Send Message</Button>
            </form>
          </Card>
        </div>
      </Container>
    </MarketingLayout>
  );
}
