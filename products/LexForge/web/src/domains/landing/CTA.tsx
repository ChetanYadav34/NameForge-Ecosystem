import { Container, Stack, Button } from '@lexforge/ui';
import { landingConfig } from './config';
import Link from 'next/link';

export const CTA = () => {
  const { headline, button } = landingConfig.cta;

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden" id="cta">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <Container className="relative z-10">
        <Stack gap={8} className="items-center text-center max-w-2xl mx-auto">
          <h2 className="text-5xl font-serif text-white">{headline}</h2>
          <Link href="/playground">
            <Button variant="secondary" className="px-10 py-6 text-lg rounded-xl bg-white text-primary hover:bg-slate-50 border-none shadow-xl">
              Start Naming
            </Button>
          </Link>
        </Stack>
      </Container>
    </section>
  );
};
