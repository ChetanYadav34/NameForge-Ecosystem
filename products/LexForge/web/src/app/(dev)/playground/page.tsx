"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { 
  Button, Input, Card, Badge, Chip, Skeleton, Toggle, Slider, Progress, Tabs,
  Container, Stack, Grid, Spacer, Divider
} from '@lexforge/ui';
import { FallbackManager } from '../../../shared/3d/FallbackManager';
import { notFound } from 'next/navigation';

const SceneManager = dynamic(() => import('../../../shared/3d/SceneManager').then(mod => mod.SceneManager), { ssr: false });
const BackgroundScene = dynamic(() => import('../../../shared/3d/scenes/BackgroundScene').then(mod => mod.BackgroundScene), { ssr: false });

export default function PlaygroundPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <Container className="min-h-screen p-8 bg-background text-foreground selection:bg-primary/30">
      <Stack gap={8}>
        <header>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Engineering Laboratory
          </h1>
          <p className="text-muted mt-2">Comprehensive validation of @lexforge/ui components, tokens, and materials.</p>
        </header>

        <Divider />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Grid cols={4} gap={4}>
            <Card className="p-4 flex flex-col items-center gap-4">
              <span className="text-sm text-muted">Primary (Default)</span>
              <Button variant="primary">Submit</Button>
            </Card>
            <Card className="p-4 flex flex-col items-center gap-4">
              <span className="text-sm text-muted">Secondary</span>
              <Button variant="secondary">Cancel</Button>
            </Card>
            <Card className="p-4 flex flex-col items-center gap-4 bg-gradient-to-br from-indigo-900 to-purple-900">
              <span className="text-sm text-white/70">Glass</span>
              <Button variant="glass">Authenticate</Button>
            </Card>
            <Card className="p-4 flex flex-col items-center gap-4">
              <span className="text-sm text-muted">Disabled</span>
              <Button variant="primary" disabled>Saving...</Button>
            </Card>
          </Grid>
        </section>

        <Divider />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Form Controls</h2>
          <Grid cols={2} gap={8}>
            <Stack gap={4}>
              <Input placeholder="Enter seed prompt..." />
              <Input placeholder="Disabled field" disabled />
              <Input defaultValue="Error state" className="border-error text-error focus:ring-error" />
            </Stack>
            <Stack gap={4} className="justify-center">
              <div className="flex items-center justify-between">
                <span>Enable experimental features</span>
                <Toggle />
              </div>
              <div className="flex items-center justify-between">
                <span>Guidance Scale</span>
                <Slider defaultValue={75} />
              </div>
            </Stack>
          </Grid>
        </section>

        <Divider />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Display</h2>
          <Grid cols={2} gap={8}>
            <Stack gap={4}>
              <div className="flex gap-2">
                <Badge variant="default">Idle</Badge>
                <Badge variant="success">Completed</Badge>
                <Badge variant="error">Failed</Badge>
              </div>
              <div className="flex gap-2">
                <Chip>linguistics</Chip>
                <Chip>fantasy</Chip>
                <Chip>cyberpunk</Chip>
              </div>
            </Stack>
            <Stack gap={4}>
              <Progress value={45} />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </Stack>
          </Grid>
        </section>

        <Divider />

        <section>
          <h2 className="text-2xl font-semibold mb-4">WebGL Environment</h2>
          <Card className="w-full h-96 relative overflow-hidden bg-gradient-to-b from-background to-black">
            <FallbackManager>
              <SceneManager>
                <BackgroundScene />
              </SceneManager>
            </FallbackManager>
            <div className="absolute top-4 left-4 pointer-events-none">
              <Badge variant="default" className="bg-glass-background backdrop-blur-glass border-glass-border">
                WebGL Context Active
              </Badge>
            </div>
          </Card>
        </section>
      </Stack>
    </Container>
  );
}
